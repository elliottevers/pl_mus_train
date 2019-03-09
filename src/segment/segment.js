"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("../clip/clip");
var live_1 = require("../live/live");
var segment;
(function (segment) {
    var Clip = clip_1.clip.Clip;
    var LiveClipVirtual = live_1.live.LiveClipVirtual;
    var Segment = /** @class */ (function () {
        function Segment(note) {
            this.beat_start = note.model.note.beat_start;
            this.beat_end = note.model.note.get_beat_end();
            var clip_dao_virtual = new LiveClipVirtual([note]);
            this.clip = new Clip(clip_dao_virtual);
        }
        Segment.prototype.get_note = function () {
            return this.clip.get_notes(this.beat_start, 0, this.beat_end, 128)[0];
        };
        Segment.prototype.get_notes = function () {
            return this.clip.get_notes(this.beat_start, 0, this.beat_end, 128);
        };
        Segment.prototype.get_endpoints_loop = function () {
            return [this.beat_start, this.beat_end];
        };
        Segment.prototype.set_endpoints_loop = function (beat_start, beat_end) {
            this.clip.set_loop_bracket_upper(beat_end);
            this.clip.set_loop_bracket_lower(beat_start);
        };
        return Segment;
    }());
    segment.Segment = Segment;
    var SegmentIterator = /** @class */ (function () {
        function SegmentIterator(segments, direction_forward) {
            this.segments = segments;
            this.direction_forward = direction_forward;
            this.i = -1;
        }
        // TODO: type declarations
        SegmentIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'segment iterator < 0';
            }
            if (this.i < this.segments.length) {
                return {
                    value: this.segments[this.i],
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
        SegmentIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.segments[this.i];
            }
            else {
                return null;
            }
        };
        SegmentIterator.prototype.reset = function () {
            this.i = -1;
        };
        SegmentIterator.prototype.get_index_current = function () {
            return this.i;
        };
        return SegmentIterator;
    }());
    segment.SegmentIterator = SegmentIterator;
})(segment = exports.segment || (exports.segment = {}));
//# sourceMappingURL=segment.js.map