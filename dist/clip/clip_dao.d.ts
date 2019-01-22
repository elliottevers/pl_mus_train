export declare namespace clip_dao {
    class ClipDao {
        private clip_live;
        private messenger;
        private deferlow;
        constructor(index_track: number, index_clip_slot: number, messenger: any, deferlow: boolean);
        get_end_marker(): number;
        set_loop_bracket_lower(beat: number): void;
        set_loop_bracket_upper(beat: number): void;
        set_clip_endpoint_lower(beat: number): void;
        set_clip_endpoint_upper(beat: number): void;
        fire(): void;
        stop(): void;
        get_notes(beat_start: any, pitch_midi_min: any, beat_end: any, pitch_midi_max: any): string[];
    }
}
