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
var clip_1 = require("../clip/clip");
var live_1 = require("../live/live");
var _ = require("lodash");
var window;
(function (window) {
    var LiveClipVirtual = live_1.live.LiveClipVirtual;
    var red = [255, 0, 0];
    var white = [255, 255, 255];
    var black = [0, 0, 0];
    var region_yellow = [254, 254, 10];
    var region_green = [33, 354, 6];
    var region_red = [251, 1, 6];
    var blue = [10, 10, 251];
    var Window = /** @class */ (function () {
        // trainer: Trainer;
        function Window(height, width, messenger) {
            this.beat_to_pixel = function (beat) {
                var num_pixels_width = this.width;
                return beat * (num_pixels_width / this.length_beats);
            };
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            // this.trainer = trainer;
        }
        Window.prototype.clear = function () {
            var msg_clear = ["clear"];
            this.messenger.message(msg_clear);
        };
        // TODO: put this logic in Algorithm
        // public coord_to_index_clip(coord): number {
        //     if (this.algorithm.b_targeted()) {
        //         return 0
        //     } else {
        //         if (coord[0] === -1) {
        //             return 0
        //         } else {
        //             return coord[0] + 1
        //         }
        //     }
        // }
        Window.prototype.initialize_clips = function (trainable, segments) {
            var list_clips = [];
            var beat_start_song = segments[0].beat_start;
            var beat_end_song = segments[segments.length - 1].beat_end;
            for (var i in _.range(0, trainable.get_num_layers_clips_to_render())) {
                var clip_dao_virtual = new LiveClipVirtual([]);
                clip_dao_virtual.beat_start = beat_start_song;
                clip_dao_virtual.beat_end = beat_end_song;
                var clip_virtual = new clip_1.clip.Clip(clip_dao_virtual);
                list_clips.push(clip_virtual);
            }
            this.list_clips = list_clips;
        };
        Window.prototype.set_length_beats = function (beats) {
            this.length_beats = beats;
        };
        Window.prototype.add_notes_to_clip = function (notes_to_add_to_clip, index_clip_render) {
            // let index_clip = algorithm.coord_to_index_clip(coord_current);
            for (var _i = 0, notes_to_add_to_clip_1 = notes_to_add_to_clip; _i < notes_to_add_to_clip_1.length; _i++) {
                var note_1 = notes_to_add_to_clip_1[_i];
                this.list_clips[index_clip_render].append(note_1);
            }
        };
        Window.prototype.add_note_to_clip_root = function (note) {
            this.list_clips[0].set_notes([note]);
        };
        Window.prototype.get_messages_render_clip = function (index_clip) {
            var clip_virtual = this.list_clips[index_clip];
            var quadruplets = [];
            for (var _i = 0, _a = clip_virtual.get_notes_within_loop_brackets(); _i < _a.length; _i++) {
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
        Window.prototype.get_position_quadruplet = function (node, index_clip) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;
            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);
            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom];
        };
        ;
        Window.prototype.get_dist_from_top = function (pitch, index_clip) {
            var clip = this.list_clips[index_clip];
            var offset = index_clip;
            // TODO: make this configurable
            if (false) {
                offset = this.list_clips.length - 1 - index_clip;
            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(index_clip);
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
            return this.height / this.list_clips.length;
        };
        ;
        Window.prototype.get_height_note = function (index_clip) {
            var clip = this.list_clips[index_clip];
            var ambitus = clip.get_ambitus();
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            // TODO: fix this hack for getting a margin around the note
            if (dist_pitch === 1) {
                dist_pitch = 3;
            }
            return this.get_height_clip() / dist_pitch;
        };
        ;
        return Window;
    }());
    window.Window = Window;
    var MatrixWindow = /** @class */ (function (_super) {
        __extends(MatrixWindow, _super);
        function MatrixWindow(height, width, messenger) {
            return _super.call(this, height, width, messenger) || this;
        }
        MatrixWindow.prototype.render = function (iterator_matrix_train, trainable, struct_train, segment_current) {
            // this.clear();
            this.render_regions(iterator_matrix_train, trainable, struct_train, segment_current);
            this.render_clips(trainable, struct_train);
            this.render_trees(struct_train, trainable);
        };
        MatrixWindow.prototype.render_trees = function (struct_train, trainable) {
            var messages_render_trees = this.get_messages_render_trees(struct_train, trainable);
            for (var _i = 0, messages_render_trees_1 = messages_render_trees; _i < messages_render_trees_1.length; _i++) {
                var message_tree = messages_render_trees_1[_i];
                this.messenger.message(message_tree);
            }
        };
        MatrixWindow.prototype.get_messages_render_trees = function (struct_train, trainable) {
            var _this = this;
            if (trainable.b_targeted) {
                return [];
            }
            var struct_parse = struct_train;
            var color;
            var messages = [];
            var message;
            for (var _i = 0, _a = struct_parse.coords_roots; _i < _a.length; _i++) {
                var coord = _a[_i];
                var roots_parse_tree = void 0;
                roots_parse_tree = struct_parse.get_notes_at_coord(coord);
                for (var _b = 0, roots_parse_tree_1 = roots_parse_tree; _b < roots_parse_tree_1.length; _b++) {
                    var root = roots_parse_tree_1[_b];
                    root.walk(function (node) {
                        if (node.hasChildren()) {
                            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                                var child = _a[_i];
                                message = [
                                    "linesegment",
                                    _this.get_centroid(child, trainable)[0],
                                    _this.get_centroid(child, trainable)[1],
                                    _this.get_centroid(node, trainable)[0],
                                    _this.get_centroid(node, trainable)[1]
                                ];
                                color = black;
                                messages.push(message.concat(color));
                            }
                        }
                        return true;
                    });
                }
            }
            return messages;
        };
        MatrixWindow.prototype.get_centroid = function (node, trainable) {
            var dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;
            var coord_clip = node.model.note.get_coordinates_matrix();
            var index_clip = trainable.coord_to_index_clip_render(coord_clip);
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
        MatrixWindow.prototype.render_clips = function (trainable, struct_train) {
            var messages_render_clips = this.get_messages_render_clips(trainable, struct_train);
            for (var _i = 0, messages_render_clips_1 = messages_render_clips; _i < messages_render_clips_1.length; _i++) {
                var messages_notes = messages_render_clips_1[_i];
                for (var _a = 0, messages_notes_1 = messages_notes; _a < messages_notes_1.length; _a++) {
                    var message_note = messages_notes_1[_a];
                    this.messenger.message(message_note);
                }
            }
        };
        MatrixWindow.prototype.get_messages_render_clips = function (trainable, struct_train) {
            var messages = [];
            // let b_targeted = (struct_parse === null);
            // make abstraction that gets the renderable regions
            // struct_parse.get_regions_renderable();
            //
            // for (let coord of struct_parse.get_regions_renderable()) {
            //     messages.push(
            //         this.get_messages_render_clip(
            //             trainable.coord_to_index_clip(
            //                 coord
            //             )
            //         )
            //     )
            // }
            if (trainable.b_targeted) {
                var index_clip = 0;
                messages.push(this.get_messages_render_clip(index_clip));
            }
            else {
                var struct_parse = struct_train;
                for (var _i = 0, _a = struct_parse.get_regions_renderable(); _i < _a.length; _i++) {
                    var coord = _a[_i];
                    messages.push(this.get_messages_render_clip(trainable.coord_to_index_clip_render(coord)));
                }
            }
            return messages;
        };
        MatrixWindow.prototype.get_message_render_region_past = function (interval_current) {
            var offset_left_start, offset_top_start, offset_left_end, offset_top_end;
            offset_left_start = this.get_dist_from_left(this.get_offset_pixel_leftmost());
            offset_left_end = this.get_dist_from_left(interval_current[0]);
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();
            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end];
        };
        MatrixWindow.prototype.get_message_render_region_present = function (interval_current) {
            var offset_left_start, offset_top_start, offset_left_end, offset_top_end;
            offset_left_start = this.get_dist_from_left(interval_current[0]);
            offset_left_end = this.get_dist_from_left(interval_current[1]);
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();
            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end];
        };
        MatrixWindow.prototype.get_message_render_region_future = function (interval_current) {
            var offset_left_start, offset_top_start, offset_left_end, offset_top_end;
            offset_left_start = this.get_dist_from_left(interval_current[1]);
            offset_left_end = this.get_dist_from_left(this.get_offset_pixel_rightmost());
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();
            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end];
        };
        MatrixWindow.prototype.render_regions = function (iterator_matrix_train, trainable, 
        // target_current: Target,
        // struct_parse: StructParse
        struct_train, segment_current) {
            // let notes;
            var coord_current = iterator_matrix_train.get_coord_current();
            var interval_current;
            // prediction/detection need the current target, while parse/derive need the current segment
            if (trainable.b_targeted) {
                var struct_targets = struct_train;
                var note_2 = struct_targets[coord_current[0]][coord_current[1]].current().iterator_subtarget.current().note;
                // iterator_subtarget.subtargets.
                // let notes_target_current = target_current.get_notes();
                interval_current = trainable.determine_region_present([note_2], segment_current);
            }
            else {
                var struct_parse = struct_train;
                if (iterator_matrix_train.done) {
                    interval_current = [
                        struct_parse.get_root().model.note.beat_start,
                        struct_parse.get_root().model.note.get_beat_end()
                    ];
                }
                else {
                    // coord = iterator_matrix_train.get_coord_current();
                    var coord_segment = [0, coord_current[1]];
                    // let notes = struct_parse.get_notes_at_coord(coord_segment);
                    interval_current = trainable.determine_region_present(struct_parse.get_notes_at_coord(coord_segment), segment_current);
                }
            }
            var quadruplet_region_past = this.get_message_render_region_past(interval_current);
            var quadruplet_region_present = this.get_message_render_region_present(interval_current);
            var quadruplet_region_future = this.get_message_render_region_future(interval_current);
            quadruplet_region_past.unshift('paintrect');
            quadruplet_region_past = quadruplet_region_past.concat(region_green);
            quadruplet_region_present.unshift('paintrect');
            quadruplet_region_present = quadruplet_region_present.concat(region_red);
            quadruplet_region_future.unshift('paintrect');
            quadruplet_region_future = quadruplet_region_future.concat(region_yellow);
            for (var _i = 0, _a = [quadruplet_region_past, quadruplet_region_present, quadruplet_region_future]; _i < _a.length; _i++) {
                var quadruplet = _a[_i];
                this.messenger.message(quadruplet);
            }
        };
        return MatrixWindow;
    }(Window));
    window.MatrixWindow = MatrixWindow;
})(window = exports.window || (exports.window = {}));
//# sourceMappingURL=window.js.map