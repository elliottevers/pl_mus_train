import {log} from "./log/logger";
import Logger = log.Logger;
import {message} from "./message/messenger";
import Messenger = message.Messenger;
import {execute} from "./execute/executor";
import SynchronousDagExecutor = execute.SynchronousDagExecutor;
import CallableMax = execute.CallableMax;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

enum Mode {
    Stream = 'stream',
    BulkWrite = 'bulk_write',
    Query = 'query'
}

let executor: SynchronousDagExecutor;

let messenger_execute: Messenger;

// let messenger_log: Messenger;

let logger: Logger;

let scale_factor: number;

let length_coll: number;

let max_coll: number;

let min_coll: number;

let channel_execute: number = 0;


let returns = (index_callable, val_return) => {

    executor.return(index_callable, val_return);

    let next_result = executor.next();

    if (!next_result.done) {

        let next_callable = next_result.value['callable'];

        next_callable.call(next_result.value['index']);

        return;
    }

    logger.log('done');
};


let main = () => {
    // set router to query mode

    // query coll length

    // wait for response, with guarantee that no other responses could come back except that one

    // query coll max

    // wait

    // query coll min

    // wait

    // calculate metadata

    // set scale factor

    // set router to bulk write mode

    // send coll "dump"

    // after last value is written, set route to stream mode

    messenger_execute = new Messenger(env, channel_execute);

    logger = new Logger(env);

    let hook_set_length = (val_return) => {
        length_coll = val_return;
    };

    let hook_set_min = (val_return) => {
        min_coll = val_return;
    };

    let hook_set_max = (val_return) => {
        max_coll = val_return;
    };

    let hook_calculate_scale_factor = (arg) => {
        return max_coll + 100
    };

    let hook_get_length = (arg) => {
        return length_coll
    };

    executor = new SynchronousDagExecutor([
        new CallableMax( // 0
            Mode.Query,
            null,
            null,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 1
            'length',
            null,
            null,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 2
            'length',
            null,
            hook_set_length,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 3
            'min',
            null,
            null,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 4
            'min',
            null,
            hook_set_min,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 5
            'max',
            null,
            null,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 6
            'max',
            null,
            hook_set_max,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 7
            Mode.BulkWrite,
            null,
            null,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 8
            null,
            null,
            null,
            hook_calculate_scale_factor,
            null,
            messenger_execute
        ),
        new CallableMax( // 9
            0,
            null,
            null,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 10
            null,
            null,
            null,
            hook_get_length,
            null,
            messenger_execute
        ),
        new CallableMax( // 11
            'dump',
            null,
            null,
            null,
            null,
            messenger_execute
        ),
        new CallableMax( // 12
            Mode.Stream,
            null,
            null,
            null,
            null,
            messenger_execute
        ),
    ]);

    executor.run()
};

let test = () => {

};

// test();

if (typeof Global !== "undefined") {
    Global.test = {};
    Global.test.main = main;
    Global.test.returns = returns;
    Global.test.test = test;
}
