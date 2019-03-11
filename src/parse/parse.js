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
var algorithm_1 = require("../train/algorithm");
var _ = require("underscore");
var parse;
(function (parse) {
    var DETECT = algorithm_1.algorithm.DETECT;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var ParseTree = /** @class */ (function () {
        function ParseTree() {
        }
        ParseTree.prototype.get_root = function () {
            return this.root;
        };
        return ParseTree;
    }());
    var ParseMatrix = /** @class */ (function (_super) {
        __extends(ParseMatrix, _super);
        function ParseMatrix(matrix) {
            var _this = _super.call(this) || this;
            // let tree: TreeModel = new TreeModel();
            // this.root = tree.parse(
            //     {
            //         id: -1, // TODO: hashing scheme for clip id and beat start
            //         note: new n.NoteRenderable(
            //             // Number(splitted[0]),
            //             // Number(splitted[1]),
            //             // Number(splitted[2]),
            //             // Number(splitted[3]),
            //             // Number(splitted[4]),
            //             // coordinates_matrix
            //             note.model.note.pitch,
            //             note.model.note.beat_start,
            //             note.model.note.beats_duration,
            //             note.model.note.velocity,
            //             note.model.note.muted,
            //             coordinates_matrix
            //         ),
            //         children: [
            //
            //         ]
            //     }
            // )
            matrix.unshift([]); // entire row reserved for root
            _this.matrix_note_sequence = matrix;
            return _this;
        }
        ParseMatrix.prototype.get_roots_at_coord = function (coord) {
            return this.matrix_note_sequence[coord[0]][coord[1]];
        };
        // // TODO: we actually have to implement
        // public static add(input_user, list_parse_tree, iterator_matrix_train): ParseTree[] {
        //     let coord = iterator_matrix_train.get_coord_current()
        //     return
        // }
        //
        ParseMatrix.get_diff_index_start = function (notes_new, notes_old) {
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
        ParseMatrix.get_diff_index_end = function (notes_new, notes_old) {
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
        ParseMatrix.prototype.get_diff_index_notes = function (notes_parent, notes_child) {
            return [
                ParseTree.get_diff_index_start(notes_child, notes_parent),
                ParseTree.get_diff_index_end(notes_child, notes_parent)
            ];
        };
        ;
        // public get_root(): TreeModel.Node<n.NoteRenderable> {
        //     return this.root
        // }
        ParseMatrix.prototype.to_coord_parse_matrix = function (coord) {
            if (coord[0] === 0) {
                return [0, 0]; // entire "row" is dedicated to root
            }
            else {
                return coord;
            }
        };
        ParseMatrix.prototype.add = function (notes_user_input, list_parse_tree, iterator_matrix_train, algorithm, history_user_input) {
            //
            // ParseTree.add_layer(,notes_user_input);
            // return
            switch (algorithm.get_name()) {
                case PARSE: {
                    var coord = iterator_matrix_train.get_coord_current();
                    var coord_notes_below = [coord[0] - 1, coord[1]];
                    // let notes_below = history_user_input.get(coord_notes_below);
                    // let notes_children = notes_below;
                    // ParseTree.add_layer(
                    //     notes_user_input,
                    //     notes_children,
                    //     coord[0]
                    // );
                    var notes_below = this.matrix_note_sequence[coord_notes_below[0]][coord_notes_below[1]];
                    var notes_children = notes_below;
                    this.add_layer(notes_user_input, notes_children);
                    break;
                }
                case DERIVE: {
                    var coord_parse_matrix = this.to_coord_parse_matrix(iterator_matrix_train.get_coord_current());
                    var coord_notes_above = this.to_coord_parse_matrix([coord_parse_matrix[0] + 1, coord_parse_matrix[1]]);
                    // let notes_below = history_user_input.get(coord_notes_below);
                    // let notes_children = notes_below;
                    // ParseTree.add_layer(
                    //     notes_user_input,
                    //     notes_children,
                    //     coord[0]
                    // );
                    var notes_above = this.matrix_note_sequence[coord_notes_above[0]][coord_notes_above[1]];
                    var notes_children = notes_above;
                    this.add_layer(notes_above, notes_user_input);
                    break;
                }
                default: {
                    throw 'adding notes to parse tree failed';
                }
            }
            if (algorithm.get_name() === DETECT) {
            }
        };
        //
        // private add_first_layer(notes: TreeModel.Node<n.Note>[], index_new_layer: number): void {
        //     // var note_parent_best, b_successful;
        //
        //     for (let node of notes) {
        //         node.model.id = index_new_layer;
        //         this.root_parse_tree.addChild(node);
        //     }
        // }
        //
        // NB: only works top down currently
        // private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
        ParseMatrix.prototype.add_layer = function (notes_parent, notes_child, index_new_layer) {
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
        return ParseMatrix;
    }(ParseTree));
    parse.ParseMatrix = ParseMatrix;
})(parse = exports.parse || (exports.parse = {}));
//# sourceMappingURL=parse.js.map