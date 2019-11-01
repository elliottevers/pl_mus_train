import {max} from "../max/dao";
import {video} from "../video/video";

const _ = require('underscore');

export namespace functionBreakpoint {

    import MaxDao = max.MaxDao;
    import Percentile = video.Percentile;

    export class FunctionBreakpoint<T> {

        private keyRoute: string = 'functionBreakpoint';

        private dao: MaxDao;

        public breakpoints: Array<[T, number]> = [];

        constructor(dao: MaxDao) {
            this.dao = dao;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.dao.setMode(deferlow, synchronous)
        }

        addBreakpoint(x: T, y: number): void {

            this.dao.setMode(true, false);

            this.dao.call(
                [
                    this.keyRoute,
                    'list',
                    x,
                    y
                ]
            );

            this.dao.setMode(false, true);

            this.loadBreakpoints();
        }

        // NB: can only update latest breakpoint
        updateBreakpoint(index: number, x: Percentile, y: Percentile): void {
            this.dao.setMode(true, false);

            this.dao.call(
                [
                    this.keyRoute,
                    'list',
                    index,
                    x,
                    y
                ]
            );

            this.dao.setMode(false, true);
        }

        // synchronous
        public loadBreakpoints(): void {
            const resRaw = this.dao.call(
                [
                    this.keyRoute,
                    'listdump'
                ]
            );

            this.breakpoints = this.parseBreakpoints(resRaw)
        }

        // TODO: implement
        private parseBreakpoints(raw: Array<any>): [T, number][] {
            return raw.reduce(
                function (r, a, i) {
                    if (i % 2) {
                        r[r.length - 1].push(a);
                    } else {
                        r.push([a]);
                    }
                    return r;
                },
                []
            );
        }
    }
}