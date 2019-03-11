"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history;
(function (history) {
    // export class FactoryHistoryUserInput {
    //     public static create_history_user_input(algorithm, matrix_target_iterator) {
    //         switch (algorithm.get_name()) {
    //             case DETECT: {
    //                 return new TargetHistory(matrix_target_iterator);
    //             }
    //             case PREDICT: {
    //                 return new TargetHistory(matrix_target_iterator);
    //             }
    //             case PARSE: {
    //                 return new PhaseHistory(matrix_target_iterator);
    //             }
    //             case DERIVE: {
    //                 return new PhaseHistory(matrix_target_iterator);
    //             }
    //             default: {
    //                 throw 'factory history user input'
    //             }
    //         }
    //     }
    // }
    var HistoryUserInput = /** @class */ (function () {
        function HistoryUserInput(matrix) {
            this.matrix_data = matrix;
        }
        HistoryUserInput.prototype.add = function (struct, coord) {
            this.matrix_data[coord[0]][coord[1]] = struct;
        };
        HistoryUserInput.prototype.get = function (coord) {
            return this.matrix_data[coord[0]][coord[1]];
        };
        return HistoryUserInput;
    }());
    history.HistoryUserInput = HistoryUserInput;
    // export class PhaseHistory implements HistoryUserInput {
    //     matrix_data: TreeModel.Node<Note>[][][];
    //
    //     constructor(matrix) {
    //         this.matrix_data = matrix;
    //     }
    //
    //     add(notes: TreeModel.Node<Note>[], coord: number[]) {
    //         this.matrix_data[coord[0]][coord[1]] = notes;
    //     }
    //
    //     get(coord: number[]): TreeModel.Node<n.Note>[] {
    //         return this.matrix_data[coord[0]][coord[1]];
    //     }
    // }
    //
    // export class TargetHistory implements HistoryUserInput {
    //
    //     matrix_data: Target[][][];
    //
    //     constructor(matrix) {
    //         this.matrix_data = matrix
    //     }
    //
    //     add(target_sequence: Target[], coord: number[]) {
    //         this.matrix_data[coord[0]][coord[1]] = target_sequence;
    //     }
    //
    //     get(coord: number[]) {
    //         return this.matrix_data[coord[0]][coord[1]];
    //     }
    // }
})(history = exports.history || (exports.history = {}));
//# sourceMappingURL=history.js.map