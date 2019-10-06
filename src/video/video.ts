import {message} from "../message/messenger";

const _ = require('underscore');

export namespace video {

    import Messenger = message.Messenger;

    export type Frame = number;

    export type Percentile = number;

    export type Point = [Percentile, number];  // the second value is the height

    export class BeatAnalyzed {

        protected beatEstimatesRelative: Percentile[];

        private confirmedCuts: Percentile[];

        constructor() {

        }

        public setBeatEstimatesRelative(beatsRelative: Percentile[]): void {
            this.beatEstimatesRelative = beatsRelative;
        }

        public getConfirmedCuts(): Array<Percentile> {
            return this.confirmedCuts;
        }

        public addCut(cut: Percentile): void {
            this.confirmedCuts = this.confirmedCuts.concat([cut]);
        }

        public getQuantizedX(x: Percentile): Percentile {
            return this.beatEstimatesRelative.reduce(function(prev, curr) {
                return (Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
            });
        }
    }

    export class Video extends BeatAnalyzed {

        public pathFile: string;

        private messenger: Messenger;

        private duration: Frame;

        constructor(pathFile: string, messenger: Messenger) {
            super();
            this.pathFile = pathFile;
            this.messenger = messenger;

        }

        // TODO: support
        public load(): void {
            // this.messenger.message(['load', 'read', this.pathFile])
        }

        public getDuration(): Frame {
            return this.duration;
        }

        public setDuration(duration: Frame): void {
            this.duration = duration;
        }

        // TODO: support
        public loadDuration(): void {
            // this.messenger.message(['loadDuration', 'duration'])
        }

        public frameFromPercentile(p: Percentile): Frame {
            return p * this.duration
        }

        public percentileFromFrame(f: Frame): Percentile {
            return f/this.duration
        }

        public beatsToFrames(beat: number): Frame {
            return (this.beatEstimatesRelative.length/this.duration) * beat;
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