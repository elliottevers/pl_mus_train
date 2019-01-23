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
            this.notes = null;
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
        Clip.prototype.load_notes = function () {
            this.notes = Clip._parse_notes(this._get_notes(0, 0, this.get_end_marker(), 128));
        };
        // TODO: annotations
        Clip.prototype.get_pitch_max = function () {
            var pitch_max = 0;
            for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
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
            for (var _i = 0, _a = this.notes; _i < _a.length; _i++) {
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
        Clip.prototype.get_notes = function () {
            // get_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): TreeModel.Node<Node>[] {
            if (!this.notes) {
                var beat_start = void 0, pitch_midi_min = void 0, beat_end = void 0, pitch_midi_max = void 0;
                beat_start = 0;
                beat_end = this.get_end_marker();
                pitch_midi_min = 0;
                pitch_midi_max = 128;
                return Clip._parse_notes(this._get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max));
            }
            else {
                return this.notes;
            }
        };
        Clip.prototype._get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return this.clip_dao.get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max);
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
        function ClipDao(index_track, index_clip_slot, messenger, deferlow) {
            var path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
            this.clip_live = new LiveAPI(null, path);
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
                this.messenger.message(["clip_endpoints", "loop_start", beat, "set"]);
            }
            else {
                this.clip_live.set('loop_start', beat);
            }
        };
        ClipDao.prototype.set_loop_bracket_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "loop_end", beat, "set"]);
            }
            else {
                this.clip_live.set('loop_end', beat);
            }
        };
        ClipDao.prototype.set_clip_endpoint_lower = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "start_marker", beat, "set"]);
            }
            else {
                this.clip_live.set('start_marker', beat);
            }
        };
        ClipDao.prototype.set_clip_endpoint_upper = function (beat) {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "end_marker", beat, "set"]);
            }
            else {
                this.clip_live.set('end_marker', beat);
            }
        };
        ClipDao.prototype.fire = function () {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "fire", "call"]);
            }
            else {
                this.clip_live.call('fire');
            }
        };
        ;
        ClipDao.prototype.stop = function () {
            if (this.deferlow) {
                this.messenger.message(["clip_endpoints", "stop", "call"]);
            }
            else {
                this.clip_live.call('stop');
            }
        };
        ;
        ClipDao.prototype.get_notes = function (beat_start, pitch_midi_min, beat_end, pitch_midi_max) {
            return this.clip_live.call('get_notes', beat_start, pitch_midi_min, beat_end, pitch_midi_max);
        };
        ;
        return ClipDao;
    }());
    clip.ClipDao = ClipDao;
})(clip = exports.clip || (exports.clip = {}));

},{"../note/note":4,"tree-model":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log;
(function (log) {
    var Logger = /** @class */ (function () {
        function Logger(env) {
            this.env = env;
        }
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message;
(function (message_1) {
    // TODO: the following
    // type Env = 'max' | 'node';
    var Messenger = /** @class */ (function () {
        function Messenger(env, outlet) {
            this.env = env;
            this.outlet = outlet;
        }
        Messenger.prototype.message = function (message) {
            if (this.env === 'max') {
                this.message_max(message);
            }
            else if (this.env === 'node') {
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note;
(function (note) {
    var Note = /** @class */ (function () {
        function Note(pitch, beat_start, beats_duration, velocity, muted) {
            this.pitch = pitch;
            this.beat_start = beat_start;
            this.beats_duration = beats_duration;
            this.velocity = velocity;
            this.muted = muted;
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
        Note.prototype.get_interval_beats = function () {
            return [this.beat_start, this.beat_start + this.beats_duration];
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var window;
(function (window) {
    var Pwindow = /** @class */ (function () {
        function Pwindow(height, width, messenger) {
            this.beat_to_pixel = function (beat) {
                var num_pixels_in_clip = this.width;
                var num_beats_in_clip = this.get_num_measures_clip() * this.beats_per_measure;
                return beat * (num_pixels_in_clip / num_beats_in_clip);
            };
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            this.clips = [];
            // this.grans_per_measure = 24; // sixteenth and sixteenth triplets quantization
            this.beats_per_measure = 4;
            this.root_parse_tree = null;
            this.list_leaves_current = null;
            // need to count number of measures in clip
            // then multiply that by 24 = granule/measure
            // this is the min size of window in pixels
            // make the width be an integer multiple of this, for convenience
        }
        // NB: this makes the assumption that the end marker is at the end of the clip
        Pwindow.prototype.get_num_measures_clip = function () {
            return this.clips[0].get_num_measures();
        };
        // TODO: make node have indices to both clip and note
        Pwindow.prototype.get_centroid = function (node) {
            var dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;
            // var index_clip = node.get_index_clip();
            // var index_note = node.get_index_note();
            // var clip = this.clips[index_clip];
            // clip.load_notes();
            // var note = clip.get_notes()[index_note];
            var index_clip = node.depth;
            // TODO: determine how to get the index of the clip from just depth of the node
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);
            return [
                dist_from_left_beat_end - ((dist_from_left_beat_end - dist_from_left_beat_start) / 2),
                dist_from_top_note_bottom - ((dist_from_top_note_bottom - dist_from_top_note_top) / 2)
            ];
        };
        ;
        // TODO: add capability to automatically determine parent/children relationships between adjacent tracks
        Pwindow.prototype.add_clip = function (clip) {
            this.clips.push(clip);
            // if (this.clips.length === 1) {
            //     // TODO: fix this, we're assuming the first clip has only the root note for now
            //     let tree: TreeModel = new TreeModel();
            //     this.root_parse_tree = tree.parse(
            //         {
            //             id: -1, // TODO: hashing scheme for clip id and beat start
            //             note: clip.get_notes()[0],
            //             children: []
            //         }
            //     );
            //     this.list_leaves_current = [
            //         this.root_parse_tree
            //     ];
            //     return
            // }
            // var notes_parent = this.list_leaves_current;
            // var notes_child = clip.get_notes();
            // var notes_diff = this.get_diff_notes(notes_parent, notes_child);
            // var notes_parent_diff = notes_diff['parent'];
            // var notes_child_diff = notes_diff['child'];
            // this.list_leaves_current = this.add_layer(notes_parent_diff, notes_child_diff);
        };
        ;
        // TODO: complete return signature
        Pwindow.prototype.get_diff_notes = function (notes_parent, notes_child) {
            var same_start, same_duration, notes_parent_diff, notes_child_diff, index_start_diff, index_end_diff;
            for (var i = 0; i < notes_child.length; i++) {
                same_start = (notes_child[i].model.note.beat_start === notes_parent[i].model.note.beat_start);
                same_duration = (notes_child[i].model.note.beats_duration === notes_parent[i].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_start_diff = i;
                    break;
                }
            }
            for (var i = -1; i > -1 * (notes_child.length + 1); i--) {
                same_start = (notes_child.slice(i)[0].model.note.beat_start === notes_parent.slice(i)[0].model.note.beat_start);
                same_duration = (notes_child.slice(i)[0].model.note.beats_duration === notes_parent.slice(i)[0].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_end_diff = i;
                    break;
                }
            }
            notes_parent_diff = notes_parent.slice(index_start_diff, notes_parent.length + 1 - index_end_diff);
            notes_child_diff = notes_child.slice(index_start_diff, notes_child.length + 1 - index_end_diff);
            return {
                'parent': notes_parent_diff,
                'child': notes_child_diff
            };
        };
        ;
        Pwindow.prototype.render_tree = function () {
            var messages = this.get_messages_render_tree();
            for (var i = 0; i < messages.length; i++) {
                this.messenger.message(messages[i]);
            }
        };
        ;
        // TODO: how do we render when there is no singular root (i.e. parsing, not sampling, sentence)?
        Pwindow.prototype.get_messages_render_tree = function () {
            var _this = this;
            var messages = [];
            this.root_parse_tree.walk(function (node) {
                if (node.hasChildren()) {
                    for (var child in node.children) {
                        messages.push([
                            "linesegment",
                            _this.get_centroid(child)[0],
                            _this.get_centroid(child)[1],
                            _this.get_centroid(node)[0],
                            _this.get_centroid(node)[1]
                        ]);
                    }
                }
                return true;
            });
            // isRoot(): boolean;
            // hasChildren(): boolean;
            // addChild(child: Node<T>): Node<T>;
            // addChildAtIndex(child: Node<T>, index: number): Node<T>;
            // setIndex(index: number): Node<T>;
            // getPath(): Array<Node<T>>;
            // getIndex(): number;
            //
            // walk(options: Options, fn: NodeVisitorFunction<T>, ctx?: object): void;
            // walk(fn: NodeVisitorFunction<T>, ctx?: object): void;
            //
            // all(options: Options, fn: NodeVisitorFunction<T>, ctx?: object): Array<Node<T>>;
            // all(fn: NodeVisitorFunction<T>, ctx?: object): Array<Node<T>>;
            //
            // first(options: Options, fn: NodeVisitorFunction<T>, ctx?: object): Node<T> | undefined;
            // first(fn: NodeVisitorFunction<T>, ctx?: object): Node<T> | undefined;
            //
            // drop(): Node<T>;
            // this.parse_tree.traverseDown(iterator.bind(this));
            return messages;
        };
        ;
        // NB: only works top down currently
        Pwindow.prototype.add_layer = function (notes_parent, notes_child) {
            // // TODO: fix this, we're assuming the first clip has only the root note for now
            // if (notes_parents === null) {
            //     this.parse_tree = new tr.Tree(null, notes_parents[0]);
            //     return notes_parents;
            // }
            var note_parent_best, b_successful;
            var num_successes = 0;
            var testing = 1;
            for (var _i = 0, notes_child_1 = notes_child; _i < notes_child_1.length; _i++) {
                var node = notes_child_1[_i];
                note_parent_best = node.model.note.get_best_candidate(notes_parent);
                b_successful = node.model.note.choose();
                if (b_successful) {
                    note_parent_best.addChild(node);
                    num_successes += 1;
                }
            }
            var b_layer_successful = (num_successes === notes_child.length);
            if (b_layer_successful) {
                return notes_child; // new leaves
            }
            else {
                throw 'adding layer unsuccessful';
            }
        };
        ;
        Pwindow.prototype.render_clips = function () {
            var messages = this.get_messages_render_clips();
            for (var i = 0; i < messages.length; i++) {
                this.messenger.message(messages[i]);
            }
        };
        ;
        // TODO: return signature
        Pwindow.prototype.get_messages_render_clips = function () {
            var messages = [];
            for (var index_clip in this.clips) {
                messages = messages.concat(this.get_messages_render_notes(Number(index_clip)));
            }
            return messages;
        };
        ;
        Pwindow.prototype.get_messages_render_notes = function (index_clip) {
            var clip = this.clips[index_clip];
            var quadruplets = [];
            for (var _i = 0, _a = clip.get_notes(); _i < _a.length; _i++) {
                var node = _a[_i];
                quadruplets.push(this.get_position_quadruplet(node, index_clip));
            }
            return quadruplets.map(function (tuplet) {
                return ["paintrect"].concat(tuplet);
            });
        };
        ;
        Pwindow.prototype.get_position_quadruplet = function (node, index_clip) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);
            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom];
        };
        ;
        Pwindow.prototype.get_dist_from_top = function (pitch, index_clip) {
            var clip = this.clips[index_clip];
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(index_clip);
            return dist + (this.get_height_clip() * index_clip);
        };
        ;
        Pwindow.prototype.get_dist_from_left = function (beat) {
            return this.beat_to_pixel(beat);
        };
        ;
        Pwindow.prototype.get_height_clip = function () {
            return this.height / this.clips.length;
        };
        ;
        Pwindow.prototype.get_height_note = function (index_clip) {
            var ambitus = this.get_ambitus(index_clip);
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };
        ;
        Pwindow.prototype.get_ambitus = function (index_clip) {
            return this.clips[index_clip].get_ambitus();
        };
        ;
        return Pwindow;
    }());
    window.Pwindow = Pwindow;
})(window = exports.window || (exports.window = {}));

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_5 = require("./clip/clip");
var messenger_1 = require("./message/messenger");
// const sinon = require("sinon");
var window_1 = require("./render/window");
var logger_1 = require("./log/logger");
autowatch = 1;
// let env: string = process.argv[2];
// TODO: handle better
var env = 'max';
var main = function () {
    // clip 1
    var clip_dao_1 = new clip_5.clip.ClipDao(15, 0, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_1, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_1, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_1, "get_notes").callsFake(() => {
    //     return ["notes",1,"note",50,0,4,127,0,"done"]
    // });
    // clip 2
    var clip_dao_2 = new clip_5.clip.ClipDao(14, 0, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_2, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_2, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_2, "get_notes").callsFake(() => {
    //     return ["notes",2,"note",50,0,2,127,0,"note",54,2,2,127,0,"done"]
    // });
    // clip 3
    var clip_dao_3 = new clip_5.clip.ClipDao(13, 0, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_3, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_3, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_3, "get_notes").callsFake(() => {
    //     return ["notes",3,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,2,127,0,"done"]
    // });
    // clip 4
    var clip_dao_4 = new clip_5.clip.ClipDao(12, 0, new messenger_1.message.Messenger(env, 0), false);
    // sinon.stub(clip_dao_4, "get_start_marker").callsFake(() => {
    //     return 0;
    // });
    // sinon.stub(clip_dao_4, "get_end_marker").callsFake(() => {
    //     return 4;
    // });
    // sinon.stub(clip_dao_4, "get_notes").callsFake(() => {
    //     return ["notes",4,"note",50,0,1,127,0,"note",52,1,1,127,0,"note",54,2,1,127,0,"note",55,3,1,127,0,"done"]
    // });
    var clip_1 = new clip_5.clip.Clip(clip_dao_1);
    var clip_2 = new clip_5.clip.Clip(clip_dao_2);
    var clip_3 = new clip_5.clip.Clip(clip_dao_3);
    var clip_4 = new clip_5.clip.Clip(clip_dao_4);
    clip_1.load_notes();
    clip_2.load_notes();
    clip_3.load_notes();
    clip_4.load_notes();
    var dim = 16 * 6 * 4;
    var pwindow = new window_1.window.Pwindow(dim, dim, new messenger_1.message.Messenger(env, 0));
    pwindow.add_clip(clip_4);
    pwindow.add_clip(clip_3);
    pwindow.add_clip(clip_2);
    pwindow.add_clip(clip_1);
    var messages = pwindow.get_messages_render_clips();
    var logger = new logger_1.log.Logger(env);
    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
        var message = messages_1[_i];
        logger.log(message);
        // logger.log('compiled')
    }
};
if (typeof Global !== "undefined") {
    Global.renderer = {};
    Global.renderer.main = main;
}

},{"./clip/clip":1,"./log/logger":2,"./message/messenger":3,"./render/window":5}],7:[function(require,module,exports){
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

var main = Global.renderer.main;