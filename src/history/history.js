"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history;
(function (history) {
    var HistoryUserInput = /** @class */ (function () {
        function HistoryUserInput(matrix) {
            this.matrix_data = matrix;
        }
        // TODO: does this only work for parsing/deriving?
        // add(struct: any, coord: number[]) {
        //     this.matrix_data[coord[0]][coord[1]] = struct;
        // }
        HistoryUserInput.prototype.concat = function (struct, coord) {
            this.matrix_data[coord[0]][coord[1]] = this.matrix_data[coord[0]][coord[1]].concat(struct);
        };
        HistoryUserInput.prototype.get = function (coord) {
            return this.matrix_data[coord[0]][coord[1]];
        };
        return HistoryUserInput;
    }());
    history.HistoryUserInput = HistoryUserInput;
})(history = exports.history || (exports.history = {}));
//# sourceMappingURL=history.js.map