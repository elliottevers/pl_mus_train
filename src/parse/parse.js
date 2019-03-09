"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var _ = require("underscore");
var parse;
(function (parse) {
    var ParseTree = /** @class */ (function () {
        function ParseTree(note, coordinates_matrix) {
            var tree = new TreeModel();
            // let splitted = messages[i_mess].split(' ');
            this.root = tree.parse({
                id: -1,
                note: new note_1.note.NoteRenderable(
                // Number(splitted[0]),
                // Number(splitted[1]),
                // Number(splitted[2]),
                // Number(splitted[3]),
                // Number(splitted[4]),
                // coordinates_matrix
                note.model.note.pitch, note.model.note.beat_start, note.model.note.beats_duration, note.model.note.velocity, note.model.note.muted, coordinates_matrix),
                children: []
            });
        }
        // // TODO: we actually have to implement
        // public static add(input_user, list_parse_tree, iterator_matrix_train): ParseTree[] {
        //     let coord = iterator_matrix_train.get_coord_current()
        //     return
        // }
        //
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
        //
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
        //
        // // TODO: complete return method signature
        // get_diff_index_notes(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): number[] {
        //     return [
        //         ParseTree.get_diff_index_start(notes_child, notes_parent),
        //         ParseTree.get_diff_index_end(notes_child, notes_parent)
        //     ];
        // };
        //
        ParseTree.prototype.get_root = function () {
            return;
        };
        return ParseTree;
    }());
    parse.ParseTree = ParseTree;
})(parse = exports.parse || (exports.parse = {}));
//# sourceMappingURL=parse.js.map