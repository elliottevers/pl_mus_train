import n = require('../note/note');
import c = require('../clip/clip');

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
        }

        public get_interval_beats(): number[] {
            return [this.beat_start, this.beat_end];
        }
    }

    export class PhraseIterator {
        private phrases: Phrase[];
        public direction_forward: boolean;
        private i: number;

        public current() {
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