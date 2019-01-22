import n = require("../note/note");
import p = require("../phrase/phrase");
export declare namespace target {
    class Target {
        note: n.note.Note;
        phrase: p.phrase.Phrase;
        constructor(note: n.note.Note, phrase: p.phrase.Phrase);
        value(): number;
        get_note_interval_beats(): number[];
        get_phrase_interval_beats(): number[];
        set_note_interval_beats(note_interval_beats: number[], reverse: boolean): void;
        set_phrase_interval_beats(phrase_interval_beats: number[], reverse: boolean): void;
    }
    class TargetIterator {
        phrase_iterator: p.phrase.PhraseIterator;
        i: number;
        current: any;
        next(): {
            value: any;
            done: boolean;
        };
        set_note_interval_beats(): void;
        set_phrase_interval_beats(): void;
    }
}
