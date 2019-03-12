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
    import PARSE = algorithm.PARSE;
    import DERIVE = algorithm.DERIVE;
    import MatrixIterator = iterate.MatrixIterator;
    import NoteRenderable = note.NoteRenderable;

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
            this.coords_roots = [];
            this.history = [];
        }

        public get_notes_at_coord(coord: number[]) {
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

        // public finish_parse() {
        //     for (let col of this.matrix_leaves[0]) {
        //         for (let note of col) {
        //             this.add_layer(
        //                 [this.root],
        //                 [note],
        //                 -1
        //             )
        //         }
        //     }
        // }

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

        // TODO: holy fuck refactor
        public add(notes_user_input, coord_notes_current, algorithm): void {

            // let coord_notes_previous;
            let coords_notes_previous: number[][] = [];

            let notes_user_input_renderable = notes_user_input.map((note) => {
                return NoteRenderable.from_note(note, coord_notes_current)
            });

            if (coord_notes_current[0] === -1) {
                this.root = notes_user_input_renderable[0]
            } else {
                this.matrix_leaves[coord_notes_current[0]][coord_notes_current[1]] = notes_user_input_renderable;
            }

            this.history.push(coord_notes_current);

            switch (algorithm.get_name()) {
                case PARSE: {
                    if (coord_notes_current[0] === -1) {
                        for (let i in this.matrix_leaves[0]) {
                            coords_notes_previous.push([0, Number(i)])
                        }
                    } else {
                        coords_notes_previous = MatrixIterator.get_coords_below([coord_notes_current[0], coord_notes_current[1]]);
                    }

                    for (let coord_to_grow of coords_notes_previous) {
                        let notes_below = this.matrix_leaves[coord_to_grow[0]][coord_to_grow[1]];
                        let notes_children = notes_below;
                        this.add_layer(
                            notes_user_input_renderable,
                            notes_children,
                            -1
                        );
                    }
                    break;
                }
                case DERIVE: {
                    // if (coord_notes_current[0] === -1) {
                    //     this.root = notes_user_input_renderable
                    // } else {
                    //     this.matrix_leaves[coord_notes_current[0]][coord_notes_current[1]] = notes_user_input_renderable;
                    // }
                    // coord_notes_previous = MatrixIterator.get_coords_above([coord_notes_current[0], coord_notes_current[1]]);
                    // let notes_above = this.matrix_leaves[coord_notes_previous[0]][coord_notes_previous[1]];
                    // let notes_parent = notes_above;
                    // this.add_layer(
                    //     notes_parent,
                    //     notes_user_input_renderable,
                    //     -1
                    // );
                    break;
                }
                default: {
                    throw 'adding notes to parse tree failed'
                }
            }

            // remove references to old leaves
            for (let coord_notes_previous of coords_notes_previous) {
                this.coords_roots = this.coords_roots.filter((x) => {
                    return !(x[0] === coord_notes_previous[0] && x[1] === coord_notes_previous[1])
                });
            }

            // add references to new leaves
            this.coords_roots.push(
                coord_notes_current
            )
        }

        private add_layer(notes_parent: TreeModel.Node<n.NoteRenderable>[], notes_child: TreeModel.Node<n.NoteRenderable>[], index_new_layer: number): void {

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
    }
}