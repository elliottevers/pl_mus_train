export namespace clip_dao {

    export class ClipDao {

        private clip_live;
        private messenger;
        private deferlow: boolean;

        constructor(index_track: number, index_clip_slot: number, messenger, deferlow: boolean) {
            let path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
            this.clip_live = new LiveAPI(null, path);
            this.messenger = messenger;
            this.deferlow = deferlow;
        }

        get_end_marker(): number {
            return this.clip_live.get('end_marker');
        }

        set_loop_bracket_lower(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "loop_start", beat, "set"])
            } else {
                this.clip_live.set('loop_start', beat);
            }
        }

        set_loop_bracket_upper(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "loop_end", beat, "set"])
            } else {
                this.clip_live.set('loop_end', beat);
            }
        }

        set_clip_endpoint_lower(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "start_marker", beat, "set"])
            } else {
                this.clip_live.set('start_marker', beat);
            }
        }

        set_clip_endpoint_upper(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "end_marker", beat, "set"])
            } else {
                this.clip_live.set('end_marker', beat);
            }
        }

        fire(): void {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "fire", "call"])
            } else {
                this.clip_live.call('fire');
            }
        };

        stop(): void {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "stop", "call"])
            } else {
                this.clip_live.call('stop');
            }
        };

        get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): string[] {
            return this.clip_live.call(
                'get_notes',
                beat_start,
                pitch_midi_min,
                beat_end,
                pitch_midi_max
            );
        };

    }
}