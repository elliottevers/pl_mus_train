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
                    // return new TargetHistory(algorithm, segments);
                    return new TargetHistory();
                }
                case PREDICT: {
                    // return new TargetHistory(algorithm, segments);
                    return new TargetHistory();
                }
                case PARSE: {
                    throw 'parse not yet implemented';
                }
                case DERIVE: {
                    throw 'detect not yet implemented';
                }
                default: {
                    throw 'from factory user input';
                }
            }
        };
        return FactoryHistoryUserInput;
    }());
    history.FactoryHistoryUserInput = FactoryHistoryUserInput;
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
        TargetHistory.prototype.add_sequence_target = function (target_sequence, coord) {
            this.matrix_data[coord[0]][coord[1]] = target_sequence;
        };
        TargetHistory.prototype.save = function (filename) {
            // let data_serializable = this.matrix_data as any;
            // for (let i_row in this.matrix_data) {
            //     for (let i_col in this.matrix_data[Number(i_row)]) {
            //         data_serializable[Number(i_row)][Number(i_col)] = serialize_target_sequence(
            //             this.matrix_data[Number(i_row)][Number(i_col)]
            //         )
            //     }
            // }
            //
            // let f = new File(filename,"write","JSON");
            //
            // if (f.isopen) {
            //     post("saving session");
            //     f.writestring(JSON.stringify(data_serializable));
            //     f.close();
            // } else {
            //     post("could not save session");
            // }
        };
        TargetHistory.prototype.load = function (filename) {
            // let f = new File(filename, "read","JSON");
            // let a, data_deserialized;
            //
            // if (f.isopen) {
            //     post("reading file");
            //     // @ts-ignore
            //     while ((a = f.readline()) != null) {
            //         let data_deserialized = JSON.parse(a) as any;
            //     }
            //     f.close();
            // } else {
            //     post("could not open file");
            // }
            //
            // // let data_deserialized = data_serialized as any;
            // //
            // // for (let i_row in data_serialized) {
            // //     for (let i_col in data_serialized[Number(i_row)]) {
            // //         data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)])
            // //     }
            // // }
            // //
            // // return data_deserialized
            //
            // for (let i_row in this.matrix_data) {
            //     for (let i_col in this.matrix_data[Number(i_row)]) {
            //         data_deserialized[Number(i_row)][Number(i_col)] = deserialize_target_sequence(
            //             data_deserialized[Number(i_row)][Number(i_col)]
            //         )
            //     }
            // }
            //
            // return data_deserialized
            return;
        };
        return TargetHistory;
    }());
    history.TargetHistory = TargetHistory;
    // export type TypeHistoryList = SegmentTargetable[]
    //
    // export type TypeHistoryMatrix = SegmentTargetable[][]
    // export class ParseHistory implements HistoryUserInput {
    //
    //     // data: TreeModel.Node<note.Note>[][][];
    //
    //     matrix_data: SequenceNote[][];
    //
    //     logger: Logger;
    //
    //     constructor(algorithm, segments) {
    //         let matrix_data = [];
    //         for (let i=0; i < algorithm.get_depth(); i++) {
    //             if (i == 0) {
    //                 matrix_data[i] = new Array(1); // root of tree
    //             } else {
    //                 matrix_data[i] = new Array(segments.length);
    //             }
    //         }
    //         this.matrix_data = matrix_data;
    //     }
    //
    //     save(filename) {
    //         let data_serializable = this.data as any;
    //         for (let i_row in this.data) {
    //             for (let i_col in this.data[Number(i_row)]) {
    //                 data_serializable[Number(i_row)][Number(i_col)] = ParseMatrix.serialize(this.data[Number(i_row)][Number(i_col)])
    //             }
    //         }
    //
    //         let f = new File(filename,"write","JSON");
    //
    //         if (f.isopen) {
    //             post("saving session");
    //             f.writestring(JSON.stringify(data_serializable));
    //             f.close();
    //         } else {
    //             post("could not save session");
    //         }
    //     }
    //
    //     public load(filename): HistoryUserInput {
    //         let f = new File(filename, "read","JSON");
    //         let a, data_serialized;
    //
    //         if (f.isopen) {
    //             post("reading file");
    //             // @ts-ignore
    //             while ((a = f.readline()) != null) {
    //                 data_serialized = JSON.parse(a)
    //             }
    //             f.close();
    //         } else {
    //             post("could not open file");
    //         }
    //
    //         // let data_deserialized = data_serialized as any;
    //         //
    //         // for (let i_row in data_serialized) {
    //         //     for (let i_col in data_serialized[Number(i_row)]) {
    //         //         data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)])
    //         //     }
    //         // }
    //
    //         return data_deserialized
    //     }
    // }
})(history = exports.history || (exports.history = {}));
//# sourceMappingURL=history.js.map