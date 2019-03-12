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
        function Window(height, width, messenger, algorithm) {
            this.beat_to_pixel = function (beat) {
                var num_pixels_width = this.width;
                return beat * (num_pixels_width / this.length_beats);
            };
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            this.algorithm = algorithm;
        }
        Window.prototype.clear = function () {
            var msg_clear = ["clear"];
            this.messenger.message(msg_clear);
        };
        // because it's a *list* of clips
        Window.prototype.coord_to_index_clip = function (coord) {
            if (this.algorithm.b_targeted()) {
                return 0;
            }
            else {
                if (coord[0] === -1) {
                    return 0;
                }
                else {
                    return coord[0] + 1;
                }
            }
        };
        Window.prototype.initialize_clips = function (algorithm, segments) {
            var list_clips = [];
            var depth = algorithm.get_depth();
            var beat_start_song = segments[0].beat_start;
            var beat_end_song = segments[segments.length - 1].beat_end;
            if (algorithm.b_targeted()) {
                var clip_dao_virtual = new LiveClipVirtual([]);
                clip_dao_virtual.beat_start = beat_start_song;
                clip_dao_virtual.beat_end = beat_end_song;
                var clip_virtual = new clip_1.clip.Clip(clip_dao_virtual);
                list_clips.push(clip_virtual);
            }
            else {
                for (var i in _.range(0, depth + 1)) {
                    var clip_dao_virtual = new LiveClipVirtual([]);
                    clip_dao_virtual.beat_start = beat_start_song;
                    clip_dao_virtual.beat_end = beat_end_song;
                    var clip_virtual = new clip_1.clip.Clip(clip_dao_virtual);
                    list_clips.push(clip_virtual);
                }
            }
            this.list_clips = list_clips;
        };
        Window.prototype.set_length_beats = function (beats) {
            this.length_beats = beats;
        };
        Window.prototype.add_notes_to_clip = function (notes_to_add_to_clip, coord_current) {
            var index_clip = this.coord_to_index_clip(coord_current);
            for (var _i = 0, notes_to_add_to_clip_1 = notes_to_add_to_clip; _i < notes_to_add_to_clip_1.length; _i++) {
                var note = notes_to_add_to_clip_1[_i];
                this.list_clips[index_clip].append(note);
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
        function MatrixWindow(height, width, messenger, algorithm) {
            return _super.call(this, height, width, messenger, algorithm) || this;
        }
        MatrixWindow.prototype.render = function (iterator_matrix_train, notes_target_current, algorithm, parse_matrix) {
            this.clear();
            // let notes, coord;
            //
            // if (algorithm.b_targeted()) {
            //     coord = iterator_matrix_train.get_coord_current();
            //     let target_iterator = matrix_target_iterator[coord[0]][coord[1]];
            //     notes = target_iterator.current().iterator_subtarget.subtargets.map((subtarget) => {
            //         return subtarget.note
            //     });
            // } else {
            //     coord = iterator_matrix_train.get_coord_current();
            //     let coord_segment = [0, coord[1]];
            //     notes = parse_matrix.get_roots_at_coord(coord_segment);
            // }
            this.render_regions(iterator_matrix_train, notes_target_current, algorithm, parse_matrix);
            if (algorithm.b_targeted()) {
                this.render_clips(iterator_matrix_train, null);
            }
            else {
                this.render_trees(parse_matrix);
                this.render_clips(iterator_matrix_train, parse_matrix);
            }
        };
        MatrixWindow.prototype.render_trees = function (parse_matrix) {
            var messages_render_trees = this.get_messages_render_trees(parse_matrix);
            for (var _i = 0, messages_render_trees_1 = messages_render_trees; _i < messages_render_trees_1.length; _i++) {
                var message_tree = messages_render_trees_1[_i];
                this.messenger.message(message_tree);
            }
        };
        MatrixWindow.prototype.get_messages_render_trees = function (parse_matrix) {
            var _this = this;
            var color;
            var messages = [];
            var message;
            for (var _i = 0, _a = parse_matrix.coords_roots; _i < _a.length; _i++) {
                var coord = _a[_i];
                var roots_parse_tree = void 0;
                if (coord[0] === -1) {
                    roots_parse_tree = [parse_matrix.get_root()];
                }
                else {
                    roots_parse_tree = parse_matrix.get_notes_at_coord(coord);
                }
                for (var _b = 0, roots_parse_tree_1 = roots_parse_tree; _b < roots_parse_tree_1.length; _b++) {
                    var root = roots_parse_tree_1[_b];
                    root.walk(function (node) {
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
        MatrixWindow.prototype.get_centroid = function (node) {
            var dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;
            var coord_clip = node.model.note.get_coordinates_matrix();
            var index_clip = this.coord_to_index_clip(coord_clip);
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
        MatrixWindow.prototype.render_clips = function (iterator_matrix_train, parse_matrix) {
            var messages_render_clips = this.get_messages_render_clips(iterator_matrix_train, parse_matrix);
            for (var _i = 0, messages_render_clips_1 = messages_render_clips; _i < messages_render_clips_1.length; _i++) {
                var messages_notes = messages_render_clips_1[_i];
                for (var _a = 0, messages_notes_1 = messages_notes; _a < messages_notes_1.length; _a++) {
                    var message_note = messages_notes_1[_a];
                    this.messenger.message(message_note);
                }
            }
        };
        MatrixWindow.prototype.get_messages_render_clips = function (iterator_matrix_train, parse_matrix) {
            var messages = [];
            var b_targeted = (parse_matrix === null);
            if (b_targeted) {
                // for (let i of iterator_matrix_train.get_history()) {
                //
                //     let index_clip: number = this.coord_to_index_clip(
                //         MatrixIterator.get_coord(
                //             i,
                //             iterator_matrix_train.num_columns
                //         )
                //     );
                var index_clip = 0;
                messages.push(this.get_messages_render_clip(index_clip));
                // }
            }
            else {
                for (var _i = 0, _a = parse_matrix.get_history(); _i < _a.length; _i++) {
                    var coord = _a[_i];
                    messages.push(this.get_messages_render_clip(this.coord_to_index_clip(coord)));
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
        // public render_regions(iterator_matrix_train: MatrixIterator, notes, algorithm) {
        MatrixWindow.prototype.render_regions = function (iterator_matrix_train, notes_target_current, algorithm, parse_matrix) {
            var notes, coord;
            var interval_current;
            if (algorithm.b_targeted()) {
                // coord = iterator_matrix_train.get_coord_current();
                // let target_iterator = matrix_target_iterator[coord[0]][coord[1]];
                // notes = target_iterator.current().iterator_subtarget.subtargets.map((subtarget) => {
                //     return subtarget.note
                // });
                interval_current = algorithm.determine_region_present(notes_target_current);
            }
            else {
                if (iterator_matrix_train.done) {
                    interval_current = [
                        parse_matrix.root.model.note.get_beat_end(),
                        parse_matrix.root.model.note.get_beat_end()
                    ];
                }
                else {
                    coord = iterator_matrix_train.get_coord_current();
                    var coord_segment = [0, coord[1]];
                    notes = parse_matrix.get_notes_at_coord(coord_segment);
                    interval_current = algorithm.determine_region_present(notes);
                }
            }
            // let interval_current;
            // if (iterator_matrix_train.done) {
            //
            // } else {
            //     interval_current = algorithm.determine_region_present(
            //         notes
            //     );
            // }
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