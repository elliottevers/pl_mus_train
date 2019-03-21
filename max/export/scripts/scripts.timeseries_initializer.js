(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execute;
(function (execute) {
    var SynchronousDagExecutor = /** @class */ (function () {
        function SynchronousDagExecutor(callables, messenger) {
            this.callables = callables;
            this.messenger = messenger;
        }
        SynchronousDagExecutor.prototype.next = function () {
            // this.index_to_run += 1;
            this.index_to_run = this.index_to_run + 1;
            if (this.index_to_run < this.callables.length) {
                return {
                    value: {
                        callable: this.callables[this.index_to_run],
                        index: this.index_to_run
                    },
                    done: false
                };
            }
            else {
                return {
                    value: null,
                    done: true
                };
            }
        };
        SynchronousDagExecutor.prototype.return = function (index_callable, val_return) {
            if (val_return === 'bang') {
                // denotes a void method
                val_return = null;
            }
            val_return = this.callables[index_callable].return(val_return);
            return val_return;
        };
        SynchronousDagExecutor.prototype.run = function () {
            this.index_to_run = 0;
            this.messenger.message(['reset']);
            this.callables[this.index_to_run].call(this.index_to_run);
        };
        return SynchronousDagExecutor;
    }());
    execute.SynchronousDagExecutor = SynchronousDagExecutor;
    var CallableMax = /** @class */ (function () {
        // TODO: support arbitrary amount of arguments
        // constructor(func, args: any[]) {
        function CallableMax(arg, func_pre_call, func_post_return, func_preprocess_arg, func_postprocess_return_val, messenger) {
            this.arg = arg;
            this.func_pre_call = func_pre_call;
            this.func_post_return = func_post_return;
            this.func_preprocess_arg = func_preprocess_arg;
            this.func_postprocess_return_val = func_postprocess_return_val;
            this.messenger = messenger;
        }
        CallableMax.prototype.call = function (index_sequence) {
            if (this.func_pre_call !== null) {
                this.func_pre_call.call(this, this.arg);
            }
            var arg;
            if (this.func_preprocess_arg !== null) {
                arg = this.func_preprocess_arg.call(this, this.arg);
            }
            else {
                arg = this.arg;
            }
            this.messenger.message([index_sequence, arg]);
        };
        CallableMax.prototype.return = function (val_return) {
            if (this.func_postprocess_return_val !== null) {
                val_return = this.func_postprocess_return_val.call(this, val_return);
            }
            if (this.func_post_return !== null) {
                this.func_post_return.call(this, val_return);
            }
            return val_return;
        };
        return CallableMax;
    }());
    execute.CallableMax = CallableMax;
})(execute = exports.execute || (exports.execute = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log;
(function (log) {
    var Logger = /** @class */ (function () {
        function Logger(env) {
            this.env = env;
        }
        Logger.log_max_static = function (message) {
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    post(s);
                }
                else if (message === null) {
                    post("<null>");
                }
                else {
                    post(message);
                }
            }
            post("\n");
        };
        Logger.prototype.log = function (message) {
            if (this.env === 'max') {
                this.log_max(message);
            }
            else if (this.env === 'node') {
                this.log_node(message);
            }
            else {
                post('env: ' + this.env);
                post('\n');
                throw 'environment invalid';
            }
        };
        // TODO: make static
        Logger.prototype.log_max = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0, len = arguments.length; i < len; i++) {
                var message = arguments[i];
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    post(s);
                }
                else if (message === null) {
                    post("<null>");
                }
                else {
                    post(message);
                }
            }
            post("\n");
        };
        // TODO: make static
        Logger.prototype.log_node = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0, len = arguments.length; i < len; i++) {
                var message = arguments[i];
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    console.log(s);
                }
                else if (message === null) {
                    console.log("<null>");
                }
                else {
                    console.log(message);
                }
            }
            console.log("\n");
        };
        return Logger;
    }());
    log.Logger = Logger;
})(log = exports.log || (exports.log = {}));

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message;
(function (message_1) {
    var Messenger = /** @class */ (function () {
        function Messenger(env, outlet, key_route) {
            this.env = env;
            this.outlet = outlet;
            this.key_route = key_route;
        }
        Messenger.prototype.get_key_route = function () {
            return this.key_route;
        };
        Messenger.prototype.message = function (message) {
            switch (this.env) {
                case 'max': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_max(message);
                    break;
                }
                case 'node': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_node(message);
                    break;
                }
                case 'node_for_max': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_node_for_max(message);
                    break;
                }
            }
        };
        Messenger.prototype.message_max = function (message) {
            outlet(this.outlet, message);
        };
        Messenger.prototype.message_node = function (message) {
            console.log("Messenger:");
            console.log("\n");
            console.log(message);
            console.log("\n");
        };
        Messenger.prototype.message_node_for_max = function (message) {
            // const Max = require('max-api');
            // Max.outlet(message);
        };
        return Messenger;
    }());
    message_1.Messenger = Messenger;
})(message = exports.message || (exports.message = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var executor_1 = require("../execute/executor");
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
var logger;
var scale_factor;
var length_coll;
var max_coll;
var min_coll;
var channel_execute = 0;
var done = false;
var returns = function (index_callable, val_return) {
    if (done) {
        return;
    }
    executor.return(index_callable, val_return);
    var next_result = executor.next();
    if (!next_result.done) {
        // let logger = new Logger(env);
        //
        // logger.log(JSON.stringify(next_result));
        var next_callable = next_result.value['callable'];
        next_callable.call(next_result.value['index']);
        return;
    }
    done = true;
    logger.log('done');
};
var main = function () {
    done = false;
    messenger_execute = new Messenger(env, channel_execute);
    logger = new Logger(env);
    var hook_set_length = function (val_return) {
        length_coll = val_return;
    };
    var hook_set_min = function (val_return) {
        min_coll = val_return;
    };
    var hook_set_max = function (val_return) {
        max_coll = val_return;
    };
    var hook_calculate_scale_factor = function (arg) {
        return max_coll * 2;
    };
    var hook_get_length = function (arg) {
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
        null, null, null, hook_get_length, null, messenger_execute),
        new CallableMax(// 10
        0, null, null, null, null, messenger_execute),
        new CallableMax(// 11
        'clear', null, null, null, null, messenger_execute),
        new CallableMax(// 12 - initialize buffer size
        null, null, null, hook_get_length, null, messenger_execute),
        new CallableMax(// 13
        'dump', null, null, null, null, messenger_execute),
        new CallableMax(// 14 - send size of buffer out of outlet
        null, null, null, hook_get_length, null, messenger_execute),
        new CallableMax(// 15
        Mode.Stream, null, null, null, null, messenger_execute),
    ], messenger_execute);
    executor.run();
};
var test = function () {
};
// test();
if (typeof Global !== "undefined") {
    Global.timeseries_initializer = {};
    Global.timeseries_initializer.main = main;
    Global.timeseries_initializer.returns = returns;
    Global.timeseries_initializer.test = test;
}

},{"../execute/executor":1,"../log/logger":2,"../message/messenger":3}]},{},[4]);

var main = Global.timeseries_initializer.main;
var returns = Global.timeseries_initializer.returns;
var test = Global.timeseries_initializer.test;