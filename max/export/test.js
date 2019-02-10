(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {Note, note as n} from "../note/note";
var execute;
(function (execute) {
    // export class NoteIterator {
    //
    //     private notes: TreeModel.Node<Note>[];
    //     public direction_forward: boolean;
    //     private i: number;
    //
    //     constructor(notes: TreeModel.Node<Note>[], direction_forward: boolean) {
    //         this.notes = notes;
    //         this.direction_forward = direction_forward;
    //         this.i = -1;
    //     }
    //
    //     // TODO: type declarations
    //     public next() {
    //         let value_increment = (this.direction_forward) ? 1 : -1;
    //
    //         this.i += value_increment;
    //
    //         if (this.i < 0) {
    //             throw 'note iterator < 0'
    //         }
    //
    //         if (this.i < this.notes.length) {
    //             return {
    //                 value: this.notes[this.i],
    //                 done: false
    //             }
    //         } else {
    //             return {
    //                 value: null,
    //                 done: true
    //             }
    //         }
    //     }
    //
    //     public current() {
    //         if (this.i > -1) {
    //             return this.notes[this.i];
    //         } else {
    //             return null;
    //         }
    //     }
    // }
    var SynchronousDagExecutor = /** @class */ (function () {
        // to_run: Callable;
        // private running: Callable;
        function SynchronousDagExecutor(callables) {
            this.callables = callables;
        }
        SynchronousDagExecutor.prototype.next = function () {
            this.index_to_run += 1;
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
        // private call() {
        //     this.callables[this.index_to_run].call(this.index_to_run);
        //     this.index_running = this.index_to_run;
        //     // this.running = this.to_run;
        // }
        // private get_index_running() {
        //     return this.index_to_run
        // }
        // public return(name_func, val_return) {
        //     let currently_running =  this.callables.filter((callable) =>{
        //         return callable.name_func === name_func
        //     });
        //
        //     val_return = currently_running[0].return(val_return);
        //
        //     if (this.callables.length < this.index_running) {
        //         this.index_to_run += 1;
        //     }
        //
        //     return val_return;
        // }
        SynchronousDagExecutor.prototype.return = function (index_callable, val_return) {
            // let currently_running =  this.callables.filter((callable) =>{
            //     return callable.name_func === name_func
            // });
            val_return = this.callables[index_callable].return(val_return);
            // if (this.callables.length < this.index_running) {
            //     this.index_to_run += 1;
            // }
            //
            return val_return;
        };
        SynchronousDagExecutor.prototype.run = function () {
            this.index_to_run = 0;
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
            if (this.func_preprocess_arg !== null) {
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
var message;
(function (message_1) {
    // TODO: the following
    // type Env = 'max' | 'node';
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
            if (this.env === 'max') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_max(message);
            }
            else if (this.env === 'node') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_node(message);
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
        return Messenger;
    }());
    message_1.Messenger = Messenger;
})(message = exports.message || (exports.message = {}));

},{}],3:[function(require,module,exports){
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
// test();
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
    Global.test.returns = returns;
    Global.test.test = test;
}

},{"./execute/executor":1,"./message/messenger":2}]},{},[3]);

var main = Global.test.main;
var returns = Global.test.returns;
var test = Global.test.test;