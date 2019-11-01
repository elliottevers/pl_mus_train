import {max} from "../max/dao";

export namespace video {

    import MaxDao = max.MaxDao;

    export type Frame = number;

    export type Percentile = number;

    export class Video {

        private keyRoute: string = 'video';

        private pathFile: string;

        private dao: MaxDao;

        public duration: Frame;

        constructor(pathFile: string, dao: MaxDao) {
            this.pathFile = pathFile;
            this.dao = dao;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.dao.setMode(deferlow, synchronous)
        }

        public load(): void {
            this.dao.call(
                [
                    this.keyRoute,
                    'read',
                    this.pathFile
                ]
            );
        }

        public stop(): void {
            this.dao.setMode(true, false);

            this.dao.call(
                [
                    this.keyRoute,
                    'stop'
                ]
            );

            this.dao.setMode(false, true);
        }

        public loop(cutLower: Percentile, cutUpper: Percentile): void {
            this.dao.call(
                [
                    this.keyRoute,
                    'looppoints',
                    String(Math.round(this.frameFromPercentile(cutLower))),
                    String(Math.round(this.frameFromPercentile(cutUpper)))
                ]
            )
        }

        public frameFromPercentile(p: Percentile): Frame {
            return p * this.duration
        }

        public percentileFromFrame(f: Frame): Percentile {
            return f / this.duration
        }

        public loadDuration(): void {
            this.duration = this.dao.call(
                [
                    this.keyRoute,
                    'getduration'
                ]
            )[0]
        }

        public getFrameCurrent(): Frame {
            return this.dao.call(
                [
                    this.keyRoute,
                    'gettime'
                ]
            )
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