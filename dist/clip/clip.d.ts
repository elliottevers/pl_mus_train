import TreeModel = require("tree-model");
export declare namespace clip {
    class Clip {
        private clip_dao;
        private notes;
        constructor(clip_dao: any);
        get_num_measures(): number;
        get_end_marker(): number;
        get_start_marker(): number;
        load_notes(): void;
        get_pitch_max(): number;
        get_pitch_min(): number;
        get_ambitus(): number[];
        set_loop_bracket_lower(beat: number): void;
        set_loop_bracket_upper(beat: number): void;
        set_clip_endpoint_lower(beat: number): void;
        set_clip_endpoint_upper(beat: number): void;
        fire(): void;
        stop(): void;
        get_notes(): TreeModel.Node<Node>[];
        private _get_notes;
        private static _parse_notes;
    }
    interface implementsLiveAPI {
        get(): any;
        set(): void;
        call(): void;
    }
    class ClipDao {
        private clip_live;
        private messenger;
        private deferlow;
        constructor(clip_live: implementsLiveAPI, messenger: any, deferlow: boolean);
        get_end_marker(): number;
        get_start_marker(): number;
        set_loop_bracket_lower(beat: number): void;
        set_loop_bracket_upper(beat: number): void;
        set_clip_endpoint_lower(beat: number): void;
        set_clip_endpoint_upper(beat: number): void;
        fire(): void;
        stop(): void;
        get_notes(beat_start: any, pitch_midi_min: any, beat_end: any, pitch_midi_max: any): string[];
    }
}
