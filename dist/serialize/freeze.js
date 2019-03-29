"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_1 = require("../io/file");
var serialize_1 = require("./serialize");
var freeze;
(function (freeze) {
    var to_json = file_1.file.to_json;
    var serialize_sequence_note = serialize_1.serialize.serialize_sequence_note;
    var TrainFreezer = /** @class */ (function () {
        function TrainFreezer() {
        }
        TrainFreezer.freeze = function (trainer, filepath, env) {
            var data_serializable = trainer.history_user_input.matrix_data;
            var dict = {};
            var data_serializable_max = {};
            for (var i_row in trainer.history_user_input.matrix_data) {
                data_serializable_max[i_row] = {};
                for (var i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                    // data_serializable[Number(i_row)][Number(i_col)] = serialize_sequence_note(
                    //     trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                    // )
                    data_serializable_max[i_row][i_col] = serialize_sequence_note(trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]);
                }
            }
            dict['history_user_input'] = data_serializable_max;
            // to_json(data_serializable, filepath, env)
            to_json(dict, filepath, env);
        };
        return TrainFreezer;
    }());
    freeze.TrainFreezer = TrainFreezer;
})(freeze = exports.freeze || (exports.freeze = {}));
//# sourceMappingURL=freeze.js.map