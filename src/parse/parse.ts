import {segment} from "../segment/segment";
import {note as n, note} from "../note/note";
import TreeModel = require("tree-model");
import {log} from "../log/logger";
import {utils} from "../utils/utils";
import {live} from "../live/live";
import {clip as c} from "../clip/clip";
import {algorithm} from "../train/algorithm";
import {trainer} from "../train/trainer";
import {iterate} from "../train/iterate";

const _ = require("underscore");


export namespace parse {
    import LiveClipVirtual = live.LiveClipVirtual;
    import DETECT = algorithm.DETECT;
    import PARSE = algorithm.PARSE;
    import DERIVE = algorithm.DERIVE;
    import MatrixIterator = iterate.MatrixIterator;
    import NoteRenderable = note.NoteRenderable;
    // import MatrixIterator = trainer.MatrixIterator;

    export interface Parsable {
        choose(): boolean;

        // TODO: annotation
        get_best_candidate(list_candidate_note);
    }

    abstract class ParseTree {
        root: TreeModel.Node<n.NoteRenderable>;

        constructor() {

        }

        public get_root(): TreeModel.Node<n.NoteRenderable> {
            return this.root
        }
    }

    export class StructParse extends ParseTree {

        root: TreeModel.Node<n.NoteRenderable>;

        matrix_leaves: TreeModel.Node<n.NoteRenderable>[][][];

        coords_roots: number[][]; // list of coordinates

        history: number[][];

        constructor(matrix) {
            super();
            this.matrix_leaves = matrix;
            this.coords_roots = []
            this.history = []
        }

        public get_roots_at_coord(coord: number[]) {
            return this.matrix_leaves[coord[0]][coord[1]]
        }

        private static get_diff_index_start(notes_new: TreeModel.Node<n.Note>[], notes_old: TreeModel.Node<n.Note>[]): number {
            let same_start, same_duration, index_start_diff;
            for (let i=0; i < notes_old.length; i++) {
                same_start = (notes_old[i].model.note.beat_start === notes_new[i].model.note.beat_start);
                same_duration = (notes_old[i].model.note.beats_duration === notes_new[i].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_start_diff = i;
                    break;
                }
            }

            return index_start_diff;
        }

        private static get_diff_index_end(notes_new: TreeModel.Node<n.Note>[], notes_old: TreeModel.Node<n.Note>[]): number {
            let same_start, same_duration, index_end_diff;
            for (let i=-1; i > -1 * (notes_new.length + 1); i--) {
                same_start = (notes_new.slice(i)[0].model.note.beat_start === notes_old.slice(i)[0].model.note.beat_start);
                same_duration = (notes_new.slice(i)[0].model.note.beats_duration === notes_old.slice(i)[0].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_end_diff = i;
                    break;
                }
            }

            // NB: add one in order to use with array slice, unless of course the index is -1, then you'll access the front of the array
            return index_end_diff;
        }

        // TODO: complete return method signature
        get_diff_index_notes(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): number[] {
            return [
                StructParse.get_diff_index_start(notes_child, notes_parent),
                StructParse.get_diff_index_end(notes_child, notes_parent)
            ];
        };

        public finish() {
            for (let col of this.matrix_leaves[0]) {
                for (let notes of col) {
                    // @ts-ignore
                    for (let note of notes) {
                        this.add_layer(
                            [this.root],
                            note,
                            -1
                        )
                    }
                }
            }
        }

        public set_root(note) {
            let coord_root = [-1];
            this.history.push(coord_root);
            this.root = NoteRenderable.from_note(note, coord_root)
        }

        public set_notes(notes: TreeModel.Node<n.Note>[], coord) {
            this.history.push(coord);
            this.matrix_leaves[coord[0]][coord[1]] = notes.map((note) => {
                return NoteRenderable.from_note(note, coord)
            });
        }

        public get_history(): number[][] {
            return this.history
        }

        public add(notes_user_input, coord_notes_current, algorithm): void {

            let coord_notes_previous;
            this.matrix_leaves[coord_notes_current[0]][coord_notes_current[1]] = notes_user_input;

            switch (algorithm.get_name()) {
                case PARSE: {
                    coord_notes_previous = MatrixIterator.get_coord_below([coord_notes_current[0], coord_notes_current[1]]);
                    let notes_below = this.matrix_leaves[coord_notes_previous[0]][coord_notes_previous[1]];
                    let notes_children = notes_below;
                    this.add_layer(
                        notes_user_input,
                        notes_children,
                        -1
                    );
                    break;
                }
                case DERIVE: {
                    coord_notes_previous = MatrixIterator.get_coord_above([coord_notes_current[0], coord_notes_current[1]]);
                    let notes_above = this.matrix_leaves[coord_notes_previous[0]][coord_notes_previous[1]];
                    let notes_parent = notes_above;
                    this.add_layer(
                        notes_parent,
                        notes_user_input,
                        -1
                    );
                    break;
                }
                default: {
                    throw 'adding notes to parse tree failed'
                }
            }

            // remove references to old leaves
            this.coords_roots = this.coords_roots.filter((x) => {
                return !(x[0] === coord_notes_previous[0] && x[1] === coord_notes_previous[1])
            });

            // add references to new leaves
            this.coords_roots.push(
                coord_notes_current
            )
        }

