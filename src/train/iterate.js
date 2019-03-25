"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algorithm_1 = require("./algorithm");
var utils_1 = require("../utils/utils");
var iterate;
(function (iterate) {
    var division_int = utils_1.utils.division_int;
    var remainder = utils_1.utils.remainder;
    var MatrixIterator = /** @class */ (function () {
        function MatrixIterator(num_rows, num_columns, downward, rightward, start_at_row, stop_at_row) {
            this.num_rows = num_rows;
            this.num_columns = num_columns;
            this.downward = (downward == null) ? true : downward;
            this.rightward = (rightward == null) ? true : rightward;
            this.index_row_start = start_at_row;
            this.index_row_stop = stop_at_row;
            this.determine_index_start();
            this.determine_index_stop();
            this.i = this.index_start ? this.index_start : -1;
            this.history = [];
            this.done = false;
            this.b_started = false;
        }
        MatrixIterator.prototype.determine_index_start = function () {
            var i_start;
            if (this.downward && this.rightward) {
                i_start = -1 + (this.num_columns * this.index_row_start);
            }
            else if (!this.downward && this.rightward) {
                i_start = (this.num_columns * (this.index_row_start + 2)) - 1 - this.num_columns;
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
                i_stop = (this.index_row_stop - 1) * this.num_columns;
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
                if (remainder(this.i + 1, this.num_columns) === 0) {
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
        MatrixIterator.prototype.add_history = function (i) {
            this.history.push(i);
        };
        MatrixIterator.prototype.get_history = function () {
            return this.history;
        };
        MatrixIterator.prototype.next = function () {
            this.b_started = true;
            var value = null;
            this.next_column();
            this.add_history(this.i);
            if (this.i === this.index_stop) {
                this.done = true;
                return {
                    value: value,
                    done: this.done
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
        MatrixIterator.get_coords_above = function (coord) {
            if (coord[0] === 0) {
                return [[-1]];
            }
            else {
                return [[coord[0] - 1, coord[1]]];
            }
            // return [[coord[0] - 1, coord[1]]]
        };
        MatrixIterator.get_coords_below = function (coord) {
            return [[coord[0] + 1, coord[1]]];
        };
        return MatrixIterator;
    }());
    iterate.MatrixIterator = MatrixIterator;
    var FactoryMatrixObjectives = /** @class */ (function () {
        function FactoryMatrixObjectives() {
        }
        FactoryMatrixObjectives.create_matrix_objectives = function (trainable, segments) {
            var matrix_data = [];
            switch (trainable.get_name()) {
                case algorithm_1.algorithm.DETECT: {
                    for (var i = 0; i < 1; i++) {
                        matrix_data.push([]);
                        for (var i_segment in segments) {
                            matrix_data[i][Number(i_segment)] = [];
                        }
                        // matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                case algorithm_1.algorithm.PREDICT: {
                    for (var i = 0; i < 1; i++) {
                        matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                case algorithm_1.algorithm.PARSE: {
                    for (var i = 0; i < trainable.get_depth(); i++) {
                        matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                case algorithm_1.algorithm.DERIVE: {
                    for (var i = 0; i < trainable.get_depth(); i++) {
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
        return FactoryMatrixObjectives;
    }());
    iterate.FactoryMatrixObjectives = FactoryMatrixObjectives;
    var IteratorTrainFactory = /** @class */ (function () {
        function IteratorTrainFactory() {
        }
        IteratorTrainFactory.get_iterator_train = function (trainable, segments) {
            var iterator;
            var downward, rightward;
            switch (trainable.get_name()) {
                case algorithm_1.algorithm.DETECT: {
                    iterator = new MatrixIterator(1, segments.length, true, true, 0, 1);
                    break;
                }
                case algorithm_1.algorithm.PREDICT: {
                    iterator = new MatrixIterator(1, segments.length);
                    break;
                }
                case algorithm_1.algorithm.PARSE: {
                    downward = false;
                    rightward = true;
                    var index_row_start = trainable.get_depth() - 1;
                    var index_row_stop = 1;
                    iterator = new MatrixIterator(trainable.get_depth(), segments.length, downward, rightward, index_row_start, index_row_stop);
                    break;
                }
                case algorithm_1.algorithm.DERIVE: {
                    downward = true;
                    rightward = true;
                    var index_row_start = 1;
                    var index_row_stop = trainable.get_depth();
                    iterator = new MatrixIterator(trainable.get_depth(), segments.length, downward, rightward, index_row_start, index_row_stop);
                    break;
                }
                default: {
                    throw ['algorithm of name', trainable.get_name(), 'not supported'].join(' ');
                }
            }
            return iterator;
        };
        return IteratorTrainFactory;
    }());
    iterate.IteratorTrainFactory = IteratorTrainFactory;
})(iterate = exports.iterate || (exports.iterate = {}));
//# sourceMappingURL=iterate.js.map