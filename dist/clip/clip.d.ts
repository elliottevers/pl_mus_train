import TreeModel = require("tree-model");
export declare namespace clip {
    class Clip {
        private clip_dao;
        private notes;
        constructor(clip_dao: any);
        get_num_measures(): number;
        get_end_marker(): number;
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
        private _parse_notes;
    }
}
