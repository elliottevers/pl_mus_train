const _ = require('underscore');

const max_api = require('max-api');

export namespace functionBreakpoint {

    export class FunctionBreakpoint<T> {

        public breakpoints: Array<[T, number]> = [];

        constructor() {

        }

        addBreakpoint(x: T, y: number): void {
            if (!_.contains(this.breakpoints.map(x => x[0]), x)) {
                this.breakpoints = this.breakpoints.concat([[x, y]]);
            }

            max_api.outlet('functionBreakpoint', 'list', x, y);
        }

        public loadBreakpoints(): void {
            // @ts-ignore
            global.maxObjects.locked = true;

            // @ts-ignore
            global.maxObjects.responses = [];

            // @ts-ignore
            global.maxObjects.responsesProcessed = 0;

            // @ts-ignore
            global.maxObjects.responsesExpected = 1;

            max_api.outlet('functionBreakpoint', 'listdump');

            // @ts-ignore
            while (global.maxObjects.locked)
                // @ts-ignore
                node.loop();

            // @ts-ignore
            this.breakpoints = global.maxObjects.responses.reduce(function (r, a, i) {
                if (i % 2) {
                    r[r.length - 1].push(a);
                } else {
                    r.push([a]);
                }
                return r;
            }, []);
        }
    }
}