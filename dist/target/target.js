"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var target;
(function (target) {
    var min_width_clip = 0.25;
    var Target = /** @class */ (function () {
        function Target(note, phrase) {
            this.note = note;
            this.phrase = phrase;
        }
        Target.prototype.value = function () {
            return this.note.model.pitch;
        };
        Target.prototype.get_note_interval_beats = function () {
            return this.note.model.get_interval_beats();
        };
        Target.prototype.get_phrase_interval_beats = function () {
            return this.phrase.get_interval_beats();
        };
        // TODO: annotate
        Target.prototype.set_note_interval_beats = function (note_interval_beats, reverse) {
            var beat_lower = note_interval_beats[0];
            var beat_upper = note_interval_beats[1];
            if (beat_upper - beat_lower < min_width_clip) {
                beat_upper = beat_lower + min_width_clip;
            }
            if (reverse) {
                this.phrase.clip.set_clip_endpoint_upper(beat_upper);
                this.phrase.clip.set_clip_endpoint_lower(beat_lower);
            }
            else {
                this.phrase.clip.set_clip_endpoint_lower(beat_lower);
                this.phrase.clip.set_clip_endpoint_upper(beat_upper);
            }
        };
        Target.prototype.set_phrase_interval_beats = function (phrase_interval_beats, reverse) {
            var beat_lower = phrase_interval_beats[0];
            var beat_upper = phrase_interval_beats[1];
            if (reverse) {
                this.phrase.clip.set_loop_bracket_upper(beat_upper);
                this.phrase.clip.set_loop_bracket_lower(beat_lower);
            }
            else {
                this.phrase.clip.set_loop_bracket_lower(beat_lower);
                this.phrase.clip.set_loop_bracket_upper(beat_upper);
            }
        };
        return Target;
    }());
    target.Target = Target;
    var TargetIterator = /** @class */ (function () {
        function TargetIterator() {
        }
        // TODO: figure out how to annotate
        TargetIterator.prototype.next = function () {
            this.i += 1;
            var phrase_current = this.phrase_iterator.current();
            var note_result_next = phrase_current.note_iterator.next();
            var note_next = note_result_next.value;
            if (!note_result_next.done) {
                this.current = new Target(note_next, phrase_current);
                return {
                    value: this.current,
                    done: false
                };
            }
            var phrase_result_next = this.phrase_iterator.next();
            if (!phrase_result_next.done) { // note_next.done is true by now
                var phrase_next = this.phrase_iterator.current();
                note_result_next = phrase_next.note_iterator.next();
                note_next = note_result_next.value;
                this.current = new Target(note_next, phrase_next);
                return {
                    value: this.current,
                    done: false
                };
            }
            return {
                value: null,
                done: true
            };
        };
        TargetIterator.prototype.set_note_interval_beats = function () {
            // TODO: use direction in logic
            var direction_forward = this.phrase_iterator.current().note_iterator.direction_forward;
            var reverse;
            var note_interval = this.current.get_note_interval_beats();
            if (this.i === 0) {
                this.current.set_note_interval_beats(note_interval);
            }
            else {
                reverse = true;
                this.current.set_note_interval_beats(note_interval, reverse);
            }
        };
        TargetIterator.prototype.set_phrase_interval_beats = function () {
            // TODO: use direction in logic
            var direction_forward = this.phrase_iterator.direction_forward;
            var reverse;
            var phrase_interval_beats = this.current.get_phrase_interval_beats();
            if (this.i === 0) {
                this.current.set_phrase_interval_beats(phrase_interval_beats);
            }
            else {
                reverse = true;
                this.current.set_phrase_interval_beats(phrase_interval_beats, reverse);
            }
        };
        return TargetIterator;
    }());
    target.TargetIterator = TargetIterator;
})(target = exports.target || (exports.target = {}));
//# sourceMappingURL=target.js.map