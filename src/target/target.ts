import TreeModel = require("tree-model");
import {note as n} from "../note/note"
import {history} from "../history/history";


export namespace target {
    import TypeSequenceTarget = history.TypeSequenceTarget;

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

        get_notes(): TreeModel.Node<n.Note>[] {
            let notes: TreeModel.Node<n.Note>[] = [];
            for (let subtarget of this.iterator_subtarget.subtargets) {
                notes.push(subtarget.note)
            }
            return notes;
        }
    }

    export class TargetIterator {

        public static from_sequence_target(sequence_target: TypeSequenceTarget): TargetIterator {

            let targets: Target[] = [];
            for (let notes of sequence_target) {
                let subtargets: Subtarget[] = [];
                for (let note of notes) {
                    subtargets.push(
                        new Subtarget(note)
                    )
                }
                let iterator_subtarget = new SubtargetIterator(subtargets);

                targets.push(
                    new Target(iterator_subtarget)
                )
            }

            return new TargetIterator(targets)
        }

        public targets: Target[];

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
}