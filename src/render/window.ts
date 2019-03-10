import TreeModel = require("tree-model");
import {message, message as m} from "../message/messenger"
import {clip, clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";
import {log} from "../log/logger";
import {history} from "../history/history";
// import {struct} from "../train/struct";
// import {parse} from "../parse/parse";
import {trainer} from "../train/trainer";
import {parse} from "../parse/parse";
import {segment} from "../segment/segment";

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;
    import Logger = log.Logger;
    import HistoryUserInput = history.HistoryUserInput;
    // import ParseTree = parse.ParseTree;
    import Messenger = message.Messenger;
    import TargetHistory = history.TargetHistory;
    import MatrixIterator = trainer.MatrixIterator;
    import ParseTree = parse.ParseTree;
    import Segment = segment.Segment;
    import Clip = clip.Clip;

    const red = [255, 0, 0];
    const black = [0, 0, 0];
    const region_yellow = [254, 254, 10];
    const region_green = [33, 354, 6];
    const region_red = [251, 1, 6];

    interface Temporal {
        get_message_render_region_past(interval_current);
        get_message_render_region_present(interval_current);
        get_message_render_region_future(interval_current);
    }

    export abstract class Window {
        // height: number;
        // width: number;
        // messenger: m.Messenger;
        // clips: c.Clip[];
        // beats_per_measure: number;
        // root_parse_tree: TreeModel.Node<n.Note>;
        // leaves: TreeModel.Node<n.Note>[];
        // logger: Logger;
        // history_user_input: HistoryUserInput;

        matrix_clips: Clip[][];
        height: number;
        width: number;
        messenger: Messenger;
        length_beats: number;

        protected constructor(height, width, messenger) {
            this.height = height;
            this.width = width;
            this.messenger = messenger;
        }

        public clear() {
            let msg_clear = ["render", "clear"];
            this.messenger.message(msg_clear);
        }

        public set_matrix(matrix) {
            this.matrix_clips = matrix;
        }

        // TODO: this won't work for a parse tree
        public initialize_clips_matrix(segments: Segment[]) {
            for (let i_row in this.matrix_clips) {
                for (let i_col in this.matrix_clips[Number(i_row)]) {
                    let segment = segments[Number(i_col)];
                    let clip_dao_virtual = new LiveClipVirtual([]);
                    clip_dao_virtual.beat_start = segment.beat_start;
                    clip_dao_virtual.beat_end = segment.beat_end;
                    this.matrix_clips[Number(i_row)][Number(i_col)] = new c.Clip(clip_dao_virtual);
                }
            }
        }

        public set_length_beats(beats) {
            this.length_beats = beats;
        }

        public add_note_to_clip(note_to_add_to_clip, coord_current) {
            this.matrix_clips[coord_current[0]][coord_current[1]].append(note_to_add_to_clip);
            return
        }

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

        get_messages_render_clip(coord_clip: number[]) {
            let clip_virtual = this.matrix_clips[coord_clip[0]][coord_clip[1]];
            let quadruplets = [];
            for (let node of clip_virtual.get_notes_within_loop_brackets()) {
                quadruplets.push(this.get_position_quadruplet(node, coord_clip));
            }
            return quadruplets.map(function (tuplet) {
                let message = <any>["paintrect"].concat(tuplet);
                message = message.concat(black);
                return message;
            })
        };

        get_position_quadruplet(node: TreeModel.Node<n.Note>, coord_clip: number[]) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;

            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, coord_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, coord_clip);

            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom]
        };

        get_dist_from_top(pitch: number, coord_clip: number[]): number {
            // var clip = this.clips[index_clip];
            var clip = this.matrix_clips[coord_clip[0]][coord_clip[1]];
            // let offset = index_clip;
            let offset = coord_clip[0];
            // let offset = coord_clip[1];
            // TODO: make this configurable
            if (false) {
                // offset = this.clips.length - 1 - index_clip;
                // offset = this.matrix_clips.get_num_rows() - 1 - coord_clip[0];
                offset = this.matrix_clips.length - 1 - coord_clip[0];

            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(coord_clip);
            return dist + (this.get_height_clip() * offset);
        };

        beat_to_pixel = function (beat: number): number {
            let num_pixels_width = this.width;
            // var num_beats_in_clip = this.get_num_measures_clip() * this.beats_per_measure;
            // let num_beats_window = this.num_measures * this.beats_per_measure;
            return beat * (num_pixels_width / this.length_beats);
        };

        get_dist_from_left(beat: number): number {
            return this.beat_to_pixel(beat);
        };

        get_offset_pixel_leftmost(): number {
            return 0;
        }

        get_offset_pixel_topmost(): number {
            return 0;
        }

        get_offset_pixel_rightmost(): number {
            return this.width;
        }

        get_offset_pixel_bottommost(): number {
            return this.height;
        }

        get_height_clip(): number {
            return this.height / this.matrix_clips.length;
        };

        // TODO: make a virtual "append" clip method so we can get the ambitus across columns
        get_height_note(coord_clip: number[]): number {
            let notes_row = [];
            let interval_ambitus: number[] = [-Infinity, Infinity];
            for (let i_row in this.matrix_clips) {
                for (let i_col in this.matrix_clips[Number(i_row)]) {
                    if (Number(i_col) == 0) {
                        interval_ambitus[0] = this.matrix_clips[coord_clip[0]][Number(i_col)].get_beat_start()
                    }
                    notes_row = notes_row.concat(this.matrix_clips[coord_clip[0]][Number(i_col)].get_notes_within_loop_brackets())
                    interval_ambitus[1] = this.matrix_clips[coord_clip[0]][Number(i_col)].get_beat_end()
                }
            }
            let clip_dao_row_virtual = new LiveClipVirtual([]);
            let clip_row_virtual = new Clip(clip_dao_row_virtual);
            clip_row_virtual.set_notes(
                notes_row
            );
            // let ambitus = this.get_ambitus(coord_clip);
            let ambitus = clip_row_virtual.get_ambitus(interval_ambitus);
            let dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };

        // get_ambitus(coord_clips: number[]): number[] {
        //     return this.matrix_clips[coord_clips[0]][coord_clips[1]].get_ambitus();
        // };
    }

    export interface Renderable {
        render_regions(
            iterator_matrix_train,
            matrix_target_iterator
        )

        render_notes(
            history_user_input
        )
    }

    export interface TreeRenderable extends Renderable {

        render_regions(iterator_matrix_train)

        render_trees(list_parse_tree: ParseTree[])
    }

    export class ListWindow extends Window implements Temporal {
        constructor(height, width, messenger) {
            super(height, width, messenger);
        }

        public render(iterator_matrix_train, matrix_target_iterator, history_user_input, algorithm) {
            this.clear();
            this.render_regions(iterator_matrix_train, matrix_target_iterator, algorithm);
            this.render_clips(iterator_matrix_train);
        }

        public render_clips(iterator_matrix_train) {
            let messages_render_clips = this.get_messages_render_clips(iterator_matrix_train);
            for (let messages_notes of messages_render_clips) {
                for (let message_note of messages_notes) {
                    this.messenger.message(message_note);
                }
            }
        }

        public get_messages_render_clips(iterator_matrix_train): any[][] {
            let messages = [];

            for (let i of _.range(0, iterator_matrix_train.get_state_current() + 1)) {

                let coord_clip: number[] = MatrixIterator.get_coord(i, this.matrix_clips[this.matrix_clips.length - 1].length);

                messages.push(
                    this.get_messages_render_clip(coord_clip)
                )
            }

            return messages
        }

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

        public get_message_render_region_past(interval_current) {
            let offset_left_start, offset_top_start, offset_left_end, offset_top_end;

            offset_left_start = this.get_dist_from_left(this.get_offset_pixel_leftmost());
            offset_left_end = this.get_dist_from_left(interval_current[0]);
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();

            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end]
        }

        public get_message_render_region_present(interval_current) {
            let offset_left_start, offset_top_start, offset_left_end, offset_top_end;

            offset_left_start = this.get_dist_from_left(interval_current[0]);
            offset_left_end = this.get_dist_from_left(interval_current[1]);
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();

            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end]
        }

        public get_message_render_region_future(interval_current) {
            let offset_left_start, offset_top_start, offset_left_end, offset_top_end;

            offset_left_start = this.get_dist_from_left(interval_current[1]);
            offset_left_end = this.get_dist_from_left(this.get_offset_pixel_rightmost());
            offset_top_start = this.get_offset_pixel_topmost();
            offset_top_end = this.get_offset_pixel_bottommost();

            return [offset_left_start, offset_top_start, offset_left_end, offset_top_end]
        }

        public render_regions(iterator_matrix_train, matrix_target_iterator, algorithm) {
            let coord = iterator_matrix_train.get_coord_current();
            let target_iterator = matrix_target_iterator[coord[0]][coord[1]];
            let subtargets = target_iterator.current().iterator_subtarget.subtargets.map((subtarget) => {
                return subtarget.note
            });
            let interval_current = algorithm.determine_region_present(
                subtargets
            );

            let quadruplet_region_past = this.get_message_render_region_past(interval_current);
            let quadruplet_region_present = this.get_message_render_region_present(interval_current);
            let quadruplet_region_future = this.get_message_render_region_future(interval_current);

            quadruplet_region_past.unshift('paintrect');
            quadruplet_region_past = quadruplet_region_past.concat(region_green);

            quadruplet_region_present.unshift('paintrect');
            quadruplet_region_present = quadruplet_region_present.concat(region_red);

            quadruplet_region_future.unshift('paintrect');
            quadruplet_region_future = quadruplet_region_future.concat(region_yellow);

            for (let quadruplet of [quadruplet_region_past, quadruplet_region_present, quadruplet_region_future]) {
                this.messenger.message(quadruplet);
            }
        }

        // public get_messages_render_notes(iterator_matrix_train: MatrixIterator, matrix_target_iterator) {
        //     let coord_clip = iterator_matrix_train.get_coord_current();
        //     let clip_virtual = this.matrix_clips[coord_clip[0]][coord_clip[1]];
        //     let quadruplets = [];
        //     for (let node of clip_virtual.get_notes_within_loop_brackets()) {
        //         quadruplets.push(this.get_position_quadruplet(node, coord_clip));
        //     }
        //     return quadruplets.map(function (tuplet) {
        //         let message = <any>["paintrect"].concat(tuplet);
        //         message = message.concat(black);
        //         return message;
        //     })
        // }
    }

    // class MatrixClip {
    //     data: LiveClipVirtual[][];
    //
    //
    // }

    export class TreeWindow extends Window {

        // matrix_clips: LiveClipVirtual[][];

        constructor(height, width, messenger) {
            super(height, width, messenger);
            // this.struct = new struct.StructList();
        }

        public static set_parent_child_relationships() {

        }

        // public render(list_parse_tree, matrix_history) {
        //     this.clear()
        //
        // }

        render(list_parse_tree, matrix_history) {

            this.clear();

            let messages_regions = this.render_regions(
                matrix_history
            );

            let messages_notes = this.render_notes(
                matrix_history
            );

            let messages_tree = this.render_tree(

            );

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
        }

        public render_regions(iterator_matrix_train: MatrixIterator) {
            // determine the coordinates of the last null region (assuming we're working forward)
        }

        public render_notes(history_user_input: HistoryUserInput) {
            // for all non null clips, render
        }

        public render_trees(list_parse_trees: ParseTree[]) {

            let color: number[];
            let messages: any[] = [];
            let message: any[];

            for (let parse_tree of list_parse_trees) {

                let root = parse_tree.get_root();

                root.walk((node)=>{

                    if (node.hasChildren()) {

                        let coords: number[] = node.model.note.get_coordinates_matrix();

                        for (let child of node.children) {

                            message = [
                                "linesegment",
                                this.get_centroid(child)[0],
                                this.get_centroid(child)[1],
                                this.get_centroid(node)[0],
                                this.get_centroid(node)[1]
                            ];

                            color = red;

                            messages.push(message.concat(color));

                        }
                    }

                    return true;
                });
            }

            return messages;
        }

        // TODO: implement
        private render_note(note: TreeModel.Node<n.Note>, coord: number[]) {

        }

        // TODO: make node have indices to both clip and note
        get_centroid(node: TreeModel.Node<n.NoteRenderable>): number[] {

            let dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;

            // let index_clip = node.model.id;
            let coord_clip = node.model.note.get_coordinates_matrix();

            // TODO: determine how to get the index of the clip from just depth of the node

            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, coord_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, coord_clip);

            return [
                dist_from_left_beat_end - ((dist_from_left_beat_end - dist_from_left_beat_start) / 2),
                dist_from_top_note_bottom - ((dist_from_top_note_bottom - dist_from_top_note_top) / 2)
            ]
        };

        // TODO: elaboration won't always
        get_order_of_note_at_beat_start(notes: TreeModel.Node<n.Note>[], beat_start: number): number {
            return _.findIndex(notes, (node) => {
                return node.model.note.beat_start === beat_start
            });
        }

        get_order_of_note_at_beat_end(notes: TreeModel.Node<n.Note>[], beat_end: number): number {
            return _.findIndex(notes, (node) => {
                return node.model.note.get_beat_end() === beat_end
            });
        }

        get_interval_beats(notes: TreeModel.Node<n.Note>[]): number[] {
            return [
                notes[0].model.note.beat_start,
                notes[notes.length - 1].model.note.get_beat_end()
            ];
        }

        render_tree(): void {
            var messages = this.get_messages_render_tree();
            for (var i=0; i < messages.length; i++) {
                this.messenger.message(
                    messages[i]
                )
            }
        };

        get_messages_render_tree() {
            return []
        }

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

        // get_messages_render_notes(index_clip: number) {
        //     var clip = this.clips[index_clip];
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

    }
}