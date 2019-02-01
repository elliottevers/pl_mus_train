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
    var Executable = /** @class */ (function () {
        function Executable(path, flags, options, args, messenger) {
            this.path = path;
            this.flags = flags;
            this.options = options;
            this.args = args;
            this.messenger = messenger;
        }
        // TODO: put counting logic here
        Executable.prototype.b_primed = function () {
            return this.get_unset_parameters().length > 0;
        };
        Executable.prototype.get_unset_parameters = function () {
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
        Executable.prototype.get_command_exec = function () {
            return this.path;
        };
        Executable.prototype.get_arg = function (name_arg) {
            return this.args.filter(function (arg) {
                return arg.name === name_arg;
            })[0];
        };
        Executable.prototype.get_opt = function (name_opt) {
            return this.options.filter(function (opt) {
                return opt.name === name_opt;
            })[0];
        };
        Executable.prototype.get_flag = function (name_flag) {
            return this.flags.filter(function (flag) {
                return flag.name === name_flag;
            })[0];
        };
        Executable.prototype.get_run_command = function () {
            var command_exec = this.get_command_exec();
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
            return command_exec + ' ' + argv.join(' ');
        };
        Executable.prototype.run = function () {
            var unset_params = this.get_unset_parameters();
            if (unset_params.length > 0) {
                throw 'unset parameters: ' + unset_params;
            }
            this.messenger.message(this.get_run_command().split(' '));
        };
        return Executable;
    }());
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
        MaxShellParameter.prototype._preprocess_shell = function (val) {
            if (this.needs_escaping_shell) {
                // val = val.split(' ').join('\\\\\\\\ ');
                // post(val);
                // return val;
                // return val.split(' ').join('\\\\\\\\ ');
                return val.split(' ').join('\\\\ ');
            }
            else {
                return val;
            }
        };
        MaxShellParameter.prototype._preprocess = function (val) {
            if (this.needs_escaping_max && this.needs_escaping_shell) {
                // TODO: take care of this
                throw 'you better take care of this now';
            }
            if (this.needs_escaping_max) {
                return this._preprocess_max(val);
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
        function Arg(name, needs_escaping_max, needs_escaping_shell) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.needs_escaping_max = needs_escaping_max;
            _this.needs_escaping_shell = needs_escaping_shell;
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
        function Option(name, needs_escaping_max, needs_escaping_shell) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.needs_escaping_max = needs_escaping_max;
            _this.needs_escaping_shell = needs_escaping_shell;
            return _this;
        }
        Option.prototype.set = function (val) {
            this.val = val;
        };
        Option.prototype.get_name_exec = function () {
            return '-' + this.name + ' ' + this._preprocess(this.val);
        };
        Option.prototype.b_set = function () {
            return this.val !== null;
        };
        return Option;
    }(MaxShellParameter));
    cli.Option = Option;
})(cli = exports.cli || (exports.cli = {}));
//# sourceMappingURL=cli.js.map