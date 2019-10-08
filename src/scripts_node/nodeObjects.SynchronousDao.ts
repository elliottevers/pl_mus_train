// import {test as t} from "../test/SynchronousDao";
// import SynchronousDao = t.SynchronousDao;

import {test} from "../test/SynchronousDao";
import SynchronousDao = test.SynchronousDao;

const max_api = require('max-api');



max_api.addHandler('return', (val) => {
    // @ts-ignore
    global.generatorLastExecuted.next(val)
});

max_api.addHandler('start', (val) => {
    let thing = new SynchronousDao();
    thing.execute(100)
});

