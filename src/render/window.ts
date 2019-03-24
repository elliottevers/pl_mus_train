import TreeModel = require("tree-model");
import {message, message as m} from "../message/messenger"
import {clip, clip as c} from "../clip/clip";
import {note, note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";
import {segment as module_segment} from "../segment/segment";
import {algorithm} from "../train/algorithm";
import {iterate} from "../train/iterate";
import {parse} from "../parse/parse";
import {log} from "../log/logger";
import {target} from "../target/target";
import {trainer as module_trainer} from "../train/trainer";

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;
    import Messenger = message.Messenger;
    import Segment = module_segment.Segment;
    import Clip = clip.Clip;
    // import Algorithm = algorithm.Algorithm;
    import MatrixIterator = iterate.MatrixIterator;
    import StructParse = parse.StructParse;
    import Logger = log.Logger;
    import Note = note.Note;
    import NoteRenderable = note.NoteRenderable;
    import Target = target.Target;
    import Trainer = module_trainer.Trainer;
    import Trainable = algorithm.Trainable;

    const red = [255, 0, 0];
    const white = [255, 255, 255];
    const black = [0, 0, 0];
    const region_yellow = [254, 254, 10];
    const region_green = [33, 354, 6];
    const region_red = [251, 1, 6];
    const blue = [10, 10, 251];

    interface Temporal {
        get_message_render_region_past(interval_current);
        get_message_render_region_present(interval_current);
        get_message_render_region_future(interval_current);
    }

    export abstract class Window {
        list_clips: Clip[];
        height: number;
        width: number;
        messenger: Messenger;
        length_beats: number;
        // trainer: Trainer;

        protected constructor(height, width, messenger) {
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            // this.trainer = trainer;
        }

        public clear() {
            let msg_clear = ["clear"];
            this.messenger.message(msg_clear);
        }

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

        public initialize_clips(trainable: Trainable, segments: Segment[]) {
            let list_clips = [];
            let beat_start_song = segments[0].beat_start;
            let beat_end_song = segments[segments.length - 1].beat_end;

            for (let i in _.range(0, trainable.get_depth() + 1)) {
                let clip_dao_virtual = new LiveClipVirtual([]);
                clip_dao_virtual.beat_start = beat_start_song;
                clip_dao_virtual.beat_end = beat_end_song;
                let clip_virtual = new c.Clip(clip_dao_virtual);
                list_clips.push(clip_virtual)
            }

            this.list_clips = list_clips;
        }

        public set_length_beats(beats) {
            this.length_beats = beats;
        }

        public add_notes_to_clip(notes_to_add_to_clip, coord_current, algorithm) {
            let index_clip = algorithm.coord_to_index_clip(coord_current);
            for (let note of notes_to_add_to_clip) {
                this.list_clips[index_clip].append(note);
            }
        }

        add_note_to_clip_root(note) {
            this.list_clips[0].set_notes(
                [note]
            )
        }

        get_messages_render_clip(index_clip: number) {
            let clip_virtual = this.list_clips[index_clip];
            let quadruplets = [];
            for (let node of clip_virtual.get_notes_within_loop_brackets()) {
                quadruplets.push(this.get_position_quadruplet(node, index_clip));
            }
            return quadruplets.map(function (tuplet) {
                let message = <any>["paintrect"].concat(tuplet);
                message = message.concat(black);
                return message;
            })
        };

        get_position_quadruplet(node: TreeModel.Node<n.Note>, index_clip: number) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;

            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);

            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom]
        };

        get_dist_from_top(pitch: number, index_clip: number): number {
            var clip = this.list_clips[index_clip];
            let offset = index_clip;
            // TODO: make this configurable
            if (false) {
                offset = this.list_clips.length - 1 - index_clip;

            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(index_clip);
            return dist + (this.get_height_clip() * offset);
        };

        beat_to_pixel = function (beat: number): number {
            let num_pixels_width = this.width;
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
            return this.height / this.list_clips.length;
        };

        get_height_note(index_clip: number): number {
            let clip = this.list_clips[index_clip];
            let ambitus = clip.get_ambitus();
            let dist_pitch = ambitus[1] - ambitus[0] + 1;

            // TODO: fix this hack for getting a margin around the note
            if (dist_pitch === 1) {
                dist_pitch = 3;
            }
            return this.get_height_clip() / dist_pitch;
        };
    }

    export class MatrixWindow extends Window implements Temporal {

        constructor(height, width, messenger) {
            super(height, width, messenger);
        }

        public render(
            iterator_matrix_train: MatrixIterator,
            trainable: Trainable,
            target_current: Target, // only for detect/predict
            struct_parse: StructParse, // only for parse/derive
            // segment_current: Segment
        ) {

            this.clear();

            // TODO: compensate for this logic
            // if (this.algorithm.b_targeted()) {
            //     notes = this.target_current.iterator_subtarget.subtargets.map((subtarget) => {
            //         return subtarget.note
            //     })
            // }
            // let notes_in_region = trainable.get_notes_in_region(
            //     target_current,
            //     segment_current
            // );

            this.render_regions(
                iterator_matrix_train,
                trainable,
                target_current,
                struct_parse
            );

            this.render_clips(
                trainable,
                struct_parse
            );

            this.render_trees(
                struct_parse,
                trainable
            );
        }

        public render_trees(struct_parse: StructParse, trainable: Trainable) {
            let messages_render_trees = this.get_messages_render_trees(struct_parse, trainable);
            for (let message_tree of messages_render_trees) {
                this.messenger.message(message_tree)
            }
        }

        public get_messages_render_trees(struct_parse: StructParse, trainable: Trainable) {

            if (struct_parse === null) {
                return []
            }

            let color: number[];
            let messages: any[] = [];
            let message: any[];

            for (let coord of struct_parse.coords_roots) {
                let roots_parse_tree;

                // if (coord[0] === -1) {
                //     roots_parse_tree = [struct_parse.get_root()]
                // } else {
                //     roots_parse_tree = struct_parse.get_notes_at_coord(coord);
                // }

                roots_parse_tree = struct_parse.get_notes_at_coord(coord);

                for (let root of roots_parse_tree) {
                    root.walk((node)=>{

                        if (node.hasChildren()) {

                            for (let child of node.children) {

                                message = [
                                    "linesegment",
                                    this.get_centroid(child, trainable)[0],
                                    this.get_centroid(child, trainable)[1],
                                    this.get_centroid(node, trainable)[0],
                                    this.get_centroid(node, trainable)[1]
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
        }

        get_centroid(node: TreeModel.Node<n.NoteRenderable>, trainable: Trainable): number[] {

            let dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;

            let coord_clip = node.model.note.get_coordinates_matrix();

            let index_clip = trainable.coord_to_index_clip(coord_clip);

            // TODO: determine how to get the index of the clip from just depth of the node

            dist_from_left_beat_start = this.get_dist_from_left(node.model.note.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.model.note.beat_start + node.model.note.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.model.note.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.model.note.pitch - 1, index_clip);

            return [
                dist_from_left_beat_end - ((dist_from_left_beat_end - dist_from_left_beat_start) / 2),
                dist_from_top_note_bottom - ((dist_from_top_note_bottom - dist_from_top_note_top) / 2)
            ]
        };

        public render_clips(trainable: Trainable, struct_parse: StructParse) {
            let messages_render_clips = this.get_messages_render_clips(trainable, struct_parse);
            for (let messages_notes of messages_render_clips) {
                for (let message_note of messages_notes) {
                    this.messenger.message(message_note);
                }
            }
        }

        public get_messages_render_clips(trainable: Trainable, struct_parse: StructParse): any[][] {
            let messages = [];

            let b_targeted = (struct_parse === null);

            // make abstraction that gets the renderable regions

            struct_parse.get_regions_renderable();

            for (let coord of struct_parse.get_regions_renderable()) {
                messages.push(
                    this.get_messages_render_clip(
                        trainable.coord_to_index_clip(
                            coord
                        )
                    )
                )
            }

            // if (b_targeted) {
            //
            //     let index_clip = 0;
            //
            //     messages.push(
            //         this.get_messages_render_clip(index_clip)
            //     )
            // } else {
            //     for (let coord of parse_matrix.get_regions_renderable()) {
            //         messages.push(
            //             this.get_messages_render_clip(
            //                 this.algorithm.coord_to_index_clip(
            //                     coord
            //                 )
            //             )
            //         )
            //     }
            // }

            return messages
        }

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

        public render_regions(
            iterator_matrix_train: MatrixIterator,
            trainable: Trainable,
            target_current: Target,
            struct_parse: StructParse
        ) {

            let notes, coord;

            let interval_current;

            // prediction/detection need the current target, while parse/derive need the current segment
            if (trainable.b_targeted) {
                let notes_target_current = target_current.get_notes();

                interval_current = trainable.determine_region_present(
                    notes_target_current
                );
            } else {
                if (iterator_matrix_train.done) {
                    interval_current = [
                        struct_parse.get_root().model.note.get_beat_end(),
                        struct_parse.get_root().model.note.get_beat_end()
                    ]
                } else {
                    coord = iterator_matrix_train.get_coord_current();

                    let coord_segment = [0, coord[1]];

                    notes = struct_parse.get_notes_at_coord(coord_segment);

                    interval_current = trainable.determine_region_present(
                        notes
                    );
                }
            }

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
    }
}