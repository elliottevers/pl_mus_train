"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mode;
(function (mode) {
    var HARMONY = 'harmony';
    var MELODY = 'melody';
    var Harmonic = /** @class */ (function () {
        function Harmonic() {
        }
        Harmonic.prototype.transform = function (notes_target) {
            function compare(note_former, note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }
            notes_target.sort(compare);
            var length_beats = notes_target[notes_target.length - 1].model.note.get_beat_end() - notes_target[0].model.note.beat_start;
            var duration_monophonic = length_beats / notes_target.length;
            clip_user_input.set_notes();
        };
        return Harmonic;
    }());
    mode.Harmonic = Harmonic;
    var Melodic = /** @class */ (function () {
        function Melodic() {
        }
        return Melodic;
    }());
    mode.Melodic = Melodic;
})(mode = exports.mode || (exports.mode = {}));
//# sourceMappingURL=mode.js.map