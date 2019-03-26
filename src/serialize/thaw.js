"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trainer_1 = require("../train/trainer");
var file_1 = require("../io/file");
var algorithm_1 = require("../train/algorithm");
var TreeModel = require("tree-model");
var serialize_1 = require("./serialize");
var note_1 = require("../note/note");
var logger_1 = require("../log/logger");
var thaw;
(function (thaw) {
    var Trainer = trainer_1.trainer.Trainer;
    var from_json = file_1.file.from_json;
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var PARSE = algorithm_1.algorithm.PARSE;
    var deserialize_note = serialize_1.serialize.deserialize_note;
    var Note = note_1.note.Note;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var Logger = logger_1.log.Logger;
    var TrainThawer = /** @class */ (function () {
        function TrainThawer(env) {
            this.env = env;
        }
        TrainThawer.prototype.thaw = function (filepath, config) {
            var trainer;
            var matrix_deserialized = from_json(filepath, config['env']);
            var logger = new Logger(config['env']);
            logger.log(JSON.stringify(matrix_deserialized));
            trainer = new Trainer(config['window'], config['user_input_handler'], config['trainable'], config['track_target'], config['track_user_input'], config['song'], config['segments'], config['messenger']);
            trainer.advance();
            switch (config['trainable'].get_name()) {
                case DETECT: {
                    var notes = [];
                    // TODO: this is only valid for forward iteration
                    for (var _i = 0, matrix_deserialized_1 = matrix_deserialized; _i < matrix_deserialized_1.length; _i++) {
                        var row = matrix_deserialized_1[_i];
                        for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
                            var col = row_1[_a];
                            if (col === null) {
                                continue;
                            }
                            for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                                var note_serialized = col_1[_b];
                                notes.push(deserialize_note(note_serialized));
                            }
                        }
                    }
                    var notes_parsed = notes;
                    var tree = new TreeModel();
                    for (var _c = 0, notes_parsed_1 = notes_parsed; _c < notes_parsed_1.length; _c++) {
                        var note_parsed = notes_parsed_1[_c];
                        var note_recovered = tree.parse({
                            id: -1,
                            note: new Note(note_parsed.model.note.pitch, note_parsed.model.note.beat_start, note_parsed.model.note.beats_duration, note_parsed.model.note.velocity, note_parsed.model.note.muted),
                            children: []
                        });
                        trainer.accept_input([note_recovered]);
                    }
                    // trainer.pause();
                    break;
                }
                case PREDICT: {
                    break;
                }
                case PARSE: {
                    var input_left = true;
                    while (input_left) {
                        var coord_current = trainer.iterator_matrix_train.get_coord_current();
                        trainer.accept_input(matrix_deserialized[coord_current[0]][coord_current[1]].map(function (note_serialized) {
                            return deserialize_note(note_serialized);
                        }));
                        if (trainer.iterator_matrix_train.done) {
                            input_left = false;
                        }
                    }
                    // trainer.pause();
                    break;
                }
                // go until we find a segment without user input
                case DERIVE: {
                    var input_left = true;
                    while (input_left) {
                        var coord_current = trainer.iterator_matrix_train.get_coord_current();
                        if (matrix_deserialized[coord_current[0]][coord_current[1]].length === 0) {
                            input_left = false;
                            continue;
                        }
                        trainer.accept_input(matrix_deserialized[coord_current[0]][coord_current[1]]);
                    }
                    // trainer.pause();
                    break;
                }
            }
            return trainer;
        };
        return TrainThawer;
    }());
    thaw.TrainThawer = TrainThawer;
})(thaw = exports.thaw || (exports.thaw = {}));
//# sourceMappingURL=thaw.js.map