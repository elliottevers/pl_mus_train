"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var track_1 = require("../track/track");
var targeted_1 = require("./targeted");
var constants_1 = require("../constants/constants");
var trainable_1 = require("./trainable");
var logger_1 = require("../log/logger");
var _ = require('underscore');
var predict;
(function (predict) {
    var Targeted = targeted_1.targeted.Targeted;
    var POLYPHONY = constants_1.modes_texture.POLYPHONY;
    var MONOPHONY = constants_1.modes_texture.MONOPHONY;
    var PREDICT = trainable_1.trainable.PREDICT;
    var Logger = logger_1.log.Logger;
    var Track = track_1.track.Track;
    var Predict = /** @class */ (function (_super) {
        __extends(Predict, _super);
        function Predict() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Predict.prototype.get_name = function () {
            return PREDICT;
        };
        Predict.prototype.determine_targets = function (user_input_handler, notes_segment_next) {
            if (user_input_handler.mode_texture === POLYPHONY) {
                // let chords_grouped: TreeModel.Node<n.Note>[][] = Harmony.group(
                //     notes_segment_next
                // );
                //
                // let chords_monophonified: TypeSequenceTarget = [];
                //
                // for (let note_group of chords_grouped) {
                //     chords_monophonified.push(
                //         Harmony.monophonify(
                //             note_group
                //         )
                //     );
                // }
                throw 'polyphonic targets for prediction not yet implemented';
            }
            else if (user_input_handler.mode_texture === MONOPHONY) {
                var notes_grouped = [];
                // partition segment into measures
                var position_measure = function (node) {
                    return Math.floor(node.model.note.beat_start / 4);
                };
                var note_partitions = _.groupBy(notes_segment_next, position_measure);
                // for (let partition of note_partitions) {
                //     // get the middle note of the measure
                //     notes_grouped.push([partition[partition.length/2]])
                // }
                for (var _i = 0, _a = Object.keys(note_partitions); _i < _a.length; _i++) {
                    var key_partition = _a[_i];
                    var partition = note_partitions[key_partition];
                    notes_grouped.push([partition[partition.length / 2]]);
                }
                // let logger = new Logger('max');
                // logger.log(JSON.stringify(notes_segment_next));
                //
                // logger.log('done');
                return notes_grouped;
            }
            else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ');
            }
        };
        Predict.prototype.postprocess_subtarget = function (note_subtarget) {
            note_subtarget.model.note.muted = 1;
            return note_subtarget;
        };
        // TODO: verify that we don't have to do anythiing here
        Predict.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            return window;
        };
        // NB: we only have to initialize clips in the target track
        Predict.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            var matrix_targets = struct_train;
            var logger = new Logger('max');
            for (var i_segment in segments) {
                // let segment = segments[Number(i_segment)];
                var clip = Track.get_clip_at_index(track_target.get_index(), Number(i_segment), track_target.track_dao.messenger);
                var targeted_notes_in_segment = matrix_targets[0][Number(i_segment)].get_notes();
                // logger.log(JSON.stringify(targeted_notes_in_segment));
                // TODO: this won't work for polyphony
                for (var _i = 0, targeted_notes_in_segment_1 = targeted_notes_in_segment; _i < targeted_notes_in_segment_1.length; _i++) {
                    var note_1 = targeted_notes_in_segment_1[_i];
                    clip.set_path_deferlow('clip_target');
                    clip.remove_notes(note_1.model.note.beat_start, 0, note_1.model.note.get_beat_end(), 128);
                    var note_muted = note_1;
                    note_muted.model.note.muted = 1;
                    clip.set_notes([note_muted]);
                }
            }
        };
        return Predict;
    }(Targeted));
    predict.Predict = Predict;
})(predict = exports.predict || (exports.predict = {}));
//# sourceMappingURL=predict.js.map