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
var harmony_1 = require("../music/harmony");
var constants_1 = require("../constants/constants");
var parse_1 = require("../parse/parse");
var iterate_1 = require("./iterate");
var target_1 = require("../target/target");
var utils_1 = require("../utils/utils");
var _ = require('underscore');
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
    var ParseTree = parse_1.parse.ParseTree;
    var StructParse = parse_1.parse.StructParse;
    var MatrixIterator = iterate_1.iterate.MatrixIterator;
    var TargetIterator = target_1.target.TargetIterator;
    var FactoryMatrixObjectives = iterate_1.iterate.FactoryMatrixObjectives;
    // logic common to detect and predict
    var Targeted = /** @class */ (function () {
        function Targeted() {
            this.b_parsed = false;
            this.b_targeted = true;
        }
        Targeted.prototype.update_history_user_input = function (input_postprocessed, history_user_input, iterator_matrix_train, trainable) {
            history_user_input.concat(input_postprocessed, 
            // trainable.coord_in_indeiterator_matrix_train.get_coord_current()
            trainable.coord_to_index_history_user_input(iterator_matrix_train.get_coord_current()));
            return history_user_input;
        };
        Targeted.prototype.get_num_layers_input = function () {
            return 1;
        };
        // coord_to_index_clip(coord: number[]): number {
        //     return 0;
        // }
        Targeted.prototype.determine_region_present = function (notes_target_next, segment_current) {
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
        Targeted.prototype.unpause = function (song, scene_current) {
            // not forcing legato so that it starts immediately
            scene_current.fire(false);
            song.set_session_record(1);
            song.set_overdub(1);
        };
        Targeted.prototype.postprocess_user_input = function (notes_user_input, subtarget_current) {
            return [subtarget_current.note];
        };
        // TODO: verify that we don't need to do anything
        Targeted.prototype.terminate = function (struct_train, segments) {
            return;
        };
        Targeted.prototype.pause = function (song, scene_current) {
            song.stop();
        };
        Targeted.prototype.warrants_advance = function (notes_user_input, subtarget_current) {
            return utils_1.utils.remainder(notes_user_input[0].model.note.pitch, 12) === utils_1.utils.remainder(subtarget_current.note.model.note.pitch, 12);
        };
        Targeted.prototype.preprocess_struct_train = function (struct_train, segments, notes_target_track) {
            return this.preprocess_struct_targets(struct_train, segments, notes_target_track);
        };
        Targeted.prototype.preprocess_struct_targets = function (struct_targets, segments, notes_target_track) {
            return struct_targets;
        };
        Targeted.prototype.create_matrix_targets = function (user_input_handler, segments, notes_target_track) {
            var matrix_targets = FactoryMatrixObjectives.create_matrix_targets(this, segments);
            var _loop_1 = function (i_segment) {
                var segment_1 = segments[Number(i_segment)];
                var notes_in_segment = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_1.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_1.get_endpoints_loop()[1]; });
                var sequence_targets = this_1.determine_targets(user_input_handler, notes_in_segment);
                matrix_targets[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            };
            var this_1 = this;
            for (var i_segment in segments) {
                _loop_1(i_segment);
            }
            return matrix_targets;
        };
        Targeted.stream_subtarget_bounds = function (messenger, subtarget_current, segment_current, segments) {
            var duration_training_data = segments[segments.length - 1].beat_end;
            messenger.message(['duration_training_data', duration_training_data], true);
            messenger.message([
                'bounds',
                subtarget_current.note.model.note.beat_start / duration_training_data,
                subtarget_current.note.model.note.get_beat_end() / duration_training_data
            ], true);
        };
        Targeted.prototype.stream_bounds = function (messenger, subtarget_current, segment_current, segments) {
            Targeted.stream_subtarget_bounds(messenger, subtarget_current, segment_current, segments);
        };
        Targeted.prototype.update_struct = function (notes_input_user, struct_train, trainable, iterator_matrix_train) {
            return struct_train;
        };
        Targeted.prototype.create_struct_train = function (window, segments, track_target, user_input_handler, struct_train) {
            var notes_target_track = track_target.get_notes();
            return this.create_matrix_targets(user_input_handler, segments, notes_target_track);
        };
        Targeted.prototype.set_depth = function () {
        };
        Targeted.prototype.advance_scene = function (scene_current, song) {
            scene_current.fire(true);
        };
        Targeted.prototype.preprocess_history_user_input = function (history_user_input, segments) {
            return history_user_input;
        };
        Targeted.prototype.get_num_layers_clips_to_render = function () {
            return 1;
        };
        Targeted.prototype.coord_to_index_clip_render = function (coord) {
            return 0;
        };
        Targeted.prototype.coord_to_index_history_user_input = function (coord) {
            return coord;
        };
        Targeted.prototype.coord_to_index_struct_train = function (coord) {
            return coord;
        };
        return Targeted;
    }());
    algorithm.Targeted = Targeted;
    // logic common to parse and derive
    var Parsed = /** @class */ (function () {
        function Parsed() {
            this.b_parsed = true;
            this.b_targeted = false;
        }
        Parsed.prototype.update_struct = function (notes_input_user, struct_train, trainable, iterator_matrix_train) {
            var struct_parse = struct_train;
            struct_parse.add(notes_input_user, 
            // iterator_matrix_train.get_coord_current(),
            trainable.coord_to_index_struct_train(iterator_matrix_train.get_coord_current()), trainable);
            return struct_parse;
        };
        Parsed.prototype.update_history_user_input = function (input_postprocessed, history_user_input, iterator_matrix_train, trainable) {
            history_user_input.concat(input_postprocessed, trainable.coord_to_index_history_user_input(iterator_matrix_train.get_coord_current()));
            return history_user_input;
        };
        Parsed.prototype.set_depth = function (depth) {
            this.depth = depth;
        };
        Parsed.prototype.coord_to_index_clip_render = function (coord) {
            if (coord[0] === -1) {
                return 0;
            }
            else {
                return coord[0] + 1;
            }
        };
        Parsed.prototype.create_struct_parse = function (segments) {
            return new StructParse(FactoryMatrixObjectives.create_matrix_parse(this, segments));
        };
        Parsed.prototype.determine_region_present = function (notes_target_next, segment_current) {
            // return [
            //     notes_target_next[0].model.note.beat_start,
            //     notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            // ]
            // let logger = new Logger('max');
            // logger.log(JSON.stringify(segment_current));
            return [
                segment_current.beat_start,
                segment_current.beat_end
            ];
        };
        Parsed.prototype.finish_parse = function (struct_parse, segments) {
        };
        Parsed.prototype.get_notes_in_region = function (target, segment) {
            return [segment.get_note()];
        };
        Parsed.prototype.preprocess_struct_train = function (struct_train, segments, notes_target_track) {
            return this.preprocess_struct_parse(struct_train, segments, notes_target_track);
        };
        Parsed.prototype.pause = function (song, scene_current) {
            song.set_overdub(0);
            song.set_session_record(0);
            song.stop();
        };
        Parsed.prototype.postprocess_user_input = function (notes_user_input, subtarget_current) {
            return notes_user_input;
        };
        Parsed.prototype.stream_bounds = function (messenger, subtarget_current, segment_current, segments) {
            Parsed.stream_segment_bounds(messenger, subtarget_current, segment_current, segments);
        };
        Parsed.stream_segment_bounds = function (messenger, subtarget_current, segment_current, segments) {
            messenger.message(['duration_training_data', segments[segments.length - 1].beat_end], true);
            messenger.message(['bounds', 0, 1], true);
        };
        Parsed.prototype.terminate = function (struct_train, segments) {
            this.finish_parse(struct_train, segments);
        };
        Parsed.prototype.unpause = function (song, scene_current) {
            scene_current.fire(false);
            song.set_overdub(1);
            song.set_session_record(1);
        };
        Parsed.prototype.warrants_advance = function (notes_user_input, subtarget_current) {
            return true;
        };
        Parsed.prototype.create_struct_train = function (window, segments, track_target, user_input_handler, struct_train) {
            return this.create_struct_parse(segments);
        };
        Parsed.prototype.advance_scene = function (scene_current, song) {
            scene_current.fire(true);
            song.set_overdub(1);
            song.set_session_record(1);
        };
        Parsed.prototype.preprocess_history_user_input = function (history_user_input, segments) {
            // for (let i_segment in segments) {
            //     let segment = segments[Number(i_segment)];
            //     history_user_input.concat(
            //         [segment.get_note()],
            //         [0, Number(i_segment)]
            //     )
            // }
            return history_user_input;
        };
        // we skip over the root and the segments layer
        // to_index_history_user_input(coord: number[]): number[] {
        //     return [coord[0] - 2, coord[1]];
        // }
        // the root is prepended to clips
        // coord_to_index_clip_render(coord: number[]): number {
        //     return coord[0] + 1;
        // }
        // we skip over the segments layer
        Parsed.prototype.coord_to_index_history_user_input = function (coord) {
            return [coord[0] - 1, coord[1]];
        };
        // the root is not included in iteration
        Parsed.prototype.coord_to_index_struct_train = function (coord) {
            // return [coord[0] - 1, coord[1]];
            return coord;
        };
        return Parsed;
    }());
    algorithm.Parsed = Parsed;
    var Detect = /** @class */ (function (_super) {
        __extends(Detect, _super);
        function Detect() {
            return _super.call(this) || this;
        }
        Detect.prototype.determine_targets = function (user_input_handler, notes_segment_next) {
            if (user_input_handler.mode_texture === POLYPHONY) {
                var chords_grouped = Harmony.group(notes_segment_next);
                var chords_monophonified = [];
                for (var _i = 0, chords_grouped_1 = chords_grouped; _i < chords_grouped_1.length; _i++) {
                    var note_group = chords_grouped_1[_i];
                    chords_monophonified.push(Harmony.monophonify(note_group));
                }
                return chords_monophonified;
            }
            else if (user_input_handler.mode_texture === MONOPHONY) {
                var notes_grouped_trivial = [];
                for (var _a = 0, notes_segment_next_1 = notes_segment_next; _a < notes_segment_next_1.length; _a++) {
                    var note_1 = notes_segment_next_1[_a];
                    notes_grouped_trivial.push([note_1]);
                }
                return notes_grouped_trivial;
            }
            else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ');
            }
        };
        Detect.prototype.get_name = function () {
            return algorithm.DETECT;
        };
        Detect.prototype.postprocess_subtarget = function (note_subtarget) {
            return note_subtarget;
        };
        // TODO: verify that we don't have to do anything here
        Detect.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            return window;
        };
        Detect.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            return;
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
        Predict.prototype.determine_targets = function (user_input_handler, notes_segment_next) {
            if (user_input_handler.mode_texture === POLYPHONY) {
                // let chords_grouped: TreeModel.Node<n.Note>[][] = Harmony.group(
                //     notes_segment_next
                // );
                //
                // let chords_monophonified: TypeSequenceTarget = [];
                //
                // for (let note_group of chords_grouped) {
                //     chords_monophonified.push(
                //         Harmony.monophonify(
                //             note_group
                //         )
                //     );
                // }
                throw 'polyphonic targets for prediction not yet implemented';
            }
            else if (user_input_handler.mode_texture === MONOPHONY) {
                var notes_grouped = [];
                // partition segment into measures
                var position_measure = function (node) {
                    return Math.floor(node.model.note.beat_start / 4);
                };
                var note_partitions = _.groupBy(notes_segment_next, position_measure);
                // for (let partition of note_partitions) {
                //     // get the middle note of the measure
                //     notes_grouped.push([partition[partition.length/2]])
                // }
                for (var _i = 0, _a = Object.keys(note_partitions); _i < _a.length; _i++) {
                    var key_partition = _a[_i];
                    var partition = note_partitions[key_partition];
                    notes_grouped.push([partition[partition.length / 2]]);
                }
                return notes_grouped;
            }
            else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ');
            }
        };
        Predict.prototype.postprocess_subtarget = function (note_subtarget) {
            note_subtarget.model.note.muted = 1;
            return note_subtarget;
        };
        // TODO: verify that we don't have to do anythiing here
        Predict.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            return window;
        };
        // NB: we only have to initialize clips in the target track
        Predict.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            var matrix_targets = struct_train;
            for (var i_segment in segments) {
                var segment_2 = segments[Number(i_segment)];
                var targeted_notes_in_segment = matrix_targets[0][Number(i_segment)].get_notes();
                // TODO: this won't work for polyphony
                for (var _i = 0, targeted_notes_in_segment_1 = targeted_notes_in_segment; _i < targeted_notes_in_segment_1.length; _i++) {
                    var note_2 = targeted_notes_in_segment_1[_i];
                    segment_2.clip_user_input.remove_notes(note_2.model.note.beat_start, 0, note_2.model.note.get_beat_end(), 128);
                    segment_2.clip_user_input.set_notes([note_2]);
                }
            }
        };
        return Predict;
    }(Targeted));
    algorithm.Predict = Predict;
    var Parse = /** @class */ (function (_super) {
        __extends(Parse, _super);
        function Parse() {
            return _super.call(this) || this;
        }
        Parse.prototype.get_name = function () {
            return algorithm.PARSE;
        };
        Parse.prototype.grow_layer = function (notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(notes_user_input_renderable, notes_to_grow, -1);
        };
        // TODO: we don't need the target track - we should 1) transfer all notes over to user input track and 2) mute the track
        Parse.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            // transfer notes from target track to user input track
            for (var i_segment in segments) {
                var clip_target = track_target.get_clip_at_index(Number(i_segment));
                var clip_user_input = track_user_input.get_clip_at_index(Number(i_segment));
                var notes = clip_target.get_notes(clip_target.get_loop_bracket_lower(), 0, clip_target.get_loop_bracket_upper(), 128);
                clip_user_input.remove_notes(clip_target.get_loop_bracket_lower(), 0, clip_target.get_loop_bracket_upper(), 128);
                clip_user_input.set_notes(notes);
            }
            // mute target track
            track_target.mute();
        };
        // add the root up to which we're going to parse
        // add the segments as the layer below
        // add the leaf notes
        Parse.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            // first layer
            window.add_note_to_clip_root(StructParse.create_root_from_segments(segments));
            // window.regions_renderable.push(coords_parse);
            var struct_parse = struct_train;
            struct_parse.regions_renderable.push([-1]);
            var _loop_2 = function (i_segment) {
                var segment_3 = segments[Number(i_segment)];
                var note_segment = segment_3.get_note();
                var coord_current_virtual_second_layer = [0, Number(i_segment)];
                var notes_leaves = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_3.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_3.get_endpoints_loop()[1]; });
                var coord_current_virtual_leaves = [this_2.depth - 1, Number(i_segment)];
                // second layer
                window.add_notes_to_clip([note_segment], this_2.coord_to_index_clip_render(coord_current_virtual_second_layer));
                struct_parse.regions_renderable.push(this_2.coord_to_index_struct_train(coord_current_virtual_second_layer));
                // leaves
                window.add_notes_to_clip(notes_leaves, this_2.coord_to_index_clip_render(coord_current_virtual_leaves));
            };
            var this_2 = this;
            for (var i_segment in segments) {
                _loop_2(i_segment);
            }
            return window;
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
            return coords_roots_new;
        };
        Parse.prototype.get_coords_notes_to_grow = function (coord_notes_input_current) {
            return MatrixIterator.get_coords_below([coord_notes_input_current[0], coord_notes_input_current[1]]);
        };
        // adding the leaf notes to the actual parse tree
        // DO NOT set the root or the segments as nodes immediately below that - do that at the end
        // set the leaf notes as the notes in the target track
        Parse.prototype.preprocess_struct_parse = function (struct_parse, segments, notes_target_track) {
            // this is to set the leaves as the notes of the target clip
            var _loop_4 = function (i_segment) {
                var segment_4 = segments[Number(i_segment)];
                var notes = notes_target_track.filter(function (node) { return node.model.note.beat_start >= segment_4.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_4.get_endpoints_loop()[1]; });
                var coord_parse_current_virtual_leaf = [this_3.depth - 1, Number(i_segment)];
                struct_parse.add(notes, coord_parse_current_virtual_leaf, this_3, true);
            };
            var this_3 = this;
            // struct_parse.set_root(
            //     ParseTree.create_root_from_segments(
            //         segments
            //     )
            // );
            for (var i_segment in segments) {
                _loop_4(i_segment);
            }
            return struct_parse;
        };
        Parse.prototype.finish_parse = function (struct_parse, segments) {
            var coords_to_grow = [];
            // make connections with segments
            for (var i_segment in segments) {
                coords_to_grow.push([0, Number(i_segment)]);
                var segment_5 = segments[Number(i_segment)];
                struct_parse.add([segment_5.get_note()], [0, Number(i_segment)], this);
            }
            struct_parse.set_root(StructParse.create_root_from_segments(segments));
            for (var _i = 0, coords_to_grow_1 = coords_to_grow; _i < coords_to_grow_1.length; _i++) {
                var coord_to_grow = coords_to_grow_1[_i];
                var notes_to_grow = struct_parse.get_notes_at_coord(coord_to_grow);
                this.grow_layer([struct_parse.get_root()], notes_to_grow);
            }
            struct_parse.coords_roots = this.update_roots(struct_parse.coords_roots, coords_to_grow, [-1]);
        };
        // segments layer and leaves layer don't count
        Parse.prototype.get_num_layers_input = function () {
            return this.depth - 2;
        };
        Parse.prototype.get_num_layers_clips_to_render = function () {
            return this.depth + 1;
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
        Derive.prototype.initialize_tracks = function (segments, track_target, track_user_input, struct_train) {
            track_target.mute();
        };
        Derive.prototype.preprocess_struct_parse = function (struct_parse, segments) {
            // add the root to the tree immediately
            struct_parse.set_root(ParseTree.create_root_from_segments(segments));
            for (var i_segment in segments) {
                var segment_6 = segments[Number(i_segment)];
                var note_3 = segment_6.get_note();
                var coord_current_virtual = [0, Number(i_segment)];
                struct_parse.add([note_3], coord_current_virtual, this);
            }
            return struct_parse;
        };
        Derive.prototype.initialize_render = function (window, segments, notes_target_track, struct_train) {
            // first layer (root)
            window.add_note_to_clip_root(StructParse.create_root_from_segments(segments));
            for (var i_segment in segments) {
                var segment_7 = segments[Number(i_segment)];
                var note_segment = segment_7.get_note();
                var coord_current_virtual_second_layer = [0, Number(i_segment)];
                // second layer
                window.add_notes_to_clip([note_segment], this.coord_to_index_clip_render(coord_current_virtual_second_layer));
            }
            return window;
        };
        Derive.prototype.finish_parse = function (struct_parse, segments) {
            return;
        };
        Derive.prototype.update_roots = function (coords_roots_previous, coords_notes_previous, coord_notes_current) {
            return coords_roots_previous;
        };
        // the layer of segments don't count
        Derive.prototype.get_num_layers_input = function () {
            return this.depth - 1;
        };
        Derive.prototype.get_num_layers_clips_to_render = function () {
            return this.depth + 1;
        };
        return Derive;
    }(Parsed));
    algorithm.Derive = Derive;
})(algorithm = exports.algorithm || (exports.algorithm = {}));
//# sourceMappingURL=algorithm.js.map