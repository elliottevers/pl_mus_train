import TreeModel = require("tree-model");
import { note as n } from "../note/note";
import { phrase as p } from "../phrase/phrase";
export declare namespace target {
    class Target {
        note: TreeModel.Node<n.Note>;
        phrase: p.Phrase;
        constructor(note: TreeModel.Node<n.Note>, phrase: p.Phrase);
        value(): number;
        get_note_interval_beats(): number[];
        get_phrase_interval_beats(): number[];
        set_note_interval_beats(note_interval_beats: number[], reverse: boolean): void;
        set_phrase_interval_beats(phrase_interval_beats: number[], reverse: boolean): void;
    }
    class TargetIterator {
        phrase_iterator: p.PhraseIterator;
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
