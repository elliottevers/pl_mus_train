"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var _ = require("underscore");
var parse;
(function (parse) {
    var NoteRenderable = note_1.note.NoteRenderable;
    // import Parsable = algorithm.Parsable;
    var ParseTree = /** @class */ (function () {
        function ParseTree() {
        }
        ParseTree.prototype.get_root = function () {
            return this.root;
        };
        // public set_root(root: TreeModel.Node<n.NoteRenderable>): void {
        //     this.root = root;
        //     this.coords_roots.push([-1])
        // }
        ParseTree.create_root_from_segments = function (segments) {
            var note_segment_last = segments[segments.length - 1].get_note();
            var note_segment_first = segments[0].get_note();
            var tree = new TreeModel();
            return tree.parse({
                id: -1,
                note: new note_1.note.NoteRenderable(note_segment_last.model.note.pitch, note_segment_first.model.note.beat_start, (note_segment_last.model.note.beat_start + note_segment_last.model.note.beats_duration) - note_segment_first.model.note.beat_start, note_segment_last.model.note.velocity, note_segment_last.model.note.muted, [-1]),
                children: []
            });
        };
        ParseTree.add_layer = function (notes_parent, notes_child, index_new_layer) {
            var note_parent_best, b_successful;
            for (var _i = 0, notes_child_1 = notes_child; _i < notes_child_1.length; _i++) {
                var node = notes_child_1[_i];
                note_parent_best = node.model.note.get_best_candidate(notes_parent);
                b_successful = node.model.note.choose();
                if (b_successful) {
                    node.model.id = index_new_layer;
                    note_parent_best.addChild(node);
                }
            }
        };
        ;
        return ParseTree;
    }());
    parse.ParseTree = ParseTree;
    var StructParse = /** @class */ (function (_super) {
        __extends(StructParse, _super);
        function StructParse(matrix) {
            var _this = _super.call(this) || this;
            _this.matrix_leaves = matrix;
            _this.coords_roots = [];
            _this.regions_renderable = [];
            return _this;
        }
        StructParse.prototype.get_notes_at_coord = function (coord) {
            if (coord[0] === -1) {
                return [this.root];
            }
            else {
                return this.matrix_leaves[coord[0]][coord[1]];
            }
        };
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
        StructParse.prototype.set_root = function (note) {
            var coord_root = [-1];
            // this.root = NoteRenderable.from_note(note, coord_root)
            // this.set_root(NoteRenderable.from_note(note, coord_root))
            this.root = NoteRenderable.from_note(note, coord_root);
            this.regions_renderable.push(coord_root);
            this.coords_roots.push(coord_root);
        };
        StructParse.prototype.get_regions_renderable = function () {
            return this.regions_renderable;
        };
        // TODO: never set the root in this manner - maybe that's how we can get around the if-else barrage
        StructParse.prototype.add = function (notes_user_input, coords_parse, parsable, bypass_parse) {
            var notes_user_input_renderable = notes_user_input.map(function (note) {
                return NoteRenderable.from_note(note, coords_parse);
            });
            this.matrix_leaves[coords_parse[0]][coords_parse[1]] = notes_user_input_renderable;
            this.regions_renderable.push(coords_parse);
            if (bypass_parse) {
                this.coords_roots = this.coords_roots.concat([coords_parse]);
                return;
            }
            // if (!bypass_parse) {
            var coords_notes_to_grow = parsable.get_coords_notes_to_grow(coords_parse);
            for (var _i = 0, coords_notes_to_grow_1 = coords_notes_to_grow; _i < coords_notes_to_grow_1.length; _i++) {
                var coord_to_grow = coords_notes_to_grow_1[_i];
                var notes_to_grow = this.get_notes_at_coord(coord_to_grow);
                parsable.grow_layer(notes_user_input_renderable, notes_to_grow);
            }
            this.coords_roots = parsable.update_roots(this.coords_roots, coords_notes_to_grow, coords_parse);
        };
        return StructParse;
    }(ParseTree));
    parse.StructParse = StructParse;
})(parse = exports.parse || (exports.parse = {}));
//# sourceMappingURL=parse.js.map