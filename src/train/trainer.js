"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var algorithm_1 = require("./algorithm");
var history_1 = require("../history/history");
var target_1 = require("../target/target");
var parse_1 = require("../parse/parse");
var iterate_1 = require("./iterate");
var logger_1 = require("../log/logger");
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
    var StructParse = parse_1.parse.StructParse;
    var FactoryMatrixTargetIterator = iterate_1.iterate.FactoryMatrixTargetIterator;
    var IteratorTrainFactory = iterate_1.iterate.IteratorTrainFactory;
    var Note = note_1.note.Note;
    var Logger = logger_1.log.Logger;
    var Trainer = /** @class */ (function () {
        function Trainer(window, user_input_handler, algorithm, clip_user_input, clip_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_target = clip_target;
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
            // TODO: make the root the length of the entire song
            this.window.add_note_to_clip_root(note_length_full);
            // set first layer, which are the various key center estimates
            for (var i_segment in this.segments) {
                var segment_1 = this.segments[Number(i_segment)];
                var note_2 = segment_1.get_note();
                var coord_current_virtual = [0, Number(i_segment)];
                this.struct_parse.set_notes([note_2], coord_current_virtual);
                this.window.add_notes_to_clip([note_2], coord_current_virtual);
            }
            switch (this.algorithm.get_name()) {
                case PARSE: {
                    for (var i_segment in this.segments) {
                        var segment_2 = this.segments[Number(i_segment)];
                        var notes = this.clip_target.get_notes(segment_2.beat_start, 0, segment_2.beat_end - segment_2.beat_start, 128);
                        var coord_current_virtual = [this.algorithm.get_depth() - 1, Number(i_segment)];
                        this.struct_parse.set_notes(notes, coord_current_virtual);
                        this.window.add_notes_to_clip(notes, coord_current_virtual);
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
            this.clip_target.load_notes_within_markers();
            for (var i_segment in this.segments) {
                var sequence_targets = this.algorithm.determine_targets(this.clip_target.get_notes(this.segments[Number(i_segment)].beat_start, 0, this.segments[Number(i_segment)].beat_end - this.segments[Number(i_segment)].beat_start, 128));
                this.matrix_focus[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            }
        };
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            var notes;
            if (this.algorithm.b_targeted()) {
                notes = this.target_current.iterator_subtarget.subtargets.map(function (subtarget) {
                    return subtarget.note;
                });
            }
            else {
                notes = [this.segment_current.get_note()];
            }
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
        Trainer.prototype.set_loop = function () {
            var interval = this.segment_current.get_endpoints_loop();
            this.clip_user_input.set_endpoints_loop(interval[0], interval[1]);
        };
        Trainer.prototype.resume = function () {
            this.algorithm.post_init();
        };
        Trainer.prototype.pause = function () {
            var logger = new Logger('max');
            logger.log(JSON.stringify(this.song));
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
                this.advance_segment();
            }
            if (!virtual) {
                this.algorithm.post_init(this.song, this.clip_user_input);
            }
        };
        Trainer.prototype.advance_segment = function () {
            var obj_next_coord = this.iterator_matrix_train.next();
            if (obj_next_coord.done) {
                switch (this.algorithm.get_name()) {
                    case PARSE: {
                        // make connections with segments
                        for (var i_segment in this.segments) {
                            var segment_3 = this.segments[Number(i_segment)];
                            this.struct_parse.add([segment_3.get_note()], [0, Number(i_segment)], this.algorithm);
                        }
                        // make conncetions with root
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
        };
        Trainer.prototype.advance_subtarget = function () {
            var have_not_begun = (!this.iterator_matrix_train.b_started);
            if (have_not_begun) {
                this.iterator_matrix_train.next();
                this.iterator_target_current = this.matrix_focus[0][0];
                this.iterator_target_current.next();
                this.target_current = this.iterator_target_current.current();
                this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                this.iterator_subtarget_current.next();
                this.subtarget_current = this.iterator_subtarget_current.current();
                this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];
                return;
            }
            var target_at_time = this.iterator_target_current.targets;
            var coord_at_time = this.iterator_matrix_train.get_coord_current();
            var obj_next_subtarget = this.iterator_subtarget_current.next();
            if (obj_next_subtarget.done) {
                var obj_next_target = this.iterator_target_current.next();
                if (obj_next_target.done) {
                    var obj_next_coord = this.iterator_matrix_train.next();
                    this.history_user_input.add(target_at_time, coord_at_time);
                    if (obj_next_coord.done) {
                        this.history_user_input.add(target_at_time, coord_at_time);
                        this.algorithm.pre_terminate();
                        return;
                    }
                    var coord_next = obj_next_coord.value;
                    this.iterator_target_current = this.matrix_focus[coord_next[0]][coord_next[1]];
                    this.segment_current = this.segments[coord_next[1]];
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
            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];
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
                this.render_window();
                return;
            }
            // detect/predict logic
            if (notes_input_user[0].model.note.pitch === this.subtarget_current.note.model.note.pitch) {
                this.window.add_notes_to_clip([this.subtarget_current.note], this.iterator_matrix_train.get_coord_current());
                if (this.algorithm.b_targeted()) {
                    // set the targets and shit
                }
                this.advance_subtarget();
                this.set_loop();
                this.render_window();
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map