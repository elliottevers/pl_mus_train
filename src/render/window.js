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
// import {struct} from "../train/struct";
// import {parse} from "../parse/parse";
var trainer_1 = require("../train/trainer");
var window;
(function (window) {
    var LiveClipVirtual = live_1.live.LiveClipVirtual;
    var MatrixIterator = trainer_1.trainer.MatrixIterator;
    var red = [255, 0, 0];
    var black = [0, 0, 0];
    var region_yellow = [254, 254, 10];
    var region_green = [33, 354, 6];
    var region_red = [251, 1, 6];
    var Window = /** @class */ (function () {
        function Window(height, width, messenger) {
            this.beat_to_pixel = function (beat) {
                var num_pixels_width = this.width;
                // var num_beats_in_clip = this.get_num_measures_clip() * this.beats_per_measure;
                // let num_beats_window = this.num_measures * this.beats_per_measure;
                return beat * (num_pixels_width / this.length_beats);
            };
            this.height = height;
            this.width = width;
            this.messenger = messenger;
        }
        Window.prototype.clear = function () {
            var msg_clear = ["clear"];
            this.messenger.message(msg_clear);
        };
        // because it's a *list* of clips
        Window.coord_to_index_clip = function (coord) {
            return coord[0] + 1; // we prepend the root to the list
        };
        // TODO: this won't work for a parse tree
        // public initialize_clips_matrix(segments: Segment[]) {
        //     for (let i_row in this.matrix_clips) {
        //         for (let i_col in this.matrix_clips[Number(i_row)]) {
        //             let segment = segments[Number(i_col)];
        //             let clip_dao_virtual = new LiveClipVirtual([]);
        //             clip_dao_virtual.beat_start = segment.beat_start;
        //             clip_dao_virtual.beat_end = segment.beat_end;
        //             this.matrix_clips[Number(i_row)][Number(i_col)] = new c.Clip(clip_dao_virtual);
        //         }
        //     }
        // }
        Window.prototype.initialize_clips = function (algorithm, segments) {
            var list_clips = [];
            var depth = algorithm.get_depth();
            var beat_start_song = segments[0].beat_start;
            var beat_end_song = segments[segments.length - 1].beat_end;
            for (var i in _.range(0, depth + 1)) {
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
        // public add_note_to_clip(note_to_add_to_clip, coord_current) {
        //     this.matrix_clips[coord_current[0]][coord_current[1]].append(note_to_add_to_clip);
        // }
        Window.prototype.add_notes_to_clip = function (notes_to_add_to_clip, coord_current) {
            var index_clip = Window.coord_to_index_clip(coord_current);
            for (var _i = 0, notes_to_add_to_clip_1 = notes_to_add_to_clip; _i < notes_to_add_to_clip_1.length; _i++) {
                var note = notes_to_add_to_clip_1[_i];
                this.list_clips[index_clip].append(note);
            }
        };
        Window.prototype.add_note_to_clip_root = function (note) {
            this.list_clips[0].set_notes([note]);
        };
        // public add(notes: TreeModel.Node<n.Note>[], coord_matrix_clip: number[], segment: Segment) {
        //     let clip_dao_virtual = new LiveClipVirtual(notes);
        //
        //     clip_dao_virtual.beat_start = segment.beat_start;
        //
        //     clip_dao_virtual.beat_end = segment.beat_end;
        //
        //     let clip_virtual = new c.Clip(clip_dao_virtual);
        //
        //     this.matrix_clips[coord_matrix_clip[0]][coord_matrix_clip[1]] = clip_virtual;
        // }
        Window.prototype.get_messages_render_clip = function (coord) {
            var index_clip = Window.coord_to_index_clip(coord);
            var clip_virtual = this.list_clips[index_clip];
            var quadruplets = [];
            for (var _i = 0, _a = clip_virtual.get_notes_within_loop_brackets(); _i < _a.length; _i++) {
                var node = _a[_i];
                quadruplets.push(this.get_position_quadruplet(node, coord));
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
        // render_tree(): void {
        //     var messages = this.get_messages_render_tree();
        //     for (var i=0; i < messages.length; i++) {
        //         this.messenger.message(
        //             messages[i]
        //         )
        //     }
        // };
        Window.prototype.get_dist_from_top = function (pitch, coord) {
            // var clip = this.clips[index_clip];
            var index_clip = Window.coord_to_index_clip(coord);
            var clip = this.list_clips[index_clip];
            // let offset = index_clip;
            var offset = coord[0];
            // let offset = coord_clip[1];
            // TODO: make this configurable
            if (false) {
                // offset = this.clips.length - 1 - index_clip;
                // offset = this.matrix_clips.get_num_rows() - 1 - coord_clip[0];
                offset = this.list_clips.length - 1 - coord[0];
            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(coord);
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
            // return this.height / this.matrix_clips.length;
            return this.height / this.list_clips.length;
        };
        ;
        // TODO: make a virtual "append" clip method so we can get the ambitus across columns
        // get_height_note(coord_clip: number[]): number {
        //     let notes_row = [];
        //     let interval_ambitus: number[] = [-Infinity, Infinity];
        //     for (let i_row in this.matrix_clips) {
        //         for (let i_col in this.matrix_clips[Number(i_row)]) {
        //             if (Number(i_col) == 0) {
        //                 interval_ambitus[0] = this.matrix_clips[coord_clip[0]][Number(i_col)].get_beat_start()
        //             }
        //             notes_row = notes_row.concat(this.matrix_clips[coord_clip[0]][Number(i_col)].get_notes_within_loop_brackets())
        //             interval_ambitus[1] = this.matrix_clips[coord_clip[0]][Number(i_col)].get_beat_end()
        //         }
        //     }
        //     let clip_dao_row_virtual = new LiveClipVirtual([]);
        //     let clip_row_virtual = new Clip(clip_dao_row_virtual);
        //     clip_row_virtual.set_notes(
        //         notes_row
        //     );
        //     // let ambitus = this.get_ambitus(coord_clip);
        //     let ambitus = clip_row_virtual.get_ambitus(interval_ambitus);
        //     let dist_pitch = ambitus[1] - ambitus[0] + 1;
        //     return this.get_height_clip() / dist_pitch;
        // };
        Window.prototype.get_height_note = function (coord) {
            // let notes_row = [];
            // let interval_ambitus: number[] = [-Infinity, Infinity];
            // for (let i_row in this.matrix_clips) {
            //     for (let i_col in this.matrix_clips[Number(i_row)]) {
            //         if (Number(i_col) == 0) {
            //             interval_ambitus[0] = this.matrix_clips[coord_clip[0]][Number(i_col)].get_beat_start()
            //         }
            //         notes_row = notes_row.concat(this.matrix_clips[coord_clip[0]][Number(i_col)].get_notes_within_loop_brackets())
            //         interval_ambitus[1] = this.matrix_clips[coord_clip[0]][Number(i_col)].get_beat_end()
            //     }
            // }
            // let clip_dao_row_virtual = new LiveClipVirtual([]);
            // let clip_row_virtual = new Clip(clip_dao_row_virtual);
            // clip_row_virtual.set_notes(
            //     notes_row
            // );
            var index_clip = Window.coord_to_index_clip(coord);
            var clip = this.list_clips[index_clip];
            // let ambitus = this.get_ambitus(coord_clip);
            var ambitus = clip.get_ambitus();
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };
        ;
        return Window;
    }());
    window.Window = Window;
    // export interface TreeRenderable extends Renderable {
    //
    //     render_regions(iterator_matrix_train)
    //
    //     render_trees(list_parse_tree: ParseTree[])
    // }
    var MatrixWindow = /** @class */ (function (_super) {
        __extends(MatrixWindow, _super);
        function MatrixWindow(height, width, messenger) {
            return _super.call(this, height, width, messenger) || this;
        }
        MatrixWindow.prototype.render = function (iterator_matrix_train, matrix_target_iterator, algorithm, parse_matrix) {
            this.clear();
            this.render_regions(iterator_matrix_train, matrix_target_iterator, algorithm);
            this.render_clips(iterator_matrix_train);
            if (!algorithm.b_targeted()) {
                this.render_trees(parse_matrix);
            }
        };
        MatrixWindow.prototype.render_trees = function (parse_matrix) {
            var _this = this;
            var color;
            var messages = [];
            var message;
            for (var _i = 0, _a = parse_matrix.coords_roots; _i < _a.length; _i++) {
                var coord = _a[_i];
                for (var _b = 0, _c = parse_matrix.get_roots_at_coord(coord); _b < _c.length; _b++) {
                    var root = _c[_b];
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
                                color = red;
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
        // render_tree(): void {
        //     var messages = this.get_messages_render_tree();
        //     for (var i=0; i < messages.length; i++) {
        //         this.messenger.message(
        //             messages[i]
        //         )
        //     }
        // };
        MatrixWindow.prototype.render_clips = function (iterator_matrix_train) {
            var messages_render_clips = this.get_messages_render_clips(iterator_matrix_train);
            for (var _i = 0, messages_render_clips_1 = messages_render_clips; _i < messages_render_clips_1.length; _i++) {
                var messages_notes = messages_render_clips_1[_i];
                for (var _a = 0, messages_notes_1 = messages_notes; _a < messages_notes_1.length; _a++) {
                    var message_note = messages_notes_1[_a];
                    this.messenger.message(message_note);
                }
            }
        };
        MatrixWindow.prototype.get_messages_render_clips = function (iterator_matrix_train) {
            var messages = [];
            for (var _i = 0, _a = _.range(0, iterator_matrix_train.get_state_current() + 1); _i < _a.length; _i++) {
                var i = _a[_i];
                // let coord_clip: number[] = MatrixIterator.get_coord(i, this.matrix_clips[this.matrix_clips.length - 1].length);
                var coord_clip = MatrixIterator.get_coord(i, iterator_matrix_train.num_columns);
                messages.push(this.get_messages_render_clip(coord_clip));
            }
            return messages;
        };
        // render_clips(): void {
        //     var messages = this.get_messages_render_clips();
        //     for (var i=0; i < messages.length; i++) {
        //         this.messenger.message(
        //             messages[i]
        //         )
        //     }
        // };
        // TODO: return signature
        // get_messages_render_clips(history_user_input: HistoryUserInput)  {
        //     var messages = [];
        //     // for (let index_clip in this.clips) {
        //     //     messages = messages.concat(this.get_messages_render_notes(Number(index_clip)))
        //     // }
        //     for (let index_clip in this.clips) {
        //         messages = messages.concat(this.get_messages_render_notes(Number(index_clip)))
        //     }
        //     return messages;
        // };
        // get_messages_render_notes(clip: Clip) {
        //     let quadruplets = [];
        //     for (let node of clip.get_notes_within_loop_brackets()) {
        //         quadruplets.push(this.get_position_quadruplet(node, index_clip));
        //     }
        //     return quadruplets.map(function (tuplet) {
        //         let message = <any>["paintrect"].concat(tuplet);
        //         message = message.concat(black);
        //         return message;
        //     })
        // };
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
        MatrixWindow.prototype.render_regions = function (iterator_matrix_train, matrix_target_iterator, algorithm) {
            var coord = iterator_matrix_train.get_coord_current();
            var target_iterator = matrix_target_iterator[coord[0]][coord[1]];
            var subtargets = target_iterator.current().iterator_subtarget.subtargets.map(function (subtarget) {
                return subtarget.note;
            });
            var interval_current = algorithm.determine_region_present(subtargets);
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