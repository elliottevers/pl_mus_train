"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note;
(function (note) {
    var Note = /** @class */ (function () {
        function Note(pitch, beat_start, beats_duration, velocity, muted) {
            this.pitch = pitch;
            this.beat_start = beat_start;
            this.beats_duration = beats_duration;
            this.velocity = velocity;
            this.muted = muted;
            this._b_has_chosen = false;
        }
        Note.get_overlap_beats = function (beat_start_former, beat_end_former, beat_start_latter, beat_end_latter) {
            var a = beat_start_former, b = beat_end_former, c = beat_start_latter, d = beat_end_latter;
            var former_starts_before_latter = (a <= c);
            var former_ends_before_latter = (b <= d);
            // TODO: check logic
            if (former_starts_before_latter && former_ends_before_latter) {
                return b - c;
            }
            else if (former_starts_before_latter && !former_ends_before_latter) {
                return a - c;
            }
            else if (!former_starts_before_latter && !former_ends_before_latter) {
                return 0;
            }
            else if (!former_starts_before_latter && former_ends_before_latter) {
                return b - a;
            }
            throw 'case not considered';
        };
        Note.prototype.get_beat_end = function () {
            return this.beat_start + this.beats_duration;
        };
        Note.prototype.get_interval_beats = function () {
            return [this.beat_start, this.get_beat_end()];
        };
        // TODO: add type of argument and return value
        Note.prototype.get_best_candidate = function (list_candidate_note) {
            var beats_overlap, beats_max_overlap, list_candidate_note_max_overlap;
            list_candidate_note_max_overlap = [];
            beats_max_overlap = 0;
            for (var _i = 0, list_candidate_note_1 = list_candidate_note; _i < list_candidate_note_1.length; _i++) {
                var candidate_note = list_candidate_note_1[_i];
                beats_overlap = Note.get_overlap_beats(this.beat_start, this.beat_start + this.beats_duration, candidate_note.model.note.beat_start, candidate_note.model.note.beat_start + candidate_note.model.note.beats_duration);
                if (beats_overlap > beats_max_overlap) {
                    beats_max_overlap = beats_overlap;
                    list_candidate_note_max_overlap = [];
                }
                if (beats_overlap === beats_max_overlap) {
                    list_candidate_note_max_overlap.push(candidate_note);
                }
            }
            function compare(note_former, note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }
            list_candidate_note_max_overlap.sort(compare);
            return list_candidate_note_max_overlap[0];
        };
        Note.prototype.choose = function () {
            if (!this._b_has_chosen) {
                // tree.children[0].appendChild(left_left).appendChild(left_right);
                // note_parent.addChild(this);
                this._b_has_chosen = true;
                return true;
            }
            else {
                return false;
            }
        };
        return Note;
    }());
    note.Note = Note;
    var NoteIterator = /** @class */ (function () {
        function NoteIterator(notes, direction_forward) {
            this.notes = notes;
            this.direction_forward = direction_forward;
            this.i = -1;
        }
        // TODO: type declarations
        NoteIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'note iterator < 0';
            }
            if (this.i < this.notes.length) {
                return {
                    value: this.notes[this.i],
                    done: false
                };
            }
            else {
                return {
                    value: null,
                    done: true
                };
            }
        };
        NoteIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.notes[this.i];
            }
            else {
                return null;
            }
        };
        return NoteIterator;
    }());
    note.NoteIterator = NoteIterator;
})(note = exports.note || (exports.note = {}));
//# sourceMappingURL=note.js.map