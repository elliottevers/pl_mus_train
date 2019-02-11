"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./log/logger");
var Logger = logger_1.log.Logger;
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
var messenger_execute;
// let messenger_log: Messenger;
var logger;
var scale_factor;
var length_coll;
var max_coll;
var min_coll;
var channel_execute = 0;
var returns = function (index_callable, val_return) {
    executor.return(index_callable, val_return);
    var next_result = executor.next();
    if (!next_result.done) {
        var next_callable = next_result.value['callable'];
        next_callable.call(next_result.value['index']);
        return;
    }
    logger.log('done');
    logger.log(['length: ', length_coll].join(''));
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
    messenger_execute = new Messenger(env, channel_execute);
    logger = new Logger(env);
    var hook_set_length = function (val_return) {
        length_coll = val_return;
        logger.log('hook_set_length');
    };
    var hook_set_min = function (val_return) {
        min_coll = val_return;
        logger.log('hook_set_min');
    };
    var hook_set_max = function (val_return) {
        max_coll = val_return;
        logger.log('hook_set_max');
    };
    var hook_calculate_scale_factor = function (arg) {
        logger.log('hook_calculate_scale_factor');
        return max_coll + 100;
    };
    var hook_get_length = function (arg) {
        logger.log('hook_get_length');
        return length_coll;
    };
    executor = new SynchronousDagExecutor([
        new CallableMax(// 0
        Mode.Query, null, null, null, null, messenger_execute),
        new CallableMax(// 1
        'length', null, null, null, null, messenger_execute),
        new CallableMax(// 2
        'length', null, hook_set_length, null, null, messenger_execute),
        new CallableMax(// 3
        'min', null, null, null, null, messenger_execute),
        new CallableMax(// 4
        'min', null, hook_set_min, null, null, messenger_execute),
        new CallableMax(// 5
        'max', null, null, null, null, messenger_execute),
        new CallableMax(// 6
        'max', null, hook_set_max, null, null, messenger_execute),
        new CallableMax(// 7
        Mode.BulkWrite, null, null, null, null, messenger_execute),
        new CallableMax(// 8
        null, null, null, hook_calculate_scale_factor, null, messenger_execute),
        new CallableMax(// 9
        0, null, null, null, null, messenger_execute),
        new CallableMax(// 10
        null, null, null, hook_get_length, null, messenger_execute),
        new CallableMax(// 11
        'dump', null, null, null, null, messenger_execute),
        new CallableMax(// 12
        Mode.Stream, null, null, null, null, messenger_execute),
    ]);
    executor.run();
};
var test = function () {
};
// test();
if (typeof Global !== "undefined") {
    Global.test = {};
    Global.test.main = main;
    Global.test.returns = returns;
    Global.test.test = test;
}
//# sourceMappingURL=test.js.map