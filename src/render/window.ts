import TreeModel = require("tree-model");
import {message, message as m} from "../message/messenger"
import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";
import {log} from "../log/logger";
import {history} from "../history/history";
// import {struct} from "../train/struct";
// import {parse} from "../parse/parse";
import {trainer} from "../train/trainer";
import {parse} from "../parse/parse";
let CircularJSON = require('circular-json');

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;
    import Logger = log.Logger;
    import HistoryUserInput = history.HistoryUserInput;
    // import ParseTree = parse.ParseTree;
    import Messenger = message.Messenger;
    import TargetHistory = history.TargetHistory;
    import MatrixIterator = trainer.MatrixIterator;
    import ParseTree = parse.ParseTree;

    const red = [255, 0, 0];
    const black = [0, 0, 0];

    // interface Renderable {
    //     add(notes: TreeModel.Node<n.Note>[])
    // }

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

        // struct;
        height: number;
        width: number;
        messenger: Messenger;

        protected constructor(height, width, messenger) {
            this.height = height;
            this.width = width;
            this.messenger = messenger;
        }

        public clear() {
            let msg_clear = ["clear"];
            msg_clear.unshift('render');
            this.messenger.message(msg_clear);
        }

        public add(notes: TreeModel.Node<n.Note>[]) {

        }

        // public insert(notes: TreeModel.Node<n.Note>[]) {
        //     this.history_user_input.add(notes)
        //
        // }

        // public render() {
        //
        // }

    }

    export interface Renderable {
        render_regions(
            iterator_matrix_train,
            matrix_target_iterator
        ) // have to have data down to the target

        render_notes(history_user_input)
    }

    export interface TreeRenderable extends Renderable {

        render_regions(iterator_matrix_train)

        render_trees(list_parse_tree: ParseTree[])
    }

    export class ListWindow extends Window {
        constructor(height, width, messenger) {
            super(height, width, messenger);
        }

        public render_regions(iterator_matrix_train: MatrixIterator, matrix_target_iterator) {

        }

        public render_notes(history_user_input: HistoryUserInput) {

        }
    }

    class MatrixClip {
        data: LiveClipVirtual[][];


    }

    export class TreeWindow extends Window {

        matrix_clips: LiveClipVirtual[][];

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

        // render_clips(): void {
        //     var messages = this.get_messages_render_clips();
        //     for (var i=0; i < messages.length; i++) {
        //         this.messenger.message(
        //             messages[i]
        //         )
        //     }
        // };

        get_messages_render_tree() {
            return []
        }

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

        get_messages_render_notes(coord_clip: number[]) {
            // var clip = this.clips[index_clip];
            let clip_virtual = this.matrix_clips[coord_clip[0]][coord_clip[1]]
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
            var num_pixels_in_clip = this.width;
            var num_beats_in_clip = this.get_num_measures_clip() * this.beats_per_measure;
            return beat * (num_pixels_in_clip / num_beats_in_clip);
        };

        get_dist_from_left(beat: number): number {
            return this.beat_to_pixel(beat);
        };

        get_height_clip(): number {
            // return this.height / this.clips.length;
            // return this.height / this.matrix_clips.get_num_rows();
            return this.height / this.matrix_clips.length;
        };

        // get_height_note(index_clip: number): number {
        //     var ambitus = this.get_ambitus(index_clip);
        //     var dist_pitch = ambitus[1] - ambitus[0] + 1;
        //     return this.get_height_clip() / dist_pitch;
        // };

        get_height_note(coord_clip: number[]): number {
            var ambitus = this.get_ambitus(coord_clip);
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };

        // get_ambitus(index_clip: number): number[] {
        //     return this.clips[index_clip].get_ambitus();
        // };
        get_ambitus(coord_clips: number[]): number[] {
            // return this.matrix_clips[
            //     coord_clips[0],
            //     coord_clips[1]
            // ].get_ambitus();
            return this.matrix_clips[coord_clips[0]][coord_clips[1]].get_ambitus();
        };
    }
}