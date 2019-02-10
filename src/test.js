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
var initial = 2;
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
};
var test = function () {
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
//# sourceMappingURL=test.js.map