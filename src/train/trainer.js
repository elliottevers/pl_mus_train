"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {parse_matrix, pwindow} from "../scripts/parse_tree";
var algorithm_1 = require("./algorithm");
var history_1 = require("../history/history");
var target_1 = require("../target/target");
var parse_1 = require("../parse/parse");
var utils_1 = require("../utils/utils");
var _ = require('underscore');
var l = require('lodash');
var trainer;
(function (trainer) {
    // import TargetType = target.TargetType;
    var TargetIterator = target_1.target.TargetIterator;
    var division_int = utils_1.utils.division_int;
    var remainder = utils_1.utils.remainder;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var FactoryHistoryUserInput = history_1.history.FactoryHistoryUserInput;
    var ParseMatrix = parse_1.parse.ParseMatrix;
    var MatrixIterator = /** @class */ (function () {
        function MatrixIterator(num_rows, num_columns, downward, rightward) {
            this.num_rows = num_rows;
            this.num_columns = num_columns;
            this.downward = downward ? downward : true;
            this.rightward = rightward ? rightward : true;
            if (this.downward && this.rightward) {
                this.i = -1;
            }
            else if (!this.downward && this.rightward) {
                this.i = this.num_columns * this.num_rows + 1 - this.num_columns;
            }
            else if (this.downward && !this.rightward) {
                this.i = -1 + this.num_columns;
            }
            else if (!this.downward && !this.rightward) {
                this.i = this.num_columns * this.num_rows + 1;
            }
            else {
                throw 'matrix iterator';
            }
        }
        MatrixIterator.prototype.next_row = function () {
            if (this.downward && this.rightward) {
                this.i = this.i + this.num_columns;
            }
            else if (!this.downward && this.rightward) {
                this.i = this.i - 3;
            }
            else if (this.downward && !this.rightward) {
                this.i = this.i + 3;
            }
            else if (!this.downward && !this.rightward) {
                this.i = this.i - this.num_columns;
            }
            else {
                throw 'matrix iterator';
            }
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
                if (remainder(this.i + 1, this.num_rows) === 0) {
                    this.i = this.i + (this.num_columns - 1) + this.num_columns;
                }
                else {
                    this.i--;
                }
            }
            else if (!this.downward && !this.rightward) {
                this.i--;
            }
            else {
                throw 'matrix iterator';
            }
        };
        MatrixIterator.prototype.get_index_done = function () {
            if (this.downward && this.rightward) {
                return this.num_columns * this.num_rows;
            }
            else if (!this.downward && this.rightward) {
                return -1 * this.num_rows;
            }
            else if (this.downward && !this.rightward) {
                return this.num_columns * this.num_rows - 1 + this.num_rows;
            }
            else if (!this.downward && !this.rightward) {
                return -1;
            }
            else {
                throw 'matrix iterator';
            }
        };
        MatrixIterator.prototype.next = function () {
            var value = null;
            this.next_column();
            if (this.i === this.get_index_done()) {
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
        return MatrixIterator;
    }());
    trainer.MatrixIterator = MatrixIterator;
    var FactoryMatrixTargetIterator = /** @class */ (function () {
        function FactoryMatrixTargetIterator() {
        }
        FactoryMatrixTargetIterator.get_iterator_target = function (algorithm, segments) {
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
                        if (i == 0) {
                            matrix_data[i] = new Array(1); // root of tree
                        }
                        else {
                            matrix_data[i] = new Array(segments.length);
                        }
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
                    iterator = new MatrixIterator(algorithm.get_depth() + 1, segments.length, downward, rightward);
                    break;
                }
                case algorithm_1.algorithm.DERIVE: {
                    iterator = new MatrixIterator(algorithm.get_depth() + 1, segments.length);
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
            this.matrix_target_iterator = FactoryMatrixTargetIterator.get_iterator_target(this.algorithm, this.segments);
            this.history_user_input = FactoryHistoryUserInput.create_history_user_input(this.algorithm, this.segments);
            this.history_user_input.set_matrix(l.cloneDeep(this.matrix_target_iterator));
            this.window.initialize_clips(this.algorithm, this.segments);
            this.window.set_length_beats(this.segments[this.segments.length - 1].beat_end);
            if (this.algorithm.b_targeted()) {
                this.create_targets();
            }
            else {
                this.parse_matrix = new ParseMatrix(l.cloneDeep(this.matrix_target_iterator));
                this.initialize_parse_matrix();
            }
        }
        // TODO: everytime we add a note, call next() on matrix iterator
        Trainer.prototype.initialize_parse_matrix = function () {
            // set root
            var coord_root = [0, 0];
            var note_root = this.segments[0].get_note();
            this.parse_matrix.matrix_note_sequence[coord_root[0]][coord_root[1]] = [note_root];
            // initialize
            this.iterator_matrix_train.next();
            // set first layer, which are the various key center estimates
            for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                var i_segment = _a[_i];
                var segment_1 = this.segments[Number(i_segment)];
                this.parse_matrix.matrix_note_sequence[1][Number(i_segment)] = [segment_1.get_note()];
                this.iterator_matrix_train.next();
            }
            switch (this.algorithm.get_name()) {
                case PARSE: {
                    for (var _b = 0, _c = this.segments; _b < _c.length; _b++) {
                        var i_segment = _c[_b];
                        var segment_2 = this.segments[Number(i_segment)];
                        var notes = this.clip_user_input.get_notes(segment_2.beat_start, 0, segment_2.beat_end - segment_2.beat_start, 128);
                        this.parse_matrix.matrix_note_sequence[this.algorithm.get_depth()][Number(i_segment)] = notes;
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
                this.matrix_target_iterator[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            }
        };
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            this.window.render(this.iterator_matrix_train, this.matrix_target_iterator, this.history_user_input, this.algorithm, this.parse_matrix);
        };
        Trainer.prototype.reset_user_input = function () {
            if (_.contains([DETECT, PREDICT], this.algorithm.get_name())) {
                var coords = this.iterator_matrix_train.get_coord_current();
                var notes_last = this.matrix_target_iterator[coords[0] - 1][coords[1]].get_notes();
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
                this.algorithm.terminate();
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
                        // this.window.add(
                        //     this.matrix_target_iterator[coord_current[0]][coord_current[1]].get_notes(),
                        //     coord_current,
                        //     this.segment_current
                        // );
                        this.algorithm.pre_terminate();
                        return;
                    }
                    var coord_next = obj_next_coord.value;
                    this.iterator_target_current = this.matrix_target_iterator[coord_next[0]][coord_next[1]];
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
                // TODO: implement
                this.parse_matrix.add(notes_input_user, this.parse_matrix, this.iterator_matrix_train);
                this.advance_segment();
                this.render_window();
                return;
            }
            // detect/predict logic
            // NB: assumes we're only giving list of a single note as input
            if (notes_input_user[0].model.note.pitch === this.subtarget_current.note.model.note.pitch) {
                this.window.add_note_to_clip(this.subtarget_current.note, this.iterator_matrix_train.get_coord_current());
                if (this.algorithm.b_targeted()) {
                    // set the targets and shit
                }
                this.advance_subtarget();
                this.set_loop();
                // this.render_window();
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map