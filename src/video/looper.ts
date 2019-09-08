const _ = require('underscore');

export namespace video {

    type Frame = number;

    type FramePositionPercentile = number;

    type BeatPositionPercentile = number;

    export class Looper {

        public static beat_to_point;

        private beat_estimates: BeatPositionPercentile[];

        private bars: number[];

        // list of duples of floats
        private cuts: FramePositionPercentile[][];

        private length_video: Frame;

        public set_beat_estimates(estimates_beat_position_percentile: number[]) {
            this.beat_estimates = estimates_beat_position_percentile;
        }

        private beats_to_bars(beats: BeatPositionPercentile[]): number[] {
            let bars = [];
            for (let i_point in beats) {
                if (parseInt(i_point) % 4 == 0) {
                    bars.push(beats[i_point])
                }
            }
            return bars;
        }

        public get_bar() {
            return this.beat_estimates
        }

        // create rightmost cut from current playback time
        public add_cut() {

        }

        public update_cuts_from_loop(frame_loop_start: Frame, frame_loop_end: Frame): void {
            frame_loop_start/this.length_video
            frame_loop_end/this.length_video
        }
    }
}