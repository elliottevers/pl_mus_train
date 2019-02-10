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

let messenger: Messenger;

let scale_factor: number;

let length_coll: number;

let max_coll: number;

let min_coll: number;

let initial = 2;

let called_pre_call_hook = false;

let called_post_return_hook = false;

let final: number;


let returns = (index_callable, val_return) => {

    executor.return(index_callable, val_return);

    let next_result = executor.next();

    if (!next_result.done) {

        let next_callable = next_result.value['callable'];

        next_callable.call(next_result.value['index'])
    }

    messenger.message(['done'])
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

    let hook_preprocess_arg = (arg) => {
        return arg*3
    };

    let hook_pre_call = (arg) => {
        called_pre_call_hook = true;
    };

    let hook_post_return = (val_return) => {
        called_post_return_hook = true;
        final = val_return;
    };

    let hook_postprocess_return = (val_return) => {
        return val_return
    };

    let hook_preprocess_arg_set_final = (arg) => {
        return final
    };

    messenger = new Messenger(env, 0);

    executor = new SynchronousDagExecutor([
        new CallableMax(
            initial,
            hook_pre_call,
            hook_post_return,
            hook_preprocess_arg,
            hook_postprocess_return,
            messenger
        ),
        new CallableMax(
            null,
            null,
            null,
            hook_preprocess_arg_set_final,
            null,
            messenger
        )
    ]);

    executor.run()
};

let test = () => {
    main();
    returns(0, 24);
};

// test();

if (typeof Global !== "undefined") {
    Global.test = {};
    Global.test.main = main;
    Global.test.returns = returns;
    Global.test.test = test;
}
