"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algorithm_1 = require("./algorithm");
var parse_1 = require("../parse/parse");
var utils_1 = require("../utils/utils");
var trainer;
(function (trainer) {
    var ParseTree = parse_1.parse.ParseTree;
    var division_int = utils_1.utils.division_int;
    var remainder = utils_1.utils.remainder;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
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
            var pos_row = division_int(this.i + 1, this.num_columns);
            var pos_column = remainder(this.i + 1, this.num_columns);
            return [pos_row, pos_column];
        };
        return MatrixIterator;
    }());
    trainer.MatrixIterator = MatrixIterator;
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
            // this.struct = new StructFactory.get_struct(user_input_handler.mode);
            // this.history_user_input = new HistoryUserInput(
            //     this.algorithm,
            //     this.segments
            // );
            this.history_user_input = FactoryHistoryUserInput.create_history_user_input(this.algorithm, this.segments);
            if (this.algorithm.b_targetable()) {
                this.create_targets();
            }
            if (this.algorithm.b_growable()) {
                this.create_parse_trees();
            }
            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(this.algorithm, this.segments);
        }
        Trainer.prototype.create_parse_trees = function () {
            var list_parse_tree = [];
            switch (this.algorithm.get_name()) {
                case PARSE: {
                    for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                        var segment_1 = _a[_i];
                        for (var _b = 0, _c = segment_1.get_notes(); _b < _c.length; _b++) {
                            var note = _c[_b];
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
            var iterators_target = [];
            for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                var segment_2 = _a[_i];
                // need SegmentTargetable -> TargetIterator
                iterators_target.push(this.algorithm.determine_targets(this.clip_target.get_notes(segment_2.beat_start, 0, segment_2.beat_end, 128)));
            }
            this.iterators_target = iterators_target;
        };
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            this.window.render();
        };
        Trainer.prototype.reset_user_input = function () {
            if ([DETECT, PREDICT].includes(this.algorithm.get_name())) {
                this.clip_user_input.set_notes(this.struct.get_notes(
                // TODO: pass requisite information
                ));
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
        // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user
        Trainer.prototype.init = function () {
            this.advance();
            this.algorithm.post_init();
        };
        Trainer.prototype.advance_segment = function () {
        };
        Trainer.prototype.advance_subtarget = function () {
            // this.segment_current = this.segment_iterator.next();
            // this.target_current = this.target_iterator.next();
            // this.subtarget_current = this.subtarget_current.next();
            // [i_height, i_width] = this.iterator_matrix_train.next();
            var obj_next_subtarget = this.itertor_subtarget_current.next();
            var obj_next_target;
            if (obj_next_subtarget.done) {
                obj_next_target = this.iterator_target_current.next();
            }
            if (obj_next_target.done) {
                var obj_next_coord = this.iterator_matrix_train.next();
                if (obj_next_coord.done) {
                    this.algorithm.pre_terminate();
                    return;
                }
                var coord_next = obj_next_coord.value;
                this.iterator_target_current = this.matrix_target_iterator[coord_next[0]][coord_next[1]];
            }
            // let obj_matrix_next = this.iterator_matrix_train.next();
            //
            // if (obj_matrix_next.done) {
            //     this.algorithm.pre_terminate()
            // }
            // set segment current
            if (this.algorithm.b_targeted()) {
                // set the targets and shit
            }
            // set the context in ableton
            this.set_loop();
        };
        // advance_target() {
        //     this.target_current = this.target_iterator.next()
        // }
        //
        // advance_subtarget() {
        //     let val = this.subtarget_iterator.next();
        //     if (val.done) {
        //         this.advance_target()
        //     } else {
        //         this.subtarget_current = val.value
        //     }
        // }
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
            if (input_user.note.pitch === this.subtarget_current.note.pitch) {
                var target_iterator_current = this.matrix_target_iterator[this.iterator_matrix_train.get_row_current()][this.iterator_matrix_train.get_column_current()];
                // NB: we actually add the note that the user was trying to guess, not the note played
                this.history_user_input.add_subtarget(this.iterator_target_current.current().subtarget_iterator.current());
                this.advance_subtarget();
                this.window.render_regions(this.iterator_matrix_train, this.matrix_target_iterator);
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map