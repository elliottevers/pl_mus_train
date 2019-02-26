(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var clip;
(function (clip) {
    var Clip = /** @class */ (function () {
        function Clip(clip_dao) {
            this.clip_dao = clip_dao;
        }
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
        Clip.prototype.load_notes_within_markers = function () {
            this.notes = this.get_notes(this.get_start_marker(), 0, this.get_end_marker(), 128);
        };
        // TODO: annotations
        Clip.prototype.get_pitch_max = function () {
            var pitch_max = 0;
            for (var _i = 0, _a = this.get_notes_within_markers(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.model.note.pitch > pitch_max) {
                    pitch_max = node.model.note.pitch;
                }
            }
            return pitch_max;
        };
        // TODO: annotations
        Clip.prototype.get_pitch_min = function () {
            var pitch_min = 128;
            for (var _i = 0, _a = this.get_notes_within_markers(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.model.note.pitch < pitch_min) {
                    pitch_min = node.model.note.pitch;
                }
            }
            return pitch_min;
        };
        Clip.prototype.get_ambitus = function () {
            return [this.get_pitch_min(), this.get_pitch_max()];
        };
        Clip.prototype.set_loop_bracket_lower = function (beat) {
            this.clip_dao.set_loop_bracket_lower(beat);
        };
        Clip.prototype.set_loop_bracket_upper = function (beat) {
            this.clip_dao.set_loop_bracket_upper(beat);
        };
        Clip.prototype.get_loop_bracket_lower = function () {
            return this.clip_dao.get_loop_bracket_lower();
        };
        Clip.prototype.get_loop_bracket_upper = function () {
            return this.clip_dao.get_loop_bracket_upper();
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
        Clip.prototype.get_notes_within_markers = function () {
            if (!this.notes) {
                this.load_notes_within_markers();
            }
            return this.notes;
        };
        Clip.prototype.get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return Clip._parse_notes(this._get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max));
        };
        Clip.prototype.set_notes = function (notes) {
            this.clip_dao.set_notes(notes);
        };
        // TODO: *actually* make private
        Clip.prototype._get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return this.clip_dao.get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max);
        };
        Clip.prototype.remove_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            this.clip_dao.remove_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max);
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
        // TODO: return list of tree nodes
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
            // l.log(notes_parsed);
            return notes_parsed;
        };
        return Clip;
    }());
    clip.Clip = Clip;
    var ClipDao = /** @class */ (function () {
        // how to implement LiveAPI - get, set, call
        function ClipDao(clip_live, messenger, deferlow) {
            // let path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
            // this.clip_live = new LiveAPI(null, path);
            this.clip_live = clip_live;
            this.messenger = messenger;
            this.deferlow = deferlow;
        }
        // TODO: check if these actually return arrays
        ClipDao.prototype.get_end_marker = function () {
            return this.clip_live.get('end_marker')[0];
        };
        // TODO: check if these actually return arrays
        ClipDao.prototype.get_start_marker = function () {
            return this.clip_live.get('start_marker')[0];
        };
        ClipDao.prototype.set_loop_bracket_lower = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["set", "loop_start", beat]);
            }
            else {
                this.clip_live.set('loop_start', beat);
            }
        };
        ClipDao.prototype.set_loop_bracket_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["set", "loop_end", beat]);
            }
            else {
                this.clip_live.set('loop_end', beat);
            }
        };
        ClipDao.prototype.get_loop_bracket_lower = function () {
            // if (this.deferlow) {
            //     this.messenger.message(["set", "loop_start", beat])
            // } else {
            return this.clip_live.get('loop_start');
            // }
        };
        ClipDao.prototype.get_loop_bracket_upper = function () {
            // if (this.deferlow) {
            //     this.messenger.message(["set", "loop_end", beat])
            // } else {
            return this.clip_live.get('loop_end');
            // }
        };
        ClipDao.prototype.set_clip_endpoint_lower = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["set", "start_marker", beat]);
            }
            else {
                this.clip_live.set('start_marker', beat);
            }
        };
        ClipDao.prototype.set_clip_endpoint_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["set", "end_marker", beat]);
            }
            else {
                this.clip_live.set('end_marker', beat);
            }
        };
        ClipDao.prototype.fire = function () {
            if (this.deferlow) {
                this.messenger.message(["call", "fire"]);
            }
            else {
                this.clip_live.call('fire');
            }
        };
        ;
        ClipDao.prototype.stop = function () {
            if (this.deferlow) {
                this.messenger.message(["call", "stop"]);
            }
            else {
                this.clip_live.call('stop');
            }
        };
        ;
        ClipDao.prototype.get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            // if (this.deferlow) {
            //
            // } else {
            return this.clip_live.call('get_notes', beat_start, pitch_midi_min, beat_end, pitch_midi_max);
            // }
        };
        ;
        ClipDao.prototype.remove_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            if (this.deferlow) {
                this.messenger.message(["call", "remove_notes", beat_start, pitch_midi_min, beat_end, pitch_midi_max]);
            }
            else {
                this.clip_live.call('remove_notes', beat_start, pitch_midi_min, beat_end, pitch_midi_max);
            }
        };
        ;
        ClipDao.prototype.set_notes = function (notes) {
            if (this.deferlow) {
                this.messenger.message(['call', 'set_notes']);
                this.messenger.message(['call', 'notes', notes.length]);
                for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
                    var node = notes_1[_i];
                    this.messenger.message([
                        'call',
                        'note',
                        node.model.note.pitch,
                        node.model.note.beat_start.toFixed(4),
                        node.model.note.beats_duration.toFixed(4),
                        node.model.note.velocity,
                        node.model.note.muted
                    ]);
                }
                this.messenger.message(['call', 'done']);
            }
            else {
                this.clip_live.call('set_notes');
                this.clip_live.call('notes', notes.length);
                for (var _a = 0, notes_2 = notes; _a < notes_2.length; _a++) {
                    var node = notes_2[_a];
                    this.clip_live.call("note", node.model.note.pitch, node.model.note.beat_start.toFixed(4), node.model.note.beats_duration.toFixed(4), node.model.note.velocity, node.model.note.muted);
                }
                this.clip_live.call("done");
            }
        };
        return ClipDao;
    }());
    clip.ClipDao = ClipDao;
})(clip = exports.clip || (exports.clip = {}));

},{"../note/note":5,"tree-model":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("../clip/clip");
var messenger_1 = require("../message/messenger");
var io;
(function (io) {
    var Messenger = messenger_1.message.Messenger;
    var Exporter = /** @class */ (function () {
        function Exporter(filepath_export, name_dict) {
            this.filepath_export = filepath_export;
            this.dict = new Dict(name_dict);
            this.clips = {};
        }
        Exporter.prototype.set_notes = function (name_part, notes) {
            this.clips[name_part] = notes;
        };
        Exporter.prototype.unset_notes = function (name_part) {
            this.clips[name_part] = null;
        };
        Exporter.prototype.set_tempo = function (bpm) {
            this.tempo = bpm;
        };
        Exporter.prototype.set_length = function (beats) {
            this.length_beats = beats;
        };
        Exporter.get_messages = function (notes) {
            var messages = [];
            messages.push(['notes', notes.length.toString()].join(' '));
            for (var i_note in notes) {
                messages.push(notes[i_note].model.note.encode());
            }
            messages.push(['notes', 'done'].join(' '));
            return messages;
        };
        Exporter.prototype.export_clips = function (partnames) {
            var _a;
            var messenger = new Messenger('max', 0);
            for (var name_part in this.clips) {
                var notes = this.clips[name_part];
                if (partnames.indexOf(name_part) !== -1) {
                    var key = [name_part, 'notes'].join('::');
                    this.dict.replace(key, "");
                    (_a = this.dict).set.apply(_a, [key].concat(Exporter.get_messages(notes)));
                }
            }
            this.dict.replace('tempo', this.tempo);
            this.dict.replace('length_beats', this.length_beats);
            this.dict.export_json(this.filepath_export);
            messenger.message(['python']);
        };
        return Exporter;
    }());
    io.Exporter = Exporter;
    var Importer = /** @class */ (function () {
        function Importer(filepath_import, name_dict) {
            this.filepath_import = filepath_import;
            this.dict = new Dict(name_dict);
        }
        Importer.prototype.import = function () {
            this.dict.import_json(this.filepath_import);
        };
        Importer.prototype.get_notes = function (name_part) {
            var key = [name_part, 'notes'].join('::');
            return clip_1.clip.Clip.parse_note_messages(this.dict.get(key));
        };
        return Importer;
    }());
    io.Importer = Importer;
})(io = exports.io || (exports.io = {}));

},{"../clip/clip":1,"../message/messenger":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note;
(function (note) {
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
        // to_json():any {
        //     return {
        //         pitch: this.pitch,
        //         beat_start: this.beat_start,
        //         beats_duration: this.beats_duration,
        //         velocity: this.velocity,
        //         muted: this.muted
        //     }
        // }
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
    note.Note = Note;
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
    note.NoteIterator = NoteIterator;
})(note = exports.note || (exports.note = {}));

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var io_1 = require("../io/io");
var Exporter = io_1.io.Exporter;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var exporter = new Exporter('/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/music/src/cache/json/live/from_live.json');
var set_length = function () {
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    exporter.set_length(clip_highlighted.get("length"));
};
var set_tempo = function () {
    var song = new live_1.live.LiveApiJs('live_set');
    exporter.set_tempo(song.get('tempo'));
};
var add = function (name_part) {
    var song = new live_1.live.LiveApiJs('live_set');
    var clip_highlighted = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(clip_highlighted, new messenger_1.message.Messenger(env, 0), false));
    var notes = clip.get_notes(0, 0, clip_highlighted.get("length"), 128);
    exporter.set_notes(name_part, notes);
};
var remove = function (name_part) {
    exporter.unset_notes(name_part);
};
var export_clips = function () {
    exporter.export_clips(['melody', 'chord', 'bass']);
};
var test = function () {
    // let song = new li.LiveApiJs(
    //     'live_set'
    // );
    //
    // let clip_highlighted = new li.LiveApiJs(
    //     'live_set view highlighted_clip_slot clip'
    // );
    //
    // let length_clip = clip_highlighted.get("length");
    //
    // let tempo = song.get("tempo");
    //
    // let logger = new Logger(env);
    //
    // logger.log(clip_highlighted.get_id())
};
if (typeof Global !== "undefined") {
    Global.export_clips = {};
    Global.export_clips.test = test;
    Global.export_clips.add = add;
    Global.export_clips.remove = remove;
    Global.export_clips.export_clips = export_clips;
    Global.export_clips.set_length = set_length;
    Global.export_clips.set_tempo = set_tempo;
}

},{"../clip/clip":1,"../io/io":2,"../live/live":3,"../message/messenger":4}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"find-insert-index":7,"mergesort":8}]},{},[6]);

var test = Global.export_clips.test;
var add = Global.export_clips.add;
var remove = Global.export_clips.remove;
var export_clips = Global.export_clips.export_clips;
var set_tempo = Global.export_clips.set_tempo;
var set_length = Global.export_clips.set_length;