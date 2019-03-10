"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        }
        TrainFreezer.prototype.freeze = function (trainer, filepath, env) {
            var data_serializable = trainer.history_user_input.matrix_data;
            for (var i_row in trainer.history_user_input.matrix_data) {
                for (var i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                    data_serializable[Number(i_row)][Number(i_col)] = serialize_target_sequence(trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]);
                }
            }
            to_json(data_serializable, filepath, env);
        };
        return TrainFreezer;
    }());
    freeze.TrainFreezer = TrainFreezer;
})(freeze = exports.freeze || (exports.freeze = {}));
var thaw;
(function (thaw) {
    var Trainer = trainer_1.trainer.Trainer;
    var deserialize_target_sequence = serialize.deserialize_target_sequence;
    var from_json = file_1.file.from_json;
    var TrainThawer = /** @class */ (function () {
        function TrainThawer(env) {
        }
        TrainThawer.prototype.thaw = function (filepath, config) {
            var matrix_deserialized = from_json(filepath, config['env']);
            for (var i_row in matrix_deserialized) {
                for (var i_col in matrix_deserialized[Number(i_row)]) {
                    matrix_deserialized[Number(i_row)][Number(i_col)] = deserialize_target_sequence(matrix_deserialized[Number(i_row)][Number(i_col)]);
                }
            }
            return new Trainer(config['window'], config['user_input_handler'], config['algorithm'], config['clip_user_input'], config['clip_target_virtual'], config['song'], config['segments'], config['messenger']);
        };
        return TrainThawer;
    }());
    thaw.TrainThawer = TrainThawer;
})(thaw = exports.thaw || (exports.thaw = {}));
//# sourceMappingURL=serialize.js.map