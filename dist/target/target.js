"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../log/logger");
// import {Segment} from "../segment/segment";
// import {serialize_subtarget} from "../serialize/serialize";
var target;
(function (target_1) {
    var Logger = logger_1.log.Logger;
    var Subtarget = /** @class */ (function () {
        function Subtarget(note) {
            this.note = note;
        }
        return Subtarget;
    }());
    target_1.Subtarget = Subtarget;
    var SubtargetIterator = /** @class */ (function () {
        function SubtargetIterator(subtargets) {
            this.subtargets = subtargets;
            this.i = -1;
        }
        SubtargetIterator.prototype.next = function () {
            var value_increment = 1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'subtarget iterator < 0';
            }
            if (this.i < this.subtargets.length) {
                return {
                    value: this.subtargets[this.i],
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
        SubtargetIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.subtargets[this.i];
            }
            else {
                return null;
            }
        };
        SubtargetIterator.prototype.reset = function () {
            this.i = -1;
        };
        SubtargetIterator.prototype.get_index_current = function () {
            return this.i;
        };
        return SubtargetIterator;
    }());
    target_1.SubtargetIterator = SubtargetIterator;
    var Target = /** @class */ (function () {
        function Target(iterator_subtarget) {
            this.iterator_subtarget = iterator_subtarget;
        }
        Target.prototype.get_notes = function () {
            var notes = [];
            for (var _i = 0, _a = this.iterator_subtarget.subtargets; _i < _a.length; _i++) {
                var subtarget = _a[_i];
                notes.push(subtarget.note);
            }
            return notes;
        };
        return Target;
    }());
    target_1.Target = Target;
    var TargetIterator = /** @class */ (function () {
        function TargetIterator(targets) {
            this.targets = targets;
            this.i = -1;
        }
        TargetIterator.from_sequence_target = function (sequence_target) {
            var targets = [];
            for (var _i = 0, sequence_target_1 = sequence_target; _i < sequence_target_1.length; _i++) {
                var notes = sequence_target_1[_i];
                var subtargets = [];
                for (var _a = 0, notes_1 = notes; _a < notes_1.length; _a++) {
                    var note = notes_1[_a];
                    subtargets.push(new Subtarget(note));
                }
                var iterator_subtarget = new SubtargetIterator(subtargets);
                var logger = new Logger('max');
                logger.log(JSON.stringify(notes));
                targets.push(new Target(iterator_subtarget));
            }
            return new TargetIterator(targets);
        };
        TargetIterator.prototype.get_notes = function () {
            var notes = [];
            for (var _i = 0, _a = this.targets; _i < _a.length; _i++) {
                var target_2 = _a[_i];
                var iterator_subtarget = target_2.iterator_subtarget;
                for (var _b = 0, _c = iterator_subtarget.subtargets; _b < _c.length; _b++) {
                    var subtarget = _c[_b];
                    notes.push(subtarget.note);
                }
            }
            return notes;
        };
        TargetIterator.prototype.next = function () {
            var value_increment = 1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'target iterator < 0';
            }
            if (this.i < this.targets.length) {
                return {
                    value: this.targets[this.i],
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
        TargetIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.targets[this.i];
            }
            else {
                return null;
            }
        };
        TargetIterator.prototype.reset = function () {
            this.i = -1;
        };
        TargetIterator.prototype.get_index_current = function () {
            return this.i;
        };
        return TargetIterator;
    }());
    target_1.TargetIterator = TargetIterator;
    // export class Target {
    // notes_grouped: TreeModel.Node<n.Note>[][];
    //
    // constructor(notes_grouped: TreeModel.Node<n.Note>[][]) {
    //     this.notes_grouped = notes_grouped
    // }
    // subtargets: Subtarget[]
    //     note: TreeModel.Node<n.Note>;
    //     phrase: p.Phrase;
    //
    //     constructor(note: TreeModel.Node<n.Note>, phrase: p.Phrase) {
    //         this.note = note;
    //         this.phrase = phrase;
    //     }
    //
    //     public value(): number {
    //         return this.note.model.pitch;
    //     }
    //
    //     public get_note_interval_beats(): number[] {
    //         return this.note.model.get_interval_beats();
    //     }
    //
    //     public get_phrase_interval_beats(): number[] {
    //         return this.phrase.get_interval_beats();
    //     }
    //
    //     // TODO: annotate
    //     public set_note_interval_beats(note_interval_beats: number[], reverse: boolean) {
    //         let beat_lower = note_interval_beats[0];
    //         let beat_upper = note_interval_beats[1];
    //
    //         if (beat_upper - beat_lower < min_width_clip) {
    //             beat_upper = beat_lower + min_width_clip;
    //         }
    //
    //         if (reverse) {
    //             this.phrase.clip.set_clip_endpoint_upper(beat_upper);
    //             this.phrase.clip.set_clip_endpoint_lower(beat_lower);
    //         } else {
    //             this.phrase.clip.set_clip_endpoint_lower(beat_lower);
    //             this.phrase.clip.set_clip_endpoint_upper(beat_upper);
    //         }
    //     }
    //
    //     public set_phrase_interval_beats(phrase_interval_beats: number[], reverse: boolean) {
    //         let beat_lower = phrase_interval_beats[0];
    //         let beat_upper = phrase_interval_beats[1];
    //         if (reverse) {
    //             this.phrase.clip.set_loop_bracket_upper(beat_upper);
    //             this.phrase.clip.set_loop_bracket_lower(beat_lower);
    //         } else {
    //             this.phrase.clip.set_loop_bracket_lower(beat_lower);
    //             this.phrase.clip.set_loop_bracket_upper(beat_upper);
    //         }
    //     }
    // }
    //
    // export class TargetIterator {
    //     phrase_iterator: p.PhraseIterator;
    //     i: number;
    //     current: any;
    //
    //     // TODO: figure out how to annotate
    //     next() {
    //         this.i += 1;
    //
    //         var phrase_current = this.phrase_iterator.current();
    //
    //         var note_result_next = phrase_current.note_iterator.next();
    //
    //         var note_next = note_result_next.value;
    //
    //         if (!note_result_next.done) {
    //             this.current = new Target(note_next, phrase_current);
    //             return {
    //                 value: this.current,
    //                 done: false
    //             }
    //         }
    //
    //         var phrase_result_next = this.phrase_iterator.next();
    //
    //         if (!phrase_result_next.done) { // note_next.done is true by now
    //             var phrase_next = this.phrase_iterator.current();
    //
    //             note_result_next = phrase_next.note_iterator.next();
    //
    //             note_next = note_result_next.value;
    //
    //             this.current = new Target(note_next, phrase_next);
    //
    //             return {
    //                 value: this.current,
    //                 done: false
    //             }
    //         }
    //
    //         return {
    //             value: null,
    //             done: true
    //         }
    //     }
    //
    //     set_note_interval_beats(): void {
    //         // TODO: use direction in logic
    //         if (this.phrase_iterator.current() !== null) {
    //             var direction_forward = this.phrase_iterator.current().note_iterator.direction_forward;
    //         }
    //         var reverse;
    //         var note_interval = this.current.get_note_interval_beats();
    //
    //         if (this.i === 0) {
    //             this.current.set_note_interval_beats(note_interval);
    //         } else {
    //             reverse = true;
    //             this.current.set_note_interval_beats(note_interval, reverse);
    //         }
    //     }
    //
    //     set_phrase_interval_beats(): void {
    //         // TODO: use direction in logic
    //         var direction_forward = this.phrase_iterator.direction_forward;
    //         var reverse;
    //         var phrase_interval_beats = this.current.get_prhrase_interval_beats();
    //
    //         if (this.i === 0) {
    //             this.current.set_phrase_interval_beats(phrase_interval_beats);
    //         } else {
    //             reverse = true;
    //             this.current.set_phrase_interval_beats(phrase_interval_beats, reverse);
    //         }
    //     }
    // }
})(target = exports.target || (exports.target = {}));
//# sourceMappingURL=target.js.map