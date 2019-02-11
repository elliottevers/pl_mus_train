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
//# sourceMappingURL=executor.js.map