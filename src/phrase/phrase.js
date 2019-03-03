"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var n = require("../note/note");
// TODO: use namespaces better
var phrase;
(function (phrase) {
    var Phrase = /** @class */ (function () {
        function Phrase(beat_start, beat_end, clip) {
            this.beat_start = beat_start;
            this.beat_end = beat_end;
            this.clip = clip;
        }
        Phrase.parse = function (clip_segments, beat_start, beat_end) {
            var endpoints_segments = [];
            for (var _i = 0, _a = clip_segments.get_notes(beat_start, 0, beat_end, 0); _i < _a.length; _i++) {
                var note = _a[_i];
            }
            notes = clip_segments.get_notes();
            return segments;
        };
        Phrase.prototype.set_note_iterator = function (notes, direction_forward) {
            this.note_iterator = new n.note.NoteIterator(notes, direction_forward);
        };
        Phrase.prototype.get_interval_beats = function () {
            return [this.beat_start, this.beat_end];
        };
        Phrase.prototype.load_notes = function () {
            var notes = this.clip.get_notes(this.beat_start, 0, this.beat_end, 128);
            this.set_note_iterator(notes, true);
        };
        return Phrase;
    }());
    phrase.Phrase = Phrase;
    var PhraseIterator = /** @class */ (function () {
        function PhraseIterator() {
        }
        PhraseIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.phrases[this.i];
            }
            else {
                return null;
            }
        };
        // TODO: figure out how to annotate
        PhraseIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < this.phrases.length) {
                return {
                    value: this.phrases[this.i],
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
        return PhraseIterator;
    }());
    phrase.PhraseIterator = PhraseIterator;
})(phrase = exports.phrase || (exports.phrase = {}));
//# sourceMappingURL=phrase.js.map