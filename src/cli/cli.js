"use strict";
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
            this.messenger.message(this.get_run_command().split(' '));
        };
        return Executable;
    }());
    cli.Executable = Executable;
    var Arg = /** @class */ (function () {
        function Arg(name) {
            this.name = name;
        }
        Arg.prototype.set = function (val) {
            this.val = val;
        };
        Arg.prototype.get_name_exec = function () {
            return this.val;
        };
        Arg.prototype.b_set = function () {
            return this.val !== null;
        };
        return Arg;
    }());
    cli.Arg = Arg;
    var Flag = /** @class */ (function () {
        function Flag(name) {
            this.name = name;
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
    }());
    cli.Flag = Flag;
    var Option = /** @class */ (function () {
        function Option(name, needs_escaping) {
            this.name = name;
            this.needs_escaping = needs_escaping;
        }
        Option.prototype.set = function (val) {
            this.val = val;
        };
        Option.prototype._preprocess = function (val) {
            if (this.needs_escaping) {
            }
        };
        Option.prototype.get_name_exec = function () {
            return '-' + this.name + ' ' + this._preprocess(this.val);
        };
        Option.prototype.b_set = function () {
            return this.val !== null;
        };
        return Option;
    }());
    cli.Option = Option;
})(cli = exports.cli || (exports.cli = {}));
//# sourceMappingURL=cli.js.map