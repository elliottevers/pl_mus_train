"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../log/logger");
var TreeModel = require("tree-model");
var utils_1 = require("../utils/utils");
var history;
(function (history) {
    var Logger = logger_1.log.Logger;
    var division_int = utils_1.utils.division_int;
    var remainder = utils_1.utils.remainder;
    var HistoryUserInput = /** @class */ (function () {
        function HistoryUserInput() {
        }
        return HistoryUserInput;
    }());
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
            var pos_row = division_int(this.i + 1, this.num_columns);
            var pos_column = remainder(this.i + 1, this.num_columns);
            value = [pos_row, pos_column];
            return {
                value: value,
                done: false
            };
        };
        return MatrixIterator;
    }());
    history.MatrixIterator = MatrixIterator;
    var HistoryList = /** @class */ (function (_super) {
        __extends(HistoryList, _super);
        function HistoryList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HistoryList.prototype.add_subtarget = function (subtarget) {
        };
        HistoryList.prototype.get_list = function () {
            return;
        };
        HistoryList.prototype.set_list = function () {
        };
        return HistoryList;
    }(HistoryUserInput));
    history.HistoryList = HistoryList;
    var HistoryMatrix = /** @class */ (function (_super) {
        __extends(HistoryMatrix, _super);
        function HistoryMatrix(height, width) {
            var _this = this;
            _this.data = [];
            for (var i = 0; i < height; i++) {
                _this.data[i] = new Array(width);
            }
            _this.logger = new Logger('max');
            return _this;
        }
        HistoryMatrix.prototype.set_notes = function (i_height, i_width, notes) {
            this.data[i_height][i_width] = notes;
        };
        HistoryMatrix.prototype.get_notes = function (i_height, i_width) {
            return this.data[i_height][i_width];
        };
        HistoryMatrix.serialize = function (notes) {
            return notes.map(function (note) {
                return JSON.stringify(note.model);
            });
        };
        HistoryMatrix.deserialize = function (notes_serialized) {
            if (notes_serialized === null) {
                return null;
            }
            var tree = new TreeModel();
            return notes_serialized.map(function (note) {
                return tree.parse(JSON.parse(note));
            });
        };
        HistoryMatrix.prototype.save = function (filename) {
            var data_serializable = this.data;
            for (var i_row in this.data) {
                for (var i_col in this.data[Number(i_row)]) {
                    data_serializable[Number(i_row)][Number(i_col)] = ParseMatrix.serialize(this.data[Number(i_row)][Number(i_col)]);
                }
            }
            var f = new File(filename, "write", "JSON");
            if (f.isopen) {
                post("saving session");
                f.writestring(JSON.stringify(data_serializable)); //writes a string
                f.close();
            }
            else {
                post("could not save session");
            }
        };
        HistoryMatrix.load = function (filename) {
            var f = new File(filename, "read", "JSON");
            var a, data_serialized;
            if (f.isopen) {
                post("reading file");
                // @ts-ignore
                while ((a = f.readline()) != null) {
                    data_serialized = JSON.parse(a);
                }
                f.close();
            }
            else {
                post("could not open file");
            }
            var data_deserialized = data_serialized;
            for (var i_row in data_serialized) {
                for (var i_col in data_serialized[Number(i_row)]) {
                    // post(i_row);
                    // post(i_col);
                    data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)]);
                }
            }
            return data_deserialized;
        };
        return HistoryMatrix;
    }(HistoryUserInput));
    history.HistoryMatrix = HistoryMatrix;
})(history = exports.history || (exports.history = {}));
//# sourceMappingURL=history.js.map