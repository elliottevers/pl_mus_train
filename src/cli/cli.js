"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cli;
(function (cli) {
    var Parameterized = /** @class */ (function () {
        function Parameterized() {
        }
        // TODO: put counting logic here
        Parameterized.prototype.b_primed = function () {
            return this.get_unset_parameters().length > 0;
        };
        Parameterized.prototype.get_unset_parameters = function () {
            var unset_parameters = [];
            // flags
            for (var _i = 0, _a = this.flags; _i < _a.length; _i++) {
                var flag = _a[_i];
                if (!flag.b_set()) {
                    unset_parameters.push(flag.name);
                }
            }
            // options
            for (var _b = 0, _c = this.options; _b < _c.length; _b++) {
                var option = _c[_b];
                if (!option.b_set()) {
                    unset_parameters.push(option.name);
                }
            }
            // args
            for (var _d = 0, _e = this.args; _d < _e.length; _d++) {
                var arg = _e[_d];
                if (!arg.b_set()) {
                    unset_parameters.push(arg.name);
                }
            }
            return unset_parameters;
        };
        // public get_command_exec(): string {
        //     return this.path;
        // }
        Parameterized.prototype.get_arg = function (name_arg) {
            return this.args.filter(function (arg) {
                return arg.name === name_arg;
            })[0];
        };
        Parameterized.prototype.get_opt = function (name_opt) {
            return this.options.filter(function (opt) {
                return opt.name === name_opt;
            })[0];
        };
        Parameterized.prototype.get_flag = function (name_flag) {
            return this.flags.filter(function (flag) {
                return flag.name === name_flag;
            })[0];
        };
        Parameterized.prototype.get_run_parameters = function () {
            // let command_exec: string = this.get_command_exec();
            var argv = [];
            for (var _i = 0, _a = this.flags; _i < _a.length; _i++) {
                var flag = _a[_i];
                if (flag.b_set()) {
                    argv.push(flag.get_name_exec());
                }
            }
            // options
            for (var _b = 0, _c = this.options; _b < _c.length; _b++) {
                var option = _c[_b];
                if (option.b_set()) {
                    argv.push(option.get_name_exec());
                }
            }
            // args
            for (var _d = 0, _e = this.args; _d < _e.length; _d++) {
                var arg = _e[_d];
                if (arg.b_set()) {
                    argv.push(arg.get_name_exec());
                }
            }
            // return command_exec + ' ' + argv.join(' ');
            return argv.join(' ');
        };
        Parameterized.prototype.preprocess_shell = function (val) {
            return val.split(' ').join('\\\\ ');
        };
        Parameterized.prototype.preprocess_max = function (val) {
            return '\\"' + val + '\\"';
        };
        return Parameterized;
    }());
    var Script = /** @class */ (function (_super) {
        __extends(Script, _super);
        // flags: Flag[];
        // options: Option[];
        // args: Arg[];
        // messenger: Messenger;
        function Script(interpreter, script, flags, options, args, messenger, escape_paths) {
            var _this = _super.call(this) || this;
            _this.get_command_exec = function () {
                if (_this.escape_paths) {
                    return _this.preprocess_max(_this.preprocess_shell(_this.interpreter) + ' ' + _this.preprocess_shell(_this.script));
                }
                else {
                    return _this.interpreter + ' ' + _this.script;
                }
            };
            _this.interpreter = interpreter;
            _this.script = script;
            _this.flags = flags;
            _this.options = options;
            _this.args = args;
            _this.messenger = messenger;
            // TODO: do better
            _this.escape_paths = escape_paths;
            return _this;
        }
        Script.prototype.run = function () {
            var unset_params = this.get_unset_parameters();
            if (unset_params.length > 0) {
                throw 'unset parameters: ' + unset_params;
            }
            var command_full = [this.get_command_exec()].concat(this.get_run_parameters().split(' '));
            this.messenger.message(command_full);
        };
        return Script;
    }(Parameterized));
    cli.Script = Script;
    var Executable = /** @class */ (function (_super) {
        __extends(Executable, _super);
        // flags: Flag[];
        // options: Option[];
        // args: Arg[];
        // messenger: Messenger;
        function Executable(path, flags, options, args, messenger, escape_paths) {
            var _this = _super.call(this) || this;
            _this.get_command_exec = function () {
                if (_this.escape_paths) {
                    return _this.preprocess_max(_this.preprocess_shell(_this.path));
                }
                else {
                    return _this.path;
                }
            };
            _this.get_command_full = function () {
                var unset_params = _this.get_unset_parameters();
                if (unset_params.length > 0) {
                    throw 'unset parameters: ' + unset_params;
                }
                var command_full = [_this.get_command_exec()].concat(_this.get_run_parameters().split(' '));
                return command_full;
            };
            _this.path = path;
            _this.flags = flags;
            _this.options = options;
            _this.args = args;
            _this.messenger = messenger;
            _this.escape_paths = escape_paths;
            return _this;
        }
        Executable.prototype.run = function () {
            this.messenger.message(this.get_command_full());
        };
        return Executable;
    }(Parameterized));
    cli.Executable = Executable;
    var MaxShellParameter = /** @class */ (function () {
        function MaxShellParameter() {
        }
        MaxShellParameter.prototype._preprocess_max = function (val) {
            if (this.needs_escaping_max) {
                return '\\"' + val + '\\"';
            }
            else {
                return val;
            }
        };
        MaxShellParameter.prototype._preprocess_max_shell = function (val) {
            if (this.needs_escaping_max_shell) {
                return val.split(' ').join('\\\\ ');
            }
            else {
                return val;
            }
        };
        MaxShellParameter.prototype._preprocess_shell = function (val) {
            if (this.needs_escaping_shell) {
                return "\"" + val + "\"";
            }
            else {
                return val;
            }
        };
        MaxShellParameter.prototype._preprocess = function (val) {
            if (this.needs_escaping_max && this.needs_escaping_max_shell) {
                // TODO: take care of this
                throw 'you better take care of this now';
            }
            if (this.needs_escaping_max) {
                return this._preprocess_max(val);
            }
            if (this.needs_escaping_max_shell) {
                return this._preprocess_max_shell(val);
            }
            if (this.needs_escaping_shell) {
                return this._preprocess_shell(val);
            }
            return val;
        };
        return MaxShellParameter;
    }());
    var Arg = /** @class */ (function (_super) {
        __extends(Arg, _super);
        function Arg(name, needs_escaping_max, needs_escaping_max_shell, needs_escaping_shell) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.needs_escaping_max = needs_escaping_max;
            _this.needs_escaping_max_shell = needs_escaping_max_shell;
            return _this;
        }
        Arg.prototype.set = function (val) {
            this.val = val;
        };
        Arg.prototype.get_name_exec = function () {
            return this._preprocess(this.val);
        };
        // public get_name_exec() {
        //     return '-' + this.name + ' ' + this._preprocess(this.val)
        // }
        Arg.prototype.b_set = function () {
            return this.val !== null;
        };
        return Arg;
    }(MaxShellParameter));
    cli.Arg = Arg;
    var Flag = /** @class */ (function (_super) {
        __extends(Flag, _super);
        function Flag(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            return _this;
        }
        Flag.prototype.set = function (val) {
            this.val = val;
        };
        Flag.prototype.get_name_exec = function () {
            return '-' + this.name;
        };
        Flag.prototype.b_set = function () {
            return this.val;
        };
        return Flag;
    }(MaxShellParameter));
    cli.Flag = Flag;
    var Option = /** @class */ (function (_super) {
        __extends(Option, _super);
        function Option(name, needs_escaping_max, needs_escaping_max_shell, needs_escaping_shell, num_dashes) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.needs_escaping_max = needs_escaping_max;
            _this.needs_escaping_max_shell = needs_escaping_max_shell;
            _this.needs_escaping_shell = needs_escaping_shell;
            _this.num_dashes = num_dashes;
            return _this;
        }
        Option.prototype.set = function (val) {
            this.val = val;
        };
        Option.prototype.get_name_exec = function () {
            return (this.num_dashes === 1 ? '-' : '--') + this.name + ' ' + this._preprocess(this.val);
        };
        Option.prototype.b_set = function () {
            return this.val !== null;
        };
        return Option;
    }(MaxShellParameter));
    cli.Option = Option;
})(cli = exports.cli || (exports.cli = {}));
//# sourceMappingURL=cli.js.map