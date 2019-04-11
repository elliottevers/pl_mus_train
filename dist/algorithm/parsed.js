"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_1 = require("../parse/parse");
var iterate_1 = require("../train/iterate");
var parsed;
(function (parsed) {
    var FactoryMatrixObjectives = iterate_1.iterate.FactoryMatrixObjectives;
    var StructParse = parse_1.parse.StructParse;
    var Parsed = /** @class */ (function () {
        function Parsed() {
            this.b_parsed = true;
            this.b_targeted = false;
        }
        Parsed.prototype.update_struct = function (notes_input_user, struct_train, trainable, iterator_matrix_train) {
            var struct_parse = struct_train;
            struct_parse.add(notes_input_user, 
            // iterator_matrix_train.get_coord_current(),
            trainable.coord_to_index_struct_train(iterator_matrix_train.get_coord_current()), trainable);
            return struct_parse;
        };
        Parsed.prototype.update_history_user_input = function (input_postprocessed, history_user_input, iterator_matrix_train, trainable) {
            history_user_input.concat(input_postprocessed, trainable.coord_to_index_history_user_input(iterator_matrix_train.get_coord_current()));
            return history_user_input;
        };
        Parsed.prototype.set_depth = function (depth) {
            this.depth = depth;
        };
        Parsed.prototype.coord_to_index_clip_render = function (coord) {
            if (coord[0] === -1) {
                return 0;
            }
            else {
                return coord[0] + 1;
            }
        };
        Parsed.prototype.create_struct_parse = function (segments) {
            return new StructParse(FactoryMatrixObjectives.create_matrix_parse(this, segments));
        };
        Parsed.prototype.determine_region_present = function (notes_target_next, segment_current) {
            return [
                segment_current.beat_start,
                segment_current.beat_end
            ];
        };
        Parsed.prototype.finish_parse = function (struct_parse, segments) {
        };
        Parsed.prototype.get_notes_in_region = function (target, segment) {
            return [segment.get_note()];
        };
        Parsed.prototype.preprocess_struct_train = function (struct_train, segments, notes_target_track) {
            return this.preprocess_struct_parse(struct_train, segments, notes_target_track);
        };
        Parsed.prototype.pause = function (song, scene_current) {
            song.set_overdub(0);
            song.set_session_record(0);
            song.stop();
        };
        Parsed.prototype.postprocess_user_input = function (notes_user_input, subtarget_current) {
            return notes_user_input;
        };
        Parsed.prototype.stream_bounds = function (messenger, subtarget_current, segment_current, segments) {
            Parsed.stream_segment_bounds(messenger, subtarget_current, segment_current, segments);
        };
        Parsed.stream_segment_bounds = function (messenger, subtarget_current, segment_current, segments) {
            messenger.message(['duration_training_data', segments[segments.length - 1].beat_end], true);
            messenger.message(['bounds', 0, 1], true);
        };
        Parsed.prototype.terminate = function (struct_train, segments) {
            this.finish_parse(struct_train, segments);
        };
        Parsed.prototype.unpause = function (song, scene_current) {
            scene_current.fire(false);
            song.set_overdub(1);
            song.set_session_record(1);
        };
        Parsed.prototype.warrants_advance = function (notes_user_input, subtarget_current) {
            return true;
        };
        Parsed.prototype.create_struct_train = function (window, segments, track_target, user_input_handler, struct_train) {
            return this.create_struct_parse(segments);
        };
        Parsed.prototype.advance_scene = function (scene_current, song) {
            scene_current.fire(true);
            song.set_overdub(1);
            song.set_session_record(1);
        };
        Parsed.prototype.preprocess_history_user_input = function (history_user_input, segments) {
            return history_user_input;
        };
        // we skip over the segments layer
        Parsed.prototype.coord_to_index_history_user_input = function (coord) {
            return [coord[0] - 1, coord[1]];
        };
        // the root is not included in iteration
        Parsed.prototype.coord_to_index_struct_train = function (coord) {
            // return [coord[0] - 1, coord[1]];
            return coord;
        };
        return Parsed;
    }());
    parsed.Parsed = Parsed;
})(parsed = exports.parsed || (exports.parsed = {}));
//# sourceMappingURL=parsed.js.map