import {message} from "../message/messenger";
// import {Note, note as n} from "../note/note";

export namespace execute {

    import Messenger = message.Messenger;

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

    export class SynchronousDagExecutor {

        callables: CallableMax[];

        index_to_run: number;

        private index_running: number;

        // to_run: Callable;

        // private running: Callable;

        constructor(callables) {
            this.callables = callables;
        }

        public next() {
            this.index_to_run += 1;

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

        public return(index_callable, val_return) {
            // let currently_running =  this.callables.filter((callable) =>{
            //     return callable.name_func === name_func
            // });

            val_return = this.callables[index_callable].return(val_return);

            // if (this.callables.length < this.index_running) {
            //     this.index_to_run += 1;
            // }
            //
            return val_return;
        }

        public run() {
            this.index_to_run = 0;
            this.callables[this.index_to_run].call(this.index_to_run);
        }
    }

    interface Callable {

        // constructor(func, args: any[]) {
        //     this.func = func;
        // }

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

            if (this.func_preprocess_arg !== null) {
                val_return = this.func_postprocess_return_val.call(this, val_return);
            }

            if (this.func_post_return !== null) {
                this.func_post_return.call(this, val_return);
            }
            return val_return;
        }

        // get_note_index_at_beat(beat: number, notes: TreeModel.Node<n.Note>[]): number {
        //     let val =  _.findIndex(notes, (node)=>{
        //         // checking number against string
        //         return node.model.note.beat_start === beat
        //     });
        //     return val;
        // }
        //
        // get_leaves_within_interval(beat_start: number, beat_end: number): TreeModel.Node<n.Note>[] {
        //     let val =  this.leaves.filter((node) =>{
        //         return node.model.note.beat_start >= beat_start && node.model.note.get_beat_end() <= beat_end
        //     });
        //     return val;
        // }
    }
}