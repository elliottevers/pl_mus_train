"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algorithm_1 = require("../train/algorithm");
var file_1 = require("../io/file");
var serialize_1 = require("./serialize");
var freeze;
(function (freeze) {
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var PARSE = algorithm_1.algorithm.PARSE;
    var to_json = file_1.file.to_json;
    var serialize_sequence_note = serialize_1.serialize.serialize_sequence_note;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var TrainFreezer = /** @class */ (function () {
        function TrainFreezer(env) {
            this.env = env;
        }
        TrainFreezer.prototype.freeze = function (trainer, filepath) {
            var data_serializable = trainer.history_user_input.matrix_data;
            switch (trainer.trainable.get_name()) {
                case DETECT: {
                    for (var i_row in trainer.history_user_input.matrix_data) {
                        for (var i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                            // data_serializable[Number(i_row)][Number(i_col)] = serialize_target_sequence(
                            //     trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                            // )
                            data_serializable[Number(i_row)][Number(i_col)] = serialize_sequence_note(trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]);
                        }
                    }
                    break;
                }
                case PREDICT: {
                    // TODO
                    break;
                }
                case PARSE: {
                    for (var i_row in trainer.history_user_input.matrix_data) {
                        for (var i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                            data_serializable[Number(i_row)][Number(i_col)] = serialize_sequence_note(trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]);
                        }
                    }
                    break;
                }
                case DERIVE: {
                    // TODO
                    break;
                }
            }
            to_json(data_serializable, filepath, this.env);
        };
        return TrainFreezer;
    }());
    freeze.TrainFreezer = TrainFreezer;
})(freeze = exports.freeze || (exports.freeze = {}));
//# sourceMappingURL=freeze.js.map