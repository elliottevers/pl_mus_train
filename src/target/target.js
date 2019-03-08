"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var target;
(function (target) {
    // let min_width_clip = 0.25;
    // export type TargetType = TreeModel.Node<n.Note>[]
    var Subtarget = /** @class */ (function () {
        function Subtarget(note) {
            this.note = note;
        }
        return Subtarget;
    }());
    target.Subtarget = Subtarget;
    var SubtargetIterator = /** @class */ (function () {
        function SubtargetIterator(subtargets) {
            this.subtargets = subtargets;
        }
        return SubtargetIterator;
    }());
    target.SubtargetIterator = SubtargetIterator;
    var Target = /** @class */ (function () {
        function Target(subtarget_iterator) {
            this.subtarget_iterator = subtarget_iterator;
        }
        return Target;
    }());
    target.Target = Target;
    var TargetIterator = /** @class */ (function () {
        function TargetIterator(targets) {
            this.targets = targets;
        }
        TargetIterator.from_segment_targetable = function (segment_targetable) {
            return;
        };
        return TargetIterator;
    }());
    target.TargetIterator = TargetIterator;
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