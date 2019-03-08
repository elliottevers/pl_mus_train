"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var _ = require("underscore");
var parse;
(function (parse) {
    var LiveClipVirtual = live_1.live.LiveClipVirtual;
    var ParseTree = /** @class */ (function () {
        function ParseTree() {
        }
        // matrix_clip: LiveClipVirtual[][];
        //
        // constructor() {
        //     this.matrix_clip
        // }
        ParseTree.get_diff_index_start = function (notes_new, notes_old) {
            var same_start, same_duration, index_start_diff;
            for (var i = 0; i < notes_old.length; i++) {
                same_start = (notes_old[i].model.note.beat_start === notes_new[i].model.note.beat_start);
                same_duration = (notes_old[i].model.note.beats_duration === notes_new[i].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_start_diff = i;
                    break;
                }
            }
            return index_start_diff;
        };
        ParseTree.get_diff_index_end = function (notes_new, notes_old) {
            var same_start, same_duration, index_end_diff;
            for (var i = -1; i > -1 * (notes_new.length + 1); i--) {
                same_start = (notes_new.slice(i)[0].model.note.beat_start === notes_old.slice(i)[0].model.note.beat_start);
                same_duration = (notes_new.slice(i)[0].model.note.beats_duration === notes_old.slice(i)[0].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_end_diff = i;
                    break;
                }
            }
            // NB: add one in order to use with array slice, unless of course the index is -1, then you'll access the front of the array
            return index_end_diff;
        };
        // TODO: complete return method signature
        ParseTree.prototype.get_diff_index_notes = function (notes_parent, notes_child) {
            return [
                ParseTree.get_diff_index_start(notes_child, notes_parent),
                ParseTree.get_diff_index_end(notes_child, notes_parent)
            ];
        };
        ;
        ParseTree.prototype.get_root = function () {
            return;
        };
        ParseTree.prototype.add_first_layer = function (notes, index_new_layer) {
            // var note_parent_best, b_successful;
            for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
                var node = notes_1[_i];
                node.model.id = index_new_layer;
                this.root_parse_tree.addChild(node);
            }
        };
        // NB: only works top down currently
        // private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
        ParseTree.prototype.add_layer = function (notes_parent, notes_child, index_new_layer) {
            var note_parent_best, b_successful;
            for (var _i = 0, notes_child_1 = notes_child; _i < notes_child_1.length; _i++) {
                var node = notes_child_1[_i];
                note_parent_best = node.model.note.get_best_candidate(notes_parent);
                b_successful = node.model.note.choose();
                if (b_successful) {
                    node.model.id = index_new_layer;
                    note_parent_best.addChild(node);
                }
            }
        };
        ;
        ParseTree.prototype.update_leaves = function (leaves) {
            // find leaves in parse/derive beat interval
            // splice them with their children
            var leaves_spliced = this.leaves;
            var children_to_insert, i_leaf_to_splice;
            var _loop_1 = function (leaf) {
                // find index of leaf to "splice"
                // always splice only one leaf
                // find corresponding leaf in leaves_spliced
                children_to_insert = [];
                if (leaf.hasChildren()) {
                    i_leaf_to_splice = _.findIndex(leaves_spliced, function (leaf_to_splice) {
                        // assuming monophony, i.e., no overlap
                        return leaf_to_splice.model.note.beat_start === leaf.model.note.beat_start;
                    });
                    var beat_end_children_greatest = -Infinity, beat_start_children_least = Infinity;
                    for (var _i = 0, _a = leaf.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        if (child.model.note.get_beat_end() > beat_end_children_greatest) {
                            beat_end_children_greatest = child.model.note.get_beat_end();
                        }
                        if (child.model.note.beat_start < beat_start_children_least) {
                            beat_start_children_least = child.model.note.beat_start;
                        }
                        children_to_insert.push(child);
                    }
                    if (false) {
                        // if (leaf.model.note.get_beat_end() > beat_end_children_greatest || leaf.model.note.beat_start < beat_start_children_least) {
                        leaves_spliced.splice.apply(leaves_spliced, [i_leaf_to_splice,
                            0].concat(children_to_insert));
                    }
                    else {
                        leaves_spliced.splice.apply(leaves_spliced, [i_leaf_to_splice,
                            1].concat(children_to_insert));
                    }
                    // leaves_spliced.splice(
                    //     i_leaf_to_splice,
                    //     1,
                    //     ...children_to_insert
                    // )
                }
            };
            for (var _i = 0, leaves_1 = leaves; _i < leaves_1.length; _i++) {
                var leaf = leaves_1[_i];
                _loop_1(leaf);
            }
            this.leaves = leaves_spliced;
        };
        ParseTree.prototype.insert = function (notes) {
            if (this.iterator_tree.get_index_current() == 1) {
                this.set_root(notes[0]);
            }
            else {
                this.grow(notes, this.iterator_tree.get_breadth_current());
                this.iterator_tree.get_depth_current();
            }
        };
        ParseTree.prototype.get_notes_leaves = function () {
            return this.leaves;
        };
        ParseTree.prototype.set_root = function (note_root) {
            var clip_dao_virtual = new LiveClipVirtual([note_root]);
            var clip_virtual = new clip_1.clip.Clip(clip_dao_virtual);
            clip_virtual.clip_dao.beat_start = note_root.model.note.beat_start;
            clip_virtual.clip_dao.beat_end = note_root.model.note.get_beat_end();
            this.add_clip(clip_virtual);
            note_root.model.id = 0; // index of first clip
            this.root_parse_tree = note_root;
            this.leaves = [note_root];
        };
        // struct
        ParseTree.prototype.elaborate = function (elaboration, beat_start, beat_end, index_layer) {
            if (index_layer + 1 > this.clips.length) {
                var clip_dao_virtual = new LiveClipVirtual(elaboration);
                clip_dao_virtual.beat_start = elaboration[0].model.note.beat_start;
                clip_dao_virtual.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
                var clip_virtual = new clip_1.clip.Clip(clip_dao_virtual);
                this.add_clip(clip_virtual);
            }
            else {
                var clip_last = this.clips[this.clips.length - 1];
                clip_last.clip_dao.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
                clip_last.set_notes(elaboration);
            }
            var leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);
            if (index_layer == 1) {
                this.add_first_layer(elaboration, this.clips.length - 1);
            }
            else {
                this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
            }
            this.update_leaves(leaves_within_interval);
        };
        // struct
        ParseTree.prototype.splice_notes = function (notes_subset, clip, interval_beats) {
            var notes_clip = _.cloneDeep(clip.get_notes_within_loop_brackets());
            var num_notes_to_replace = this.get_order_of_note_at_beat_end(notes_clip, interval_beats[1]) - this.get_order_of_note_at_beat_start(notes_clip, interval_beats[0]) + 1;
            var index_start = this.get_note_index_at_beat(interval_beats[0], notes_clip);
            notes_clip.splice.apply(notes_clip, [index_start, num_notes_to_replace].concat(notes_subset));
            return notes_clip;
        };
        // struct
        ParseTree.prototype.get_note_index_at_beat = function (beat, notes) {
            var val = _.findIndex(notes, function (node) {
                return node.model.note.beat_start === beat;
            });
            return val;
        };
        // struct
        ParseTree.prototype.get_leaves_within_interval = function (beat_start, beat_end) {
            var val = this.leaves.filter(function (node) {
                // return node.model.note.beat_start >= beat_start && node.model.note.get_beat_end() <= beat_end
                return (node.model.note.beat_start >= beat_start && node.model.note.beat_start <= beat_end) ||
                    (node.model.note.get_beat_end() <= beat_end && node.model.note.get_beat_end() >= beat_start) ||
                    (node.model.note.get_beat_end() >= beat_end && node.model.note.beat_start <= beat_start);
            });
            // this.logger.log(CircularJSON.stringify(this.leaves));
            return val;
        };
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