"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TreeModel = require("tree-model");
var history;
(function (history) {
    history.serialize = function (note) {
        return JSON.stringify(note.model);
    };
    history.deserialize = function (note_serialized) {
        if (note_serialized === null) {
            return null;
        }
        var tree = new TreeModel();
        return tree.parse(JSON.parse(note_serialized));
    };
    var TargetHistory = /** @class */ (function () {
        function TargetHistory(algorithm, segments) {
            var matrix_data = [];
            for (var i = 0; i < 1; i++) {
                matrix_data[i] = new Array(segments.length);
            }
            this.matrix_data = matrix_data;
        }
        TargetHistory.prototype.set_sequence_target = function (sequence_target, coord_matrix) {
            this.matrix_data[coord_matrix[0]][coord_matrix[1]] = sequence_target;
        };
        TargetHistory.prototype.get_notes = function (i_height, i_width) {
            return this.matrix_data[i_height][i_width];
        };
        TargetHistory.prototype.save = function (filename) {
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
        TargetHistory.prototype.load = function (filename) {
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
        return TargetHistory;
    }());
    // export type TypeHistoryList = SegmentTargetable[]
    //
    // export type TypeHistoryMatrix = SegmentTargetable[][]
    var ParseHistory = /** @class */ (function () {
        function ParseHistory(algorithm, segments) {
            var matrix_data = [];
            for (var i = 0; i < algorithm.get_depth(); i++) {
                if (i == 0) {
                    matrix_data[i] = new Array(1); // root of tree
                }
                else {
                    matrix_data[i] = new Array(segments.length);
                }
            }
            this.matrix_data = matrix_data;
        }
        ParseHistory.prototype.save = function (filename) {
            // let data_serializable = this.data as any;
            // for (let i_row in this.data) {
            //     for (let i_col in this.data[Number(i_row)]) {
            //         data_serializable[Number(i_row)][Number(i_col)] = ParseMatrix.serialize(this.data[Number(i_row)][Number(i_col)])
            //     }
            // }
            var f = new File(filename, "write", "JSON");
            if (f.isopen) {
                post("saving session");
                f.writestring(JSON.stringify(data_serializable));
                f.close();
            }
            else {
                post("could not save session");
            }
        };
        ParseHistory.prototype.load = function (filename) {
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
            // let data_deserialized = data_serialized as any;
            //
            // for (let i_row in data_serialized) {
            //     for (let i_col in data_serialized[Number(i_row)]) {
            //         data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)])
            //     }
            // }
            return data_deserialized;
        };
        return ParseHistory;
    }());
    history.ParseHistory = ParseHistory;
})(history = exports.history || (exports.history = {}));
//# sourceMappingURL=history.js.map