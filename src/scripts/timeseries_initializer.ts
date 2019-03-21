import {log} from "../log/logger";
import Logger = log.Logger;
import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {execute} from "../execute/executor";
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

let logger: Logger;

let scale_factor: number;

let length_coll: number;

let max_coll: number;

let min_coll: number;

let channel_execute: number = 0;

let done = false;


let returns = (index_callable, val_return) => {

    if (done) {
        return;
    }

    executor.return(index_callable, val_return);

    let next_result = executor.next();

    if (!next_result.done) {

        // let logger = new Logger(env);
        //
        // logger.log(JSON.stringify(next_result));

        let next_callable = next_result.value['callable'];

        next_callable.call(next_result.value['index']);

        return;
    }

    done = true;

    logger.log('done');
};


let main = () => {

    done = false;

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
        return max_coll * 2
    };

    let hook_get_length = (arg) => {
        return length_coll
    };

    executor = new SynchronousDagExecutor(
        [
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
                null,
                null,
                null,
                hook_get_length,
                null,
                messenger_execute
            ),
            new CallableMax( // 10
                0,
                null,
                null,
                null,
                null,
                messenger_execute
            ),
            new CallableMax( // 11
                'clear',
                null,
                null,
                null,
                null,
                messenger_execute
            ),
            new CallableMax( // 12 - initialize buffer size
                null,
                null,
                null,
                hook_get_length,
                null,
                messenger_execute
            ),
            new CallableMax( // 13
                'dump',
                null,
                null,
                null,
                null,
                messenger_execute
            ),
            new CallableMax( // 14 - send size of buffer out of outlet
                null,
                null,
                null,
                hook_get_length,
                null,
                messenger_execute
            ),
            new CallableMax( // 15
                Mode.Stream,
                null,
                null,
                null,
                null,
                messenger_execute
            ),
        ],
        messenger_execute
    );

    executor.run()
};

let test = () => {

};

// test();

if (typeof Global !== "undefined") {
    Global.timeseries_initializer = {};
    Global.timeseries_initializer.main = main;
    Global.timeseries_initializer.returns = returns;
    Global.timeseries_initializer.test = test;
}
