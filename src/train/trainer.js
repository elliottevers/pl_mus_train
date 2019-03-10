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
    var ParseTree = parse_1.parse.ParseTree;
    var division_int = utils_1.utils.division_int;
    var remainder = utils_1.utils.remainder;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var FactoryHistoryUserInput = history_1.history.FactoryHistoryUserInput;
    var MatrixIterator = /** @class */ (function () {
        function MatrixIterator(num_rows, num_columns) {
            this.num_rows = num_rows;
            this.num_columns = num_columns;
            this.i = -1;
        }
        MatrixIterator.prototype.next_row = function () {
            this.i = this.i + this.num_columns;
        };
        MatrixIterator.prototype.next_column = function () {
            this.i = this.i + 1;
        };
        MatrixIterator.prototype.next = function () {
            var value = null;
            this.next_column();
            if (this.i === this.num_columns * this.num_rows + 1) {
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
            return MatrixIterator.get_coord(this.get_state_current(), this.num_columns);
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
                    iterator = new MatrixIterator(algorithm.get_depth(), segments.length);
                    break;
                }
                case algorithm_1.algorithm.DERIVE: {
                    iterator = new MatrixIterator(algorithm.get_depth(), segments.length);
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
        // window is either tree or list
        // mode is either harmonic or melodic
        // algorithm is either detect, predict, parse, or derive
        // history
        function Trainer(window, user_input_handler, algorithm, clip_user_input, clip_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_target = clip_target;
            this.song = song;
            this.segments = segments;
            this.messenger = messenger;
            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(this.algorithm, this.segments);
            var clone_matrix_iterator = l.cloneDeep(this.iterator_matrix_train);
            this.history_user_input = FactoryHistoryUserInput.create_history_user_input(this.algorithm, this.segments);
            this.history_user_input.set_matrix(clone_matrix_iterator);
            this.window.set_matrix(clone_matrix_iterator);
            this.window.set_length_beats(this.segments[this.segments.length - 1].beat_end);
            if (this.algorithm.b_targeted()) {
                this.create_targets();
            }
            else {
                this.create_parse_trees();
            }
        }
        Trainer.prototype.create_parse_trees = function () {
            var list_parse_tree = [];
            switch (this.algorithm.get_name()) {
                case PARSE: {
                    for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                        var segment_1 = _a[_i];
                        var notes = this.clip_user_input.get_notes(segment_1.beat_start, 0, segment_1.beat_end - segment_1.beat_start, 128);
                        for (var _b = 0, notes_1 = notes; _b < notes_1.length; _b++) {
                            var note = notes_1[_b];
                            list_parse_tree.push(new ParseTree(note, this.algorithm.get_depth()));
                        }
                    }
                    break;
                }
                case DERIVE: {
                    var note = this.segments[0].get_note();
                    list_parse_tree.push(new ParseTree(note, this.algorithm.get_depth()));
                    break;
                }
                default: {
                    throw ['algorithm of name', this.algorithm.get_name(), 'not supported'].join(' ');
                }
            }
            return list_parse_tree;
        };
        // now we can assume we have a list instead of a matrix
        Trainer.prototype.create_targets = function () {
            this.clip_target.load_notes_within_markers();
            // let segment_targetable: SegmentTargetable;
            // let iterators_target: TargetIterator[] = [];
            for (var i_segment in this.segments) {
                var sequence_targets = this.algorithm.determine_targets(this.clip_target.get_notes(this.segments[Number(i_segment)].beat_start, 0, this.segments[Number(i_segment)].beat_end - this.segments[Number(i_segment)].beat_start, 128));
                this.matrix_target_iterator[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            }
        };
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            this.window.render(this.iterator_matrix_train, this.matrix_target_iterator, this.history_user_input, this.algorithm);
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
            // set segment current
            // set target current
            // set subtarget current
            this.algorithm.post_init();
        };
        Trainer.prototype.pause = function () {
            this.algorithm.pre_terminate();
        };
        Trainer.prototype.terminate = function () {
            this.algorithm.pre_terminate();
        };
        // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user
        Trainer.prototype.init = function () {
            this.advance_segment();
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
            this.iterator_target_current = this.matrix_target_iterator[coord[0]][coord[1]];
            // TODO: why isn't this a 'TargetIterator'?
            var obj_target = this.iterator_target_current.next();
            if (obj_target.done) {
                return;
            }
            this.target_current = obj_target.value;
            this.iterator_subtarget_current = this.target_current.iterator_subtarget;
            var obj_subtarget = this.iterator_subtarget_current.next();
            if (obj_subtarget.done) {
                return;
            }
            this.subtarget_current = obj_subtarget.value;
        };
        Trainer.prototype.advance_subtarget = function () {
            var possibly_history = this.iterator_target_current.targets;
            var obj_next_subtarget = this.iterator_subtarget_current.next();
            if (obj_next_subtarget.done) {
                var obj_next_target = this.iterator_target_current.next();
                if (obj_next_target.done) {
                    var obj_next_coord = this.iterator_matrix_train.next();
                    this.history_user_input.add_sequence_target(possibly_history, this.iterator_matrix_train);
                    if (obj_next_coord.done) {
                        this.history_user_input.add_sequence_target(possibly_history, this.iterator_matrix_train);
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
        Trainer.prototype.accept_input = function (input_user) {
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
                // this.struct.add(
                //     input_user
                // );
                this.list_parse_tree = ParseTree.add(input_user, this.list_parse_tree, this.iterator_matrix_train);
                this.advance_segment();
                this.window.render_regions(this.iterator_matrix_train, this.matrix_target_iterator);
                this.window.render_notes(this.history_user_input);
                this.window.render_tree(this.list_parse_tree);
                return;
            }
            // detect/predict logic
            // NB: assumes we're only giving list of a single note as input
            if (input_user[0].model.note.pitch === this.subtarget_current.note.model.note.pitch) {
                // let coords = this.iterator_matrix_train.get_coord_current();
                // let target_iterator_current = this.matrix_target_iterator[coords[0]][coords[1]];
                // NB: we actually add the note that the user was trying to guess, not the note played
                // this.history_user_input.add_subtarget(
                //     this.iterator_target_current.current().iterator_subtarget.current(),
                //     this.iterator_matrix_train
                // );
                this.advance_subtarget();
                if (this.algorithm.b_targeted()) {
                    // set the targets and shit
                }
                // set the context in ableton
                this.set_loop();
                var coord_current = this.iterator_matrix_train.get_coord_current();
                this.window.add(this.matrix_target_iterator[coord_current[0]][coord_current[1]], coord_current, this.segment_current);
                this.render_window();
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map