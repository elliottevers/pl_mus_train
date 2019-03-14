import {message} from "../message/messenger";

export namespace cli {

    import Messenger = message.Messenger;

    interface Runnable {
        get_command_exec();
        run();
    }

    abstract class Parameterized {
        flags: Flag[];
        options: Option[];
        args: Arg[];
        messenger: Messenger;

        // TODO: put counting logic here
        public b_primed(): boolean {
            return this.get_unset_parameters().length > 0;
        }

        public get_unset_parameters(): string[] {
            let unset_parameters: string[] = [];

            // flags
            for (let flag of this.flags) {
                if (!flag.b_set()) {
                    unset_parameters.push(flag.name)
                }
            }

            // options
            for (let option of this.options) {
                if (!option.b_set()) {
                    unset_parameters.push(option.name)
                }
            }

            // args
            for (let arg of this.args) {
                if (!arg.b_set()) {
                    unset_parameters.push(arg.name)
                }
            }

            return unset_parameters;
        }

        public get_arg(name_arg) {
            return this.args.filter((arg) => {
                return arg.name === name_arg;
            })[0];
        }

        public get_opt(name_opt) {
            return this.options.filter((opt) => {
                return opt.name === name_opt;
            })[0];
        }

        public get_flag(name_flag) {
            return this.flags.filter((flag) => {
                return flag.name === name_flag;
            })[0];
        }

        public get_run_parameters() {
            // let command_exec: string = this.get_command_exec();

            let argv: string[] = [];

            for (let flag of this.flags) {
                if (flag.b_set()) {
                    argv.push(flag.get_name_exec());
                }
            }

            // options
            for (let option of this.options) {
                if (option.b_set()) {
                    argv.push(option.get_name_exec());
                }
            }

            // args
            for (let arg of this.args) {
                if (arg.b_set()) {
                    argv.push(arg.get_name_exec());
                }
            }

            // return command_exec + ' ' + argv.join(' ');
            return argv.join(' ');
        }

        protected preprocess_shell(val) {
            return val.split(' ').join('\\\\ ');
        }

        protected preprocess_max(val) {
            return '\\"' + val + '\\"';
        }
    }

    export class Script extends Parameterized implements Runnable {

        interpreter: string;
        script: string;
        escape_paths: boolean;

        constructor(interpreter, script, flags, options, args, messenger?, escape_paths?: boolean) {
            super();
            this.interpreter = interpreter;
            this.script = script;
            this.flags = flags;
            this.options = options;
            this.args = args;
            this.messenger = messenger;
            // TODO: do better
            this.escape_paths = escape_paths;
        }

        public get_command_exec = () => {
            if (this.escape_paths) {
                return this.preprocess_max(this.preprocess_shell(this.interpreter) + ' ' + this.preprocess_shell(this.script));
            } else {
                return this.interpreter + ' ' + this.script;
            }
        };

        public run() {
            this.messenger.message(this.get_command_full());
        }


        public get_command_full = () => {
            let unset_params = this.get_unset_parameters();
            if (unset_params.length > 0) {
                throw 'unset parameters: ' + unset_params
            }
            let command_full = [this.get_command_exec()].concat(this.get_run_parameters().split(' '));
            return command_full
        };
    }

    export class Executable extends Parameterized implements Runnable {

        path: string;
        escape_paths: boolean;

        constructor(path, flags, options, args, messenger?, escape_paths?: boolean) {
            super();
            this.path = path;
            this.flags = flags;
            this.options = options;
            this.args = args;
            this.messenger = messenger;
            this.escape_paths = escape_paths;
        }

        public get_command_exec = () => {
            if (this.escape_paths) {
                return this.preprocess_max(this.preprocess_shell(this.path));
            } else {
                return this.path;
            }
        };

        public get_command_full = () => {
            let unset_params = this.get_unset_parameters();
            if (unset_params.length > 0) {
                throw 'unset parameters: ' + unset_params
            }
            let command_full = [this.get_command_exec()].concat(this.get_run_parameters().split(' '));
            return command_full
        };

        public run() {
            this.messenger.message(this.get_command_full());
        }
    }

    abstract class MaxShellParameter {
        needs_escaping_max: boolean;
        needs_escaping_max_shell: boolean;
        needs_escaping_shell: boolean;

        _preprocess_max(val): string {
            if (this.needs_escaping_max) {
                return '\\"' + val + '\\"';
            } else {
                return val;
            }
        }

        _preprocess_max_shell(val): string {
            if (this.needs_escaping_max_shell) {
                return val.split(' ').join('\\\\ ');

            } else {
                return val;
            }
        }

        _preprocess_shell(val): string {
            if (this.needs_escaping_shell) {
                return "\"" + val + "\"";

            } else {
                return val;
            }
        }

        _preprocess(val): string {
            if (this.needs_escaping_max && this.needs_escaping_max_shell) {
                // TODO: take care of this
                throw 'you better take care of this now'
            }
            if (this.needs_escaping_max) {
                return this._preprocess_max(val)
            }
            if (this.needs_escaping_max_shell) {
                return this._preprocess_max_shell(val)
            }
            if (this.needs_escaping_shell) {
                return this._preprocess_shell(val);
            }

            return val;
        }
    }

    export class Arg extends MaxShellParameter {
        name: string;
        val: string;

        constructor(name, needs_escaping_max?: boolean, needs_escaping_max_shell?: boolean, needs_escaping_shell?: boolean) {
            super();
            this.name = name;
            this.needs_escaping_max = needs_escaping_max;
            this.needs_escaping_max_shell = needs_escaping_max_shell;
        }

        public set(val) {
            this.val = val;
        }

        public get_name_exec() {
            return this._preprocess(this.val)
        }

        public b_set(): boolean {
            return this.val !== null
        }
    }

    export class Flag extends MaxShellParameter {
        name: string;
        val: boolean;

        constructor(name) {
            super();
            this.name = name;
        }

        public set(val) {
            this.val = val;
        }

        public get_name_exec() {
            return '-' + this.name
        }

        public b_set(): boolean {
            return this.val
        }
    }

    export class Option extends MaxShellParameter {
        name: string;
        val: string;
        num_dashes: number;

        constructor(name, needs_escaping_max?: boolean, needs_escaping_max_shell?: boolean, needs_escaping_shell?: boolean, num_dashes?: number) {
            super();
            this.name = name;
            this.needs_escaping_max = needs_escaping_max;
            this.needs_escaping_max_shell = needs_escaping_max_shell;
            this.needs_escaping_shell = needs_escaping_shell;
            this.num_dashes = num_dashes
        }

        public set(val) {
            this.val = val;
        }

        public get_name_exec() {
            return (this.num_dashes === 1 ? '-' : '--') + this.name + ' ' + this._preprocess(this.val)
        }

        public b_set(): boolean {
            return this.val !== null
        }
    }
}