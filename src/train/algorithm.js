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
var note_1 = require("../note/note");
var harmony_1 = require("../music/harmony");
var constants_1 = require("../constants/constants");
var clip_1 = require("../clip/clip");
var parse_1 = require("../parse/parse");
var track_1 = require("../track/track");
var iterate_1 = require("./iterate");
var messenger_1 = require("../message/messenger");
var target_1 = require("../target/target");
var live_1 = require("../live/live");
var utils_1 = require("../utils/utils");
var algorithm;
(function (algorithm) {
    algorithm.DETECT = 'detect';
    algorithm.PREDICT = 'predict';
    algorithm.PARSE = 'parse';
    algorithm.DERIVE = 'derive';
    algorithm.FREESTYLE = 'freestyle';
    var Harmony = harmony_1.harmony.Harmony;
    var POLYPHONY = constants_1.modes_texture.POLYPHONY;
    var MONOPHONY = constants_1.modes_texture.MONOPHONY;
    var Clip = clip_1.clip.Clip;
    var Note = note_1.note.Note;
    var ParseTree = parse_1.parse.ParseTree;
    var StructParse = parse_1.parse.StructParse;
    var get_notes_on_track = track_1.track.get_notes_on_track;
    var MatrixIterator = iterate_1.iterate.MatrixIterator;
    var Messenger = messenger_1.message.Messenger;
    var TargetIterator = target_1.target.TargetIterator;
    var LiveApiJs = live_1.live.LiveApiJs;
    var ClipDao = clip_1.clip.ClipDao;
    var FactoryMatrixObjectives = iterate_1.iterate.FactoryMatrixObjectives;
    // logic common to all algorithms
    var SceneIterator = /** @class */ (function () {
        function SceneIterator() {
        }
        // update the clips we'll be using to store user input and retrieve information about it
        SceneIterator.prototype.update_clips = function (clip_user_input_current, clip_user_input_synchronous_current) {
            var list_path_current_s = clip_user_input_synchronous_current.get_path().split(' ');
            var index_clipslot_current_s = list_path_current_s[list_path_current_s.length - 2];
            var list_path_next_s = list_path_current_s;
            var list_path_current = clip_user_input_current.get_path().split(' ');
            var index_clipslot_current = list_path_current[list_path_current.length - 2];
            var list_path_next = list_path_current;
            list_path_next_s[list_path_next_s.length - 2] = index_clipslot_current_s + 1;
            var clip_user_input_synchronous_next = new Clip(new ClipDao(new LiveApiJs(list_path_next_s.join(' ')), new Messenger('max', 0)));
            list_path_next[list_path_next.length - 2] = index_clipslot_current + 1;
            var clip_user_input_next = new Clip(new ClipDao(new LiveApiJs(list_path_next.join(' ')), new Messenger('max', 0), true, 'clip_user_input'));
            clip_user_input_next.set_path_deferlow('set_path_clip_user_input');
            return [clip_user_input_next, clip_user_input_synchronous_next];
        };
        SceneIterator.prototype.advance_scene = function (segment_current, clip_user_input_current, clip_user_input_synchronous_current) {
            segment_current.scene.fire(true);
            this.update_clips(clip_user_input_current, clip_user_input_synchronous_current);
        };
        SceneIterator.prototype.advance = function (messenger, subtarget_current, segment_current) {
            this.advance_scene(segment_current, clip_user_input_current, clip_user_input_synchronous_current);
            this.stream_bounds(messenger, subtarget_current, segment_current);
        };
        return SceneIterator;
    }());
    algorithm.SceneIterator = SceneIterator;
    // logic common to detect and predict
    var Targeted = /** @class */ (function (_super) {
        __extends(Targeted, _super);
        function Targeted() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Targeted.prototype.determine_targets = function (notes_segment_next) {
            if (user_input_handler.mode_texture === POLYPHONY) {
                var chords_grouped = Harmony.group(notes_segment_next);
                var chords_monophonified = [];
                for (var _i = 0, chords_grouped_1 = chords_grouped; _i < chords_grouped_1.length; _i++) {
                    var note_group = chords_grouped_1[_i];
                    chords_monophonified.push(Harmony.monophonify(note_group));
                }
                // return [chords_monophonified[Math.floor(Math.random() * chords_monophonified.length)]];
                return [chords_monophonified[chords_monophonified.length / 2]];
            }
            else if (user_input_handler.mode_texture === MONOPHONY) {
                var notes_grouped_trivial = [];
                for (var _a = 0, notes_segment_next_1 = notes_segment_next; _a < notes_segment_next_1.length; _a++) {
                    var note_2 = notes_segment_next_1[_a];
                    notes_grouped_trivial.push([note_2]);
                }
                // return notes_grouped_trivial
                // TODO: let's put more weight towards the center of the measure
                // return notes_grouped_trivial[Math.floor(Math.random() * notes_grouped_trivial.length)];
                return [notes_grouped_trivial[notes_grouped_trivial.length / 2]];
            }
            else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ');
            }
        };
        Targeted.prototype.get_depth = function () {
            return 1;
        };
        Targeted.prototype.coord_to_index_clip = function (coord) {
            return 0;
        };
        Targeted.prototype.create_struct_parse = function () {
            return null;
        };
        Targeted.prototype.determine_region_present = function (notes_target_next) {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[0].model.note.get_beat_end()
            ];
        };
        Targeted.prototype.get_notes_in_region = function (target, segment) {
            return target.iterator_subtarget.subtargets.map(function (subtarget) {
                return subtarget.note;
            });
        };
        Targeted.prototype.initialize = function () {
            // TODO: add logic
        };
        Targeted.prototype.pause = function (song) {
            song.start();
        };
        Targeted.prototype.postprocess_user_input = function (notes_user_input, subtarget_current) {
            return [subtarget_current.note];
        };
        Targeted.prototype.terminate = function () {
            // TODO: add logic
        };
        Targeted.prototype.pause = function (song) {
            song.stop();
        };
        Targeted.prototype.warrants_advance = function (notes_user_input, subtarget_current) {
            return utils_1.utils.remainder(notes_user_input[0].model.note.pitch, 12) === utils_1.utils.remainder(subtarget_current.note.model.note.pitch, 12);
        };
        Targeted.prototype.create_matrix_targets = function (segments, notes_target_track) {
            var matrix_targets = FactoryMatrixObjectives.create_matrix_objectives(this, segments);
            var _loop_1 = function (i_segment) {
                var segment_1 = segments[Number(i_segment)];
                var notes_in_segment = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_1.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_1.get_endpoints_loop()[1]; });
                var sequence_targets = this_1.determine_targets(notes_in_segment);
                // set the note as muted for predict
                // TODO: do we actually use the user input clip for prediction?  Isn't it just for parsing/deriving to store input and overdub?
                for (var _i = 0, sequence_targets_1 = sequence_targets; _i < sequence_targets_1.length; _i++) {
                    var target_3 = sequence_targets_1[_i];
                    for (var _a = 0, target_2 = target_3; _a < target_2.length; _a++) {
                        var subtarget = target_2[_a];
                        var subtarget_processed = this_1.postprocess_subtarget(subtarget);
                        clip_user_input.remove_notes(subtarget_processed.model.note.beat_start, 0, subtarget_processed.model.note.get_beat_end(), 128);
                        clip_user_input.set_notes([subtarget_processed]);
                    }
                }
                matrix_targets[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            };
            var this_1 = this;
            // TODO: use 'filter' here
            // this.clip_target.load_notes_within_markers();
            for (var i_segment in segments) {
                _loop_1(i_segment);
            }
            return matrix_targets;
        };
        Targeted.stream_subtarget_bounds = function (messenger, subtarget_current, segment_current) {
            var ratio_bound_lower = (subtarget_current.note.model.note.beat_start - segment_current.get_endpoints_loop()[0]) / (segment_current.get_endpoints_loop()[1] - segment_current.get_endpoints_loop()[0]);
            var ratio_bound_upper = (subtarget_current.note.model.note.get_beat_end() - segment_current.get_endpoints_loop()[0]) / (segment_current.get_endpoints_loop()[1] - segment_current.get_endpoints_loop()[0]);
            messenger.message(['bounds', ratio_bound_lower, ratio_bound_upper]);
        };
        Targeted.prototype.stream_bounds = function (messenger, subtarget_current, segment_current) {
            Targeted.stream_subtarget_bounds(messenger, subtarget_current, segment_current);
        };
        Targeted.prototype.initialize_render = function (window, segments) {
            // TODO: implement here because it should be the same for both algorithms
        };
        Targeted.prototype.initialize = function (window, segments) {
            this.create_matrix_targets(window, segments);
            this.initialize_render(window, segments);
        };
        return Targeted;
    }(SceneIterator));
    // logic common to parse and derive
    var Parsed = /** @class */ (function (_super) {
        __extends(Parsed, _super);
        function Parsed() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Parsed.prototype.get_depth = function () {
            return this.depth;
        };
        Parsed.prototype.set_depth = function (depth) {
            this.depth = depth;
        };
        Parsed.prototype.advance = function () {
        };
        Parsed.prototype.coord_to_index_clip = function (coord) {
            if (coord[0] === -1) {
                return 0;
            }
            else {
                return coord[0] + 1;
            }
        };
        Parsed.prototype.create_matrix_targets = function (segments, notes_target_track) {
            return [];
        };
        Parsed.prototype.create_struct_parse = function () {
        };
        Parsed.prototype.determine_children = function () {
        };
        Parsed.prototype.determine_parents = function () {
        };
        Parsed.prototype.determine_region_present = function (notes_target_next) {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ];
        };
        Parsed.prototype.finish_parse = function (struct_parse, segments) {
        };
        Parsed.prototype.get_notes_in_region = function (target, segment) {
            return [segment.get_note()];
        };
        Parsed.prototype.initialize = function () {
            // TODO: add logic
        };
        Parsed.prototype.pause = function (song, clip_user_input) {
            song.set_overdub(0);
            song.set_session_record(0);
            song.stop();
        };
        Parsed.prototype.postprocess_user_input = function (notes_user_input, subtarget_current) {
            return notes_user_input;
        };
        Parsed.prototype.stream_bounds = function (messenger, subtarget_current, segment_current) {
            Parsed.stream_segment_bounds(messenger);
        };
        Parsed.stream_segment_bounds = function (messenger) {
            messenger.message(['bounds', 0, 1]);
        };
        Parsed.prototype.terminate = function (struct_parse, segments) {
            this.finish_parse(struct_parse, segments);
        };
        Parsed.prototype.unpause = function (song, scene_current) {
            song.set_overdub(1);
            song.set_session_record(1);
            scene_current.fire();
        };
        Parsed.prototype.update_roots = function (coords_roots_previous, coords_notes_to_grow, coord_notes_current) {
        };
        Parsed.prototype.warrants_advance = function (notes_user_input, subtarget_current) {
            return true;
        };
        return Parsed;
    }(SceneIterator));
    var Detect = /** @class */ (function (_super) {
        __extends(Detect, _super);
        function Detect(user_input_handler) {
            return _super.call(this, user_input_handler) || this;
        }
        Detect.prototype.get_name = function () {
            return algorithm.DETECT;
        };
        Detect.prototype.postprocess_subtarget = function (note_subtarget) {
            return note_subtarget;
        };
        return Detect;
    }(Targeted));
    algorithm.Detect = Detect;
    var Predict = /** @class */ (function (_super) {
        __extends(Predict, _super);
        function Predict() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Predict.prototype.get_name = function () {
            return algorithm.PREDICT;
        };
        Predict.prototype.postprocess_subtarget = function (note_subtarget) {
            note_subtarget.model.note.muted = 1;
            return note_subtarget;
        };
        return Predict;
    }(Targeted));
    algorithm.Predict = Predict;
    var Parse = /** @class */ (function (_super) {
        __extends(Parse, _super);
        function Parse(user_input_handler) {
            return _super.call(this, user_input_handler) || this;
        }
        Parse.prototype.get_name = function () {
            return algorithm.PARSE;
        };
        Parse.prototype.grow_layer = function (notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(notes_user_input_renderable, notes_to_grow, -1);
        };
        Parse.prototype.initialize_track_user_input = function (segments, track_target, clip_user_input_initial) {
            for (var i_segment in segments) {
                var index_clip_slot_current = Number(i_segment);
                var api_clip_target_synchronous = new LiveApiJs(track_target.track_dao.get_path().split(' ').concat(['clip_slots', index_clip_slot_current, 'clip']).join(' '));
                var clip_target = new Clip(new ClipDao(api_clip_target_synchronous, new Messenger('max', 0)));
                var notes = clip_target.get_notes(clip_target.get_loop_bracket_lower(), 0, clip_target.get_loop_bracket_upper(), 128);
                clip_user_input_initial.remove_notes(clip_target.get_loop_bracket_lower(), 0, clip_target.get_loop_bracket_upper(), 128);
                clip_user_input_initial.set_notes(notes);
            }
        };
        // add the root up to which we're going to parse
        // add the segments as the layer below
        // add the leaf notes
        Parse.prototype.initialize_render = function (window, segments, track_target) {
            var notes_target_track = get_notes_on_track(track_target.track_dao.get_path());
            // first layer
            window.add_note_to_clip_root(StructParse.create_root_from_segments(segments));
            var _loop_2 = function (i_segment) {
                var segment_2 = segments[Number(i_segment)];
                var note_segment = segment_2.get_note();
                var coord_current_virtual_second_layer = [0, Number(i_segment)];
                var notes_leaves = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_2.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_2.get_endpoints_loop()[1]; });
                var coord_current_virtual_leaves = [this_2.get_depth() - 1, Number(i_segment)];
                // second layer
                window.add_notes_to_clip([note_segment], coord_current_virtual_second_layer, this_2);
                // leaves
                window.add_notes_to_clip(notes_leaves, coord_current_virtual_leaves, this_2);
            };
            var this_2 = this;
            for (var i_segment in segments) {
                _loop_2(i_segment);
            }
        };
        Parse.prototype.update_roots = function (coords_roots_previous, coords_notes_previous, coord_notes_current) {
            var coords_roots_new = [];
            var _loop_3 = function (coord_notes_previous) {
                coords_roots_new = coords_roots_new.concat(coords_roots_previous.filter(function (x) {
                    return !(x[0] === coord_notes_previous[0] && x[1] === coord_notes_previous[1]);
                }));
            };
            // remove references to old leaves
            for (var _i = 0, coords_notes_previous_1 = coords_notes_previous; _i < coords_notes_previous_1.length; _i++) {
                var coord_notes_previous = coords_notes_previous_1[_i];
                _loop_3(coord_notes_previous);
            }
            // add references to new leaves
            coords_roots_new.push(coord_notes_current);
        };
        Parse.prototype.get_coords_notes_to_grow = function (coord_notes_input_current) {
            return MatrixIterator.get_coords_below([coord_notes_input_current[0], coord_notes_input_current[1]]);
        };
        // adding the leaf notes to the actual parse tree
        // DO NOT set the root or the segments as nodes immediately below that - do that at the end
        // set the leaf notes as the notes in the target track
        Parse.prototype.initialize_parse = function (struct_parse, segments, track_target) {
            // this is to set the leaves as the notes of the target clip
            var notes_target_track = get_notes_on_track(track_target.track_dao.get_path());
            var _loop_4 = function (i_segment) {
                var segment_3 = segments[Number(i_segment)];
                var notes = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_3.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_3.get_endpoints_loop()[1]; });
                var coord_current_virtual_leaf = [this_3.get_depth() - 1, Number(i_segment)];
                struct_parse.add(notes, coord_current_virtual_leaf, this_3);
            };
            var this_3 = this;
            for (var i_segment in segments) {
                _loop_4(i_segment);
            }
        };
        Parse.prototype.finish_parse = function (struct_parse, segments) {
            // make connections with segments
            for (var i_segment in segments) {
                var segment_4 = segments[Number(i_segment)];
                struct_parse.add([segment_4.get_note()], [0, Number(i_segment)], this);
            }
            struct_parse.set_root(StructParse.create_root_from_segments(segments));
            // make connections with root
            struct_parse.add([Note.from_note_renderable(struct_parse.get_root())], [-1], this);
        };
        return Parse;
    }(Parsed));
    algorithm.Parse = Parse;
    var Derive = /** @class */ (function (_super) {
        __extends(Derive, _super);
        function Derive() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Derive.prototype.get_name = function () {
            return algorithm.DERIVE;
        };
        Derive.prototype.get_coords_notes_to_grow = function (coords_note_input_current) {
            return MatrixIterator.get_coords_above([coords_note_input_current[0], coords_note_input_current[1]]);
        };
        Derive.prototype.grow_layer = function (notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(notes_to_grow, notes_user_input_renderable, -1);
        };
        Derive.prototype.initialize_track_user_input = function (segments, track_target, clip_user_input_initial) {
            return;
        };
        Derive.prototype.initialize_parse = function (struct_parse, segments) {
            // add the root to the tree immediately
            struct_parse.set_root(ParseTree.create_root_from_segments(segments));
            for (var i_segment in segments) {
                var segment_5 = segments[Number(i_segment)];
                var note_3 = segment_5.get_note();
                var coord_current_virtual = [0, Number(i_segment)];
                struct_parse.add([note_3], coord_current_virtual, this);
            }
        };
        Derive.prototype.initialize_render = function (window, segments, track_target) {
            // first layer (root)
            window.add_note_to_clip_root(StructParse.create_root_from_segments(segments));
            for (var i_segment in segments) {
                var segment_6 = segments[Number(i_segment)];
                var note_segment = segment_6.get_note();
                var coord_current_virtual_second_layer = [0, Number(i_segment)];
                // second layer
                window.add_notes_to_clip([note_segment], coord_current_virtual_second_layer, this);
            }
        };
        Derive.prototype.finish_parse = function (struct_parse, segments) {
            return;
        };
        return Derive;
    }(Parsed));
    algorithm.Derive = Derive;
})(algorithm = exports.algorithm || (exports.algorithm = {}));
//# sourceMappingURL=algorithm.js.map