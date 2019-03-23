import {note as n, note} from "../note/note";
import TreeModel = require("tree-model");
import {algorithm} from "../train/algorithm";

const _ = require("underscore");


export namespace parse {
    import NoteRenderable = note.NoteRenderable;
    import Parsed = algorithm.Parsed;

    export interface Parsable {
        choose(): boolean;

        // TODO: annotation
        get_best_candidate(list_candidate_note);
    }

    export abstract class ParseTree {
        root: TreeModel.Node<n.NoteRenderable>;

        coords_roots: number[][]; // list of coordinates

        constructor() {

        }

        public get_root(): TreeModel.Node<n.NoteRenderable> {
            return this.root
        }

        public set_root(root: TreeModel.Node<n.NoteRenderable>): void {
            this.root = root;
            this.coords_roots = [[-1]]
        }

        public static create_root_from_segments(segments): TreeModel.Node<n.NoteRenderable> {
            let note_segment_last = segments[segments.length - 1].get_note();

            let note_segment_first = segments[0].get_note();

            let tree: TreeModel = new TreeModel();

            return tree.parse(
                {
                    id: -1, // TODO: hashing scheme for clip id and beat start
                    note: new n.NoteRenderable(
                        note_segment_last.model.note.pitch,
                        note_segment_first.model.note.beat_start,
                        (note_segment_last.model.note.beat_start + note_segment_last.model.note.beats_duration) - note_segment_first.model.note.beat_start,
                        note_segment_last.model.note.velocity,
                        note_segment_last.model.note.muted,
                        [-1]
                    ),
                    children: [

                    ]
                }
            );
        }

        public static add_layer(notes_parent: TreeModel.Node<n.NoteRenderable>[], notes_child: TreeModel.Node<n.NoteRenderable>[], index_new_layer: number): void {

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

    export class StructParse extends ParseTree {

        root: TreeModel.Node<n.NoteRenderable>;

        matrix_leaves: TreeModel.Node<n.NoteRenderable>[][][];

        // theoretically we can render these regions to the user
        regions_renderable: number[][];

        constructor(matrix) {
            super();
            this.matrix_leaves = matrix;
            this.coords_roots = [];
            this.regions_renderable = [];
        }

        public get_notes_at_coord(coord: number[]) {
            if (coord[0] === -1) {
                return [this.root]
            } else {
                return this.matrix_leaves[coord[0]][coord[1]]
            }
        }

        // TODO: don't delete these 3 until we're sure we don't use them
        // private static get_diff_index_start(notes_new: TreeModel.Node<n.Note>[], notes_old: TreeModel.Node<n.Note>[]): number {
        //     let same_start, same_duration, index_start_diff;
        //     for (let i=0; i < notes_old.length; i++) {
        //         same_start = (notes_old[i].model.note.beat_start === notes_new[i].model.note.beat_start);
        //         same_duration = (notes_old[i].model.note.beats_duration === notes_new[i].model.note.beats_duration);
        //         if (!(same_start && same_duration)) {
        //             index_start_diff = i;
        //             break;
        //         }
        //     }
        //
        //     return index_start_diff;
        // }

        // private static get_diff_index_end(notes_new: TreeModel.Node<n.Note>[], notes_old: TreeModel.Node<n.Note>[]): number {
        //     let same_start, same_duration, index_end_diff;
        //     for (let i=-1; i > -1 * (notes_new.length + 1); i--) {
        //         same_start = (notes_new.slice(i)[0].model.note.beat_start === notes_old.slice(i)[0].model.note.beat_start);
        //         same_duration = (notes_new.slice(i)[0].model.note.beats_duration === notes_old.slice(i)[0].model.note.beats_duration);
        //         if (!(same_start && same_duration)) {
        //             index_end_diff = i;
        //             break;
        //         }
        //     }
        //
        //     // NB: add one in order to use with array slice, unless of course the index is -1, then you'll access the front of the array
        //     return index_end_diff;
        // }

        // private static get_diff_index_notes(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): number[] {
        //     return [
        //         StructParse.get_diff_index_start(notes_child, notes_parent),
        //         StructParse.get_diff_index_end(notes_child, notes_parent)
        //     ];
        // };

        public set_root(note) {
            let coord_root = [-1];
            this.regions_renderable.push(coord_root);
            this.root = NoteRenderable.from_note(note, coord_root)
        }

        public get_regions_renderable(): number[][] {
            return this.regions_renderable
        }

        // TODO: never set the root in this manner - maybe that's how we can get around the if-else barrage
        public add(notes_user_input, coord_notes_current, algorithm: Parsed): void {

            let notes_user_input_renderable = notes_user_input.map((note) => {
                return NoteRenderable.from_note(note, coord_notes_current)
            });

            this.matrix_leaves[coord_notes_current[0]][coord_notes_current[1]] = notes_user_input_renderable;

            this.regions_renderable.push(coord_notes_current);

            let coords_notes_to_grow = algorithm.get_coords_notes_to_grow(coord_notes_current);

            for (let coord_to_grow of coords_notes_to_grow) {

                let notes_to_grow = this.get_notes_at_coord(coord_to_grow);

                algorithm.grow_layer(notes_user_input_renderable, notes_to_grow);
            }

            this.coords_roots = algorithm.update_roots(
                this.coords_roots,
                coords_notes_to_grow,
                coord_notes_current
            );
        }
    }
}