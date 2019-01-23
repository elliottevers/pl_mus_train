import n = require('../note/note');
import c = require('../clip/clip');
import TreeModel = require("tree-model");
export declare namespace phrase {
    class Phrase {
        beat_start: number;
        beat_end: number;
        clip: c.clip.Clip;
        note_iterator: n.note.NoteIterator;
        constructor(beat_start: number, beat_end: number, clip: c.clip.Clip);
        set_note_iterator(notes: TreeModel.Node<n.note.Note>, direction_forward: any): void;
        get_interval_beats(): number[];
    }
    class PhraseIterator {
        private phrases;
        private clip;
        direction_forward: boolean;
        private i;
        current(): Phrase;
        next(): {
            value: Phrase;
            done: boolean;
        };
    }
}
