import {segment} from "../segment/segment";
import {note as n, note} from "../note/note";
import TreeModel = require("tree-model");
import {log} from "../log/logger";
import {utils} from "../utils/utils";
import {live} from "../live/live";
import {clip as c} from "../clip/clip";

const _ = require("underscore");


export namespace parse {
    import SegmentIterator = segment.SegmentIterator;
    import Logger = log.Logger;
    import remainder = utils.remainder;
    import division_int = utils.division_int;
    import LiveClipVirtual = live.LiveClipVirtual;

    export interface Parsable {
        choose(): boolean;

        // TODO: annotation
        get_best_candidate(list_candidate_note);
    }

    export class ParseTree implements Parsable {
        // matrix_clip: LiveClipVirtual[][];
        //
        // constructor() {
        //     this.matrix_clip
        // }


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
                ParseTree.get_diff_index_start(notes_child, notes_parent),
                ParseTree.get_diff_index_end(notes_child, notes_parent)
            ];
        };

        public get_root(): TreeModel.Node<n.NoteRenderable> {
            return
        }

        private add_first_layer(notes: TreeModel.Node<n.Note>[], index_new_layer: number): void {
            // var note_parent_best, b_successful;

            for (let node of notes) {
                node.model.id = index_new_layer;
                this.root_parse_tree.addChild(node);
            }
        }

        // NB: only works top down currently
        // private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
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

        private update_leaves(leaves: TreeModel.Node<n.Note>[]) {
            // find leaves in parse/derive beat interval

            // splice them with their children
            let leaves_spliced = this.leaves;
            let children_to_insert, i_leaf_to_splice;
            for (let leaf of leaves) {
                // find index of leaf to "splice"
                // always splice only one leaf
                // find corresponding leaf in leaves_spliced
                children_to_insert = [];
                if (leaf.hasChildren()) {
                    i_leaf_to_splice = _.findIndex(leaves_spliced, (leaf_to_splice)=>{
                        // assuming monophony, i.e., no overlap
                        return leaf_to_splice.model.note.beat_start === leaf.model.note.beat_start
                    });

                    let beat_end_children_greatest = -Infinity, beat_start_children_least = Infinity;

                    for (let child of leaf.children) {
                        if (child.model.note.get_beat_end() > beat_end_children_greatest) {
                            beat_end_children_greatest = child.model.note.get_beat_end();
                        }
                        if (child.model.note.beat_start < beat_start_children_least) {
                            beat_start_children_least = child.model.note.beat_start;
                        }
                        children_to_insert.push(child);
                    }

                    if (false) {
                        // if (leaf.model.note.get_beat_end() > beat_end_children_greatest || leaf.model.note.beat_start < beat_start_children_least) {
                        leaves_spliced.splice(
                            i_leaf_to_splice,
                            0,
                            ...children_to_insert
                        )
                    } else {
                        leaves_spliced.splice(
                            i_leaf_to_splice,
                            1,
                            ...children_to_insert
                        )
                    }
                    // leaves_spliced.splice(
                    //     i_leaf_to_splice,
                    //     1,
                    //     ...children_to_insert
                    // )
                }
            }

            this.leaves = leaves_spliced;
        }

        public insert(notes: TreeModel.Node<n.Note>[]) {
            if (this.iterator_tree.get_index_current() == 1) {
                this.set_root(notes[0])
            } else {
                this.grow(
                    notes,
                    this.iterator_tree.get_breadth_current();
                this.iterator_tree.get_depth_current();
            )
            }
        }

        get_notes_leaves(): TreeModel.Node<n.Note>[] {
            return this.leaves;
        }

        set_root(note_root: TreeModel.Node<n.Note>) {
            let clip_dao_virtual = new LiveClipVirtual([note_root]);

            let clip_virtual = new c.Clip(clip_dao_virtual);

            clip_virtual.clip_dao.beat_start = note_root.model.note.beat_start;

            clip_virtual.clip_dao.beat_end = note_root.model.note.get_beat_end();

            this.add_clip(clip_virtual);

            note_root.model.id = 0;  // index of first clip

            this.root_parse_tree = note_root;

            this.leaves = [note_root];
        }

        // struct
        elaborate(elaboration: TreeModel.Node<n.Note>[], beat_start: number, beat_end: number, index_layer: number): void {

            if (index_layer + 1 > this.clips.length) {
                let clip_dao_virtual = new LiveClipVirtual(elaboration);

                clip_dao_virtual.beat_start = elaboration[0].model.note.beat_start;
                clip_dao_virtual.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();

                let clip_virtual = new c.Clip(clip_dao_virtual);
                this.add_clip(clip_virtual);
            } else {
                let clip_last = this.clips[this.clips.length - 1];
                clip_last.clip_dao.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
                clip_last.set_notes(elaboration);
            }

            let leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);

            if (index_layer == 1) {
                this.add_first_layer(elaboration, this.clips.length - 1)
            } else {
                this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
            }

            this.update_leaves(leaves_within_interval);
        }

        // struct
        splice_notes(notes_subset: TreeModel.Node<n.Note>[], clip: c.Clip, interval_beats: number[]): TreeModel.Node<n.Note>[] {
            let notes_clip = _.cloneDeep(clip.get_notes_within_loop_brackets());
            let num_notes_to_replace = this.get_order_of_note_at_beat_end(notes_clip, interval_beats[1]) - this.get_order_of_note_at_beat_start(notes_clip, interval_beats[0]) + 1;
            let index_start = this.get_note_index_at_beat(interval_beats[0], notes_clip);
            notes_clip.splice(index_start, num_notes_to_replace, ...notes_subset);
            return notes_clip
        }

        // struct
        get_note_index_at_beat(beat: number, notes: TreeModel.Node<n.Note>[]): number {
            let val =  _.findIndex(notes, (node)=>{
                return node.model.note.beat_start === beat
            });
            return val;
        }

        // struct
        get_leaves_within_interval(beat_start: number, beat_end: number): TreeModel.Node<n.Note>[] {
            let val =  this.leaves.filter((node) =>{
                // return node.model.note.beat_start >= beat_start && node.model.note.get_beat_end() <= beat_end
                return (node.model.note.beat_start >= beat_start && node.model.note.beat_start <= beat_end) ||
                    (node.model.note.get_beat_end() <= beat_end && node.model.note.get_beat_end() >= beat_start) ||
                    (node.model.note.get_beat_end() >= beat_end && node.model.note.beat_start <= beat_start)

            });
            // this.logger.log(CircularJSON.stringify(this.leaves));
            return val;
        }

    }

    // export class ParseMatrix {
    //
    //     data: TreeModel.Node<note.Note>[][][];
    //     logger: Logger;
    //
    //     constructor(height: number, width: number) {
    //         this.data = [];
    //         for(let i=0; i<height; i++) {
    //             this.data[i] = new Array(width);
    //         }
    //         this.logger = new Logger('max')
    //     }
    //
    //     set_notes(i_height, i_width, notes): void {
    //         this.data[i_height][i_width] = notes
    //     }
    //
    //     get_notes(i_height, i_width): TreeModel.Node<note.Note>[] {
    //         return this.data[i_height][i_width]
    //     }
    //
    //     private static serialize(notes: TreeModel.Node<note.Note>[]) {
    //         return notes.map((note) => {
    //             return JSON.stringify(note.model);
    //         })
    //     }
    //
    //     private static deserialize(notes_serialized) {
    //         if (notes_serialized === null) {
    //             return null
    //         }
    //         let tree = new TreeModel();
    //         return notes_serialized.map((note) => {
    //             return tree.parse(JSON.parse(note));
    //         })
    //     }
    //
    //     save(filename) {
    //         let data_serializable = this.data as any;
    //         for (let i_row in this.data) {
    //             for (let i_col in this.data[Number(i_row)]) {
    //                 data_serializable[Number(i_row)][Number(i_col)] = ParseMatrix.serialize(this.data[Number(i_row)][Number(i_col)])
    //             }
    //         }
    //
    //         let f = new File(filename,"write","JSON");
    //
    //         if (f.isopen) {
    //             post("saving session");
    //             f.writestring(JSON.stringify(data_serializable)); //writes a string
    //             f.close();
    //         } else {
    //             post("could not save session");
    //         }
    //     }
    //
    //     public static load(filename) {
    //         let f = new File(filename, "read","JSON");
    //         let a, data_serialized;
    //
    //         if (f.isopen) {
    //             post("reading file");
    //             // @ts-ignore
    //             while ((a = f.readline()) != null) {
    //                 data_serialized = JSON.parse(a)
    //             }
    //             f.close();
    //         } else {
    //             post("could not open file");
    //         }
    //
    //         let data_deserialized = data_serialized as any;
    //
    //         for (let i_row in data_serialized) {
    //             for (let i_col in data_serialized[Number(i_row)]) {
    //                 // post(i_row);
    //                 // post(i_col);
    //                 data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)])
    //             }
    //         }
    //
    //         return data_deserialized
    //     }
    // }

    export class TreeDepthIterator {
        public direction_forward: boolean;
        private i: number;
        private layers: number[];

        constructor(depth: number, direction_forward: boolean) {
            this.layers = _.range(depth);
            this.direction_forward = direction_forward;
            this.i = 0;
        }

        // TODO: type declarations
        public next() {
            let value_increment = (this.direction_forward) ? 1 : -1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'segment iterator < 0'
            }

            if (this.i < this.layers.length) {
                return {
                    value: this.layers[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.layers[this.i];
            } else {
                return null;
            }
        }

        public get_index_current() {
            return this.i // TODO: the root is the first index
        }
    }

    // export class MatrixIterator {
    //     private num_rows: number;
    //     private num_columns: number;
    //
    //     private row_current: number;
    //     private column_current: number;
    //
    //     private i;
    //
    //     constructor(num_rows: number, num_columns: number) {
    //         this.num_rows = num_rows;
    //         this.num_columns = num_columns;
    //
    //         this.i = -1;
    //     }
    //
    //     private next_row() {
    //         this.i = this.i + this.num_columns;
    //     }
    //
    //     private next_column() {
    //         this.i = this.i + 1;
    //     }
    //
    //     public next() {
    //
    //         let value: number[] = null;
    //
    //         this.next_column();
    //
    //         if (this.i === this.num_columns * this.num_rows + 1) {
    //             return {
    //                 value: value,
    //                 done: true
    //             }
    //         }
    //
    //         let pos_row = division_int(this.i + 1, this.num_columns);
    //         let pos_column = remainder(this.i + 1, this.num_columns);
    //
    //         value = [pos_row, pos_column];
    //
    //         return {
    //             value: value,
    //             done: false
    //         };
    //     }
    // }

    export class ParseTreeIterator {
        private iterator_segment;
        private iterator_tree;
        public segment_current;
        public layer_current;

        constructor(iterator_segment: SegmentIterator, iterator_tree: TreeDepthIterator) {
            this.iterator_segment = iterator_segment;
            this.iterator_tree = iterator_tree
        }

        // TODO: type declarations
        public next(type_node?:string) {

            if (type_node === 'root') {
                // initialize
                this.iterator_tree.next();
                return
            }

            // initialize
            if (this.iterator_tree.get_index_current() == -1) {
                this.iterator_tree.next()
            }

            // let layer_current = this.iterator_tree.current();

            let segment_result_next = this.iterator_segment.next();

            let segment_next = segment_result_next.value;

            if (!segment_result_next.done) {
                this.segment_current = segment_next;
                return {
                    value: this.segment_current,
                    done: false
                }
            }

            //
            // this.iterator_segment.reset();

            let layer_result_next = this.iterator_tree.next();

            // segment_next.done is true by now
            if (!layer_result_next.done) {

                this.iterator_segment.reset();

                this.layer_current = this.iterator_tree.current();

                segment_result_next = this.iterator_segment.next();

                segment_next = segment_result_next.value;

                this.segment_current = segment_next;

                return {
                    value: this.segment_current,
                    done: false
                }
            }

            return {
                value: null,
                done: true
            }
        }
    }
}