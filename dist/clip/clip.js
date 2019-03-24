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
//# sourceMappingURL=clip.js.map