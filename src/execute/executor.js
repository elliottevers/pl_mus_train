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
            this.messenger.message([index_sequence, this.name_func, arg]);
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
//# sourceMappingURL=executor.js.map