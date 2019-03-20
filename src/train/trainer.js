"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var algorithm_1 = require("./algorithm");
var history_1 = require("../history/history");
var target_1 = require("../target/target");
var parse_1 = require("../parse/parse");
var messenger_1 = require("../message/messenger");
var clip_1 = require("../clip/clip");
var iterate_1 = require("./iterate");
var utils_1 = require("../utils/utils");
var live_1 = require("../live/live");
var _ = require('underscore');
var l = require('lodash');
var trainer;
(function (trainer) {
    var HistoryUserInput = history_1.history.HistoryUserInput;
    var TargetIterator = target_1.target.TargetIterator;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var Messenger = messenger_1.message.Messenger;
    var Clip = clip_1.clip.Clip;
    var StructParse = parse_1.parse.StructParse;
    var FactoryMatrixTargetIterator = iterate_1.iterate.FactoryMatrixTargetIterator;
    var IteratorTrainFactory = iterate_1.iterate.IteratorTrainFactory;
    var Note = note_1.note.Note;
    var ClipDao = clip_1.clip.ClipDao;
    var LiveApiJs = live_1.live.LiveApiJs;
    var Trainer = /** @class */ (function () {
        function Trainer(window, user_input_handler, algorithm, clip_user_input, clip_user_input_synchronous, notes_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_user_input_synchronous = clip_user_input_synchronous;
            this.notes_target = notes_target;
            this.song = song;
            this.segments = segments;
            this.messenger = messenger;
            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(this.algorithm, this.segments);
            this.matrix_focus = FactoryMatrixTargetIterator.create_matrix_focus(this.algorithm, this.segments);
            this.history_user_input = new HistoryUserInput(l.cloneDeep(this.matrix_focus));
            this.window.initialize_clips(this.algorithm, this.segments);
            this.window.set_length_beats(this.segments[this.segments.length - 1].beat_end);
            if (this.algorithm.b_targeted()) {
                this.create_targets();
            }
            else {
                this.struct_parse = new StructParse(l.cloneDeep(this.matrix_focus));
                this.initialize_struct_parse();
            }
        }
        Trainer.prototype.initialize_struct_parse = function () {
            var note_segment_last = this.segments[this.segments.length - 1].get_note();
            var tree = new TreeModel();
            var note_length_full = tree.parse({
                id: -1,
                note: new note_1.note.Note(note_segment_last.model.note.pitch, this.segments[0].get_note().model.note.beat_start, (note_segment_last.model.note.beat_start + note_segment_last.model.note.beats_duration) - this.segments[0].get_note().model.note.beat_start, note_segment_last.model.note.velocity, note_segment_last.model.note.muted),
                children: []
            });
            this.struct_parse.set_root(note_length_full);
            if (this.algorithm.get_name() === DERIVE) {
                this.struct_parse.coords_roots = [[-1]];
            }
            // TODO: make the root the length of the entire song
            this.window.add_note_to_clip_root(note_length_full);
            // set first layer, which are the various key center estimates
            for (var i_segment in this.segments) {
                var segment_1 = this.segments[Number(i_segment)];
                // let logger = new Logger('max');
                //
                // logger.log(JSON.stringify(segment));
                var note_2 = segment_1.get_note();
                var coord_current_virtual = [0, Number(i_segment)];
                switch (this.algorithm.get_name()) {
                    case DERIVE: {
                        this.struct_parse.add([note_2], coord_current_virtual, this.algorithm);
                        break;
                    }
                    case PARSE: {
                        this.struct_parse.set_notes([note_2], coord_current_virtual);
                        break;
                    }
                }
                this.window.add_notes_to_clip([note_2], coord_current_virtual);
                this.history_user_input.add([note_2], coord_current_virtual);
                this.stream_segment_bounds();
            }
            switch (this.algorithm.get_name()) {
                case PARSE: {
                    var _loop_1 = function (i_segment) {
                        var segment_2 = this_1.segments[Number(i_segment)];
                        // let notes = this.clip_target.get_notes(
                        //     segment.beat_start,
                        //     0,
                        //     segment.beat_end - segment.beat_start,
                        //     128
                        // );
                        var notes = this_1.notes_target.filter(function (node) { return node.model.note.beat_start >= segment_2.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_2.get_endpoints_loop()[1]; });
                        var coord_current_virtual = [this_1.algorithm.get_depth() - 1, Number(i_segment)];
                        this_1.struct_parse.set_notes(notes, coord_current_virtual);
                        this_1.window.add_notes_to_clip(notes, coord_current_virtual);
                    };
                    var this_1 = this;
                    // let notes_within_segment = notes_clip.filter(
                    //     node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                    // );
                    // TODO: use 'filter'
                    for (var i_segment in this.segments) {
                        _loop_1(i_segment);
                    }
                    break;
                }
                case DERIVE: {
                    //  TODO: anything?
                    break;
                }
                default: {
                    throw ['algorithm of name', this.algorithm.get_name(), 'not supported'].join(' ');
                }
            }
        };
        // now we can assume we have a list instead of a matrix
        Trainer.prototype.create_targets = function () {
            // TODO: use 'filter' here
            // this.clip_target.load_notes_within_markers();
            var _loop_2 = function (i_segment) {
                var segment_3 = this_2.segments[Number(i_segment)];
                var notes_in_segment = this_2.notes_target.filter(function (node) { return node.model.note.beat_start >= segment_3.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment_3.get_endpoints_loop()[1]; });
                var sequence_targets = this_2.algorithm.determine_targets(
                // this.clip_target.get_notes(
                //     this.segments[Number(i_segment)].beat_start,
                //     0,
                //     this.segments[Number(i_segment)].beat_end - this.segments[Number(i_segment)].beat_start,
                //     128
                // )
                notes_in_segment);
                for (var _i = 0, sequence_targets_1 = sequence_targets; _i < sequence_targets_1.length; _i++) {
                    var target_3 = sequence_targets_1[_i];
                    for (var _a = 0, target_2 = target_3; _a < target_2.length; _a++) {
                        var subtarget = target_2[_a];
                        var subtarget_processed = this_2.algorithm.postprocess_subtarget(subtarget);
                        this_2.clip_user_input.remove_notes(subtarget_processed.model.note.beat_start, 0, subtarget_processed.model.note.get_beat_end(), 128);
                        this_2.clip_user_input.set_notes([subtarget_processed]);
                    }
                }
                this_2.matrix_focus[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            };
            var this_2 = this;
            for (var i_segment in this.segments) {
                _loop_2(i_segment);
            }
        };
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            var notes = [];
            if (this.algorithm.b_targeted()) {
                notes = this.target_current.iterator_subtarget.subtargets.map(function (subtarget) {
                    return subtarget.note;
                });
            }
            // } else {
            //     // notes = [this.segment_current.get_note()]
            //     notes = []
            // }
            this.window.render(this.iterator_matrix_train, notes, this.algorithm, this.struct_parse);
        };
        Trainer.prototype.reset_user_input = function () {
            if (_.contains([DETECT, PREDICT], this.algorithm.get_name())) {
                var coords = this.iterator_matrix_train.get_coord_current();
                var notes_last = this.matrix_focus[coords[0] - 1][coords[1]].get_notes();
                this.clip_user_input.set_notes(notes_last);
            }
            else {
                return;
            }
        };
        // private set_loop() {
        //     let interval = this.segment_current.get_endpoints_loop();
        //
        //     this.clip_user_input.set_endpoints_loop(
        //         interval[0],
        //         interval[1]
        //     )
        // }
        Trainer.prototype.advance_scene = function (first_time) {
            this.segment_current.scene.fire(true);
            if (first_time) {
                return;
            }
            // clip user input synchronous
            var list_path_current_s = this.clip_user_input_synchronous.get_path().split(' ');
            var index_clipslot_current_s = list_path_current_s[list_path_current_s.length - 2];
            var list_path_next_s = list_path_current_s;
            list_path_next_s[list_path_next_s.length - 2] = index_clipslot_current_s + 1;
            this.clip_user_input_synchronous = new Clip(new ClipDao(new LiveApiJs(list_path_next_s.join(' ')), new Messenger('max', 0)));
            // clip user input deferred
            var list_path_current = this.clip_user_input.get_path().split(' ');
            var index_clipslot_current = list_path_current[list_path_current.length - 2];
            var list_path_next = list_path_current;
            list_path_next[list_path_next.length - 2] = index_clipslot_current + 1;
            var clip_user_input_next = new Clip(new ClipDao(new LiveApiJs(list_path_next.join(' ')), new Messenger('max', 0), true, 'clip_user_input'));
            clip_user_input_next.set_path_deferlow('set_path_clip_user_input');
            this.clip_user_input = clip_user_input_next;
        };
        Trainer.prototype.resume = function () {
            this.algorithm.post_init();
        };
        Trainer.prototype.pause = function () {
            this.algorithm.pre_terminate(this.song, this.clip_user_input);
        };
        Trainer.prototype.terminate = function () {
            this.algorithm.pre_terminate(this.song, this.clip_user_input);
        };
        Trainer.prototype.init = function (virtual) {
            if (this.algorithm.b_targeted()) {
                this.advance_subtarget();
            }
            else {
                this.advance_segment(true);
            }
            if (!virtual) {
                this.algorithm.post_init(this.song, this.clip_user_input);
            }
        };
        Trainer.prototype.advance_segment = function (first_time) {
            var obj_next_coord = this.iterator_matrix_train.next();
            if (obj_next_coord.done) {
                switch (this.algorithm.get_name()) {
                    case PARSE: {
                        // make connections with segments
                        for (var i_segment in this.segments) {
                            var segment_4 = this.segments[Number(i_segment)];
                            this.struct_parse.add([segment_4.get_note()], [0, Number(i_segment)], this.algorithm);
                        }
                        // make connections with root
                        this.struct_parse.add([Note.from_note_renderable(this.struct_parse.get_root())], [-1], this.algorithm);
                        break;
                    }
                    case DERIVE: {
                        break;
                    }
                    default: {
                        throw 'error advancing segment';
                    }
                }
                this.algorithm.pre_terminate(this.song, this.clip_user_input);
                return;
            }
            var coord = obj_next_coord.value;
            this.segment_current = this.segments[coord[1]];
            // TODO: PLEASE put back in
            // this.advance_scene(first_time);
        };
        Trainer.prototype.advance_subtarget = function () {
            var _this = this;
            var have_not_begun = (!this.iterator_matrix_train.b_started);
            if (have_not_begun) {
                this.iterator_matrix_train.next();
                this.iterator_target_current = this.matrix_focus[0][0];
                this.iterator_target_current.next();
                this.target_current = this.iterator_target_current.current();
                this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                this.iterator_subtarget_current.next();
                this.subtarget_current = this.iterator_subtarget_current.current();
                this.handle_boundary_change();
                return;
            }
            var notes_in_segment_at_time = this.notes_target.filter(function (node) { return node.model.note.beat_start >= _this.segment_current.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= _this.segment_current.get_endpoints_loop()[1]; });
            var targets_at_time = this.iterator_target_current.targets;
            var coord_at_time = this.iterator_matrix_train.get_coord_current();
            var obj_next_subtarget = this.iterator_subtarget_current.next();
            if (obj_next_subtarget.done) {
                var obj_next_target = this.iterator_target_current.next();
                if (obj_next_target.done) {
                    var obj_next_coord = this.iterator_matrix_train.next();
                    // TODO: can we add all notes in segment for predict here?
                    var notes_to_add_to_history = [];
                    if (this.algorithm.get_name() === PREDICT) {
                        notes_to_add_to_history = notes_in_segment_at_time;
                    }
                    else {
                        notes_to_add_to_history = targets_at_time;
                    }
                    this.history_user_input.add(notes_to_add_to_history, coord_at_time);
                    if (obj_next_coord.done) {
                        // TODO: can we add all notes in segment for predict here?
                        this.history_user_input.add(notes_to_add_to_history, coord_at_time);
                        this.algorithm.pre_terminate();
                        return;
                    }
                    var coord_next = obj_next_coord.value;
                    this.iterator_target_current = this.matrix_focus[coord_next[0]][coord_next[1]];
                    this.handle_boundary_change();
                    var obj_next_target_twice_nested = this.iterator_target_current.next();
                    this.target_current = obj_next_target_twice_nested.value;
                    var obj_next_subtarget_twice_nested = this.target_current.iterator_subtarget.next();
                    this.subtarget_current = obj_next_subtarget_twice_nested.value;
                    this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                    return;
                }
                this.target_current = obj_next_target.value;
                var obj_next_subtarget_once_nested = this.target_current.iterator_subtarget.next();
                this.subtarget_current = obj_next_subtarget_once_nested.value;
                this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                return;
            }
            this.subtarget_current = obj_next_subtarget.value;
        };
        Trainer.prototype.handle_boundary_change = function () {
            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];
            // TODO: PLEASE put back in
            // this.advance_scene(first_time);
            // if (this.algorithm.b_targeted()) {
            this.stream_subtarget_bounds();
            // } else {
            //     this.stream_segment_bounds();
            // }
        };
        Trainer.prototype.accept_input = function (notes_input_user) {
            this.counter_user_input++;
            if (this.counter_user_input >= this.limit_user_input) {
                this.limit_input_reached = true;
            }
            if (this.limit_input_reached) {
                // completely ignore
                return;
            }
            // parse/derive logic
            if (!this.algorithm.b_targeted()) {
                this.history_user_input.add(notes_input_user, this.iterator_matrix_train.get_coord_current());
                this.window.add_notes_to_clip(notes_input_user, this.iterator_matrix_train.get_coord_current());
                // TODO: implement
                this.struct_parse.add(notes_input_user, this.iterator_matrix_train.get_coord_current(), this.algorithm);
                this.advance_segment();
                this.stream_segment_bounds();
                this.render_window();
                return;
            }
            // let logger = new Logger('max');
            //
            // logger.log(JSON.stringify(notes_input_user[0].model.note.pitch));
            // logger.log(JSON.stringify(this.subtarget_current));
            // logger.log('------------');
            // detect/predict logic
            if (utils_1.utils.remainder(notes_input_user[0].model.note.pitch, 12) === utils_1.utils.remainder(this.subtarget_current.note.model.note.pitch, 12)) {
                this.window.add_notes_to_clip([this.subtarget_current.note], this.iterator_matrix_train.get_coord_current());
                if (this.algorithm.b_targeted()) {
                    // set the targets and shit
                }
                this.advance_subtarget();
                this.stream_subtarget_bounds();
                this.render_window();
            }
        };
        Trainer.prototype.stream_subtarget_bounds = function () {
            var ratio_bound_lower = (this.subtarget_current.note.model.note.beat_start - this.segment_current.get_endpoints_loop()[0]) / (this.segment_current.get_endpoints_loop()[1] - this.segment_current.get_endpoints_loop()[0]);
            var ratio_bound_upper = (this.subtarget_current.note.model.note.get_beat_end() - this.segment_current.get_endpoints_loop()[0]) / (this.segment_current.get_endpoints_loop()[1] - this.segment_current.get_endpoints_loop()[0]);
            this.messenger.message(['bounds', ratio_bound_lower, ratio_bound_upper]);
        };
        Trainer.prototype.stream_segment_bounds = function () {
            this.messenger.message(['bounds', 0, 1]);
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map