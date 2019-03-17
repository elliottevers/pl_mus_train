(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var logger_1 = require("../log/logger");
var utils_1 = require("../utils/utils");
var clip;
(function (clip) {
    var Logger = logger_1.log.Logger;
    var Clip = /** @class */ (function () {
        function Clip(clip_dao) {
            this.clip_dao = clip_dao;
            this.logger = new Logger('max');
        }
        Clip.prototype.set_endpoints_loop = function (beat_start, beat_end) {
            if (beat_start >= this.clip_dao.get_loop_bracket_upper()) {
                this.clip_dao.set_loop_bracket_upper(beat_end);
                this.clip_dao.set_loop_bracket_lower(beat_start);
            }
            else {
                this.clip_dao.set_loop_bracket_lower(beat_start);
                this.clip_dao.set_loop_bracket_upper(beat_end);
            }
        };
        Clip.prototype.get_beat_start = function () {
            return this.clip_dao.beat_start;
        };
        Clip.prototype.get_beat_end = function () {
            return this.clip_dao.beat_end;
        };
        Clip.prototype.get_path = function () {
            return this.clip_dao.get_path();
        };
        Clip.prototype.set_path_deferlow = function (key_route) {
            this.clip_dao.set_path_deferlow(key_route, this.get_path());
        };
        Clip.prototype.get_num_measures = function () {
            return (this.get_end_marker() - this.get_start_marker()) / 4;
        };
        Clip.prototype.get_end_marker = function () {
            return this.clip_dao.get_end_marker();
        };
        Clip.prototype.get_start_marker = function () {
            return this.clip_dao.get_start_marker();
        };
        // TODO: annotations
        Clip.prototype.load_notes_within_loop_brackets = function () {
            this.notes = this.get_notes(this.get_loop_bracket_lower(), 0, this.get_loop_bracket_upper(), 128);
        };
        // TODO: annotations
        Clip.prototype.load_notes_within_markers = function () {
            this.notes = this.get_notes(this.get_start_marker(), 0, this.get_end_marker(), 128);
        };
        // TODO: annotations
        Clip.prototype.get_pitch_max = function (interval) {
            var pitch_max = 0;
            var interval_search = interval ? interval : [this.get_loop_bracket_lower(), this.get_loop_bracket_upper()];
            for (var _i = 0, _a = this.get_notes(interval_search[0], 0, interval_search[1], 128); _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.model.note.pitch > pitch_max) {
                    pitch_max = node.model.note.pitch;
                }
            }
            return pitch_max;
        };
        // TODO: annotations
        Clip.prototype.get_pitch_min = function (interval) {
            var pitch_min = 128;
            var interval_search = interval ? interval : [this.get_loop_bracket_lower(), this.get_loop_bracket_upper()];
            for (var _i = 0, _a = this.get_notes(interval_search[0], 0, interval_search[1], 128); _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.model.note.pitch < pitch_min) {
                    pitch_min = node.model.note.pitch;
                }
            }
            return pitch_min;
        };
        Clip.prototype.get_ambitus = function (interval) {
            return [this.get_pitch_min(interval), this.get_pitch_max(interval)];
        };
        Clip.prototype.set_loop_bracket_lower = function (beat) {
            this.clip_dao.set_loop_bracket_lower(beat);
        };
        Clip.prototype.set_loop_bracket_upper = function (beat) {
            this.clip_dao.set_loop_bracket_upper(beat);
        };
        Clip.prototype.get_loop_bracket_lower = function () {
            return this.clip_dao.get_loop_bracket_lower()[0];
        };
        Clip.prototype.get_loop_bracket_upper = function () {
            return this.clip_dao.get_loop_bracket_upper()[0];
        };
        Clip.prototype.set_clip_endpoint_lower = function (beat) {
            this.clip_dao.set_clip_endpoint_lower(beat);
        };
        Clip.prototype.set_clip_endpoint_upper = function (beat) {
            this.clip_dao.set_clip_endpoint_upper(beat);
        };
        Clip.prototype.fire = function () {
            this.clip_dao.fire();
        };
        Clip.prototype.stop = function () {
            this.clip_dao.stop();
        };
        Clip.prototype.get_notes_within_markers = function (use_cache) {
            if (!this.notes || !use_cache) {
                this.load_notes_within_markers();
            }
            return this.notes;
        };
        Clip.prototype.get_notes_within_loop_brackets = function (use_cache) {
            if (!this.notes || !use_cache) {
                this.load_notes_within_loop_brackets();
            }
            return this.notes;
        };
        // TODO: only works virtual clips currently
        Clip.prototype.append = function (note) {
            this.clip_dao.append(note);
        };
        Clip.prototype.get_notes = function (beat_start, pitch_midi_min, beat_duration, pitch_midi_max) {
            return Clip._parse_notes(this._get_notes(beat_start, pitch_midi_min, beat_duration, pitch_midi_max));
        };
        Clip.prototype.set_notes = function (notes) {
            this.clip_dao.set_notes(notes);
        };
        // TODO: *actually* make private
        Clip.prototype._get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return this.clip_dao.get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max);
        };
        Clip.prototype.remove_notes = function (beat_start, pitch_midi_min, beat_duration, pitch_midi_max) {
            var epsilon = 1 / (48 * 2);
            this.clip_dao.remove_notes(beat_start - epsilon, pitch_midi_min, beat_duration, pitch_midi_max);
        };
        Clip.parse_note_messages = function (messages) {
            var notes = [];
            for (var i_mess in messages) {
                if (i_mess == String(0)) {
                    continue;
                }
                if (i_mess == String(messages.length - 1)) {
                    continue;
                }
                var tree = new TreeModel();
                var splitted = messages[i_mess].split(' ');
                notes.push(tree.parse({
                    id: -1,
                    note: new note_1.note.Note(Number(splitted[0]), Number(splitted[1]), Number(splitted[2]), Number(splitted[3]), Number(splitted[4])),
                    children: []
                }));
            }
            return notes;
        };
        // TODO: remove underscore prefix
        Clip._parse_notes = function (notes) {
            var data = [];
            var notes_parsed = [];
            var pitch;
            var beat_start;
            var beats_duration;
            var velocity;
            var b_muted;
            var index_num_expected_notes = null;
            for (var i = 0; i < notes.length; i++) {
                if (notes[i] === 'done') {
                    continue;
                }
                if (notes[i] === 'note') {
                    data = [];
                    continue;
                }
                if (notes[i] === 'notes') {
                    data = [];
                    continue;
                }
                if (i === index_num_expected_notes) {
                    data = [];
                    continue;
                }
                data.push(notes[i]);
                if (data.length === 5) {
                    pitch = data[0];
                    beat_start = data[1];
                    beats_duration = data[2];
                    velocity = data[3];
                    b_muted = data[4];
                    var tree = new TreeModel();
                    notes_parsed.push(tree.parse({
                        id: -1,
                        note: new note_1.note.Note(pitch, beat_start, beats_duration, velocity, b_muted),
                        children: []
                    }));
                }
            }
            function compare(note_former, note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }
            notes_parsed.sort(compare);
            // TODO: fail gracefully
            // if (notes_parsed.length !== num_expected_notes) {
            //     throw "notes retrieved from clip less than expected"
            // }
            return notes_parsed;
        };
        return Clip;
    }());
    clip.Clip = Clip;
    var ClipDao = /** @class */ (function () {
        function ClipDao(clip_live, messenger, deferlow, key_route, env) {
            this.clip_live = clip_live;
            this.messenger = messenger;
            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
            this.env = env;
        }
        ClipDao.prototype.set_path_deferlow = function (key_route_override, path_live) {
            var mess = [key_route_override];
            for (var _i = 0, _a = utils_1.utils.PathLive.to_message(path_live); _i < _a.length; _i++) {
                var word = _a[_i];
                mess.push(word);
            }
            this.messenger.message(mess);
        };
        // TODO: check if these actually return arrays
        ClipDao.prototype.get_end_marker = function () {
            return this.clip_live.get('end_marker')[0];
        };
        // TODO: check if these actually return arrays
        ClipDao.prototype.get_start_marker = function () {
            return this.clip_live.get('start_marker')[0];
        };
        ClipDao.prototype.get_path = function () {
            return this.clip_live.get_path();
        };
        ClipDao.prototype.set_loop_bracket_lower = function (beat) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "loop_start", beat]);
            }
            else {
                this.clip_live.set('loop_start', beat);
            }
        };
        ClipDao.prototype.set_loop_bracket_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "loop_end", beat]);
            }
            else {
                this.clip_live.set('loop_end', beat);
            }
        };
        ClipDao.prototype.get_loop_bracket_lower = function () {
            return this.clip_live.get('loop_start');
        };
        ClipDao.prototype.get_loop_bracket_upper = function () {
            return this.clip_live.get('loop_end');
        };
        ClipDao.prototype.set_clip_endpoint_lower = function (beat) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "start_marker", beat]);
            }
            else {
                this.clip_live.set('start_marker', beat);
            }
        };
        ClipDao.prototype.set_clip_endpoint_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "end_marker", beat]);
            }
            else {
                this.clip_live.set('end_marker', beat);
            }
        };
        ClipDao.prototype.fire = function () {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "call", "fire"]);
            }
            else {
                this.clip_live.call('fire');
            }
        };
        ;
        ClipDao.prototype.stop = function () {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "call", "stop"]);
            }
            else {
                this.clip_live.call('stop');
            }
        };
        ;
        ClipDao.prototype.get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            if (this.env === 'node_for_max') {
                return this.notes_cached;
            }
            else {
                return this.clip_live.call('get_notes', beat_start, pitch_midi_min, beat_end, pitch_midi_max);
            }
        };
        ;
        ClipDao.prototype.remove_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            if (this.deferlow) {
                this.messenger.message([
                    this.key_route,
                    "call",
                    "remove_notes",
                    beat_start,
                    pitch_midi_min,
                    beat_end,
                    pitch_midi_max
                ]);
            }
            else {
                this.clip_live.call('remove_notes', beat_start, pitch_midi_min, beat_end, pitch_midi_max);
            }
        };
        ;
        ClipDao.prototype.set_notes = function (notes) {
            if (this.env === 'node_for_max') {
                var notes_cached = [];
                notes_cached.push('notes');
                notes_cached.push(notes.length.toString());
                for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
                    var note = notes_1[_i];
                    notes_cached.push(note.model.note.pitch.toString());
                    notes_cached.push(note.model.note.beat_start.toString());
                    notes_cached.push(note.model.note.beats_duration.toString());
                    notes_cached.push(note.model.note.velocity.toString());
                    notes_cached.push(note.model.note.muted.toString());
                }
                notes_cached.push('done');
            }
            else if (this.deferlow) {
                this.messenger.message([this.key_route, 'call', 'set_notes']);
                this.messenger.message([this.key_route, 'call', 'notes', notes.length]);
                for (var _a = 0, notes_2 = notes; _a < notes_2.length; _a++) {
                    var node = notes_2[_a];
                    this.messenger.message([
                        this.key_route,
                        'call',
                        'note',
                        node.model.note.pitch,
                        node.model.note.beat_start.toFixed(4),
                        node.model.note.beats_duration.toFixed(4),
                        node.model.note.velocity,
                        node.model.note.muted
                    ]);
                }
                this.messenger.message([this.key_route, 'call', 'done']);
            }
            else {
                this.clip_live.call('set_notes');
                this.clip_live.call('notes', notes.length);
                for (var _b = 0, notes_3 = notes; _b < notes_3.length; _b++) {
                    var node = notes_3[_b];
                    this.clip_live.call("note", node.model.note.pitch, node.model.note.beat_start.toFixed(4), node.model.note.beats_duration.toFixed(4), node.model.note.velocity, node.model.note.muted);
                }
                this.clip_live.call("done");
            }
        };
        return ClipDao;
    }());
    clip.ClipDao = ClipDao;
})(clip = exports.clip || (exports.clip = {}));

},{"../log/logger":3,"../note/note":5,"../utils/utils":7,"tree-model":10}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("../clip/clip");
var live;
(function (live) {
    var Clip = clip_1.clip.Clip;
    var LiveApiJs = /** @class */ (function () {
        function LiveApiJs(path, env) {
            if (env == 'node') {
            }
            else {
                this.live_api = new LiveAPI(null, path);
            }
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
        // load_notes_within_loop_brackets(): void {
        //     this.notes = this.get_notes(
        //         this.get_loop_bracket_lower(),
        //         0,
        //         this.get_loop_bracket_upper(),
        //         128
        //     )
        // }
        LiveClipVirtual.prototype.append = function (note) {
            var test = this.notes;
            test.push(note);
            this.notes = test;
        };
        LiveClipVirtual.prototype.get_ambitus = function () {
            return [];
        };
        LiveClipVirtual.prototype.load_notes_within_loop_brackets = function () {
            this.notes = Clip._parse_notes(this.get_notes(this.get_loop_bracket_lower()[0], 0, this.get_loop_bracket_upper()[0], 128));
        };
        LiveClipVirtual.prototype.get_notes_within_loop_brackets = function (use_cache) {
            if (!this.notes || !use_cache) {
                this.load_notes_within_loop_brackets();
            }
            return this.notes;
        };
        LiveClipVirtual.prototype.get_pitch_max = function () {
            var pitch_max = 0;
            for (var _i = 0, _a = this.get_notes_within_loop_brackets(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.model.note.pitch > pitch_max) {
                    pitch_max = node.model.note.pitch;
                }
            }
            return pitch_max;
        };
        LiveClipVirtual.prototype.get_end_marker = function () {
            return this.beat_end;
            // return this.notes[this.notes.length - 1].model.note.get_beat_end()
        };
        LiveClipVirtual.prototype.get_start_marker = function () {
            return this.beat_start;
            // return this.notes[0].model.note.beat_start;
        };
        LiveClipVirtual.prototype.get_loop_bracket_upper = function () {
            return [this.beat_end];
            // return this.notes[this.notes.length - 1].model.note.get_beat_end()
        };
        LiveClipVirtual.prototype.get_loop_bracket_lower = function () {
            return [this.beat_start];
            // return this.notes[0].model.note.beat_start;
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
        LiveClipVirtual.prototype.set_notes = function (notes) {
            for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
                var note = notes_1[_i];
                this.notes.push(note);
            }
        };
        LiveClipVirtual.prototype.get_notes = function (beat_start, pitch_midi_min, beats_duration, pitch_midi_max) {
            var prefix, notes, suffix;
            prefix = ["notes", this.notes.length.toString()];
            notes = [];
            for (var _i = 0, _a = this.notes.filter(function (node) { return beat_start <= node.model.note.beat_start && node.model.note.beat_start < beat_start + beats_duration; }); _i < _a.length; _i++) {
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

},{"../clip/clip":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log;
(function (log) {
    var Logger = /** @class */ (function () {
        function Logger(env) {
            this.env = env;
        }
        Logger.log_max_static = function (message) {
            for (var i = 0, len = arguments.length; i < len; i++) {
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    post(s);
                }
                else if (message === null) {
                    post("<null>");
                }
                else {
                    post(message);
                }
            }
            post("\n");
        };
        Logger.prototype.log = function (message) {
            if (this.env === 'max') {
                this.log_max(message);
            }
            else if (this.env === 'node') {
                this.log_node(message);
            }
            else {
                post('env: ' + this.env);
                post('\n');
                throw 'environment invalid';
            }
        };
        // TODO: make static
        Logger.prototype.log_max = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0, len = arguments.length; i < len; i++) {
                var message = arguments[i];
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    post(s);
                }
                else if (message === null) {
                    post("<null>");
                }
                else {
                    post(message);
                }
            }
            post("\n");
        };
        // TODO: make static
        Logger.prototype.log_node = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0, len = arguments.length; i < len; i++) {
                var message = arguments[i];
                if (message && message.toString) {
                    var s = message.toString();
                    if (s.indexOf("[object ") >= 0) {
                        s = JSON.stringify(message);
                    }
                    console.log(s);
                }
                else if (message === null) {
                    console.log("<null>");
                }
                else {
                    console.log(message);
                }
            }
            console.log("\n");
        };
        return Logger;
    }());
    log.Logger = Logger;
})(log = exports.log || (exports.log = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message;
(function (message_1) {
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
            switch (this.env) {
                case 'max': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_max(message);
                    break;
                }
                case 'node': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_node(message);
                    break;
                }
                case 'node_for_max': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_node_for_max(message);
                    break;
                }
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
        Messenger.prototype.message_node_for_max = function (message) {
            // const Max = require('max-api');
            // Max.outlet(message);
        };
        return Messenger;
    }());
    message_1.Messenger = Messenger;
})(message = exports.message || (exports.message = {}));

},{}],5:[function(require,module,exports){
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
var TreeModel = require("tree-model");
var note;
(function (note_1) {
    var Note = /** @class */ (function () {
        function Note(pitch, beat_start, beats_duration, velocity, muted) {
            this.pitch = Number(pitch);
            this.beat_start = Number(beat_start);
            this.beats_duration = Number(beats_duration);
            this.velocity = Number(velocity);
            this.muted = Number(muted);
            this._b_has_chosen = false;
        }
        Note.get_overlap_beats = function (beat_start_former, beat_end_former, beat_start_latter, beat_end_latter) {
            var a = beat_start_former, b = beat_end_former, c = beat_start_latter, d = beat_end_latter;
            var former_starts_before_latter = (a <= c);
            var former_ends_before_latter = (b <= d);
            // TODO: check logic
            if (former_starts_before_latter && former_ends_before_latter) {
                return b - c;
            }
            else if (former_starts_before_latter && !former_ends_before_latter) {
                return a - c;
            }
            else if (!former_starts_before_latter && !former_ends_before_latter) {
                return 0;
            }
            else if (!former_starts_before_latter && former_ends_before_latter) {
                return b - a;
            }
            throw 'case not considered';
        };
        Note.prototype.encode = function () {
            return this.to_array().join(' ');
        };
        Note.from_note_renderable = function (note) {
            var tree = new TreeModel();
            return tree.parse({
                id: -1,
                note: new Note(note.model.note.pitch, note.model.note.beat_start, note.model.note.beats_duration, note.model.note.velocity, note.model.note.muted),
                children: []
            });
        };
        Note.prototype.to_array = function () {
            return [this.pitch, this.beat_start, this.beats_duration, this.velocity, this.muted];
        };
        Note.prototype.get_beat_end = function () {
            return this.beat_start + this.beats_duration;
        };
        Note.prototype.get_interval_beats = function () {
            return [this.beat_start, this.get_beat_end()];
        };
        // TODO: add type of argument and return value
        Note.prototype.get_best_candidate = function (list_candidate_note) {
            var beats_overlap, beats_max_overlap, list_candidate_note_max_overlap;
            list_candidate_note_max_overlap = [];
            beats_max_overlap = 0;
            for (var _i = 0, list_candidate_note_1 = list_candidate_note; _i < list_candidate_note_1.length; _i++) {
                var candidate_note = list_candidate_note_1[_i];
                beats_overlap = Note.get_overlap_beats(this.beat_start, this.beat_start + this.beats_duration, candidate_note.model.note.beat_start, candidate_note.model.note.beat_start + candidate_note.model.note.beats_duration);
                if (beats_overlap > beats_max_overlap) {
                    beats_max_overlap = beats_overlap;
                    list_candidate_note_max_overlap = [];
                }
                if (beats_overlap === beats_max_overlap) {
                    list_candidate_note_max_overlap.push(candidate_note);
                }
            }
            function compare(note_former, note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }
            list_candidate_note_max_overlap.sort(compare);
            return list_candidate_note_max_overlap[0];
        };
        Note.prototype.choose = function () {
            if (!this._b_has_chosen) {
                // tree.children[0].appendChild(left_left).appendChild(left_right);
                // note_parent.addChild(this);
                this._b_has_chosen = true;
                return true;
            }
            else {
                return false;
            }
        };
        return Note;
    }());
    note_1.Note = Note;
    var NoteRenderable = /** @class */ (function (_super) {
        __extends(NoteRenderable, _super);
        function NoteRenderable(pitch, beat_start, beats_duration, velocity, muted, coordinates_matrix) {
            var _this = _super.call(this, pitch, beat_start, beats_duration, velocity, muted) || this;
            _this.coordinates_matrix = coordinates_matrix;
            return _this;
        }
        NoteRenderable.prototype.get_coordinates_matrix = function () {
            return this.coordinates_matrix;
        };
        NoteRenderable.from_note = function (note, coord) {
            var tree = new TreeModel();
            return tree.parse({
                id: -1,
                note: new NoteRenderable(note.model.note.pitch, note.model.note.beat_start, note.model.note.beats_duration, note.model.note.velocity, note.model.note.muted, coord),
                children: []
            });
        };
        return NoteRenderable;
    }(Note));
    note_1.NoteRenderable = NoteRenderable;
    var NoteIterator = /** @class */ (function () {
        function NoteIterator(notes, direction_forward) {
            this.notes = notes;
            this.direction_forward = direction_forward;
            this.i = -1;
        }
        // TODO: type declarations
        NoteIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'note iterator < 0';
            }
            if (this.i < this.notes.length) {
                return {
                    value: this.notes[this.i],
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
        NoteIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.notes[this.i];
            }
            else {
                return null;
            }
        };
        return NoteIterator;
    }());
    note_1.NoteIterator = NoteIterator;
})(note = exports.note || (exports.note = {}));

},{"tree-model":10}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var Clip = clip_1.clip.Clip;
var ClipDao = clip_1.clip.ClipDao;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// let messenger_beat_start = new Messenger(env, 0, 'beat_start');
//
// let messenger_beat_end = new Messenger(env, 0, 'beat_end');
//
// let messenger_length_beats = new Messenger(env, 0, 'length-beats');
//
// let messenger_run = new Messenger(env, 0, 'run');
var messenger = new Messenger(env, 0);
var extract_beatmap_manual = function () {
    var clip_audio_warped = new Clip(new ClipDao(new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip'), new Messenger(env, 0)));
    var beat_start_marker = clip_audio_warped.get_start_marker();
    var beat_end_marker = clip_audio_warped.get_end_marker();
    var loop_bracket_lower = clip_audio_warped.get_loop_bracket_lower();
    var loop_bracket_upper = clip_audio_warped.get_loop_bracket_upper();
    var length_beats = (clip_audio_warped.get_end_marker() - clip_audio_warped.get_start_marker());
    messenger.message(['beat_start_marker', beat_start_marker]);
    messenger.message(['beat_end_marker', beat_end_marker]);
    messenger.message(['loop_bracket_lower', loop_bracket_lower]);
    messenger.message(['loop_bracket_upper', loop_bracket_upper]);
    messenger.message(['length-beats', length_beats]);
    messenger.message(['run']);
};
var test = function () {
};
if (typeof Global !== "undefined") {
    Global.extract_beatmap = {};
    Global.extract_beatmap.extract_beatmap_manual = extract_beatmap_manual;
}

},{"../clip/clip":1,"../live/live":2,"../message/messenger":4}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils;
(function (utils) {
    var PathLive = /** @class */ (function () {
        function PathLive() {
        }
        // pre-sending message
        PathLive.to_vector = function (path_live) {
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
        PathLive.to_message = function (path_live) {
            return PathLive.to_vector(path_live);
        };
        // parsing sent message
        PathLive.to_string = function (vector_path_live) {
            return PathLive.to_message(vector_path_live.join(' ')).join(' ');
        };
        return PathLive;
    }());
    utils.PathLive = PathLive;
    utils.remainder = function (top, bottom) {
        return ((top % bottom) + bottom) % bottom;
    };
    utils.division_int = function (top, bottom) {
        return Math.floor(top / bottom);
    };
    utils.path_clip_from_list_path_device = function (list_path_device) {
        // list_path_device.shift();
        list_path_device[list_path_device.length - 2] = 'clip_slots';
        list_path_device.push('clip');
        var path_clip = list_path_device.join(' ');
        return path_clip;
    };
    var Set = /** @class */ (function () {
        function Set(items) {
            this.addItem = function (value) {
                this._data[value] = true;
                return this;
            };
            this.removeItem = function (value) {
                delete this._data[value];
                return this;
            };
            this.addItems = function (values) {
                for (var i = 0; i < values.length; i++) {
                    this.addItem(values[i]);
                }
                return this;
            };
            this.removeItems = function (values) {
                for (var i = 0; i < values.length; i++) {
                    this.removeItem(values[i]);
                }
                return this;
            };
            this.contains = function (value) {
                return !!this._data[value];
            };
            this.reset = function () {
                this._data = {};
                return this;
            };
            this.data = function () {
                return Object.keys(this._data);
            };
            this.each = function (callback) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    callback(data[i]);
                }
            };
            this._data = {};
            this.addItems(items);
        }
        return Set;
    }());
    utils.Set = Set;
})(utils = exports.utils || (exports.utils = {}));

},{}],8:[function(require,module,exports){
module.exports = (function () {
  'use strict';

  /**
   * Find the index to insert an element in array keeping the sort order.
   *
   * @param {function} comparatorFn The comparator function which sorted the array.
   * @param {array} arr The sorted array.
   * @param {object} el The element to insert.
   */
  function findInsertIndex(comparatorFn, arr, el) {
    var i, len;
    for (i = 0, len = arr.length; i < len; i++) {
      if (comparatorFn(arr[i], el) > 0) {
        break;
      }
    }
    return i;
  }

  return findInsertIndex;
})();

},{}],9:[function(require,module,exports){
module.exports = (function () {
  'use strict';

  /**
   * Sort an array using the merge sort algorithm.
   *
   * @param {function} comparatorFn The comparator function.
   * @param {array} arr The array to sort.
   * @returns {array} The sorted array.
   */
  function mergeSort(comparatorFn, arr) {
    var len = arr.length, firstHalf, secondHalf;
    if (len >= 2) {
      firstHalf = arr.slice(0, len / 2);
      secondHalf = arr.slice(len / 2, len);
      return merge(comparatorFn, mergeSort(comparatorFn, firstHalf), mergeSort(comparatorFn, secondHalf));
    } else {
      return arr.slice();
    }
  }

  /**
   * The merge part of the merge sort algorithm.
   *
   * @param {function} comparatorFn The comparator function.
   * @param {array} arr1 The first sorted array.
   * @param {array} arr2 The second sorted array.
   * @returns {array} The merged and sorted array.
   */
  function merge(comparatorFn, arr1, arr2) {
    var result = [], left1 = arr1.length, left2 = arr2.length;
    while (left1 > 0 && left2 > 0) {
      if (comparatorFn(arr1[0], arr2[0]) <= 0) {
        result.push(arr1.shift());
        left1--;
      } else {
        result.push(arr2.shift());
        left2--;
      }
    }
    if (left1 > 0) {
      result.push.apply(result, arr1);
    } else {
      result.push.apply(result, arr2);
    }
    return result;
  }

  return mergeSort;
})();

},{}],10:[function(require,module,exports){
var mergeSort, findInsertIndex;
mergeSort = require('mergesort');
findInsertIndex = require('find-insert-index');

module.exports = (function () {
  'use strict';

  var walkStrategies;

  walkStrategies = {};

  function k(result) {
    return function () {
      return result;
    };
  }

  function TreeModel(config) {
    config = config || {};
    this.config = config;
    this.config.childrenPropertyName = config.childrenPropertyName || 'children';
    this.config.modelComparatorFn = config.modelComparatorFn;
  }

  function addChildToNode(node, child) {
    child.parent = node;
    node.children.push(child);
    return child;
  }

  function Node(config, model) {
    this.config = config;
    this.model = model;
    this.children = [];
  }

  TreeModel.prototype.parse = function (model) {
    var i, childCount, node;

    if (!(model instanceof Object)) {
      throw new TypeError('Model must be of type object.');
    }

    node = new Node(this.config, model);
    if (model[this.config.childrenPropertyName] instanceof Array) {
      if (this.config.modelComparatorFn) {
        model[this.config.childrenPropertyName] = mergeSort(
          this.config.modelComparatorFn,
          model[this.config.childrenPropertyName]);
      }
      for (i = 0, childCount = model[this.config.childrenPropertyName].length; i < childCount; i++) {
        addChildToNode(node, this.parse(model[this.config.childrenPropertyName][i]));
      }
    }
    return node;
  };

  function hasComparatorFunction(node) {
    return typeof node.config.modelComparatorFn === 'function';
  }

  Node.prototype.isRoot = function () {
    return this.parent === undefined;
  };

  Node.prototype.hasChildren = function () {
    return this.children.length > 0;
  };

  function addChild(self, child, insertIndex) {
    var index;

    if (!(child instanceof Node)) {
      throw new TypeError('Child must be of type Node.');
    }

    child.parent = self;
    if (!(self.model[self.config.childrenPropertyName] instanceof Array)) {
      self.model[self.config.childrenPropertyName] = [];
    }

    if (hasComparatorFunction(self)) {
      // Find the index to insert the child
      index = findInsertIndex(
        self.config.modelComparatorFn,
        self.model[self.config.childrenPropertyName],
        child.model);

      // Add to the model children
      self.model[self.config.childrenPropertyName].splice(index, 0, child.model);

      // Add to the node children
      self.children.splice(index, 0, child);
    } else {
      if (insertIndex === undefined) {
        self.model[self.config.childrenPropertyName].push(child.model);
        self.children.push(child);
      } else {
        if (insertIndex < 0 || insertIndex > self.children.length) {
          throw new Error('Invalid index.');
        }
        self.model[self.config.childrenPropertyName].splice(insertIndex, 0, child.model);
        self.children.splice(insertIndex, 0, child);
      }
    }
    return child;
  }

  Node.prototype.addChild = function (child) {
    return addChild(this, child);
  };

  Node.prototype.addChildAtIndex = function (child, index) {
    if (hasComparatorFunction(this)) {
      throw new Error('Cannot add child at index when using a comparator function.');
    }

    return addChild(this, child, index);
  };

  Node.prototype.setIndex = function (index) {
    if (hasComparatorFunction(this)) {
      throw new Error('Cannot set node index when using a comparator function.');
    }

    if (this.isRoot()) {
      if (index === 0) {
        return this;
      }
      throw new Error('Invalid index.');
    }

    if (index < 0 || index >= this.parent.children.length) {
      throw new Error('Invalid index.');
    }

    var oldIndex = this.parent.children.indexOf(this);

    this.parent.children.splice(index, 0, this.parent.children.splice(oldIndex, 1)[0]);

    this.parent.model[this.parent.config.childrenPropertyName]
      .splice(index, 0, this.parent.model[this.parent.config.childrenPropertyName].splice(oldIndex, 1)[0]);

    return this;
  };

  Node.prototype.getPath = function () {
    var path = [];
    (function addToPath(node) {
      path.unshift(node);
      if (!node.isRoot()) {
        addToPath(node.parent);
      }
    })(this);
    return path;
  };

  Node.prototype.getIndex = function () {
    if (this.isRoot()) {
      return 0;
    }
    return this.parent.children.indexOf(this);
  };

  /**
   * Parse the arguments of traversal functions. These functions can take one optional
   * first argument which is an options object. If present, this object will be stored
   * in args.options. The only mandatory argument is the callback function which can
   * appear in the first or second position (if an options object is given). This
   * function will be saved to args.fn. The last optional argument is the context on
   * which the callback function will be called. It will be available in args.ctx.
   *
   * @returns Parsed arguments.
   */
  function parseArgs() {
    var args = {};
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'function') {
        args.fn = arguments[0];
      } else {
        args.options = arguments[0];
      }
    } else if (arguments.length === 2) {
      if (typeof arguments[0] === 'function') {
        args.fn = arguments[0];
        args.ctx = arguments[1];
      } else {
        args.options = arguments[0];
        args.fn = arguments[1];
      }
    } else {
      args.options = arguments[0];
      args.fn = arguments[1];
      args.ctx = arguments[2];
    }
    args.options = args.options || {};
    if (!args.options.strategy) {
      args.options.strategy = 'pre';
    }
    if (!walkStrategies[args.options.strategy]) {
      throw new Error('Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.');
    }
    return args;
  }

  Node.prototype.walk = function () {
    var args;
    args = parseArgs.apply(this, arguments);
    walkStrategies[args.options.strategy].call(this, args.fn, args.ctx);
  };

  walkStrategies.pre = function depthFirstPreOrder(callback, context) {
    var i, childCount, keepGoing;
    keepGoing = callback.call(context, this);
    for (i = 0, childCount = this.children.length; i < childCount; i++) {
      if (keepGoing === false) {
        return false;
      }
      keepGoing = depthFirstPreOrder.call(this.children[i], callback, context);
    }
    return keepGoing;
  };

  walkStrategies.post = function depthFirstPostOrder(callback, context) {
    var i, childCount, keepGoing;
    for (i = 0, childCount = this.children.length; i < childCount; i++) {
      keepGoing = depthFirstPostOrder.call(this.children[i], callback, context);
      if (keepGoing === false) {
        return false;
      }
    }
    keepGoing = callback.call(context, this);
    return keepGoing;
  };

  walkStrategies.breadth = function breadthFirst(callback, context) {
    var queue = [this];
    (function processQueue() {
      var i, childCount, node;
      if (queue.length === 0) {
        return;
      }
      node = queue.shift();
      for (i = 0, childCount = node.children.length; i < childCount; i++) {
        queue.push(node.children[i]);
      }
      if (callback.call(context, node) !== false) {
        processQueue();
      }
    })();
  };

  Node.prototype.all = function () {
    var args, all = [];
    args = parseArgs.apply(this, arguments);
    args.fn = args.fn || k(true);
    walkStrategies[args.options.strategy].call(this, function (node) {
      if (args.fn.call(args.ctx, node)) {
        all.push(node);
      }
    }, args.ctx);
    return all;
  };

  Node.prototype.first = function () {
    var args, first;
    args = parseArgs.apply(this, arguments);
    args.fn = args.fn || k(true);
    walkStrategies[args.options.strategy].call(this, function (node) {
      if (args.fn.call(args.ctx, node)) {
        first = node;
        return false;
      }
    }, args.ctx);
    return first;
  };

  Node.prototype.drop = function () {
    var indexOfChild;
    if (!this.isRoot()) {
      indexOfChild = this.parent.children.indexOf(this);
      this.parent.children.splice(indexOfChild, 1);
      this.parent.model[this.config.childrenPropertyName].splice(indexOfChild, 1);
      this.parent = undefined;
      delete this.parent;
    }
    return this;
  };

  return TreeModel;
})();

},{"find-insert-index":8,"mergesort":9}]},{},[6]);

var extract_beatmap_manual = Global.extract_beatmap.extract_beatmap_manual;