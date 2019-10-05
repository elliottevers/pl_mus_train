import {name_objects_patcher} from "../constants/constants";
import {message} from "../message/messenger";

const _ = require('underscore');

export namespace video {

    // import JIT_MOVIE = name_objects_patcher.JIT_MOVIE;

    import Messenger = message.Messenger;

    type Frame = number;

    type FramePositionPercentile = number;

    type BeatPositionPercentile = number;

    export class Video {

        private path_file: string;

        private messenger: Messenger;

        private length: Frame;

        constructor(path_file: string, messenger: Messenger) {
            this.path_file = path_file;
            this.messenger = messenger;
        }

        public getLength(): Frame {
            // this.messenger.message([0])
            return this.length;
        }

        public loadLength(): void {
            this.messenger.message(['loadLength'])
        }
    }

    // step function
    export class Function {

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

    export class Interval {
        private start: number;
        private end: number;

        constructor(start: number, end: number) {
            this.start = start;
            this.end = end;
        }

        public get(): Array<number> {
            return [this.start, this.end]
        }
    }

    export class Iterator {

        public intervals: Interval[];

        i: number;

        constructor(intervals: Interval[]) {
            this.intervals = intervals;

            this.i = -1;
        }

        public next() {
            let value_increment = 1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'interval iterator < 0'
            }

            if (this.i < this.intervals.length) {
                return {
                    value: this.intervals[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.intervals[this.i];
            } else {
                return null;
            }
        }

        public reset() {
            this.i = -1;
        }

        public get_index_current() {
            return this.i;
        }
    }
}