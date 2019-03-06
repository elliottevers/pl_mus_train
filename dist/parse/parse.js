"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TreeModel = require("tree-model");
var logger_1 = require("../log/logger");
var _ = require("underscore");
var parse;
(function (parse) {
    var Logger = logger_1.log.Logger;
    var ParseMatrix = /** @class */ (function () {
        function ParseMatrix(height, width) {
            this.data = [];
            for (var i = 0; i < height; i++) {
                this.data[i] = new Array(width);
            }
            this.logger = new Logger('max');
        }
        ParseMatrix.prototype.set_notes = function (i_height, i_width, notes) {
            this.data[i_height][i_width] = notes;
        };
        ParseMatrix.prototype.get_notes = function (i_height, i_width) {
            return this.data[i_height][i_width];
        };
        ParseMatrix.serialize = function (notes) {
            return notes.map(function (note) {
                return JSON.stringify(note.model);
            });
        };
        ParseMatrix.deserialize = function (notes_serialized) {
            if (notes_serialized === null) {
                return null;
            }
            var tree = new TreeModel();
            return notes_serialized.map(function (note) {
                return tree.parse(JSON.parse(note));
            });
        };
        ParseMatrix.prototype.save = function (filename) {
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
        ParseMatrix.load = function (filename) {
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
        return ParseMatrix;
    }());
    parse.ParseMatrix = ParseMatrix;
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