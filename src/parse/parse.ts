import {note as n, note} from "../note/note";
import TreeModel = require("tree-model");
import {trainable} from "../algorithm/trainable";
const _ = require("underscore");


export namespace parse {
    import NoteRenderable = note.NoteRenderable;
    import Parsable = trainable.Parsable;

    export abstract class ParseTree {
        root: TreeModel.Node<n.NoteRenderable>;

        coords_roots: number[][]; // list of coordinates

        constructor() {

        }

        public get_root(): TreeModel.Node<n.NoteRenderable> {
            return this.root
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

        public set_root(note) {
            let coord_root = [-1];
            this.root = NoteRenderable.from_note(note, coord_root);
            this.regions_renderable.push(coord_root);
            this.coords_roots.push(coord_root)
        }

        public get_regions_renderable(): number[][] {
            return this.regions_renderable
        }

        // TODO: never set the root in this manner - maybe that's how we can get around the if-else barrage
        public add(notes_user_input, coords_parse: number[], parsable: Parsable, bypass_parse?: boolean): void {

            let notes_user_input_renderable = notes_user_input.map((note) => {
                return NoteRenderable.from_note(note, coords_parse)
            });

            this.matrix_leaves[coords_parse[0]][coords_parse[1]] = notes_user_input_renderable;

            this.regions_renderable.push(coords_parse);

            if (bypass_parse) {

                this.coords_roots = this.coords_roots.concat(
                    [coords_parse]
                );

                return
            }

            let coords_notes_to_grow = parsable.get_coords_notes_to_grow(coords_parse);

            for (let coord_to_grow of coords_notes_to_grow) {

                let notes_to_grow = this.get_notes_at_coord(coord_to_grow);

                parsable.grow_layer(notes_user_input_renderable, notes_to_grow);
            }

            this.coords_roots = parsable.update_roots(
                this.coords_roots,
                coords_notes_to_grow,
                coords_parse
            );
        }
    }
}