import TreeModel = require("tree-model");
import {note as n} from "../note/note"
import {phrase as p} from "../phrase/phrase"
import {trainer} from "../train/trainer";
import {history} from "../history/history";
// import {Segment} from "../segment/segment";
// import {serialize_subtarget} from "../serialize/serialize";


export namespace target {

    import TypeTarget = history.TypeTarget;

    export class Subtarget {
        note: TreeModel.Node<n.Note>;

        constructor(note: TreeModel.Node<n.Note>) {
            this.note = note;
        }


    }

    export class SubtargetIterator {

        public subtargets: Subtarget[];

        i: number;

        constructor(subtargets: Subtarget[]) {
            this.subtargets = subtargets;
            this.i = -1;
        }

        public next() {
            let value_increment = 1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'subtarget iterator < 0'
            }

            if (this.i < this.subtargets.length) {
                return {
                    value: this.subtargets[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.subtargets[this.i];
            } else {
                return null;
            }
        }

        public reset() {
            this.i = -1;
        }

        public get_index_current() {
            return this.i;
        }
    }

    export class Target {
        public iterator_subtarget: SubtargetIterator;

        constructor(iterator_subtarget: SubtargetIterator) {
            this.iterator_subtarget = iterator_subtarget;
        }
    }

    export class TargetIterator {
        // need SegmentTargetable -> TargetIterator

        targets: Target[];
        i: number;

        constructor(targets: Target[]) {
            this.targets = targets;

            this.i = -1;
        }

        get_notes(): TreeModel.Node<n.Note>[] {
            let notes: TreeModel.Node<n.Note>[] = [];
            for (let target of this.targets) {
                let iterator_subtarget = target.iterator_subtarget;
                for (let subtarget of iterator_subtarget.subtargets) {
                    notes.push(subtarget.note)
                }
            }
            return notes;
        }

        public next() {
            let value_increment = 1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'target iterator < 0'
            }

            if (this.i < this.targets.length) {
                return {
                    value: this.targets[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.targets[this.i];
            } else {
                return null;
            }
        }

        public reset() {
            this.i = -1;
        }

        public get_index_current() {
            return this.i;
        }
    }



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
}