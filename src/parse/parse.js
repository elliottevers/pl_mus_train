"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_1 = require("../note/note");
var TreeModel = require("tree-model");
var live_1 = require("../live/live");
var clip_1 = require("../clip/clip");
var _ = require("underscore");
var parse;
(function (parse) {
    var LiveClipVirtual = live_1.live.LiveClipVirtual;
    var ParseTree = /** @class */ (function () {
        function ParseTree(note, coordinates_matrix) {
            var tree = new TreeModel();
            var splitted = messages[i_mess].split(' ');
            this.root = tree.parse({
                id: -1,
                note: new note_1.note.NoteRenderable(Number(splitted[0]), Number(splitted[1]), Number(splitted[2]), Number(splitted[3]), Number(splitted[4]), coordinates_matrix),
                children: []
            });
        }
        // TODO: we actually have to implement
        ParseTree.add = function (input_user, list_parse_tree, iterator_matrix_train) {
            var coord = iterator_matrix_train.get_coord_current();
            return;
        };
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
})(parse = exports.parse || (exports.parse = {}));
//# sourceMappingURL=parse.js.map