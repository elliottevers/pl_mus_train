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
var _ = require("lodash");
var window;
(function (window) {
    var red = [255, 0, 0];
    var black = [0, 0, 0];
    var Window = /** @class */ (function () {
        function Window(height, width, messenger) {
            this.beat_to_pixel = function (beat) {
                var num_pixels_in_clip = this.width;
                var num_beats_in_clip = this.get_num_measures_clip() * this.beats_per_measure;
                return beat * (num_pixels_in_clip / num_beats_in_clip);
            };
            this.height = height;
            this.width = width;
            this.messenger = messenger;
        }
        Window.prototype.clear = function () {
            var msg_clear = ["clear"];
            msg_clear.unshift('render');
            this.messenger.message(msg_clear);
        };
        Window.prototype.add = function (notes) {
        };
        Window.prototype.get_messages_render_notes = function (coord_clip) {
            // var clip = this.clips[index_clip];
            var clip_virtual = this.matrix_clips[coord_clip[0]][coord_clip[1]];
            var quadruplets = [];
            for (var _i = 0, _a = clip_virtual.get_notes_within_loop_brackets(); _i < _a.length; _i++) {
                var node = _a[_i];
                quadruplets.push(this.get_position_quadruplet(node, coord_clip));
            }
            return quadruplets.map(function (tuplet) {
                var message = ["paintrect"].concat(tuplet);
                message = message.concat(black);
                return message;
            });
        };
        ;
        Window.prototype.get_position_quadruplet = function (node, coord_clip) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, coord_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, coord_clip);
            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom];
        };
        ;
        Window.prototype.get_dist_from_top = function (pitch, coord_clip) {
            // var clip = this.clips[index_clip];
            var clip = this.matrix_clips[coord_clip[0]][coord_clip[1]];
            // let offset = index_clip;
            var offset = coord_clip[0];
            // TODO: make this configurable
            if (false) {
                // offset = this.clips.length - 1 - index_clip;
                // offset = this.matrix_clips.get_num_rows() - 1 - coord_clip[0];
                offset = this.matrix_clips.length - 1 - coord_clip[0];
            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(coord_clip);
            return dist + (this.get_height_clip() * offset);
        };
        ;
        Window.prototype.get_dist_from_left = function (beat) {
            return this.beat_to_pixel(beat);
        };
        ;
        Window.prototype.get_offset_pixel_leftmost = function () {
            return 0;
        };
        Window.prototype.get_offset_pixel_topmost = function () {
            return 0;
        };
        Window.prototype.get_offset_pixel_rightmost = function () {
            return this.width;
        };
        Window.prototype.get_offset_pixel_bottommost = function () {
            return this.height;
        };
        Window.prototype.get_height_clip = function () {
            return this.height / this.matrix_clips.length;
        };
        ;
        Window.prototype.get_height_note = function (coord_clip) {
            var ambitus = this.get_ambitus(coord_clip);
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };
        ;
        Window.prototype.get_ambitus = function (coord_clips) {
            return this.matrix_clips[coord_clips[0]][coord_clips[1]].get_ambitus();
        };
        ;
        return Window;
    }());
    window.Window = Window;
    var ListWindow = /** @class */ (function (_super) {
        __extends(ListWindow, _super);
        function ListWindow(height, width, messenger) {
            return _super.call(this, height, width, messenger) || this;
        }
        ListWindow.prototype.render = function (iterator_matrix_train, matrix_target_iterator, history_user_input, algorithm) {
            this.clear();
            this.render_regions(iterator_matrix_train, matrix_target_iterator, algorithm);
            this.render_notes(history_user_input);
        };
        // get_position_quadruplet(node: TreeModel.Node<n.Note>, coord_clip: number[]) {
        //     var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;
        //
        //     dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
        //     dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
        //     dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, coord_clip);
        //     dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, coord_clip);
        //
        //     return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom]
        // };
        ListWindow.prototype.get_message_render_region_past = function (interval_current) {
            var offset_left_start, offset_top_start, offset_left_end, offset_top_end;
            offset_left_start = this.get_dist_from_left(this.get_offset_pixel_leftmost());
            offset_left_end = this.get_dist_from_left(interval_current[0]);
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();
            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end];
        };
        ListWindow.prototype.get_message_render_region_present = function (interval_current) {
            var offset_left_start, offset_top_start, offset_left_end, offset_top_end;
            offset_left_start = this.get_dist_from_left(interval_current[0]);
            offset_left_end = this.get_dist_from_left(interval_current[1]);
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();
            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end];
        };
        ListWindow.prototype.get_message_render_region_future = function (interval_current) {
            var offset_left_start, offset_top_start, offset_left_end, offset_top_end;
            offset_left_start = this.get_dist_from_left(interval_current[1]);
            offset_left_end = this.get_dist_from_left(this.get_offset_pixel_rightmost());
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();
            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end];
        };
        ListWindow.prototype.render_regions = function (iterator_matrix_train, matrix_target_iterator, algorithm) {
            // this.get_dist_from_left(0);
            // let clip_virtual = this.matrix_clips[coord_clip[0]][coord_clip[1]];
            // let quadruplets = [];
            // for (let node of clip_virtual.get_notes_within_loop_brackets()) {
            //     quadruplets.push(this.get_position_quadruplet(node, coord_clip));
            // }
            // return quadruplets.map(function (tuplet) {
            //     let message = <any>["paintrect"].concat(tuplet);
            //     message = message.concat(black);
            //     return message;
            // })
            var coord = iterator_matrix_train.get_coord_current();
            var target_iterator = matrix_target_iterator[coord[0]][coord[1]];
            var interval_current = algorithm.determine_region_present(target_iterator.get_notes());
            this.get_message_render_region_past(interval_current);
            this.get_message_render_region_present(interval_current);
            this.get_message_render_region_future(interval_current);
            // // set right interval
            // determine_region_past(notes_target_next): number {
            //     return notes_target_next[0].model.note.beat_start
            // }
            //
            // // set left interval
            // determine_region_upcoming(notes_target_next): number {
            //     return notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            // }
            // region
            return;
        };
        ListWindow.prototype.render_notes = function (history_user_input) {
            return;
        };
        return ListWindow;
    }(Window));
    window.ListWindow = ListWindow;
    var MatrixClip = /** @class */ (function () {
        function MatrixClip() {
        }
        return MatrixClip;
    }());
    var TreeWindow = /** @class */ (function (_super) {
        __extends(TreeWindow, _super);
        // matrix_clips: LiveClipVirtual[][];
        function TreeWindow(height, width, messenger) {
            return _super.call(this, height, width, messenger) || this;
            // this.struct = new struct.StructList();
        }
        TreeWindow.set_parent_child_relationships = function () {
        };
        // public render(list_parse_tree, matrix_history) {
        //     this.clear()
        //
        // }
        TreeWindow.prototype.render = function (list_parse_tree, matrix_history) {
            this.clear();
            var messages_regions = this.render_regions(matrix_history);
            var messages_notes = this.render_notes(matrix_history);
            var messages_tree = this.render_tree();
            // let msg_clear = ["clear"];
            // msg_clear.unshift('render');
            // this.messenger.message(msg_clear);
            // for (let message of messages_regions) {
            //     message.unshift('render');
            //     this.messenger.message(message);
            // }
            //
            // for (let message of messages_notes) {
            //     message.unshift('render');
            //     this.messenger.message(message);
            // }
            //
            // for (let message of messages_tree) {
            //     message.unshift('render');
            //     this.messenger.message(message);
            // }
        };
        TreeWindow.prototype.render_regions = function (iterator_matrix_train) {
            // determine the coordinates of the last null region (assuming we're working forward)
        };
        TreeWindow.prototype.render_notes = function (history_user_input) {
            // for all non null clips, render
        };
        TreeWindow.prototype.render_trees = function (list_parse_trees) {
            var _this = this;
            var color;
            var messages = [];
            var message;
            for (var _i = 0, list_parse_trees_1 = list_parse_trees; _i < list_parse_trees_1.length; _i++) {
                var parse_tree = list_parse_trees_1[_i];
                var root = parse_tree.get_root();
                root.walk(function (node) {
                    if (node.hasChildren()) {
                        var coords = node.model.note.get_coordinates_matrix();
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
            }
            return messages;
        };
        // TODO: implement
        TreeWindow.prototype.render_note = function (note, coord) {
        };
        // TODO: make node have indices to both clip and note
        TreeWindow.prototype.get_centroid = function (node) {
            var dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;
            // let index_clip = node.model.id;
            var coord_clip = node.model.note.get_coordinates_matrix();
            // TODO: determine how to get the index of the clip from just depth of the node
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, coord_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, coord_clip);
            return [
                dist_from_left_beat_end - ((dist_from_left_beat_end - dist_from_left_beat_start) / 2),
                dist_from_top_note_bottom - ((dist_from_top_note_bottom - dist_from_top_note_top) / 2)
            ];
        };
        ;
        // TODO: elaboration won't always
        TreeWindow.prototype.get_order_of_note_at_beat_start = function (notes, beat_start) {
            return _.findIndex(notes, function (node) {
                return node.model.note.beat_start === beat_start;
            });
        };
        TreeWindow.prototype.get_order_of_note_at_beat_end = function (notes, beat_end) {
            return _.findIndex(notes, function (node) {
                return node.model.note.get_beat_end() === beat_end;
            });
        };
        TreeWindow.prototype.get_interval_beats = function (notes) {
            return [
                notes[0].model.note.beat_start,
                notes[notes.length - 1].model.note.get_beat_end()
            ];
        };
        TreeWindow.prototype.render_tree = function () {
            var messages = this.get_messages_render_tree();
            for (var i = 0; i < messages.length; i++) {
                this.messenger.message(messages[i]);
            }
        };
        ;
        // render_clips(): void {
        //     var messages = this.get_messages_render_clips();
        //     for (var i=0; i < messages.length; i++) {
        //         this.messenger.message(
        //             messages[i]
        //         )
        //     }
        // };
        TreeWindow.prototype.get_messages_render_tree = function () {
            return [];
        };
        return TreeWindow;
    }(Window));
    window.TreeWindow = TreeWindow;
})(window = exports.window || (exports.window = {}));
//# sourceMappingURL=window.js.map