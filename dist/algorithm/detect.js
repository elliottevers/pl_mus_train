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
var targeted_1 = require("./targeted");
var harmony_1 = require("../music/harmony");
var constants_1 = require("../constants/constants");
var trainable_1 = require("./trainable");
var detect;
(function (detect) {
    var Targeted = targeted_1.targeted.Targeted;
    var Harmony = harmony_1.harmony.Harmony;
    var POLYPHONY = constants_1.modes_texture.POLYPHONY;
    var MONOPHONY = constants_1.modes_texture.MONOPHONY;
    var DETECT = trainable_1.trainable.DETECT;
    var Detect = /** @class */ (function (_super) {
        __extends(Detect, _super);
        function Detect() {
            return _super.call(this) || this;
        }
        Detect.prototype.determine_targets = function (user_input_handler, notes_segment_next) {
            if (user_input_handler.mode_texture === POLYPHONY) {
                var chords_grouped = Harmony.group(notes_segment_next);
                var chords_monophonified = [];
                for (var _i = 0, chords_grouped_1 = chords_grouped; _i < chords_grouped_1.length; _i++) {
                    var note_group = chords_grouped_1[_i];
                    chords_monophonified.push(Harmony.monophonify(note_group));
                }
                return chords_monophonified;
            }
            else if (user_input_handler.mode_texture === MONOPHONY) {
                var notes_grouped_trivial = [];
                for (var _a = 0, notes_segment_next_1 = notes_segment_next; _a < notes_segment_next_1.length; _a++) {
                    var note_1 = notes_segment_next_1[_a];
                    notes_grouped_trivial.push([note_1]);
                }
                return notes_grouped_trivial;
            }
            else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ');
            }
        };
        Detect.prototype.get_name = function () {
            return DETECT;
        };
        Detect.prototype.postprocess_subtarget = function (note_subtarget) {
            return note_subtarget;
        };
        // TODO: verify that we don't have to do anything here
        Detect.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            return window;
        };
        Detect.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            return;
        };
        return Detect;
    }(Targeted));
    detect.Detect = Detect;
})(detect = exports.detect || (exports.detect = {}));
//# sourceMappingURL=detect.js.map