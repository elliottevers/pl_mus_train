import {max} from "../max/dao";

const _ = require('underscore');

export namespace functionBreakpoint {

    import MaxDao = max.MaxDao;

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

        // synchronous
        addBreakpoint(x: T, y: number): void {
            if (!_.contains(this.breakpoints.map(x => x[0]), x)) {
                this.breakpoints = this.breakpoints.concat([[x, y]]);
            }

            this.dao.call(
                [
                    this.keyRoute,
                    'list',
                    String(x),
                    String(y)
                ]
            )
        }

        // synchronous
        public loadBreakpoints(): void {
            this.dao.call(
                [
                    this.keyRoute,
                    'listdump'
                ]
            )
        }

        // TODO: implement
        private parseBreakpoint(): [number, number][] {
            // @ts-ignore
            this.breakpoints = global.maxObjects.responses.reduce(function (r, a, i) {
                if (i % 2) {
                    r[r.length - 1].push(a);
                } else {
                    r.push([a]);
                }
                return r;
            }, []);

            return [[0, 0]]
        }
    }
}