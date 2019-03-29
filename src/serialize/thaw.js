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
            var notes = [];
            // TODO: this is only valid for forward iteration
            var matrix = TrainThawer.thaw_notes_matrix(filepath, env);
            for (var _i = 0, _a = Object.keys(matrix); _i < _a.length; _i++) {
                var key_row = _a[_i];
                var col = matrix[key_row];
                for (var _b = 0, _c = Object.keys(col); _b < _c.length; _b++) {
                    var key_col = _c[_b];
                    for (var _d = 0, _e = matrix[key_row][key_col]; _d < _e.length; _d++) {
                        var note_deserialized = _e[_d];
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
                    for (var _i = 0, col_1 = col; _i < col_1.length; _i++) {
                        var note_serialized = col_1[_i];
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