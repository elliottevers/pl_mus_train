"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {serialize_subtarget} from "../serialize/serialize";
var target;
(function (target_1) {
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
        }
        return SubtargetIterator;
    }());
    target_1.SubtargetIterator = SubtargetIterator;
    var Target = /** @class */ (function () {
        function Target(iterator_subtarget) {
            this.iterator_subtarget = iterator_subtarget;
        }
        return Target;
    }());
    target_1.Target = Target;
    var TargetIterator = /** @class */ (function () {
        function TargetIterator(targets) {
            this.targets = targets;
        }
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
    //         var phrase_interval_beats = this.current.get_phrase_interval_beats();
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