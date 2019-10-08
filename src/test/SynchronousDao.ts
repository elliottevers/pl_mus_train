
const max_api = require('max-api');

export namespace test {
    export class SynchronousDao {
        constructor() {

        }

        public execute(first) {
            // @ts-ignore
            // global.generatorLastExecuted = this.gen;

            let gen = function * () {

                let res = 0;

                res += first;
                // res += 4;

                // async call
                max_api.outlet(1, 'bang');

                let second = yield;

                res += second;

                // @ts-ignore
                // global.generatorLastExecuted = _generator;

                // async call
                max_api.outlet(2, 'bang');

                let third = yield;

                res += third;

                max_api.post(res)
            }();

            // @ts-ignore
            global.generatorLastExecuted = gen;

            // @ts-ignore
            global.generatorLastExecuted.next(4);
        }

        // public gen = function * (first) {
        //
        //     let res = 0;
        //
        //     // res += first;
        //     res += 4;
        //
        //     // async call
        //     max_api.outlet(1, 'bang');
        //
        //     let second = yield;
        //
        //     res += second;
        //
        //     // @ts-ignore
        //     // global.generatorLastExecuted = _generator;
        //
        //     // async call
        //     max_api.outlet(2, 'bang');
        //
        //     let third = yield;
        //
        //     res += third;
        //
        //     max_api.post(res)
        // }();
    }
}