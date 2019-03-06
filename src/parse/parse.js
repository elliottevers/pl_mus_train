"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var parse;
(function (parse) {
    var ParseMatrix = /** @class */ (function () {
        function ParseMatrix(height, width) {
            this.data = [];
            for (var i = 0; i < height; i++) {
                this.data[i] = new Array(width);
            }
        }
        ParseMatrix.prototype.set_notes = function (i_height, i_width, notes) {
            this.data[i_height][i_width] = notes;
        };
        ParseMatrix.prototype.get_notes = function (i_height, i_width) {
            return this.data[i_height][i_width];
        };
        return ParseMatrix;
    }());
    parse.ParseMatrix = ParseMatrix;
    var TreeDepthIterator = /** @class */ (function () {
        function TreeDepthIterator(depth, direction_forward) {
            this.layers = _.range(depth);
            this.direction_forward = direction_forward;
            this.i = -1;
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
            return this.i + 1; // TODO: the root is the first index
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
        ParseTreeIterator.prototype.next = function () {
            // initialize
            if (this.iterator_tree.get_index_current() == 0) {
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