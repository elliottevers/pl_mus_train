"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_1 = require("../io/file");
var serialize_1 = require("./serialize");
var thaw;
(function (thaw) {
    var from_json = file_1.file.from_json;
    var deserialize_note = serialize_1.serialize.deserialize_note;
    var TrainThawer = /** @class */ (function () {
        function TrainThawer() {
        }
        TrainThawer.thaw_notes = function (filepath, env) {
            // let matrix_deserialized = from_json(filepath, env);
            var notes = [];
            // TODO: this is only valid for forward iteration
            for (var _i = 0, _a = TrainThawer.thaw_notes_matrix(filepath, env); _i < _a.length; _i++) {
                var row = _a[_i];
                for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                    var col = row_1[_b];
                    if (col === null) {
                        continue;
                    }
                    for (var _c = 0, col_1 = col; _c < col_1.length; _c++) {
                        var note_deserialized = col_1[_c];
                        notes.push(note_deserialized);
                    }
                }
            }
            return notes;
        };
        TrainThawer.thaw_notes_matrix = function (filepath, env) {
            var matrix_deserialized = from_json(filepath, env);
            var matrix_test = matrix_deserialized;
            // TODO: this is only valid for forward iteration
            for (var i_row in matrix_deserialized) {
                var row = matrix_deserialized[Number(i_row)];
                for (var i_col in row) {
                    var col = matrix_deserialized[Number(i_row)][Number(i_col)];
                    if (col === null) {
                        matrix_test[Number(i_row)][Number(i_col)] = [];
                        continue;
                    }
                    var notes = [];
                    for (var _i = 0, col_2 = col; _i < col_2.length; _i++) {
                        var note_serialized = col_2[_i];
                        notes.push(deserialize_note(note_serialized));
                    }
                    matrix_test[Number(i_row)][Number(i_col)] = notes;
                }
            }
            return matrix_test;
        };
        return TrainThawer;
    }());
    thaw.TrainThawer = TrainThawer;
})(thaw = exports.thaw || (exports.thaw = {}));
//# sourceMappingURL=thaw.js.map