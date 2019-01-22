import n = require('../note/note');
import c = require('../clip/clip');
import TreeModel = require("tree-model");

// TODO: use namespaces better
export namespace phrase {
    export class Phrase {

        beat_start: number;
        beat_end: number;
        clip: c.clip.Clip;
        note_iterator: n.note.NoteIterator;

        constructor(beat_start: number, beat_end: number, clip: c.clip.Clip) {
            this.beat_start = beat_start;
            this.beat_end = beat_end;
            this.clip = clip;
            this.note_iterator = null;
        }

        public set_note_iterator(notes: TreeModel.Node<n.note.Note>, direction_forward): void {
            this.note_iterator = new n.note.NoteIterator(
                notes,
                direction_forward
            );
        }

        public get_interval_beats(): number[] {
            return [this.beat_start, this.beat_end];
        }

        // TODO: make 'direction' a type alias
        // TODO: why is this referencing an non-existant method? Have we regressed?
        public load_notes(direction_forward: boolean) {
            this.set_note_iterator(this._parse_notes(this._get_notes()), direction_forward);
        }

    }

    export class PhraseIterator {
        private phrases: Phrase[];
        private clip: c.clip.Clip;
        public direction_forward: boolean;
        private i: number;

        public current(): Phrase {
            if (this.i > -1) {
                return this.phrases[this.i];
            } else {
                return null;
            }
        }

        // TODO: figure out how to annotate
        public next() {
            let value_increment = (this.direction_forward) ? 1 : -1;

            this.i += value_increment;

            if (this.i < this.phrases.length) {
                return {
                    value: this.phrases[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }
    }
}