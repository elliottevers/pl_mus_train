import {log} from "./log/logger";
import Logger = log.Logger;
import {message} from "./message/messenger";
import Messenger = message.Messenger;
import {execute} from "./execute/executor";
import SynchronousDagExecutor = execute.SynchronousDagExecutor;
import CallableMax = execute.CallableMax;
// import {Target} from "./target/target";

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

let testing = 1;


// // TODO: sends message with (name of method being executed), ...
// let executor = new SynchronousDagExecutor(
//     {'set_mode': Mode.Query},
//     {'get_length_coll': null},
//     {'get_min_coll': null},
//     {'get_max_coll': null},
//     {'set_scale_factor': scale_factor},
//     {'set_mode': Mode.BulkWrite},
//     {'dump_coll': null},
//     {'set_mode': Mode.Stream}
// );

// let process_response = (envoker, response) => {
//
// };

let init = () => {
    call_set_mode(Mode.Query)
};

let call_set_mode = (mode) => {
    switch (mode) {
        case Mode.Query: {
            messenger.message(['set_mode', Mode.Query]);
            break;
        }

        case Mode.BulkWrite: {
            messenger.message(['set_mode', Mode.BulkWrite]);
            break;
        }

        case Mode.Stream: {
            messenger.message(['set_mode', Mode.Stream]);
            break;
        }
    }
};

let return_set_mode = (arg_invoker, val_return) => {
    switch (arg_invoker) {
        case Mode.Query: {
            call_get_length();
            break;
        }

        case Mode.BulkWrite: {
            call_dump_coll();
            break;
        }

        case Mode.Stream: {
            break;
        }

    }
};

// let call_set_mode_query = () => {
//     messenger.message(['set_mode', Mode.Query])
// };
//
// let return_set_mode = (val) => {
//     call_get_length()
// };

let call_get_length = () => {
    messenger.message(['get_length', 'length'])
};

let return_get_length = (val) => {
    length_coll = val;
    call_get_min()
};

let call_get_min = () => {
    messenger.message(['get_min', 'min'])
};

let return_get_min = (val) => {
    min_coll = val;
    call_get_max()
};

let call_get_max = () => {
    messenger.message(['get_max', 'max'])
};

let return_get_max = (val) => {
    min_coll = val;
    call_set_scale_factor()
};

let call_set_scale_factor = () => {
    messenger.message(['set_scale_factor', max_coll + 100])
};

let return_set_scale_factor = (val) => {
    call_set_mode(Mode.BulkWrite)
};

// let call_set_mode_bulk_write = () => {
//     messenger.message(['set_mode', Mode.BulkWrite])
// };
//
// let return_set_mode_bulk_write = (val) => {
//     call_dump_coll()
// };

let call_dump_coll = () => {
    messenger.message(['dump_coll'])
};

let return_dump_coll = (val) => {
    call_set_mode(Mode.Stream)
};

// let call_set_mode_stream = () => {
//     messenger.message(['set_mode', Mode.Stream])
// };

// ["test1", "test2"].forEach(function(name){eval(name + "()")})

let invoke_sequentially = (name_funcs: string[]) => {
    name_funcs.forEach(function(name){
        // send message
        // wait for ack
        // eval(name + "()")
    })
};

// declare let __router: any;
//
// declare let __coll: any;

// let receives = (name_method, val_return) => {
//     executor.return(name_method, val_return)
//
// };
//
// let sends = (name_method, arg_method) => {
//     executor.call(name_method, arg_method)
// };

let initial = 2;

// let postprocess_return_arg = 5;

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

// let calls = (index_callable, arg) => {
//
// };

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

    // post('testing...');
    // post('\n');
    // post(this.testing);


    // let call_getter = (arg) => {
    //     var_getter
    // };

    // let times_5 = (arg) => {
    //     return arg**2
    // };

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

    // this.name_func = name_func;
    // this.arg = arg;
    // this.func_pre_call = func_pre_call;
    // this.func_post_return = func_post_return;
    // this.func_preprocess_arg = func_preprocess_arg;
    // this.func_postprocess_return_val = func_postprocess_return_val;
    // this.messenger = messenger;

        // {'set_mode': Mode.Query},
        // {'get_length_coll': null},
        // {'get_min_coll': null},
        // {'get_max_coll': null},
        // {'set_scale_factor': scale_factor},
        // {'set_mode': Mode.BulkWrite},
        // {'dump_coll': null},
        // {'set_mode': Mode.Stream}
    // );


    //
    // let executor = new SynchronousDagExecutor(
    //     {'set_mode': Mode.Query},
    //     {'get_length_coll': null},
    //     {'get_min_coll': null},
    //     {'get_max_coll': null},
    //     {'set_scale_factor': scale_factor},
    //     {'set_mode': Mode.BulkWrite},
    //     {'dump_coll': null},
    //     {'set_mode': Mode.Stream}
    // );


};

let test = () => {
    main();
    returns(0, 24);
};

test();

// let variable = 'outside';
//
// let to_invoke = () => {
//     console.log(variable)
// };
//
// class Inside {
//     func: any;
//     constructor(func) {
//         this.func = func;
//     }
//
//     invoke() {
//         let variable = 'inside';
//         this.func.call()
//     }
// }
//
// let thing = new Inside(to_invoke);
//
// variable = 'outside changed';
//
// thing.invoke();

let set_state_channels = (mode) => {
    // sends messages to configure gates
};

if (typeof Global !== "undefined") {
    Global.test = {};
    Global.test.main = main;
    Global.test.test = test;
}
