"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var parse;
(function (parse) {
    var ParseTree = /** @class */ (function () {
        function ParseTree() {
        }
        return ParseTree;
    }());
    parse.ParseTree = ParseTree;
    // export class ParseMatrix {
    //
    //     data: TreeModel.Node<note.Note>[][][];
    //     logger: Logger;
    //
    //     constructor(height: number, width: number) {
    //         this.data = [];
    //         for(let i=0; i<height; i++) {
    //             this.data[i] = new Array(width);
    //         }
    //         this.logger = new Logger('max')
    //     }
    //
    //     set_notes(i_height, i_width, notes): void {
    //         this.data[i_height][i_width] = notes
    //     }
    //
    //     get_notes(i_height, i_width): TreeModel.Node<note.Note>[] {
    //         return this.data[i_height][i_width]
    //     }
    //
    //     private static serialize(notes: TreeModel.Node<note.Note>[]) {
    //         return notes.map((note) => {
    //             return JSON.stringify(note.model);
    //         })
    //     }
    //
    //     private static deserialize(notes_serialized) {
    //         if (notes_serialized === null) {
    //             return null
    //         }
    //         let tree = new TreeModel();
    //         return notes_serialized.map((note) => {
    //             return tree.parse(JSON.parse(note));
    //         })
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
    //             f.writestring(JSON.stringify(data_serializable)); //writes a string
    //             f.close();
    //         } else {
    //             post("could not save session");
    //         }
    //     }
    //
    //     public static load(filename) {
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
    //         let data_deserialized = data_serialized as any;
    //
    //         for (let i_row in data_serialized) {
    //             for (let i_col in data_serialized[Number(i_row)]) {
    //                 // post(i_row);
    //                 // post(i_col);
    //                 data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)])
    //             }
    //         }
    //
    //         return data_deserialized
    //     }
    // }
    var TreeDepthIterator = /** @class */ (function () {
        function TreeDepthIterator(depth, direction_forward) {
            this.layers = _.range(depth);
            this.direction_forward = direction_forward;
            this.i = 0;
        }
        // TODO: type declarations
        TreeDepthIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'segment iterator < 0';
            }
            if (this.i < this.layers.length) {
                return {
                    value: this.layers[this.i],
                    done: false
                };
            }
            else {
                return {
                    value: null,
                    done: true
                };
            }
        };
        TreeDepthIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.layers[this.i];
            }
            else {
                return null;
            }
        };
        TreeDepthIterator.prototype.get_index_current = function () {
            return this.i; // TODO: the root is the first index
        };
        return TreeDepthIterator;
    }());
    parse.TreeDepthIterator = TreeDepthIterator;
    // export class MatrixIterator {
    //     private num_rows: number;
    //     private num_columns: number;
    //
    //     private row_current: number;
    //     private column_current: number;
    //
    //     private i;
    //
    //     constructor(num_rows: number, num_columns: number) {
    //         this.num_rows = num_rows;
    //         this.num_columns = num_columns;
    //
    //         this.i = -1;
    //     }
    //
    //     private next_row() {
    //         this.i = this.i + this.num_columns;
    //     }
    //
    //     private next_column() {
    //         this.i = this.i + 1;
    //     }
    //
    //     public next() {
    //
    //         let value: number[] = null;
    //
    //         this.next_column();
    //
    //         if (this.i === this.num_columns * this.num_rows + 1) {
    //             return {
    //                 value: value,
    //                 done: true
    //             }
    //         }
    //
    //         let pos_row = division_int(this.i + 1, this.num_columns);
    //         let pos_column = remainder(this.i + 1, this.num_columns);
    //
    //         value = [pos_row, pos_column];
    //
    //         return {
    //             value: value,
    //             done: false
    //         };
    //     }
    // }
    var ParseTreeIterator = /** @class */ (function () {
        function ParseTreeIterator(iterator_segment, iterator_tree) {
            this.iterator_segment = iterator_segment;
            this.iterator_tree = iterator_tree;
        }
        // TODO: type declarations
        ParseTreeIterator.prototype.next = function (type_node) {
            if (type_node === 'root') {
                // initialize
                this.iterator_tree.next();
                return;
            }
            // initialize
            if (this.iterator_tree.get_index_current() == -1) {
                this.iterator_tree.next();
            }
            // let layer_current = this.iterator_tree.current();
            var segment_result_next = this.iterator_segment.next();
            var segment_next = segment_result_next.value;
            if (!segment_result_next.done) {
                this.segment_current = segment_next;
                return {
                    value: this.segment_current,
                    done: false
                };
            }
            //
            // this.iterator_segment.reset();
            var layer_result_next = this.iterator_tree.next();
            // segment_next.done is true by now
            if (!layer_result_next.done) {
                this.iterator_segment.reset();
                this.layer_current = this.iterator_tree.current();
                segment_result_next = this.iterator_segment.next();
                segment_next = segment_result_next.value;
                this.segment_current = segment_next;
                return {
                    value: this.segment_current,
                    done: false
                };
            }
            return {
                value: null,
                done: true
            };
        };
        return ParseTreeIterator;
    }());
    parse.ParseTreeIterator = ParseTreeIterator;
})(parse = exports.parse || (exports.parse = {}));
//# sourceMappingURL=parse.js.map