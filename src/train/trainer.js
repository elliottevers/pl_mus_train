"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {struct_parse, pwindow} from "../scripts/parse_tree";
var algorithm_1 = require("./algorithm");
var history_1 = require("../history/history");
var target_1 = require("../target/target");
var parse_1 = require("../parse/parse");
var utils_1 = require("../utils/utils");
var _ = require('underscore');
var l = require('lodash');
var trainer;
(function (trainer) {
    var HistoryUserInput = history_1.history.HistoryUserInput;
    var TargetIterator = target_1.target.TargetIterator;
    var division_int = utils_1.utils.division_int;
    var remainder = utils_1.utils.remainder;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var StructParse = parse_1.parse.StructParse;
    var MatrixIterator = /** @class */ (function () {
        function MatrixIterator(num_rows, num_columns, downward, rightward, start_at_row, stop_at_row) {
            this.num_rows = num_rows;
            this.num_columns = num_columns;
            this.downward = downward ? downward : true;
            this.rightward = rightward ? rightward : true;
            this.index_row_start = start_at_row;
            this.index_row_stop = stop_at_row;
            this.determine_index_start();
            this.determine_index_stop();
        }
        MatrixIterator.prototype.determine_index_start = function () {
            var i_start;
            if (this.downward && this.rightward) {
                i_start = -1 + (this.num_columns * this.index_row_start);
            }
            else if (!this.downward && this.rightward) {
                i_start = (this.num_columns * (this.index_row_start + 2)) - 1;
            }
            else if (this.downward && !this.rightward) {
                throw 'not yet supported';
            }
            else if (!this.downward && !this.rightward) {
                throw 'not yet supported';
            }
            else {
                throw 'not yet supported';
            }
            this.index_start = i_start;
        };
        MatrixIterator.prototype.determine_index_stop = function () {
            var i_stop;
            if (this.downward && this.rightward) {
                i_stop = this.index_row_stop * this.num_columns;
            }
            else if (!this.downward && this.rightward) {
                i_stop = this.index_row_stop * this.num_columns;
            }
            else if (this.downward && !this.rightward) {
                throw 'not yet supported';
            }
            else if (!this.downward && !this.rightward) {
                throw 'not yet supported';
            }
            else {
                throw 'not yet supported';
            }
            this.index_stop = i_stop;
        };
        MatrixIterator.prototype.next_column = function () {
            if (this.downward && this.rightward) {
                this.i++;
            }
            else if (!this.downward && this.rightward) {
                if (remainder(this.i + 1, this.num_rows) === 0) {
                    this.i = this.i - (this.num_columns - 1) - this.num_columns;
                }
                else {
                    this.i++;
                }
            }
            else if (this.downward && !this.rightward) {
                // if (remainder(this.i + 1, this.num_rows) === 0) {
                //     this.i = this.i + (this.num_columns - 1) + this.num_columns
                // } else {
                //     this.i--
                // }
                throw 'not yet supported';
            }
            else if (!this.downward && !this.rightward) {
                // this.i--;
                throw 'not yet supported';
            }
            else {
                throw 'not yet supported';
            }
        };
        MatrixIterator.prototype.next = function () {
            var value = null;
            this.next_column();
            if (this.i === this.index_stop) {
                return {
                    value: value,
                    done: true
                };
            }
            return {
                value: this.get_coord_current(),
                done: false
            };
        };
        MatrixIterator.prototype.get_coord_current = function () {
            return MatrixIterator.get_coord(this.get_state_current() + 1, this.num_columns);
        };
        MatrixIterator.prototype.get_state_current = function () {
            return this.i;
        };
        MatrixIterator.get_coord = function (i, num_columns) {
            var pos_row = division_int(i, num_columns);
            var pos_column = remainder(i, num_columns);
            return [pos_row, pos_column];
        };
        MatrixIterator.get_coord_above = function (coord) {
            // if (coord[0] === 1) {
            //     // return [coord[0] - 1, 0]
            //     return [0, 0]
            // } else {
            return [coord[0] - 1, coord[1]];
            // }
        };
        MatrixIterator.get_coord_below = function (coord) {
            return [coord[0] + 1, coord[1]];
        };
        return MatrixIterator;
    }());
    trainer.MatrixIterator = MatrixIterator;
    var FactoryMatrixTargetIterator = /** @class */ (function () {
        function FactoryMatrixTargetIterator() {
        }
        FactoryMatrixTargetIterator.create_matrix_focus = function (algorithm, segments) {
            var matrix_data = [];
            switch (algorithm.get_name()) {
                case algorithm_1.algorithm.DETECT || algorithm_1.algorithm.PREDICT: {
                    for (var i = 0; i < 1; i++) {
                        matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                case algorithm_1.algorithm.PARSE || algorithm_1.algorithm.DERIVE: {
                    for (var i = 0; i < algorithm.get_depth(); i++) {
                        matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                default: {
                    throw 'case not considered';
                }
            }
            return matrix_data;
        };
        return FactoryMatrixTargetIterator;
    }());
    var IteratorTrainFactory = /** @class */ (function () {
        function IteratorTrainFactory() {
        }
        IteratorTrainFactory.get_iterator_train = function (algorithm, segments) {
            var iterator;
            var downward, rightward;
            switch (algorithm.get_name()) {
                case algorithm_1.algorithm.DETECT: {
                    iterator = new MatrixIterator(1, segments.length);
                    break;
                }
                case algorithm_1.algorithm.PREDICT: {
                    iterator = new MatrixIterator(1, segments.length);
                    break;
                }
                case algorithm_1.algorithm.PARSE: {
                    downward = false;
                    rightward = true;
                    var index_row_start = algorithm.get_depth() - 1;
                    var index_row_stop = 1;
                    iterator = new MatrixIterator(algorithm.get_depth(), segments.length, downward, rightward, index_row_start, index_row_stop);
                    break;
                }
                case algorithm_1.algorithm.DERIVE: {
                    downward = true;
                    rightward = true;
                    var index_row_start = 1;
                    var index_row_stop = algorithm.get_depth();
                    iterator = new MatrixIterator(algorithm.get_depth(), segments.length, downward, rightward, index_row_start, index_row_stop);
                    break;
                }
                default: {
                    throw ['algorithm of name', algorithm.get_name(), 'not supported'].join(' ');
                }
            }
            return iterator;
        };
        return IteratorTrainFactory;
    }());
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
            var note_root = this.segments[0].get_note();
            this.struct_parse.root = note_root;
            this.window.add_note_to_clip_root(note_root);
            // set first layer, which are the various key center estimates
            for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                var i_segment = _a[_i];
                var segment_1 = this.segments[Number(i_segment)];
                var note = segment_1.get_note();
                var coord_current_virtual = [0, Number(i_segment)];
                // TODO: can we make a function to simultaneous add to all 3 of struct parse, history user input, and window?
                this.struct_parse.matrix_leaves[coord_current_virtual[0]][coord_current_virtual[1]] = [note];
                this.window.add_notes_to_clip(note, coord_current_virtual);
            }
            switch (this.algorithm.get_name()) {
                case PARSE: {
                    for (var _b = 0, _c = this.segments; _b < _c.length; _b++) {
                        var i_segment = _c[_b];
                        var segment_2 = this.segments[Number(i_segment)];
                        var notes = this.clip_user_input.get_notes(segment_2.beat_start, 0, segment_2.beat_end - segment_2.beat_start, 128);
                        this.struct_parse.matrix_leaves[this.algorithm.get_depth() - 1][Number(i_segment)] = notes;
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
            this.window.render(this.iterator_matrix_train, this.matrix_focus, this.algorithm, this.struct_parse);
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
            this.algorithm.pre_terminate();
        };
        Trainer.prototype.terminate = function () {
            this.algorithm.pre_terminate();
        };
        Trainer.prototype.init = function () {
            if (this.algorithm.b_targeted()) {
                this.advance_subtarget();
            }
            else {
                this.advance_segment();
            }
            this.algorithm.post_init(this.song, this.clip_user_input);
        };
        Trainer.prototype.advance_segment = function () {
            // TODO:
            var obj_next_coord = this.iterator_matrix_train.next();
            if (obj_next_coord.done) {
                if (this.algorithm.get_name() === PARSE) {
                    // TODO: make the connections with the root
                    // public add(notes_user_input, iterator_matrix_train, algorithm): void {
                    for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                        var segment_3 = _a[_i];
                        this.struct_parse.add(segment_3.get_note(), this.struct_parse, this.iterator_matrix_train.get_coord_current());
                    }
                    this.struct_parse.finish();
                }
                this.algorithm.pre_terminate();
            }
            var coord = obj_next_coord.value;
            this.segment_current = this.segments[coord[1]];
        };
        Trainer.prototype.advance_subtarget = function () {
            var possibly_history = this.iterator_target_current.targets;
            var coord_at_time = this.iterator_matrix_train.get_coord_current();
            var obj_next_subtarget = this.iterator_subtarget_current.next();
            if (obj_next_subtarget.done) {
                var obj_next_target = this.iterator_target_current.next();
                if (obj_next_target.done) {
                    var obj_next_coord = this.iterator_matrix_train.next();
                    this.history_user_input.add_sequence_target(possibly_history, coord_at_time);
                    if (obj_next_coord.done) {
                        this.history_user_input.add_sequence_target(possibly_history, coord_at_time);
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
        };
        // user input can be either 1) a pitch or 2) a sequence of notes
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
                this.window.add_notes_to_clip(this.subtarget_current.note, this.iterator_matrix_train.get_coord_current());
                // TODO: implement
                this.struct_parse.add(notes_input_user, this.struct_parse, this.iterator_matrix_train.get_coord_current());
                this.advance_segment();
                this.render_window();
                return;
            }
            // detect/predict logic
            // NB: assumes we're only giving list of a single note as input
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