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
var algorithm_1 = require("../train/algorithm");
var iterate_1 = require("../train/iterate");
var _ = require("underscore");
var parse;
(function (parse) {
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var MatrixIterator = iterate_1.iterate.MatrixIterator;
    var NoteRenderable = note_1.note.NoteRenderable;
    var ParseTree = /** @class */ (function () {
        function ParseTree() {
        }
        ParseTree.prototype.get_root = function () {
            return this.root;
        };
        return ParseTree;
    }());
    var StructParse = /** @class */ (function (_super) {
        __extends(StructParse, _super);
        function StructParse(matrix) {
            var _this = _super.call(this) || this;
            _this.matrix_leaves = matrix;
            _this.coords_roots = [];
            _this.history = [];
            return _this;
        }
        StructParse.prototype.get_notes_at_coord = function (coord) {
            return this.matrix_leaves[coord[0]][coord[1]];
        };
        StructParse.get_diff_index_start = function (notes_new, notes_old) {
            var same_start, same_duration, index_start_diff;
            for (var i = 0; i < notes_old.length; i++) {
                same_start = (notes_old[i].model.note.beat_start === notes_new[i].model.note.beat_start);
                same_duration = (notes_old[i].model.note.beats_duration === notes_new[i].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_start_diff = i;
                    break;
                }
            }
            return index_start_diff;
        };
        StructParse.get_diff_index_end = function (notes_new, notes_old) {
            var same_start, same_duration, index_end_diff;
            for (var i = -1; i > -1 * (notes_new.length + 1); i--) {
                same_start = (notes_new.slice(i)[0].model.note.beat_start === notes_old.slice(i)[0].model.note.beat_start);
                same_duration = (notes_new.slice(i)[0].model.note.beats_duration === notes_old.slice(i)[0].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_end_diff = i;
                    break;
                }
            }
            // NB: add one in order to use with array slice, unless of course the index is -1, then you'll access the front of the array
            return index_end_diff;
        };
        // TODO: complete return method signature
        StructParse.prototype.get_diff_index_notes = function (notes_parent, notes_child) {
            return [
                StructParse.get_diff_index_start(notes_child, notes_parent),
                StructParse.get_diff_index_end(notes_child, notes_parent)
            ];
        };
        ;
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
        StructParse.prototype.set_root = function (note) {
            var coord_root = [-1];
            this.history.push(coord_root);
            this.root = NoteRenderable.from_note(note, coord_root);
        };
        StructParse.prototype.set_notes = function (notes, coord) {
            this.history.push(coord);
            this.matrix_leaves[coord[0]][coord[1]] = notes.map(function (note) {
                return NoteRenderable.from_note(note, coord);
            });
        };
        StructParse.prototype.get_history = function () {
            return this.history;
        };
        // TODO: holy fuck refactor
        StructParse.prototype.add = function (notes_user_input, coord_notes_current, algorithm) {
            // let coord_notes_previous;
            var coords_notes_previous = [];
            var notes_user_input_renderable = notes_user_input.map(function (note) {
                return NoteRenderable.from_note(note, coord_notes_current);
            });
            if (coord_notes_current[0] === -1) {
                this.root = notes_user_input_renderable[0];
            }
            else {
                this.matrix_leaves[coord_notes_current[0]][coord_notes_current[1]] = notes_user_input_renderable;
            }
            this.history.push(coord_notes_current);
            switch (algorithm.get_name()) {
                case PARSE: {
                    if (coord_notes_current[0] === -1) {
                        for (var i in this.matrix_leaves[0]) {
                            coords_notes_previous.push([0, Number(i)]);
                        }
                    }
                    else {
                        coords_notes_previous = MatrixIterator.get_coords_below([coord_notes_current[0], coord_notes_current[1]]);
                    }
                    for (var _i = 0, coords_notes_previous_1 = coords_notes_previous; _i < coords_notes_previous_1.length; _i++) {
                        var coord_to_grow = coords_notes_previous_1[_i];
                        var notes_below = this.matrix_leaves[coord_to_grow[0]][coord_to_grow[1]];
                        var notes_children = notes_below;
                        this.add_layer(notes_user_input_renderable, notes_children, -1);
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
                    throw 'adding notes to parse tree failed';
                }
            }
            var _loop_1 = function (coord_notes_previous) {
                this_1.coords_roots = this_1.coords_roots.filter(function (x) {
                    return !(x[0] === coord_notes_previous[0] && x[1] === coord_notes_previous[1]);
                });
            };
            var this_1 = this;
            // remove references to old leaves
            for (var _a = 0, coords_notes_previous_2 = coords_notes_previous; _a < coords_notes_previous_2.length; _a++) {
                var coord_notes_previous = coords_notes_previous_2[_a];
                _loop_1(coord_notes_previous);
            }
            // add references to new leaves
            this.coords_roots.push(coord_notes_current);
        };
        StructParse.prototype.add_layer = function (notes_parent, notes_child, index_new_layer) {
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
        return StructParse;
    }(ParseTree));
    parse.StructParse = StructParse;
})(parse = exports.parse || (exports.parse = {}));
//# sourceMappingURL=parse.js.map