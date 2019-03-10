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
var harmony_1 = require("../music/harmony");
var constants_1 = require("../constants/constants");
var algorithm;
(function (algorithm) {
    algorithm.DETECT = 'detect';
    algorithm.PREDICT = 'predict';
    algorithm.PARSE = 'parse';
    algorithm.DERIVE = 'derive';
    // import TargetType = target.TargetType;
    var Harmony = harmony_1.harmony.Harmony;
    var POLYPHONY = constants_1.modes_texture.POLYPHONY;
    var MONOPONY = constants_1.modes_texture.MONOPONY;
    var Targeted = /** @class */ (function () {
        function Targeted(user_input_handler) {
            this.user_input_handler = user_input_handler;
        }
        Targeted.prototype.b_targeted = function () {
            return true;
        };
        return Targeted;
    }());
    var Parsed = /** @class */ (function () {
        function Parsed() {
        }
        Parsed.prototype.b_targeted = function () {
            return false;
        };
        return Parsed;
    }());
    var Detect = /** @class */ (function (_super) {
        __extends(Detect, _super);
        function Detect(user_input_handler) {
            return _super.call(this, user_input_handler) || this;
        }
        Detect.prototype.get_depth = function () {
            return 1;
        };
        Detect.prototype.get_name = function () {
            return algorithm.DETECT;
        };
        Detect.prototype.determine_targets = function (notes_segment_next) {
            if (this.user_input_handler.mode_texture === POLYPHONY) {
                var chords_grouped = Harmony.group(notes_segment_next);
                var chords_monophonified = [];
                for (var _i = 0, chords_grouped_1 = chords_grouped; _i < chords_grouped_1.length; _i++) {
                    var chord = chords_grouped_1[_i];
                    var notes_monophonified = Harmony.monophonify(chord);
                    chords_monophonified.push(notes_monophonified);
                }
                return chords_monophonified;
            }
            else if (this.user_input_handler.mode_texture === MONOPONY) {
                var notes_grouped_trivial = [];
                for (var _a = 0, notes_segment_next_1 = notes_segment_next; _a < notes_segment_next_1.length; _a++) {
                    var note_1 = notes_segment_next_1[_a];
                    notes_grouped_trivial.push(note_1);
                }
                // Subtarget -> Subtarget Iterator -> Target -> Target Iterator
                return notes_grouped_trivial;
            }
            else {
                throw ['texture mode', this.user_input_handler.mode_texture, 'not supported'].join(' ');
            }
        };
        Detect.prototype.determine_region_current = function (notes_target_next) {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ];
        };
        // set right interval
        Detect.prototype.determine_region_past = function (notes_target_next) {
            return notes_target_next[0].model.note.beat_start;
        };
        // set left interval
        Detect.prototype.determine_region_upcoming = function (notes_target_next) {
            return notes_target_next[notes_target_next.length - 1].model.note.get_beat_end();
        };
        Detect.prototype.pre_advance = function (clip_user_input) {
        };
        Detect.prototype.post_init = function (song, clip_user_input) {
            clip_user_input.fire();
        };
        return Detect;
    }(Targeted));
    algorithm.Detect = Detect;
    var Predict = /** @class */ (function (_super) {
        __extends(Predict, _super);
        function Predict() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Predict.prototype.get_name = function () {
            return algorithm.PREDICT;
        };
        Predict.prototype.get_depth = function () {
            return 1;
        };
        // TODO: put all calls to Clip in whatever class is a client to algorithms
        // NB: there can be multiple targets per segment
        // TODO: replace the notes in clip_target with these
        Predict.prototype.determine_targets = function (notes_segment_next) {
            if (this.user_input_handler.mode_texture === POLYPHONY) {
                var chords_grouped = Harmony.group(notes_segment_next);
                var chords_monophonified = [];
                for (var _i = 0, chords_grouped_2 = chords_grouped; _i < chords_grouped_2.length; _i++) {
                    var note_group = chords_grouped_2[_i];
                    chords_monophonified.push(Harmony.monophonify(note_group));
                }
                return chords_monophonified;
            }
            else if (this.user_input_handler.mode_texture === MONOPONY) {
                var notes_grouped_trivial = [];
                for (var _a = 0, notes_segment_next_2 = notes_segment_next; _a < notes_segment_next_2.length; _a++) {
                    var note_2 = notes_segment_next_2[_a];
                    notes_grouped_trivial.push(note_2);
                }
                return notes_grouped_trivial;
            }
            else {
                throw ['texture mode', this.user_input_handler.mode_texture, 'not supported'].join(' ');
            }
        };
        Predict.prototype.determine_region_current = function (notes_target_next) {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ];
        };
        // set right interval
        Predict.prototype.determine_region_past = function (notes_target_next) {
            return notes_target_next[0].model.note.beat_start;
        };
        // set left interval
        Predict.prototype.determine_region_upcoming = function (notes_target_next) {
            return notes_target_next[notes_target_next.length - 1].model.note.get_beat_end();
        };
        Predict.prototype.pre_advance = function () {
            //
        };
        return Predict;
    }(Targeted));
    algorithm.Predict = Predict;
    var Parse = /** @class */ (function (_super) {
        __extends(Parse, _super);
        function Parse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Parse.prototype.get_name = function () {
            return algorithm.PARSE;
        };
        Parse.prototype.get_depth = function () {
            return this.depth;
        };
        Parse.prototype.set_depth = function (depth) {
            this.depth = depth;
        };
        // happens after loop of first target is set
        Parse.prototype.post_init = function (song, clip_user_input) {
            song.set_overdub(1);
            song.set_session_record(1);
            clip_user_input.fire();
        };
        // happens after last target is guessed
        Parse.prototype.pre_terminate = function (song, clip_user_input) {
            song.set_overdub(0);
            song.set_session_record(0);
            clip_user_input.stop();
        };
        Parse.prototype.determine_region_current = function (notes_target_next) {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ];
        };
        // set right interval
        Parse.prototype.determine_region_past = function (notes_target_next) {
            return notes_target_next[0].model.note.beat_start;
        };
        // set left interval
        Parse.prototype.determine_region_upcoming = function (notes_target_next) {
            return notes_target_next[notes_target_next.length - 1].model.note.get_beat_end();
        };
        return Parse;
    }(Parsed));
    algorithm.Parse = Parse;
    var Derive = /** @class */ (function (_super) {
        __extends(Derive, _super);
        function Derive() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Derive.prototype.get_name = function () {
            return algorithm.DERIVE;
        };
        Derive.prototype.get_depth = function () {
            return this.depth;
        };
        Derive.prototype.set_depth = function (depth) {
            this.depth = depth;
        };
        // happens after loop of first target is set
        Derive.prototype.post_init = function (song, clip_user_input) {
            song.set_overdub(1);
            song.set_session_record(1);
            clip_user_input.fire();
        };
        // happens after last target is guessed
        Derive.prototype.pre_terminate = function (song, clip_user_input) {
            song.set_overdub(0);
            song.set_session_record(0);
            clip_user_input.stop();
        };
        Derive.prototype.determine_region_current = function (notes_target_next) {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ];
        };
        // set right interval
        Derive.prototype.determine_region_past = function (notes_target_next) {
            return notes_target_next[0].model.note.beat_start;
        };
        // set left interval
        Derive.prototype.determine_region_upcoming = function (notes_target_next) {
            return notes_target_next[notes_target_next.length - 1].model.note.get_beat_end();
        };
        Derive.prototype.accept = function (elaboration, i_depth, i_breadth) {
            // if (index_layer + 1 > this.clips.length) {
            //     let clip_dao_virtual = new LiveClipVirtual(elaboration);
            //
            //     clip_dao_virtual.beat_start = elaboration[0].model.note.beat_start;
            //     clip_dao_virtual.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
            //
            //     let clip_virtual = new c.Clip(clip_dao_virtual);
            //     this.add_clsip(clip_virtual);
            // } else {
            //     let clip_last = this.clips[this.clips.length - 1];
            //     clip_last.clip_dao.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
            //     clip_last.set_notes(elaboration);
            // }
            //
            // let leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);
            //
            // if (index_layer == 1) {
            //     this.add_first_layer(elaboration, this.clips.length - 1)
            // } else {
            //     this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
            // }
            //
            // this.update_leaves(leaves_within_interval);
        };
        return Derive;
    }(Parsed));
    algorithm.Derive = Derive;
})(algorithm = exports.algorithm || (exports.algorithm = {}));
//# sourceMappingURL=algorithm.js.map