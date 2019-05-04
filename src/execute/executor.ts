import {message} from "../message/messenger";

export namespace execute {

    import Messenger = message.Messenger;

    export class SynchronousDagExecutor {

        callables: CallableMax[];

        index_to_run: number;

        messenger: Messenger;

        constructor(callables, messenger) {
            this.callables = callables;
            this.messenger = messenger;
        }

        public next() {
            this.index_to_run = this.index_to_run + 1;

            if (this.index_to_run < this.callables.length) {
                return {
                    value: {
                        callable: this.callables[this.index_to_run],
                        index: this.index_to_run
                    },
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public return(index_callable, val_return) {

            if (val_return === 'bang') {
                // denotes a void method
                val_return = null;
            }

            val_return = this.callables[index_callable].return(val_return);

            return val_return;
        }

        public run() {
            this.index_to_run = 0;
            this.messenger.message(['reset']);
            this.callables[this.index_to_run].call(this.index_to_run);
        }
    }

    interface Callable {

        call(index_sequence: number);

        return(index_sequence: number)
    }

    export class CallableMax implements Callable {
        // args: any[];
        arg: any;

        messenger: Messenger;

        // TODO: how will we pass the argument required by the type defs?
        func_pre_call: Function;

        func_post_return: Function;

        func_preprocess_arg: Function;

        func_postprocess_return_val: Function;

        // TODO: support arbitrary amount of arguments
        // constructor(func, args: any[]) {
        constructor(
            arg: any,
            func_pre_call: Function,
            func_post_return: Function,
            func_preprocess_arg: Function,
            func_postprocess_return_val: Function,
            messenger: Messenger
        ) {
            this.arg = arg;
            this.func_pre_call = func_pre_call;
            this.func_post_return = func_post_return;
            this.func_preprocess_arg = func_preprocess_arg;
            this.func_postprocess_return_val = func_postprocess_return_val;
            this.messenger = messenger;
        }

        call(index_sequence) {
            if (this.func_pre_call !== null) {
                this.func_pre_call.call(this, this.arg);
            }

            let arg;

            if (this.func_preprocess_arg !== null) {
                arg = this.func_preprocess_arg.call(this, this.arg);
            } else {
                arg = this.arg;
            }

            this.messenger.message([index_sequence, arg])
        }

        return(val_return) {

            if (this.func_postprocess_return_val !== null) {
                val_return = this.func_postprocess_return_val.call(this, val_return);
            }

            if (this.func_post_return !== null) {
                this.func_post_return.call(this, val_return);
            }
            return val_return;
        }
    }
}