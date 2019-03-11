"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var trainer_1 = require("../train/trainer");
var file_1 = require("../io/file");
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
    // TODO: deserialize
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
})(serialize = exports.serialize || (exports.serialize = {}));
var freeze;
(function (freeze) {
    var serialize_target_sequence = serialize.serialize_target_sequence;
    var to_json = file_1.file.to_json;
    var TrainFreezer = /** @class */ (function () {
        function TrainFreezer(env) {
            this.env = env;
        }
        TrainFreezer.prototype.freeze = function (trainer, filepath) {
            var data_serializable = trainer.history_user_input.matrix_data;
            for (var i_row in trainer.history_user_input.matrix_data) {
                for (var i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                    data_serializable[Number(i_row)][Number(i_col)] = serialize_target_sequence(trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]);
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
    var TrainThawer = /** @class */ (function () {
        function TrainThawer(env) {
        }
        TrainThawer.prototype.thaw = function (filepath, config) {
            var matrix_deserialized = from_json(filepath, config['env']);
            var notes = [];
            for (var _i = 0, matrix_deserialized_1 = matrix_deserialized; _i < matrix_deserialized_1.length; _i++) {
                var row = matrix_deserialized_1[_i];
                for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
                    var col = row_1[_a];
                    if (col === null) {
                        continue;
                    }
                    for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                        var sequence_target = col_1[_b];
                        for (var _c = 0, _d = sequence_target.iterator_subtarget.subtargets; _c < _d.length; _c++) {
                            var note_2 = _d[_c];
                            notes.push(note_2);
                        }
                    }
                }
            }
            var notes_parsed = notes.map(function (obj) { return JSON.parse(obj.note); });
            var trainer = new Trainer(config['window'], config['user_input_handler'], config['algorithm'], config['clip_user_input'], config['clip_target_virtual'], config['song'], config['segments'], config['messenger']);
            trainer.init();
            var tree = new TreeModel();
            for (var _e = 0, notes_parsed_1 = notes_parsed; _e < notes_parsed_1.length; _e++) {
                var note_parsed = notes_parsed_1[_e];
                var note_recovered = tree.parse({
                    id: -1,
                    note: new Note(note_parsed.note.pitch, note_parsed.note.beat_start, note_parsed.note.beats_duration, note_parsed.note.velocity, note_parsed.note.b_muted),
                    children: []
                });
                trainer.accept_input([note_recovered]);
            }
            return trainer;
        };
        return TrainThawer;
    }());
    thaw.TrainThawer = TrainThawer;
})(thaw = exports.thaw || (exports.thaw = {}));
//# sourceMappingURL=serialize.js.map