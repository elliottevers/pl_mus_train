import TreeModel = require("tree-model");
export declare namespace note {
    class Note {
        pitch: number;
        beat_start: number;
        beats_duration: number;
        velocity: number;
        muted: number;
        _b_has_chosen: boolean;
        constructor(pitch: number, beat_start: number, beats_duration: number, velocity: number, muted: number);
        static get_overlap_beats(beat_start_former: number, beat_end_former: number, beat_start_latter: number, beat_end_latter: number): number;
        get_interval_beats(): number[];
        get_best_candidate(list_candidate_note: any): any;
        choose(): boolean;
    }
    class NoteIterator {
        private notes;
        direction_forward: boolean;
        private i;
        constructor(notes: TreeModel.Node<Note>, direction_forward: boolean);
        next(): {
            value: any;
            done: boolean;
        };
        current(): any;
    }
}
