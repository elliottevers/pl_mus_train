"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var executor_1 = require("./execute/executor");
var SynchronousDagExecutor = executor_1.execute.SynchronousDagExecutor;
var CallableMax = executor_1.execute.CallableMax;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var Mode;
(function (Mode) {
    Mode["Stream"] = "stream";
    Mode["BulkWrite"] = "bulk_write";
    Mode["Query"] = "query";
})(Mode || (Mode = {}));
var executor;
var messenger;
var scale_factor;
var length_coll;
var max_coll;
var min_coll;
var testing = 1;
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
var init = function () {
    call_set_mode(Mode.Query);
};
var call_set_mode = function (mode) {
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
var return_set_mode = function (arg_invoker, val_return) {
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
var call_get_length = function () {
    messenger.message(['get_length', 'length']);
};
var return_get_length = function (val) {
    length_coll = val;
    call_get_min();
};
var call_get_min = function () {
    messenger.message(['get_min', 'min']);
};
var return_get_min = function (val) {
    min_coll = val;
    call_get_max();
};
var call_get_max = function () {
    messenger.message(['get_max', 'max']);
};
var return_get_max = function (val) {
    min_coll = val;
    call_set_scale_factor();
};
var call_set_scale_factor = function () {
    messenger.message(['set_scale_factor', max_coll + 100]);
};
var return_set_scale_factor = function (val) {
    call_set_mode(Mode.BulkWrite);
};
// let call_set_mode_bulk_write = () => {
//     messenger.message(['set_mode', Mode.BulkWrite])
// };
//
// let return_set_mode_bulk_write = (val) => {
//     call_dump_coll()
// };
var call_dump_coll = function () {
    messenger.message(['dump_coll']);
};
var return_dump_coll = function (val) {
    call_set_mode(Mode.Stream);
};
// let call_set_mode_stream = () => {
//     messenger.message(['set_mode', Mode.Stream])
// };
// ["test1", "test2"].forEach(function(name){eval(name + "()")})
var invoke_sequentially = function (name_funcs) {
    name_funcs.forEach(function (name) {
        // send message
        // wait for ack
        // eval(name + "()")
    });
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
var initial = 2;
// let postprocess_return_arg = 5;
var called_pre_call_hook = false;
var called_post_return_hook = false;
var final;
var returns = function (index_callable, val_return) {
    executor.return(index_callable, val_return);
    var next_result = executor.next();
    if (!next_result.done) {
        var next_callable = next_result.value['callable'];
        next_callable.call(next_result.value['index']);
    }
    messenger.message(['done']);
};
// let calls = (index_callable, arg) => {
//
// };
var main = function () {
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
    var hook_preprocess_arg = function (arg) {
        return arg * 3;
    };
    var hook_pre_call = function (arg) {
        called_pre_call_hook = true;
    };
    var hook_post_return = function (val_return) {
        called_post_return_hook = true;
        final = val_return;
    };
    var hook_postprocess_return = function (val_return) {
        return val_return;
    };
    var hook_preprocess_arg_set_final = function (arg) {
        return final;
    };
    messenger = new Messenger(env, 0);
    executor = new SynchronousDagExecutor([
        new CallableMax(initial, hook_pre_call, hook_post_return, hook_preprocess_arg, hook_postprocess_return, messenger),
        new CallableMax(null, null, null, hook_preprocess_arg_set_final, null, messenger)
    ]);
    executor.run();
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
var test = function () {
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
var set_state_channels = function (mode) {
    // sends messages to configure gates
};
if (typeof Global !== "undefined") {
    Global.test = {};
    Global.test.main = main;
    Global.test.test = test;
}
//# sourceMappingURL=test.js.map