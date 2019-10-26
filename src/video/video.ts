import {message} from "../message/messenger";

const _ = require('underscore');

const max_api = require('max-api');

export namespace video {

    import Messenger = message.Messenger;

    export type Frame = number;

    export type Percentile = number;

    export type Point = [Percentile, number];  // the second value is the height

    export class Video {

        private pathFile: string;

        private messenger: Messenger;

        public duration: Frame;

        constructor(pathFile: string, messenger: Messenger) {
            this.pathFile = pathFile;
            this.messenger = messenger;
        }

        // TODO: support
        public load(): void {
            max_api.outlet('video', 'read', this.pathFile);
        }

        // public getDuration(): Frame {
        //     return this.duration;
        // }

        // public setDuration(duration: Frame): void {
        //     this.duration = duration;
        // }

        // public requestDuration(): void {
        //     max_api.outlet('video', 'getduration');
        // }
        //
        // public requestFrameCurrent(): void {
        //     max_api.outlet('video', 'gettime');
        // }

        public loop(cutLower: Percentile, cutUpper: Percentile): void {
            max_api.outlet(
                'video',
                'looppoints',
                String(Math.round(this.frameFromPercentile(cutLower))),
                String(Math.round(this.frameFromPercentile(cutUpper)))
            );
        }

        public stop(): void {
            max_api.outlet('video', 'stop');
        }

        public frameFromPercentile(p: Percentile): Frame {
            return p * this.duration
        }

        public percentileFromFrame(f: Frame): Percentile {
            return f/this.duration
        }

        // max_api.addHandler('outletVideo', function(){
        //     let listArgs = Array.prototype.slice.call(arguments);
        //
        //     switch (String(listArgs[0])) {
        //         case 'time':
        //             latestCut = video.percentileFromFrame(Number(listArgs[1]));
        //             break;
        //         case 'duration':
        //             video.setDuration(Number(listArgs[1]));
        //             sagaInitializeVideo.next();
        //             break;
        //         case 'read':
        //             sagaInitializeVideo.next();
        //             break;
        //         default:
        //             return
        //     }
        // });

        public getDuration(): Frame {
            // @ts-ignore
            global.maxObjects.locked = true;

            // @ts-ignore
            global.maxObjects.responses = [];

            // @ts-ignore
            global.maxObjects.responsesProcessed = 0;

            // @ts-ignore
            global.maxObjects.responsesExpected = 1;

            max_api.outlet('video', 'getduration');

            // @ts-ignore
            while (global.maxObjects.locked)
                // @ts-ignore
                node.loop();

            // @ts-ignore
            return global.maxObjects.responses[1]
        }

        public getFrameCurrent(): Frame {
            // @ts-ignore
            global.maxObjects.locked = true;

            // @ts-ignore
            global.maxObjects.responses = [];

            // @ts-ignore
            global.maxObjects.responsesProcessed = 0;

            // @ts-ignore
            global.maxObjects.responsesExpected = 1;

            max_api.outlet('video', 'gettime');

            // @ts-ignore
            while (global.maxObjects.locked)
                // @ts-ignore
                node.loop();

            // @ts-ignore
            return global.maxObjects.responses[1]
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

        public static send<T>(interval: Interval<T>) {
            const message: Array<string> = ['looppoints'].concat(
                interval.getInterval().map(
                    (n) => {
                        return String(n)
                    }
                )
            );
            max_api.outlet(message);
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