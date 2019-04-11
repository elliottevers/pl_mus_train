"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iterate_1 = require("../train/iterate");
var target_1 = require("../target/target");
var utils_1 = require("../utils/utils");
var targeted;
(function (targeted) {
    var TargetIterator = target_1.target.TargetIterator;
    var FactoryMatrixObjectives = iterate_1.iterate.FactoryMatrixObjectives;
    var Targeted = /** @class */ (function () {
        function Targeted() {
            this.b_parsed = false;
            this.b_targeted = true;
        }
        Targeted.prototype.update_history_user_input = function (input_postprocessed, history_user_input, iterator_matrix_train, trainable) {
            history_user_input.concat(input_postprocessed, trainable.coord_to_index_history_user_input(iterator_matrix_train.get_coord_current()));
            return history_user_input;
        };
        Targeted.prototype.get_num_layers_input = function () {
            return 1;
        };
        Targeted.prototype.determine_region_present = function (notes_target_next, segment_current) {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[0].model.note.get_beat_end()
            ];
        };
        Targeted.prototype.get_notes_in_region = function (target, segment) {
            return target.iterator_subtarget.subtargets.map(function (subtarget) {
                return subtarget.note;
            });
        };
        Targeted.prototype.unpause = function (song, scene_current) {
            // not forcing legato so that it starts immediately
            scene_current.fire(false);
            song.set_session_record(1);
            song.set_overdub(1);
        };
        Targeted.prototype.postprocess_user_input = function (notes_user_input, subtarget_current) {
            return [subtarget_current.note];
        };
        // TODO: verify that we don't need to do anything
        Targeted.prototype.terminate = function (struct_train, segments) {
            return;
        };
        Targeted.prototype.pause = function (song, scene_current) {
            song.stop();
        };
        Targeted.prototype.warrants_advance = function (notes_user_input, subtarget_current) {
            return utils_1.utils.remainder(notes_user_input[0].model.note.pitch, 12) === utils_1.utils.remainder(subtarget_current.note.model.note.pitch, 12);
        };
        Targeted.prototype.preprocess_struct_train = function (struct_train, segments, notes_target_track) {
            return this.preprocess_struct_targets(struct_train, segments, notes_target_track);
        };
        Targeted.prototype.preprocess_struct_targets = function (struct_targets, segments, notes_target_track) {
            return struct_targets;
        };
        Targeted.prototype.create_matrix_targets = function (user_input_handler, segments, notes_target_track) {
            var matrix_targets = FactoryMatrixObjectives.create_matrix_targets(this, segments);
            var _loop_1 = function (i_segment) {
                var segment_1 = segments[Number(i_segment)];
                var notes_in_segment = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_1.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_1.get_endpoints_loop()[1]; });
                var sequence_targets = this_1.determine_targets(user_input_handler, notes_in_segment);
                matrix_targets[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            };
            var this_1 = this;
            for (var i_segment in segments) {
                _loop_1(i_segment);
            }
            return matrix_targets;
        };
        Targeted.stream_subtarget_bounds = function (messenger, subtarget_current, segment_current, segments) {
            var duration_training_data = segments[segments.length - 1].beat_end;
            messenger.message(['duration_training_data', duration_training_data], true);
            messenger.message([
                'bounds',
                subtarget_current.note.model.note.beat_start / duration_training_data,
                subtarget_current.note.model.note.get_beat_end() / duration_training_data
            ], true);
        };
        Targeted.prototype.stream_bounds = function (messenger, subtarget_current, segment_current, segments) {
            Targeted.stream_subtarget_bounds(messenger, subtarget_current, segment_current, segments);
        };
        Targeted.prototype.update_struct = function (notes_input_user, struct_train, trainable, iterator_matrix_train) {
            return struct_train;
        };
        Targeted.prototype.create_struct_train = function (window, segments, track_target, user_input_handler, struct_train) {
            var notes_target_track = track_target.get_notes();
            return this.create_matrix_targets(user_input_handler, segments, notes_target_track);
        };
        Targeted.prototype.set_depth = function () {
        };
        Targeted.prototype.advance_scene = function (scene_current, song) {
            scene_current.fire(true);
        };
        Targeted.prototype.preprocess_history_user_input = function (history_user_input, segments) {
            return history_user_input;
        };
        Targeted.prototype.get_num_layers_clips_to_render = function () {
            return 1;
        };
        Targeted.prototype.coord_to_index_clip_render = function (coord) {
            return 0;
        };
        Targeted.prototype.coord_to_index_history_user_input = function (coord) {
            return coord;
        };
        Targeted.prototype.coord_to_index_struct_train = function (coord) {
            return coord;
        };
        return Targeted;
    }());
    targeted.Targeted = Targeted;
})(targeted = exports.targeted || (exports.targeted = {}));
//# sourceMappingURL=targeted.js.map