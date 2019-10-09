// import {test as t} from "../test/SynchronousDao";
// import SynchronousDao = t.SynchronousDao;

import {test} from "../test/SynchronousDao";
import SynchronousDao = test.SynchronousDao;

const max_api = require('max-api');

// export class DaoSynchronous {
//     public *get(property) {
//         max_api.outlet('LiveApiMax', 'get', property);
//
//         let result = yield;
//
//         return result;
//     }
//
//     public set(property, value) {
//         max_api.outlet('LiveApiMaxSynchronous', 'set', property, value);
//     }
//
//     public call(...args) {
//         max_api.outlet('LiveApiMaxSynchronous', 'call', args);
//     }
//
//     public *get_id() {
//         max_api.outlet('LiveApiMaxSynchronous', 'getid');
//
//         let result = yield;
//
//         return result;
//     }
//
//     public *get_path() {
//         max_api.outlet('LiveApiMaxSynchronous', 'getpath');
//
//         let result = yield;
//
//         return result;
//     }
//
//     public *get_children() {
//         max_api.outlet('LiveApiMaxSynchronous', 'getchildren');
//
//         let result = yield;
//
//         return result;
//     }
// }



// max_api.addHandler('return', (val) => {
//     // @ts-ignore
//     global.generatorLastExecuted.next(val)
// });
//
// max_api.addHandler('start', (val) => {
//     let thing = new SynchronousDao();
//     thing.execute(100)
// });

class DaoTest {
    constructor() {

    }

    public *test (a) {
        let first = a;
        let second = yield;
        return first + second;
    }
}

max_api.addHandler('test', () => {
    let dt = new DaoTest();
    let gen = dt.test(2);
    gen.next();
    // gen.next(4);
    max_api.post(gen.next(5).value)
});

