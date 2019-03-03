"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clip_1 = require("../clip/clip");
var live_1 = require("../live/live");
var _ = require("lodash");
var window;
(function (window) {
    var LiveClipVirtual = live_1.live.LiveClipVirtual;
    var red = [255, 0, 0];
    var black = [0, 0, 0];
    var Pwindow = /** @class */ (function () {
        function Pwindow(height, width, messenger) {
            this.beat_to_pixel = function (beat) {
                var num_pixels_in_clip = this.width;
                var num_beats_in_clip = this.get_num_measures_clip() * this.beats_per_measure;
                return beat * (num_pixels_in_clip / num_beats_in_clip);
            };
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            this.clips = [];
            this.beats_per_measure = 4;
        }
        Pwindow.prototype.get_notes_leaves = function () {
            return this.leaves;
        };
        // TODO: this assumes it only gets called once
        // TODO: assumes we only have one note to begin with
        Pwindow.prototype.set_root = function (clip_root) {
            this.add_clip(clip_root);
            var note = clip_root.get_notes_within_markers()[0]; // first clip only has one note
            note.model.id = 0; // index of first clip
            this.root_parse_tree = note;
            this.leaves = [note];
        };
        Pwindow.prototype.elaborate = function (elaboration, beat_start, beat_end) {
            // splice clip into clip
            // TODO: pick up here on adding the fourth and last clip
            var notes_new = this.splice_notes(elaboration, this.clips[this.clips.length - 1], [beat_start, beat_end]);
            // add clip to this.clips
            var clip_dao_new = new LiveClipVirtual(notes_new);
            var clip_new = new clip_1.clip.Clip(clip_dao_new);
            this.add_clip(clip_new);
            // TODO: maintain a list of current leaves
            var leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);
            this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
            // TODO: note working for the fourth and last clip
            this.update_leaves(leaves_within_interval);
            // set list of current leaves
        };
        Pwindow.prototype.splice_notes = function (notes_subset, clip, interval_beats) {
            var notes_clip = _.cloneDeep(clip.get_notes_within_markers());
            var num_notes_to_replace = this.get_order_of_note_at_beat_end(notes_clip, interval_beats[1]) - this.get_order_of_note_at_beat_start(notes_clip, interval_beats[0]) + 1;
            var index_start = this.get_note_index_at_beat(interval_beats[0], notes_clip);
            notes_clip.splice.apply(notes_clip, [index_start, num_notes_to_replace].concat(notes_subset));
            return notes_clip;
        };
        Pwindow.prototype.get_note_index_at_beat = function (beat, notes) {
            var val = _.findIndex(notes, function (node) {
                return node.model.note.beat_start === beat;
            });
            return val;
        };
        Pwindow.prototype.get_leaves_within_interval = function (beat_start, beat_end) {
            var val = this.leaves.filter(function (node) {
                return node.model.note.beat_start >= beat_start && node.model.note.get_beat_end() <= beat_end;
            });
            return val;
        };
        // NB: this makes the assumption that the end marker is at the end of the clip
        Pwindow.prototype.get_num_measures_clip = function () {
            return this.clips[0].get_num_measures();
        };
        // TODO: make node have indices to both clip and note
        Pwindow.prototype.get_centroid = function (node) {
            var dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;
            var index_clip = node.model.id;
            // TODO: determine how to get the index of the clip from just depth of the node
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);
            return [
                dist_from_left_beat_end - ((dist_from_left_beat_end - dist_from_left_beat_start) / 2),
                dist_from_top_note_bottom - ((dist_from_top_note_bottom - dist_from_top_note_top) / 2)
            ];
        };
        ;
        // TODO: elaboration won't always
        Pwindow.prototype.get_order_of_note_at_beat_start = function (notes, beat_start) {
            return _.findIndex(notes, function (node) {
                return node.model.note.beat_start === beat_start;
            });
        };
        Pwindow.prototype.get_order_of_note_at_beat_end = function (notes, beat_end) {
            return _.findIndex(notes, function (node) {
                return node.model.note.get_beat_end() === beat_end;
            });
        };
        Pwindow.prototype.get_interval_beats = function (notes) {
            return [
                notes[0].model.note.beat_start,
                notes[notes.length - 1].model.note.get_beat_end()
            ];
        };
        // TODO: add capability to automatically determine parent/children relationships between adjacent tracks
        Pwindow.prototype.add_clip = function (clip) {
            this.clips.push(clip);
        };
        ;
        Pwindow.prototype.get_diff_index_start = function (notes_new, notes_old) {
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
        Pwindow.prototype.get_diff_index_end = function (notes_new, notes_old) {
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
        Pwindow.prototype.get_diff_index_notes = function (notes_parent, notes_child) {
            return [
                this.get_diff_index_start(notes_child, notes_parent),
                this.get_diff_index_end(notes_child, notes_parent)
            ];
        };
        ;
        Pwindow.prototype.render_tree = function () {
            var messages = this.get_messages_render_tree();
            for (var i = 0; i < messages.length; i++) {
                this.messenger.message(messages[i]);
            }
        };
        ;
        // TODO: how do we render when there is no singular root (i.e. parsing, not sampling, sentence)?
        Pwindow.prototype.get_messages_render_tree = function () {
            var _this = this;
            var color, messages = [], message;
            this.root_parse_tree.walk(function (node) {
                if (node.hasChildren()) {
                    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        message = [
                            "linesegment",
                            _this.get_centroid(child)[0],
                            _this.get_centroid(child)[1],
                            _this.get_centroid(node)[0],
                            _this.get_centroid(node)[1]
                        ];
                        color = red;
                        messages.push(message.concat(color));
                    }
                }
                return true;
            });
            return messages;
        };
        ;
        // NB: only works top down currently
        // private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
        Pwindow.prototype.add_layer = function (notes_parent, notes_child, index_new_layer) {
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
        Pwindow.prototype.update_leaves = function (leaves) {
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
                    for (var _i = 0, _a = leaf.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        children_to_insert.push(child);
                    }
                    leaves_spliced.splice.apply(leaves_spliced, [i_leaf_to_splice,
                        1].concat(children_to_insert));
                }
            };
            for (var _i = 0, leaves_1 = leaves; _i < leaves_1.length; _i++) {
                var leaf = leaves_1[_i];
                _loop_1(leaf);
            }
            this.leaves = leaves_spliced;
        };
        Pwindow.prototype.render_clips = function () {
            var messages = this.get_messages_render_clips();
            for (var i = 0; i < messages.length; i++) {
                this.messenger.message(messages[i]);
            }
        };
        ;
        // TODO: return signature
        Pwindow.prototype.get_messages_render_clips = function () {
            var messages = [];
            for (var index_clip in this.clips) {
                messages = messages.concat(this.get_messages_render_notes(Number(index_clip)));
            }
            return messages;
        };
        ;
        Pwindow.prototype.get_messages_render_notes = function (index_clip) {
            var clip = this.clips[index_clip];
            var quadruplets = [];
            for (var _i = 0, _a = clip.get_notes_within_markers(); _i < _a.length; _i++) {
                var node = _a[_i];
                quadruplets.push(this.get_position_quadruplet(node, index_clip));
            }
            return quadruplets.map(function (tuplet) {
                var message = ["paintrect"].concat(tuplet);
                message = message.concat(black);
                return message;
            });
        };
        ;
        Pwindow.prototype.get_position_quadruplet = function (node, index_clip) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);
            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom];
        };
        ;
        Pwindow.prototype.get_dist_from_top = function (pitch, index_clip) {
            var clip = this.clips[index_clip];
            var offset = index_clip;
            // TODO: make this configurable
            if (false) {
                offset = this.clips.length - 1 - index_clip;
            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(index_clip);
            return dist + (this.get_height_clip() * offset);
        };
        ;
        Pwindow.prototype.get_dist_from_left = function (beat) {
            return this.beat_to_pixel(beat);
        };
        ;
        Pwindow.prototype.get_height_clip = function () {
            return this.height / this.clips.length;
        };
        ;
        Pwindow.prototype.get_height_note = function (index_clip) {
            var ambitus = this.get_ambitus(index_clip);
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };
        ;
        Pwindow.prototype.get_ambitus = function (index_clip) {
            return this.clips[index_clip].get_ambitus();
        };
        ;
        return Pwindow;
    }());
    window.Pwindow = Pwindow;
})(window = exports.window || (exports.window = {}));
//# sourceMappingURL=window.js.map