        private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[], index_new_layer: number): void {

            var note_parent_best, b_successful;

            for (let node of notes_child) {
                note_parent_best = node.model.note.get_best_candidate(notes_parent);
                b_successful = node.model.note.choose();
                if (b_successful) {
                    node.model.id = index_new_layer;
                    note_parent_best.addChild(node);
                }
            }
        };
        //
        // private update_leaves(leaves: TreeModel.Node<n.Note>[]) {
        //     // find leaves in parse/derive beat interval
        //
        //     // splice them with their children
        //     let leaves_spliced = this.leaves;
        //     let children_to_insert, i_leaf_to_splice;
        //     for (let leaf of leaves) {
        //         // find index of leaf to "splice"
        //         // always splice only one leaf
        //         // find corresponding leaf in leaves_spliced
        //         children_to_insert = [];
        //         if (leaf.hasChildren()) {
        //             i_leaf_to_splice = _.findIndex(leaves_spliced, (leaf_to_splice)=>{
        //                 // assuming monophony, i.e., no overlap
        //                 return leaf_to_splice.model.note.beat_start === leaf.model.note.beat_start
        //             });
        //
        //             let beat_end_children_greatest = -Infinity, beat_start_children_least = Infinity;
        //
        //             for (let child of leaf.children) {
        //                 if (child.model.note.get_beat_end() > beat_end_children_greatest) {
        //                     beat_end_children_greatest = child.model.note.get_beat_end();
        //                 }
        //                 if (child.model.note.beat_start < beat_start_children_least) {
        //                     beat_start_children_least = child.model.note.beat_start;
        //                 }
        //                 children_to_insert.push(child);
        //             }
        //
        //             if (false) {
        //                 // if (leaf.model.note.get_beat_end() > beat_end_children_greatest || leaf.model.note.beat_start < beat_start_children_least) {
        //                 leaves_spliced.splice(
        //                     i_leaf_to_splice,
        //                     0,
        //                     ...children_to_insert
        //                 )
        //             } else {
        //                 leaves_spliced.splice(
        //                     i_leaf_to_splice,
        //                     1,
        //                     ...children_to_insert
        //                 )
        //             }
        //             // leaves_spliced.splice(
        //             //     i_leaf_to_splice,
        //             //     1,
        //             //     ...children_to_insert
        //             // )
        //         }
        //     }
        //
        //     this.leaves = leaves_spliced;
        // }
        //
        // public insert(notes: TreeModel.Node<n.Note>[]) {
        //     if (this.iterator_tree.get_index_current() == 1) {
        //         this.set_root(notes[0])
        //     } else {
        //         this.grow(
        //             notes,
        //             this.iterator_tree.get_breadth_current();
        //         this.iterator_tree.get_depth_current();
        //     )
        //     }
        // }
        //
        // get_notes_leaves(): TreeModel.Node<n.Note>[] {
        //     return this.leaves;
        // }
        //
        // set_root(note_root: TreeModel.Node<n.Note>) {
        //     let clip_dao_virtual = new LiveClipVirtual([note_root]);
        //
        //     let clip_virtual = new c.Clip(clip_dao_virtual);
        //
        //     clip_virtual.clip_dao.beat_start = note_root.model.note.beat_start;
        //
        //     clip_virtual.clip_dao.beat_end = note_root.model.note.get_beat_end();
        //
        //     this.add_clip(clip_virtual);
        //
        //     note_root.model.id = 0;  // index of first clip
        //
        //     this.root_parse_tree = note_root;
        //
        //     this.leaves = [note_root];
        // }
        //
        // // struct
        // elaborate(elaboration: TreeModel.Node<n.Note>[], beat_start: number, beat_end: number, index_layer: number): void {
        //
        //     if (index_layer + 1 > this.clips.length) {
        //         let clip_dao_virtual = new LiveClipVirtual(elaboration);
        //
        //         clip_dao_virtual.beat_start = elaboration[0].model.note.beat_start;
        //         clip_dao_virtual.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
        //
        //         let clip_virtual = new c.Clip(clip_dao_virtual);
        //         this.add_clip(clip_virtual);
        //     } else {
        //         let clip_last = this.clips[this.clips.length - 1];
        //         clip_last.clip_dao.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
        //         clip_last.set_notes(elaboration);
        //     }
        //
        //     let leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);
        //
        //     if (index_layer == 1) {
        //         this.add_first_layer(elaboration, this.clips.length - 1)
        //     } else {
        //         this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
        //     }
        //
        //     this.update_leaves(leaves_within_interval);
        // }
        //
        // // struct
        // splice_notes(notes_subset: TreeModel.Node<n.Note>[], clip: c.Clip, interval_beats: number[]): TreeModel.Node<n.Note>[] {
        //     let notes_clip = _.cloneDeep(clip.get_notes_within_loop_brackets());
        //     let num_notes_to_replace = this.get_order_of_note_at_beat_end(notes_clip, interval_beats[1]) - this.get_order_of_note_at_beat_start(notes_clip, interval_beats[0]) + 1;
        //     let index_start = this.get_note_index_at_beat(interval_beats[0], notes_clip);
        //     notes_clip.splice(index_start, num_notes_to_replace, ...notes_subset);
        //     return notes_clip
        // }
        //
        // // struct
        // get_note_index_at_beat(beat: number, notes: TreeModel.Node<n.Note>[]): number {
        //     let val =  _.findIndex(notes, (node)=>{
        //         return node.model.note.beat_start === beat
        //     });
        //     return val;
        // }
        //
        // // struct
        // get_leaves_within_interval(beat_start: number, beat_end: number): TreeModel.Node<n.Note>[] {
        //     let val =  this.leaves.filter((node) =>{
        //         // return node.model.note.beat_start >= beat_start && node.model.note.get_beat_end() <= beat_end
        //         return (node.model.note.beat_start >= beat_start && node.model.note.beat_start <= beat_end) ||
        //             (node.model.note.get_beat_end() <= beat_end && node.model.note.get_beat_end() >= beat_start) ||
        //             (node.model.note.get_beat_end() >= beat_end && node.model.note.beat_start <= beat_start)
        //
        //     });
        //     // this.logger.log(CircularJSON.stringify(this.leaves));
        //     return val;
        // }

    }
}