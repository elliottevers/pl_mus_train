(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var live_1 = require("../live/live");
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
        Clip.from_path = function (path, messenger) {
            //@ts-ignore
            var LiveApiJs = live_1.live.LiveApiJs;
            return new Clip(new ClipDao(new LiveApiJs(path), messenger));
        };
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
        Clip.prototype.set_endpoint_markers = function (beat_start, beat_end) {
            if (beat_start >= this.clip_dao.get_end_marker()) {
                this.clip_dao.set_clip_endpoint_upper(beat_end);
                this.clip_dao.set_clip_endpoint_lower(beat_start);
            }
            else {
                this.clip_dao.set_clip_endpoint_lower(beat_start);
                this.clip_dao.set_clip_endpoint_upper(beat_end);
            }
        };
        Clip.prototype.get_index_track = function () {
            return this.clip_dao.get_path().split(' ')[2];
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
            return utils_1.utils.cleanse_path(this.clip_live.get_path());
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

},{"../live/live":3,"../log/logger":4,"../note/note":6,"../utils/utils":12,"tree-model":15}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
// import {log} from "../log/logger";
var LiveApiJs = live_1.live.LiveApiJs;
var utils_1 = require("../utils/utils");
var clip_slot;
(function (clip_slot_1) {
    var Clip = clip_1.clip.Clip;
    var ClipDao = clip_1.clip.ClipDao;
    // import Logger = log.Logger;
    var ClipSlot = /** @class */ (function () {
        function ClipSlot(clip_slot_dao) {
            this.clip_slot_dao = clip_slot_dao;
        }
        ClipSlot.prototype.b_has_clip = function () {
            // let logger = new Logger('max');
            // logger.log(JSON.stringify(this.clip));
            // return this.clip !== null
            return this.clip_slot_dao.has_clip();
        };
        ClipSlot.prototype.delete_clip = function () {
            this.clip_slot_dao.delete_clip();
        };
        ClipSlot.prototype.duplicate_clip_to = function (clip_slot) {
            this.clip_slot_dao.duplicate_clip_to(clip_slot.get_id());
        };
        ClipSlot.prototype.get_id = function () {
            return this.clip_slot_dao.get_id();
        };
        ClipSlot.prototype.create_clip = function (length_beats) {
            this.clip_slot_dao.create_clip(length_beats);
        };
        ClipSlot.prototype.load_clip = function () {
            if (this.b_has_clip()) {
                this.clip = this.clip_slot_dao.get_clip();
            }
        };
        // TODO: we should consider checking whether it exists here
        ClipSlot.prototype.get_clip = function () {
            return this.clip;
        };
        return ClipSlot;
    }());
    clip_slot_1.ClipSlot = ClipSlot;
    var ClipSlotDao = /** @class */ (function () {
        function ClipSlotDao(live_api, messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }
        ClipSlotDao.prototype.create_clip = function (length_beats) {
            this.live_api.call("create_clip", String(length_beats));
        };
        ClipSlotDao.prototype.delete_clip = function () {
            this.live_api.call("delete_clip");
        };
        ClipSlotDao.prototype.has_clip = function () {
            return this.live_api.get("has_clip")[0] === 1;
        };
        ClipSlotDao.prototype.duplicate_clip_to = function (id) {
            this.live_api.call("duplicate_clip_to", ['id', id].join(' '));
        };
        ClipSlotDao.prototype.get_clip = function () {
            // return utils.FactoryLive.clip_from_path(
            //     String(this.live_api.get('clip')).split(',').join(' '),
            //     this.messenger
            // )
            // let logger = new Logger('max');
            // logger.log(utils.cleanse_id(this.live_api.get('clip')));
            return new Clip(new ClipDao(new LiveApiJs(utils_1.utils.cleanse_id(this.live_api.get('clip'))), this.messenger));
        };
        ClipSlotDao.prototype.get_path = function () {
            return utils_1.utils.cleanse_path(this.live_api.get_path());
        };
        ClipSlotDao.prototype.get_id = function () {
            return this.live_api.get_id();
        };
        return ClipSlotDao;
    }());
    clip_slot_1.ClipSlotDao = ClipSlotDao;
})(clip_slot = exports.clip_slot || (exports.clip_slot = {}));

},{"../clip/clip":1,"../live/live":3,"../utils/utils":12}],3:[function(require,module,exports){
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
    // simulate dao
    var LiveClipVirtual = /** @class */ (function () {
        function LiveClipVirtual(notes) {
            this.notes = notes;
        }
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

},{"../clip/clip":1}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"tree-model":15}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scene;
(function (scene) {
    var Scene = /** @class */ (function () {
        function Scene(scene_dao) {
            this.scene_dao = scene_dao;
        }
        Scene.prototype.fire = function (force_legato) {
            this.scene_dao.fire(force_legato);
        };
        Scene.prototype.get_id = function () {
            // TODO: implement
            return;
        };
        return Scene;
    }());
    scene.Scene = Scene;
    var SceneDaoVirtual = /** @class */ (function () {
        function SceneDaoVirtual() {
        }
        SceneDaoVirtual.prototype.fire = function (force_legato) {
            return;
        };
        return SceneDaoVirtual;
    }());
    scene.SceneDaoVirtual = SceneDaoVirtual;
    var SceneDao = /** @class */ (function () {
        function SceneDao(live_api, messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }
        SceneDao.prototype.fire = function (force_legato) {
            this.live_api.call("fire", force_legato ? '1' : '0');
        };
        return SceneDao;
    }());
    scene.SceneDao = SceneDao;
    var SceneIterator = /** @class */ (function () {
        function SceneIterator(scenes, direction_forward) {
            this.scenes = scenes;
            this.direction_forward = direction_forward;
            this.i = -1;
        }
        // TODO: type declarations
        SceneIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'segment iterator < 0';
            }
            if (this.i < this.scenes.length) {
                return {
                    value: this.scenes[this.i],
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
        SceneIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.scenes[this.i];
            }
            else {
                return null;
            }
        };
        SceneIterator.prototype.reset = function () {
            this.i = -1;
        };
        SceneIterator.prototype.get_index_current = function () {
            return this.i;
        };
        return SceneIterator;
    }());
    scene.SceneIterator = SceneIterator;
})(scene = exports.scene || (exports.scene = {}));

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var logger_1 = require("../log/logger");
var Logger = logger_1.log.Logger;
var utils_1 = require("../utils/utils");
var segment_1 = require("../segment/segment");
var Segment = segment_1.segment.Segment;
var song_1 = require("../song/song");
var SongDao = song_1.song.SongDao;
var Song = song_1.song.Song;
var LiveApiJs = live_1.live.LiveApiJs;
var track_1 = require("../track/track");
var TrackDao = track_1.track.TrackDao;
var Track = track_1.track.Track;
var _ = require('underscore');
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger = new Messenger(env, 0);
// get the first clip and use its start and end markers to determine the length of the entire song
var get_length_beats = function () {
    var this_device = new LiveApiJs('this_device');
    var track = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    track.load_clip_slots();
    var clip_slot = track.get_clip_slot_at_index(0);
    clip_slot.load_clip();
    var clip = clip_slot.get_clip();
    // let clip: Clip = utils.get_clip_on_this_device_at_index(0);
    return clip.get_end_marker() - clip.get_start_marker();
    // let segments_first_clip = new Clip(
    //     new ClipDao(
    //         new LiveApiJs(
    //             this_device.get_path().split(' ').slice(0, 3).concat(['clip_slots', '0', 'clip']).join(' ')
    //         ),
    //         new Messenger(env, 0)
    //     )
    // );
    //
    // return segments_first_clip.get_end_marker() - segments_first_clip.get_start_marker()
};
var expand_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    //
    // let path_this_device = this_device.get_path();
    //
    // let list_this_device = path_this_device.split(' ');
    //
    // let index_this_track = Number(list_this_device[2]);
    var track = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    expand_track(track.get_path());
};
var contract_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    //
    // let path_this_device = this_device.get_path();
    //
    // let list_this_device = path_this_device.split(' ');
    //
    // let index_this_track = Number(list_this_device[2]);
    var track = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    contract_track(track.get_path());
};
var expand_selected_track = function () {
    expand_track('live_set view selected_track');
};
var contract_selected_track = function () {
    contract_track('live_set view selected_track');
};
// Assumption: all clips on "segment track have same length"
// NB: works without highlighting any tracks
// aggregate all the notes in the track's clips
// delete all the track's clips
// set the notes inside of the single clip
var contract_track = function (path_track) {
    var logger = new Logger(env);
    // let thing = new ClipSlot(
    //     new ClipSlotDao(
    //         new LiveApiJs('id 267'),
    //         messenger
    //     )
    // );
    //
    // thing.load_clip()
    //
    // logger.log(JSON.stringify(thing.get_clip().get_start_marker()));
    //
    // logger.log(JSON.stringify(thing.get_clip().get_end_marker()));
    //
    //
    // return;
    // length of first clip
    var length_beats = get_length_beats();
    var track = new Track(new TrackDao(new live_1.live.LiveApiJs(path_track), messenger));
    // clip_slots and clips
    track.load_clips();
    var notes = track.get_notes();
    // logger.log(JSON.stringify(notes));
    track.delete_clips();
    track.create_clip_at_index(0, length_beats);
    var clip_slot = track.get_clip_slot_at_index(0);
    clip_slot.load_clip();
    var clip = clip_slot.get_clip();
    clip.set_notes(notes);
    clip.set_endpoint_markers(0, length_beats);
    clip.set_endpoints_loop(0, length_beats);
    // for (let clip_slot of track.get_clip_slots()) {
    //
    //     if (clip_slot.get_index() === 0) {
    //         continue
    //     }
    //
    //     if (clip_slot.b_has_clip()) {
    //         let clip = clip_slot.clip;
    //         clip_slot.clip.get_notes_within_markers()
    //     }
    //
    //
    // }
    // TODO: the following is one layer of abstraction below the DAO
    // let track = new li.LiveApiJs(path_track);
    // let list_path_track_with_index = track.get_path().split(' ').map((el) => {
    //     return el.replace('\"', '')
    // });
    //
    // let index_track = Number(list_path_track_with_index[2]);
    //
    // track = new li.LiveApiJs(list_path_track_with_index.join(' '));
    //
    // let num_clipslots = track.get("clip_slots").length/2;
    // let notes_amassed = [];
    //
    // // first, amass all notes of clips and delete all clips
    //
    // for (let i_clipslot of _.range(0, num_clipslots)) {
    //     let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
    //
    //     let api_clipslot_segment = new li.LiveApiJs(path_clipslot);
    //
    //     let clip_segment = new Clip(
    //         new ClipDao(
    //             new li.LiveApiJs(
    //                 path_clipslot.split(' ').concat(['clip']).join(' ')
    //             ),
    //             new Messenger(env, 0)
    //         )
    //     );
    //     notes_amassed = notes_amassed.concat(
    //         clip_segment.get_notes(
    //             clip_segment.get_loop_bracket_lower(),
    //             0,
    //             clip_segment.get_loop_bracket_upper(),
    //             128
    //         )
    //     );
    //
    //     api_clipslot_segment.call('delete_clip')
    // }
    //
    // // create one clip of length "length_beats"
    //
    // let path_clipslot_contracted = ['live_set', 'tracks', String(index_track), 'clip_slots', String(0)];
    //
    // let api_clipslot_contracted = new li.LiveApiJs(
    //     path_clipslot_contracted.join(' ')
    // );
    //
    // api_clipslot_contracted.call('create_clip', String(length_beats));
    //
    // let clip_contracted = new Clip(
    //     new ClipDao(
    //         new li.LiveApiJs(
    //             path_clipslot_contracted.concat(['clip']).join(' ')
    //         ),
    //         new Messenger(env, 0)
    //     )
    // );
    //
    // // add the amassed notes to it
    //
    // clip_contracted.set_notes(
    //     notes_amassed
    // )
};
// export let get_notes_on_track = (path_track) => {
//     let index_track = Number(path_track.split(' ')[2]);
//
//     let track = new li.LiveApiJs(path_track);
//
//     let num_clipslots = track.get("clip_slots").length/2;
//
//     let notes_amassed = [];
//
//     for (let i_clipslot of _.range(0, num_clipslots)) {
//         let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
//
//         let clip = new Clip(
//             new ClipDao(
//                 new li.LiveApiJs(
//                     path_clipslot.split(' ').concat(['clip']).join(' ')
//                 ),
//                 new Messenger(env, 0)
//             )
//         );
//
//         notes_amassed = notes_amassed.concat(
//             clip.get_notes(
//                 clip.get_loop_bracket_lower(),
//                 0,
//                 clip.get_loop_bracket_upper(),
//                 128
//             )
//         );
//     }
//
//     return notes_amassed
// };
// TODO: we can't export this, because it could be called from a different track than the one the segments are on...
// NB: assumes the device that calls this is on the track of segments
var get_notes_segments = function () {
    var this_device = new live_1.live.LiveApiJs('this_device');
    var track_segments = new Track(new TrackDao(new LiveApiJs(utils_1.utils.get_path_track_from_path_device(this_device.get_path())), messenger));
    track_segments.load_clips();
    return track_segments.get_notes();
};
// 'live_set view highlighted_clip_slot'
var test = function () {
};
var expand_selected_audio_track = function () {
    expand_track_audio('live_set view selected_track');
};
var contract_selected_audio_track = function () {
    contract_track_audio('live_set view selected_track');
};
// NB: we assume all training data starts on the first beat
var contract_track_audio = function (path_track) {
    var length_beats = get_length_beats();
    var track = new Track(new TrackDao(new live_1.live.LiveApiJs(path_track), messenger));
    track.load_clips();
    var clip_slots = track.get_clip_slots();
    for (var i_clip_slot_audio in clip_slots) {
        var clip_slot_audio = clip_slots[Number(i_clip_slot_audio)];
        if (Number(i_clip_slot_audio) === 0) {
            clip_slot_audio.clip.set_endpoint_markers(0, length_beats);
            continue;
        }
        if (clip_slot_audio.b_has_clip()) {
            clip_slot_audio.delete_clip();
        }
    }
    // let track = new li.LiveApiJs(path_track);
    // let list_path_track_with_index = track.get_path().split(' ').map((el) => {
    //     return el.replace('\"', '')
    // });
    // let index_track = Number(list_path_track_with_index[2]);
    //
    // track = new li.LiveApiJs(list_path_track_with_index.join(' '));
    // let num_clipslots = track.get("clip_slots").length/2;
    // let notes_segments = get_notes_segments();
    // for (let i_clipslot of _.range(1, num_clipslots)) {
    //     let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
    //
    //     let api_clipslot_segment = new li.LiveApiJs(path_clipslot);
    //
    //     api_clipslot_segment.call('delete_clip')
    // }
    //
    // let path_clipslot_contracted = ['live_set', 'tracks', String(index_track), 'clip_slots', String(0)];
    //
    // let clip_contracted = new Clip(
    //     new ClipDao(
    //         new li.LiveApiJs(
    //             path_clipslot_contracted.concat(['clip']).join(' ')
    //         ),
    //         new Messenger(env, 0)
    //     )
    // );
    //
    // clip_contracted.set_endpoints_loop(0, length_beats);
};
var expand_track_audio = function (path_track) {
    // let length_beats = get_length_beats();
    // let clipslot_audio = new li.LiveApiJs(path_clip_slot);
    // let track = new li.LiveApiJs(clipslot_audio.get_path().split(' ').slice(0, 3).join(' '));
    // let index_track = clipslot_audio.get_path().split(' ')[2];
    // let num_clipslots = track.get("clip_slots").length/2;
    var track = new Track(new TrackDao(new LiveApiJs(path_track), messenger));
    var clip_slot_audio = track.get_clip_slot_at_index(0);
    // TODO: we won't need to do this since we will be creating new ones anyway
    // track.load();
    var notes_segments = get_notes_segments();
    var song = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), true));
    song.set_path_deferlow('set_path_song');
    for (var _i = 0, _a = _.range(1, notes_segments.length); _i < _a.length; _i++) {
        var i_clipslot = _a[_i];
        var note_segment = notes_segments[Number(i_clipslot)];
        // let notes_segments
        // let clip_slot = new ClipSlot(
        //     new ClipSlotDao(
        //         // utils.get_clipslot_at_index(Number(i_clipslot))
        //     )
        // );
        var scene = song.get_scene_at_index(Number(i_clipslot));
        // if (track.get_clip_slot_at_index(Number(i_clipslot)) === null) {
        //     let scen
        // }
        var scene_exists = scene !== null;
        if (scene_exists) {
            song.create_scene_at_index(Number(i_clipslot));
        }
        // let clipslot = new li.LiveApiJs(path_clipslot);
        var clip_slot = track.get_clip_slot_at_index(Number(i_clipslot));
        // let clip_slot = new ClipSlot(
        //     new ClipSlotDao(
        //         new LiveApiJs(
        //             utils.get_path_clip_slot_at
        //         )
        //     )
        // )
        // let has_clip = clipslot.get("has_clip")[0] === 1;
        if (clip_slot.b_has_clip()) {
            // clipslot.call("delete_clip")
            clip_slot.delete_clip();
        }
        // let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
        //
        // let scene = new li.LiveApiJs(
        //     ['live_set', 'scenes', String(Number(i_clipslot))].join(' ')
        // );
        // let scene_exists = Number(scene.get_id()) !== 0;
        // if (!scene_exists) {
        //     song.call('create_scene', String(Number(i_clipslot)))
        // }
        // let clipslot = new li.LiveApiJs(path_clipslot);
        //
        // let has_clip = clipslot.get("has_clip")[0] === 1;
        //
        // if (has_clip) {
        //     clipslot.call("delete_clip")
        // }
        clip_slot_audio.duplicate_clip_to(clip_slot);
        // clipslot_audio.call("duplicate_clip_to", ['id', clipslot.get_id()].join(' '));
        // let clip = new Clip(
        //     new ClipDao(
        //         new LiveApiJs(
        //             path_clipslot.split(' ').concat(['clip']).join(' ')
        //         ),
        //         new Messenger(env, 0)
        //     )
        // );
        var clip_1 = Track.get_clip_at_index(track.get_index(), Number(i_clipslot), messenger);
        var segment_2 = new Segment(note_segment);
        clip_1.set_endpoints_loop(segment_2.beat_start, segment_2.beat_end);
    }
};
// let notes_segments = io.Importer.import('segment');
var expand_track = function (path_track) {
    var logger = new Logger(env);
    var track = new Track(new TrackDao(new LiveApiJs(path_track), messenger));
    track.load_clips();
    var clip_slot = track.get_clip_slot_at_index(0);
    clip_slot.load_clip();
    var clip = clip_slot.get_clip();
    var notes_clip = clip.get_notes(clip.get_loop_bracket_lower(), 0, clip.get_loop_bracket_upper(), 128);
    var notes_segments = get_notes_segments();
    // logger.log(JSON.stringify(notes_segments));
    var segments = [];
    for (var _i = 0, notes_segments_1 = notes_segments; _i < notes_segments_1.length; _i++) {
        var note = notes_segments_1[_i];
        segments.push(new Segment(note));
    }
    var song_read = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), false));
    var length_beats = get_length_beats();
    song_read.load_scenes();
    var _loop_1 = function (i_segment) {
        var segment_3 = segments[Number(i_segment)];
        var scene = song_read.get_scene_at_index(Number(i_segment));
        var scene_exists = scene !== null;
        if (!scene_exists) {
            song_read.create_scene_at_index(Number(i_segment));
        }
        var clip_slot_1 = Track.get_clip_slot_at_index(track.get_index(), Number(i_segment), messenger);
        clip_slot_1.load_clip();
        if (Number(i_segment) === 0) {
            clip_slot_1.delete_clip();
        }
        clip_slot_1.create_clip(length_beats);
        clip_slot_1.load_clip();
        var clip_2 = clip_slot_1.get_clip();
        clip_2.set_endpoints_loop(segment_3.get_endpoints_loop()[0], segment_3.get_endpoints_loop()[1]);
        clip_2.set_endpoint_markers(0, length_beats);
        var notes_within_segment = notes_clip.filter(function (node) { return node.model.note.beat_start >= segment_3.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_3.get_endpoints_loop()[1]; });
        clip_2.set_notes(notes_within_segment);
    };
    for (var i_segment in segments) {
        _loop_1(i_segment);
    }
};
if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.expand_selected_track = expand_selected_track;
    Global.segmenter.contract_selected_track = contract_selected_track;
    Global.segmenter.contract_segments = contract_segments;
    Global.segmenter.expand_segments = expand_segments;
    Global.segmenter.expand_selected_audio_track = expand_selected_audio_track;
    Global.segmenter.contract_selected_audio_track = contract_selected_audio_track;
    Global.segmenter.test = test;
}

},{"../live/live":3,"../log/logger":4,"../message/messenger":5,"../segment/segment":9,"../song/song":10,"../track/track":11,"../utils/utils":12,"underscore":16}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("../clip/clip");
var live_1 = require("../live/live");
var segment;
(function (segment) {
    var Clip = clip_1.clip.Clip;
    var LiveClipVirtual = live_1.live.LiveClipVirtual;
    var Segment = /** @class */ (function () {
        function Segment(note) {
            this.beat_start = note.model.note.beat_start;
            this.beat_end = note.model.note.get_beat_end();
            var clip_dao_virtual = new LiveClipVirtual([note]);
            this.clip = new Clip(clip_dao_virtual);
        }
        Segment.from_notes = function (notes) {
            return;
        };
        Segment.prototype.set_clip_user_input_sync = function (clip) {
            this.clip_user_input_sync = clip;
        };
        Segment.prototype.set_clip_user_input_async = function (clip) {
            this.clip_user_input_async = clip;
        };
        Segment.prototype.get_note = function () {
            return this.clip.get_notes(this.beat_start, 0, this.beat_end, 128)[0];
        };
        Segment.prototype.get_notes = function () {
            return this.clip.get_notes(this.beat_start, 0, this.beat_end, 128);
        };
        Segment.prototype.get_endpoints_loop = function () {
            return [this.beat_start, this.beat_end];
        };
        Segment.prototype.set_endpoints_loop = function (beat_start, beat_end) {
            this.clip.set_loop_bracket_upper(beat_end);
            this.clip.set_loop_bracket_lower(beat_start);
        };
        Segment.prototype.set_scene = function (scene) {
            this.scene = scene;
        };
        return Segment;
    }());
    segment.Segment = Segment;
    var SegmentIterator = /** @class */ (function () {
        function SegmentIterator(segments, direction_forward) {
            this.segments = segments;
            this.direction_forward = direction_forward;
            this.i = -1;
        }
        // TODO: type declarations
        SegmentIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'segment iterator < 0';
            }
            if (this.i < this.segments.length) {
                return {
                    value: this.segments[this.i],
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
        SegmentIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.segments[this.i];
            }
            else {
                return null;
            }
        };
        SegmentIterator.prototype.reset = function () {
            this.i = -1;
        };
        SegmentIterator.prototype.get_index_current = function () {
            return this.i;
        };
        return SegmentIterator;
    }());
    segment.SegmentIterator = SegmentIterator;
})(segment = exports.segment || (exports.segment = {}));

},{"../clip/clip":1,"../live/live":3}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var scene_1 = require("../scene/scene");
var utils_1 = require("../utils/utils");
var song;
(function (song) {
    var Scene = scene_1.scene.Scene;
    var SceneDao = scene_1.scene.SceneDao;
    var LiveApiJs = live_1.live.LiveApiJs;
    var Song = /** @class */ (function () {
        function Song(song_dao) {
            this.song_dao = song_dao;
            // automatically set path at time of instantiation
            if (this.song_dao.is_async()) {
                this.set_path_deferlow('set_path_' + this.song_dao.key_route);
            }
        }
        Song.prototype.load_scenes = function () {
            this.scenes = this.song_dao.get_scenes();
        };
        Song.prototype.get_scene_at_index = function (index) {
            return this.scenes[index];
        };
        Song.prototype.create_scene_at_index = function (index) {
            this.song_dao.create_scene(index);
        };
        Song.prototype.set_session_record = function (int) {
            this.song_dao.set_session_record(int);
        };
        Song.prototype.set_overdub = function (int) {
            this.song_dao.set_overdub(int);
        };
        Song.prototype.set_tempo = function (int) {
            this.song_dao.set_tempo(int);
        };
        Song.prototype.start = function () {
            this.song_dao.start();
        };
        Song.prototype.stop = function () {
            this.song_dao.stop();
        };
        Song.prototype.get_scenes = function () {
            return this.song_dao.get_scenes();
        };
        Song.prototype.get_num_scenes = function () {
            return this.get_scenes().length / 2;
        };
        Song.prototype.set_path_deferlow = function (key_route) {
            this.song_dao.set_path_deferlow(key_route, this.get_path());
        };
        Song.prototype.get_path = function () {
            return this.song_dao.get_path();
        };
        return Song;
    }());
    song.Song = Song;
    var SongDaoVirtual = /** @class */ (function () {
        // constructor(scenes: Scene[], messenger: Messenger, deferlow?: boolean, key_route?: string, env?: string) {
        function SongDaoVirtual(scenes, messenger, deferlow, key_route, env) {
            this.scenes = scenes;
            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
        }
        SongDaoVirtual.prototype.create_scene = function (index) {
        };
        SongDaoVirtual.prototype.set_path_deferlow = function (key_route_override, path_live) {
            return;
        };
        SongDaoVirtual.prototype.is_async = function () {
            return this.deferlow;
        };
        SongDaoVirtual.prototype.get_path = function () {
            return 'live_set';
        };
        SongDaoVirtual.prototype.get_scenes = function () {
            var data = [];
            for (var _i = 0, _a = this.scenes; _i < _a.length; _i++) {
                var scene_2 = _a[_i];
                data.push('id');
                data.push(scene_2.get_id());
            }
            return data;
        };
        SongDaoVirtual.prototype.load_scenes = function () {
        };
        SongDaoVirtual.prototype.set_overdub = function (int) {
            return;
        };
        SongDaoVirtual.prototype.set_session_record = function (int) {
            return;
        };
        SongDaoVirtual.prototype.set_tempo = function (int) {
            return;
        };
        SongDaoVirtual.prototype.start = function () {
            return;
        };
        SongDaoVirtual.prototype.stop = function () {
            return;
        };
        return SongDaoVirtual;
    }());
    song.SongDaoVirtual = SongDaoVirtual;
    var SongDao = /** @class */ (function () {
        function SongDao(song_live, messenger, deferlow, key_route, env) {
            // constructor(song_live: iLiveApiJs, patcher: Patcher, deferlow?: boolean, key_route?: string, env?: string) {
            this.song_live = song_live;
            this.messenger = messenger;
            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
            this.env = env;
            // automatically set the deferlow path
            // this.patcher.getnamed('song').message('set', 'session_record', String(int))
        }
        SongDao.prototype.set_path_deferlow = function (key_route_override, path_live) {
            var mess = [key_route_override];
            for (var _i = 0, _a = utils_1.utils.PathLive.to_message(path_live); _i < _a.length; _i++) {
                var word = _a[_i];
                mess.push(word);
            }
            this.messenger.message(mess);
        };
        SongDao.prototype.is_async = function () {
            return this.deferlow;
        };
        SongDao.prototype.set_session_record = function (int) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "session_record", String(int)]);
            }
            else {
                this.song_live.set("session_record", String(int));
            }
            // if (this.deferlow) {
            //     this.patcher.getnamed('song').message('set', 'session_record', String(int))
            // } else {
            //
            // }
        };
        SongDao.prototype.set_overdub = function (int) {
            this.song_live.set("overdub", int);
        };
        SongDao.prototype.set_tempo = function (int) {
            this.song_live.set("tempo", int);
        };
        SongDao.prototype.start = function () {
            this.song_live.set("is_playing", 1);
        };
        SongDao.prototype.stop = function () {
            this.song_live.set("is_playing", 0);
        };
        SongDao.prototype.get_scenes = function () {
            var _this = this;
            var data_scenes = this.song_live.get("scenes");
            var scenes = [];
            var scene = [];
            for (var i_datum in data_scenes) {
                var datum = data_scenes[Number(i_datum)];
                scene.push(datum);
                if (Number(i_datum) % 2 === 1) {
                    scenes.push(scene);
                }
            }
            return scenes.map(function (id_scene) {
                return new Scene(new SceneDao(new LiveApiJs(id_scene), _this.messenger));
            });
        };
        SongDao.prototype.get_path = function () {
            return 'live_set';
        };
        SongDao.prototype.create_scene = function (index) {
            this.song_live.call('create_scene', String(index));
        };
        return SongDao;
    }());
    song.SongDao = SongDao;
})(song = exports.song || (exports.song = {}));

},{"../live/live":3,"../scene/scene":7,"../utils/utils":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var messenger_1 = require("../message/messenger");
var clip_slot_1 = require("../clip_slot/clip_slot");
var utils_1 = require("../utils/utils");
var _ = require('underscore');
var track;
(function (track) {
    var LiveApiJs = live_1.live.LiveApiJs;
    var Clip = clip_1.clip.Clip;
    var Messenger = messenger_1.message.Messenger;
    var ClipSlot = clip_slot_1.clip_slot.ClipSlot;
    var ClipSlotDao = clip_slot_1.clip_slot.ClipSlotDao;
    var ClipDao = clip_1.clip.ClipDao;
    // export let get_notes_on_track = (path_track) => {
    //     let index_track = Number(path_track.split(' ')[2]);
    //
    //     let track = new Track(
    //         new TrackDao(
    //             new li.LiveApiJs(path_track)
    //         )
    //     );
    //
    //     let num_clip_slots = track.get_num_clip_slots();
    //
    //     let notes_amassed = [];
    //
    //     for (let i_clipslot of _.range(0, num_clip_slots)) {
    //         let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
    //
    //         let clip = new Clip(
    //             new ClipDao(
    //                 new li.LiveApiJs(
    //                     path_clipslot.split(' ').concat(['clip']).join(' ')
    //                 ),
    //                 new Messenger('max', 0)
    //             )
    //         );
    //
    //         notes_amassed = notes_amassed.concat(
    //             clip.get_notes(
    //                 clip.get_loop_bracket_lower(),
    //                 0,
    //                 clip.get_loop_bracket_upper(),
    //                 128
    //             )
    //         );
    //     }
    //
    //     return notes_amassed
    // };
    var Track = /** @class */ (function () {
        function Track(track_dao) {
            this.clip_slots = [];
            this.track_dao = track_dao;
        }
        Track.get_clip_at_index = function (index_track, index_clip_slot, messenger) {
            // return new Clip(
            //     new ClipDao(
            //         new LiveApiJs(
            //             ['live_set', 'tracks', String(index_track), 'clips', String(index_clip_slot), 'clip'].join(' ')
            //         ),
            //         messenger
            //     )
            // );
            return new Clip(new ClipDao(new LiveApiJs(['live_set', 'tracks', String(index_track), 'clip_slots', String(index_clip_slot), 'clip'].join(' ')), messenger));
        };
        Track.get_clip_slot_at_index = function (index_track, index_clip_slot, messenger) {
            // return new ClipSlot(
            //     new ClipSlotDao(
            //         new LiveApiJs(
            //             ['live_set', 'tracks', String(index_track), 'clips', String(index_clip_slot)].join(' ')
            //         ),
            //         messenger
            //     )
            // );
            return new ClipSlot(new ClipSlotDao(new LiveApiJs(['live_set', 'tracks', String(index_track), 'clip_slots', String(index_clip_slot)].join(' ')), messenger));
        };
        Track.prototype.get_index = function () {
            // let logger = new Logger('max');
            // logger.log(String(String(this.track_dao.get_path()).split(' ')[2]));
            return Number(this.track_dao.get_path().split(' ')[2]);
        };
        Track.prototype.load_clip_slots = function () {
            this.clip_slots = this.track_dao.get_clip_slots();
            // for (let clip_slot of this.clip_slots) {
            //     clip_slot.load_clip();
            // }
            // let logger = new Logger('max');
            // logger.log(this.track_dao.get_clip_slots().length);
        };
        Track.prototype.mute = function () {
            this.track_dao.mute(true);
        };
        Track.prototype.unmute = function () {
            this.track_dao.mute(false);
        };
        // public load_clips(): void {
        //     //
        //     let id_pairs: string[][] = this.get_clip_slots();
        //     for (let id_pair of id_pairs) {
        //         let clip_slot = new ClipSlot(
        //             new ClipSlotDao(
        //                 new LiveApiJs(
        //                     id_pair.join(' ')
        //                 ),
        //                 this.track_dao.messenger
        //             )
        //         );
        //
        //         if (clip_slot.b_has_clip()) {
        //             this.clip
        //         }
        //     }
        // }
        Track.prototype.load_clips = function () {
            this.load_clip_slots();
            // let logger = new Logger('max');
            // logger.log(JSON.stringify(this.clip_slots))
            for (var _i = 0, _a = this.clip_slots; _i < _a.length; _i++) {
                var clip_slot_2 = _a[_i];
                if (clip_slot_2.b_has_clip()) {
                    clip_slot_2.load_clip();
                }
                // clip_slot.load_clip()
                // if (clip_slot.b_has_clip()) {
                //     logger.log(JSON.stringify(clip_slot.get_clip().get_notes_within_markers()))
                // }
            }
        };
        Track.prototype.delete_clips = function () {
            for (var _i = 0, _a = this.clip_slots; _i < _a.length; _i++) {
                var clip_slot_3 = _a[_i];
                if (clip_slot_3.b_has_clip()) {
                    clip_slot_3.delete_clip();
                }
            }
        };
        Track.prototype.create_clip_at_index = function (index, length_beats) {
            this.clip_slots[index].create_clip(length_beats);
        };
        Track.prototype.get_clip_slot_at_index = function (index_clip_slot) {
            return this.clip_slots[index_clip_slot];
        };
        // TODO: should return null if the there aren't even that many scenes
        Track.prototype.get_clip_at_index = function (index) {
            var clip_slot = this.clip_slots[index];
            return clip_slot.get_clip();
        };
        Track.prototype.get_num_clip_slots = function () {
            return this.get_clip_slots().length;
        };
        Track.prototype.get_clip_slots = function () {
            return this.track_dao.get_clip_slots();
        };
        // NB: assumes that the clips form a perfect partition of the duration inside the start, end marker
        Track.prototype.get_notes = function () {
            var notes_amassed = [];
            for (var _i = 0, _a = this.clip_slots; _i < _a.length; _i++) {
                var clip_slot_4 = _a[_i];
                if (clip_slot_4.b_has_clip()) {
                    notes_amassed = notes_amassed.concat(clip_slot_4.get_clip().get_notes_within_markers());
                }
            }
            return notes_amassed;
        };
        Track.prototype.get_path = function () {
            // TODO: implement
            return this.track_dao.get_path();
        };
        return Track;
    }());
    track.Track = Track;
    // TODO: please change everything in here
    var TrackDaoVirtual = /** @class */ (function () {
        function TrackDaoVirtual(clips) {
            this.clips = clips;
        }
        TrackDaoVirtual.prototype.mute = function () {
        };
        // get_num_clip_slots(): number {
        //     return this.num_clip_slots;
        // }
        TrackDaoVirtual.prototype.get_notes = function () {
            var notes_amassed = [];
            for (var _i = 0, _a = this.clips; _i < _a.length; _i++) {
                var clip_2 = _a[_i];
                notes_amassed = notes_amassed.concat(clip_2.get_notes(clip_2.get_loop_bracket_lower(), 0, clip_2.get_loop_bracket_upper(), 128));
            }
            return notes_amassed;
        };
        TrackDaoVirtual.prototype.get_clip_slots = function () {
            return;
        };
        TrackDaoVirtual.prototype.get_path = function () {
            return;
        };
        return TrackDaoVirtual;
    }());
    track.TrackDaoVirtual = TrackDaoVirtual;
    var TrackDao = /** @class */ (function () {
        function TrackDao(live_api, messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }
        TrackDao.prototype.get_clip_slots = function () {
            var data_clip_slots = this.live_api.get("clip_slots");
            var clip_slots = [];
            var clip_slot = [];
            for (var i_datum in data_clip_slots) {
                var datum = data_clip_slots[Number(i_datum)];
                clip_slot.push(datum);
                if (Number(i_datum) % 2 === 1) {
                    clip_slots.push(clip_slot);
                    clip_slot = [];
                }
            }
            // let logger = new Logger('max');
            // logger.log(JSON.stringify(clip_slots));
            return clip_slots.map(function (list_id_clip_slot) {
                // return new ClipSlot(
                //     new ClipSlotDao(
                //         new LiveApiJs(
                //             id_clip_slot
                //         ),
                //         this.messenger
                //     )
                // )
                // return utils.FactoryLive.get_clip_slot(list_id_clip_slot.join(' '))
                return new ClipSlot(new ClipSlotDao(new LiveApiJs(list_id_clip_slot.join(' ')), new Messenger('max', 0)));
            });
        };
        TrackDao.prototype.mute = function (val) {
            if (val) {
                this.live_api.call('mute', '1');
            }
            else {
                this.live_api.call('mute', '0');
            }
        };
        // // implement the amassing notes logic
        // get_notes(): TreeModel.Node<Note>[] {
        //     return
        // }
        TrackDao.prototype.get_path = function () {
            return utils_1.utils.cleanse_path(this.live_api.get_path());
        };
        return TrackDao;
    }());
    track.TrackDao = TrackDao;
})(track = exports.track || (exports.track = {}));

},{"../clip/clip":1,"../clip_slot/clip_slot":2,"../live/live":3,"../message/messenger":5,"../utils/utils":12,"underscore":16}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils;
(function (utils) {
    utils.cleanse_id = function (string_id) {
        return String(string_id).split(',').join(' ');
    };
    // accepts a path directly from the DAO object
    utils.cleanse_path = function (path) {
        // return path.replace('/"', '')
        return String(path).split(' ').map(function (text) {
            return text.replace('\"', '');
        }).join(' ');
    };
    utils.get_path_track_from_path_device = function (path) {
        return path.split(' ').slice(0, 3).join(' ');
    };
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"find-insert-index":13,"mergesort":14}],16:[function(require,module,exports){
(function (global){
//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[8]);

var expand_selected_track = Global.segmenter.expand_selected_track;
var contract_selected_track = Global.segmenter.contract_selected_track;
var contract_segments = Global.segmenter.contract_segments;
var expand_segments = Global.segmenter.expand_segments;
var expand_selected_audio_track = Global.segmenter.expand_selected_audio_track;
var contract_selected_audio_track = Global.segmenter.contract_selected_audio_track;
var test = Global.segmenter.test;