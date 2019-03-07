"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../log/logger");
var TreeModel = require("tree-model");
var history;
(function (history) {
    var Logger = logger_1.log.Logger;
    var HistoryUserInput = /** @class */ (function () {
        function HistoryUserInput() {
        }
        return HistoryUserInput;
    }());
    history.HistoryUserInput = HistoryUserInput;
    var List = /** @class */ (function () {
        function List() {
        }
        return List;
    }());
    history.List = List;
    var Matrix = /** @class */ (function () {
        function Matrix(height, width) {
            this.data = [];
            for (var i = 0; i < height; i++) {
                this.data[i] = new Array(width);
            }
            this.logger = new Logger('max');
        }
        Matrix.prototype.set_notes = function (i_height, i_width, notes) {
            this.data[i_height][i_width] = notes;
        };
        Matrix.prototype.get_notes = function (i_height, i_width) {
            return this.data[i_height][i_width];
        };
        Matrix.serialize = function (notes) {
            return notes.map(function (note) {
                return JSON.stringify(note.model);
            });
        };
        Matrix.deserialize = function (notes_serialized) {
            if (notes_serialized === null) {
                return null;
            }
            var tree = new TreeModel();
            return notes_serialized.map(function (note) {
                return tree.parse(JSON.parse(note));
            });
        };
        Matrix.prototype.save = function (filename) {
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
        Matrix.load = function (filename) {
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
        return Matrix;
    }());
    history.Matrix = Matrix;
})(history = exports.history || (exports.history = {}));
//# sourceMappingURL=history.js.map