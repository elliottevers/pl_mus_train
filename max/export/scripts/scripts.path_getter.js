(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live;
(function (live) {
    var LiveApiJs = /** @class */ (function () {
        function LiveApiJs(path) {
            this.live_api = new LiveAPI(null, path);
        }
        LiveApiJs.prototype.get = function (property) {
            return this.live_api.get(property);
        };
        LiveApiJs.prototype.set = function (property, value) {
            this.live_api.set(property, value);
        };
        LiveApiJs.prototype.call = function (func) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            return (_a = this.live_api).call.apply(_a, [func].concat(args));
        };
        LiveApiJs.prototype.get_id = function () {
            return this.live_api.id;
        };
        LiveApiJs.prototype.get_path = function () {
            return this.live_api.path;
        };
        LiveApiJs.prototype.get_children = function () {
            return this.live_api.children;
        };
        return LiveApiJs;
    }());
    live.LiveApiJs = LiveApiJs;
    var LiveClipVirtual = /** @class */ (function () {
        function LiveClipVirtual(notes) {
            this.notes = notes;
        }
        LiveClipVirtual.prototype.get_end_marker = function () {
            return this.notes[this.notes.length - 1].model.note.get_beat_end();
        };
        LiveClipVirtual.prototype.get_start_marker = function () {
            return this.notes[0].model.note.beat_start;
        };
        LiveClipVirtual.prototype.set_loop_bracket_lower = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.set_loop_bracket_upper = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.set_clip_endpoint_lower = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.set_clip_endpoint_upper = function (beat) {
            return;
        };
        LiveClipVirtual.prototype.fire = function () {
            return;
        };
        LiveClipVirtual.prototype.stop = function () {
            return;
        };
        LiveClipVirtual.prototype.get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            var prefix, notes, suffix;
            prefix = ["notes", this.notes.length.toString()];
            notes = [];
            for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
                var node = _a[_i];
                notes.push("note");
                notes.push(node.model.note.pitch.toString());
                notes.push(node.model.note.beat_start.toString());
                notes.push(node.model.note.beats_duration.toString());
                notes.push(node.model.note.velocity.toString());
                notes.push(node.model.note.muted.toString());
            }
            suffix = ["done"];
            return prefix.concat(notes).concat(suffix);
        };
        LiveClipVirtual.prototype.remove_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return;
        };
        return LiveClipVirtual;
    }());
    live.LiveClipVirtual = LiveClipVirtual;
})(live = exports.live || (exports.live = {}));

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
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var utils_1 = require("../utils/utils");
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var get_selected_track = function () {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view selected_track clip_slots 0');
    // let logger = new Logger(env);
    var path_live = clip_highlighted.get_path();
    var messenger = new Messenger(env, 0);
    messenger.message(utils_1.utils.PathLive.to_message(path_live));
    // logger.log(
    //     clip_highlighted.get_path().split(' ')
    // )
    // track_highlighted.get_children();
    // exporter.set_length(
    //     clip_highlighted.get("length")
    // );
};
if (typeof Global !== "undefined") {
    Global.path_getter = {};
    Global.path_getter.get_selected_track = get_selected_track;
}

},{"../live/live":1,"../message/messenger":2,"../utils/utils":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils;
(function (utils) {
    var PathLive = /** @class */ (function () {
        function PathLive() {
        }
        PathLive.to_message = function (path_live) {
            var message = [];
            for (var _i = 0, _a = path_live.split(' '); _i < _a.length; _i++) {
                var word = _a[_i];
                var cleansed = word.replace(/"/g, "");
                if (isNaN(Number(cleansed))) {
                    message.push(cleansed);
                }
                else {
                    message.push(Number(cleansed));
                }
            }
            return message;
        };
        return PathLive;
    }());
    utils.PathLive = PathLive;
})(utils = exports.utils || (exports.utils = {}));

},{}]},{},[3]);

var get_selected_track = Global.path_getter.get_selected_track;