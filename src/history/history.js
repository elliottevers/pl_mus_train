"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var algorithm_1 = require("../train/algorithm");
var history;
(function (history) {
    var DETECT = algorithm_1.algorithm.DETECT;
    var PREDICT = algorithm_1.algorithm.PREDICT;
    var PARSE = algorithm_1.algorithm.PARSE;
    var DERIVE = algorithm_1.algorithm.DERIVE;
    // export class SequenceTarget {
    //     data: TypeSequenceTarget;
    //
    //     constructor() {
    //
    //     }
    //
    //     get_subtargets() {
    //
    //     }
    // }
    var FactoryHistoryUserInput = /** @class */ (function () {
        function FactoryHistoryUserInput() {
        }
        FactoryHistoryUserInput.create_history_user_input = function (algorithm, segments) {
            switch (algorithm.get_name()) {
                case DETECT: {
                    return new TargetHistory();
                }
                case PREDICT: {
                    return new TargetHistory();
                }
                case PARSE: {
                    return new PhaseHistory();
                }
                case DERIVE: {
                    return new PhaseHistory();
                }
                default: {
                    throw 'factory history user input';
                }
            }
        };
        return FactoryHistoryUserInput;
    }());
    history.FactoryHistoryUserInput = FactoryHistoryUserInput;
    var PhaseHistory = /** @class */ (function () {
        function PhaseHistory() {
        }
        PhaseHistory.prototype.set_matrix = function (matrix) {
            this.matrix_notes = matrix;
        };
        PhaseHistory.prototype.add = function (notes, coord) {
            this.matrix_notes[coord[0]][coord[1]] = notes;
        };
        PhaseHistory.prototype.get = function (coord) {
            return this.matrix_notes[coord[0]][coord[1]];
        };
        return PhaseHistory;
    }());
    history.PhaseHistory = PhaseHistory;
    var TargetHistory = /** @class */ (function () {
        // constructor(algorithm, segments) {
        //     let matrix_data = [];
        //     for (let i=0; i < 1; i++) {
        //         matrix_data[i] = new Array(segments.length);
        //     }
        //     this.matrix_data = matrix_data;
        // }
        function TargetHistory() {
        }
        TargetHistory.prototype.set_matrix = function (matrix) {
            this.matrix_data = matrix;
        };
        // set_sequence_target(sequence_target: TypeSequenceTarget, coord_matrix: number[]) {
        //     this.matrix_data[coord_matrix[0]][coord_matrix[1]] = sequence_target;
        // }
        //
        // get_sequence_target(i_height, i_width): TypeSequenceTarget {
        //     return this.matrix_data[i_height][i_width]
        // }
        // add_subtarget(subtarget: Subtarget, iterator_matrix_train: MatrixIterator) {
        //     let coord = iterator_matrix_train.get_coord_current();
        //     this.matrix_data[coord[0]][coord[1]] = subtarget.note
        // }
        TargetHistory.prototype.add = function (target_sequence, coord) {
            this.matrix_data[coord[0]][coord[1]] = target_sequence;
        };
        return TargetHistory;
    }());
    history.TargetHistory = TargetHistory;
})(history = exports.history || (exports.history = {}));
//# sourceMappingURL=history.js.map