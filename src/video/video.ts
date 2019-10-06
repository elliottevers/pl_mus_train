import {message} from "../message/messenger";

const _ = require('underscore');

export namespace video {

    import Messenger = message.Messenger;

    export type Frame = number;

    export type Percentile = number;

    export type Point = [Percentile, number];  // the second value is the height

    export class BeatAnalyzed {

        private beatEstimatesRelative: Percentile[];

        constructor() {

        }

        public setBeatEstimatesRelative(beatsRelative: Percentile[]): void {
            this.beatEstimatesRelative = beatsRelative;
        }

        public getIntervals(): Interval<Percentile>[] {

            return []
        }

        public static framesFromPercentiles(
            percentiles: Percentile[],
            duration: Frame
        ): Frame[] {
            return percentiles.map((p) => {
                return p * duration
            })
        }
    }

    // TODO: make this a decorator class or something
    export class Video extends BeatAnalyzed {

        private pathFile: string;

        private messenger: Messenger;

        private duration: Frame;

        constructor(pathFile: string, messenger: Messenger) {
            super();
            this.pathFile = pathFile;
            this.messenger = messenger;

        }

        public load(): void {
            // TODO:
        }

        public getDuration(): Frame {
            // this.messenger.message([0])
            return this.duration;
        }

        public setDuration(duration: Frame): void {
            this.duration = duration;
        }

        public loadDuration(): void {
            this.messenger.message(['loadDuration'])
        }

    }

    // step function
    export class BreakpointFunction {

        // public static beat_to_point;
        //
        // private beat_estimates: BeatPositionPercentile[];
        //
        // private bars: number[];

        // list of duples of floats
        // private cuts: FramePositionPercentile[][];
        private cuts: Point[];

        public dump() {

        }

        public setCuts(cuts: Point[]): void {
            this.cuts = cuts;
        }

        public getCuts(): Point[] {
            return this.cuts;
        }

        // private length_video: Frame;
        //
        // public set_beat_estimates(estimates_beat_position_percentile: number[]) {
        //     this.beat_estimates = estimates_beat_position_percentile;
        // }
        //
        // private beats_to_bars(beats: BeatPositionPercentile[]): number[] {
        //     let bars = [];
        //     for (let i_point in beats) {
        //         if (parseInt(i_point) % 4 == 0) {
        //             bars.push(beats[i_point])
        //         }
        //     }
        //     return bars;
        // }
        //
        // public get_bar() {
        //     return this.beat_estimates
        // }
        //
        // // create rightmost cut from current playback time
        // public add_cut() {
        //
        // }
        //
        // public update_cuts_from_loop(frame_loop_start: Frame, frame_loop_end: Frame): void {
        //     frame_loop_start/this.length_video
        //     frame_loop_end/this.length_video
        // }
    }

    export class Interval<T> {
        private start: T;
        private end: T;

        constructor(start: T, end: T) {
            this.start = start;
            this.end = end;
        }

        public getInterval(): [T, T] {
            return [this.start, this.end]
        }
    }

    export class Iterator<T> {

        data: Array<T>;

        i: number;

        constructor(data: Array<T>) {
            this.data = data;
            this.i = -1;
        }

        public next() {
            let value_increment = 1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'iterator < 0'
            }

            if (this.i < this.data.length) {
                return {
                    value: this.data[this.i],
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
                return this.data[this.i];
            } else {
                return null;
            }
        }

        public reset() {
            this.i = -1;
        }

        public getIndexCurrent() {
            return this.i;
        }

        public static createIntervals<T>(endpoints: T[]) {
            let intervals: [T, T][] = [];
            for (let iEndpoint in endpoints.slice(0, -1)) {
                intervals.push(
                    [
                        endpoints[Number(iEndpoint)],
                        endpoints[Number(iEndpoint) + 1]
                    ]
                )
            }
            return intervals;
        }
    }
}