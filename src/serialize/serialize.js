"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var trainer_1 = require("../train/trainer");
var file_1 = require("../io/file");
var algorithm_1 = require("../train/algorithm");
var serialize;
(function (serialize) {
    serialize.serialize_note = function (note) {
        return JSON.stringify(note.model);
    };
    serialize.deserialize_note = function (note_serialized) {
        if (note_serialized === null) {
            return null;
        }
        var tree = new TreeModel();
        return tree.parse(JSON.parse(note_serialized));
    };
    serialize.serialize_sequence_note = function (notes) {
        if (!notes) {
            return null;
        }
        var notes_serialized = [];
        for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
            var note_2 = notes_1[_i];
            notes_serialized.push(serialize.serialize_note(note_2));
        }
        return notes_serialized;
    };
    serialize.serialize_subtarget = function (subtarget) {
        var subtarget_serialized;
        // TODO: fix
        // let subtarget_serialized = subtarget;
        subtarget_serialized = subtarget;
        subtarget_serialized.note = serialize.serialize_note(subtarget.note);
        return subtarget_serialized;
    };
    serialize.deserialize_subtarget = function (subtarget_serialized) {
        var subtarget_deserialized = subtarget_serialized;
        subtarget_deserialized.note = serialize.deserialize_note(subtarget_serialized.note);
        return subtarget_deserialized;
    };
    // import SequenceTarget = history.SequenceTarget;
    serialize.serialize_target_sequence = function (sequence_target) {
        var sequence_target_serialized = sequence_target;
        for (var i_target in sequence_target) {
            var subtargets = sequence_target[Number(i_target)].iterator_subtarget.subtargets;
            for (var i_subtarget in subtargets) {
                var subtarget = subtargets[Number(i_subtarget)];
                sequence_target_serialized[Number(i_target)][Number(i_subtarget)] = serialize.serialize_subtarget(subtarget);
            }
        }
        return sequence_target_serialized;
    };
    serialize.deserialize_target_sequence = function (sequence_target_serialized) {
        var sequence_target_deserialized = sequence_target_serialized;
        for (var i_target in sequence_target_serialized) {
            var subtargets = sequence_target_serialized[Number(i_target)].get_subtargets();
            for (var i_subtarget in subtargets) {
                var subtarget = subtargets[Number(i_subtarget)];
                sequence_target_deserialized[Number(i_target)][Number(i_subtarget)] = serialize.deserialize_subtarget(subtarget);
            }
        }
        return sequence_target_deserialized;
    };
    // export let serialize_note_sequence = (sequence_target) => {
    //     let sequence_target_serialized = sequence_target;
    //     for (let i_target in sequence_target) {
    //         let subtargets = sequence_target[Number(i_target)].iterator_subtarget.subtargets;
    //         for (let i_subtarget in subtargets) {
    //             let subtarget = subtargets[Number(i_subtarget)];
    //             sequence_target_serialized[Number(i_target)][Number(i_subtarget)] = serialize_subtarget(subtarget)
    //         }
    //     }
    //     return sequence_target_serialized;
    // };
    //
    // export let deserialize_note_sequence = (sequence_target_serialized) => {
    //     let sequence_target_deserialized = sequence_target_serialized;
    //
    //     for (let i_target in sequence_target_serialized) {
    //         let subtargets = sequence_target_serialized[Number(i_target)].get_subtargets();
    //         for (let i_subtarget in subtargets) {
    //             let subtarget = subtargets[Number(i_subtarget)];
    //             sequence_target_deserialized[Number(i_target)][Number(i_subtarget)] = deserialize_subtarget(subtarget)
    //         }
    //     }
    //     return sequence_target_deserialized;
    // };
})(serialize = exports.serialize || (exports.serialize = {}));
var freeze;
(function (freeze) {
    var to_json = file_1.file.to_json;
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var serialize_sequence_note = serialize.serialize_sequence_note;
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
var thaw;
(function (thaw) {
    var Trainer = trainer_1.trainer.Trainer;
    var from_json = file_1.file.from_json;
    var Note = note_1.note.Note;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var DETECT = algorithm_1.algorithm.DETECT;
    var deserialize_note = serialize.deserialize_note;
    var TrainThawer = /** @class */ (function () {
        function TrainThawer(env) {
            this.env = env;
        }
        TrainThawer.prototype.thaw = function (filepath, config) {
            var trainer;
            var matrix_deserialized = from_json(filepath, config['env']);
            trainer = new Trainer(config['window'], config['user_input_handler'], config['trainable'], config['track_target'], config['track_user_input'], config['song'], config['segments'], config['messenger']);
            trainer.commence(
            // true
            );
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
                            // for (let sequence_target of col) {
                            //     for (let note of sequence_target.iterator_subtarget.subtargets) {
                            //         notes.push(note)
                            //     }
                            // }
                            for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                                var note_serialized = col_1[_b];
                                notes.push(deserialize_note(note_serialized));
                            }
                        }
                    }
                    // let notes_parsed = notes.map((obj)=>{return JSON.parse(obj.note)});
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
                    trainer.pause();
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
                    trainer.pause();
                    break;
                }
                // go until we find a segment without user input
                case DERIVE: {
                    var input_left = true;
                    while (input_left) {
                        // if (trainer.iterator_matrix_train.done) {
                        //     input_left = false;
                        //     continue
                        // }
                        var coord_current = trainer.iterator_matrix_train.get_coord_current();
                        if (matrix_deserialized[coord_current[0]][coord_current[1]].length === 0) {
                            input_left = false;
                            continue;
                        }
                        trainer.accept_input(matrix_deserialized[coord_current[0]][coord_current[1]]);
                    }
                    trainer.pause();
                    break;
                }
            }
            return trainer;
        };
        return TrainThawer;
    }());
    thaw.TrainThawer = TrainThawer;
})(thaw = exports.thaw || (exports.thaw = {}));
//# sourceMappingURL=serialize.js.map