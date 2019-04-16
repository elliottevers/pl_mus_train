import TreeModel = require("tree-model");
import {message} from "../message/messenger"
import {clip, clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";
import {segment as module_segment} from "../segment/segment";
import {iterate} from "../train/iterate";
import {parse} from "../parse/parse";
import {trainer} from "../train/trainer";
import {trainable} from "../algorithm/trainable";

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;
    import Messenger = message.Messenger;
    import Segment = module_segment.Segment;
    import Clip = clip.Clip;
    import MatrixIterator = iterate.MatrixIterator;
    import StructParse = parse.StructParse;
    import StructTrain = trainer.StructTrain;
    import StructTargets = trainer.StructTargets;
    import Trainable = trainable.Trainable;

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

        protected constructor(height, width, messenger) {
            this.height = height;
            this.width = width;
            this.messenger = messenger;
        }

        public clear() {
            let msg_clear = ["clear"];
            this.messenger.message(msg_clear);
        }

        public initialize_clips(trainable: Trainable, segments: Segment[]) {
            let list_clips = [];
            let beat_start_song = segments[0].beat_start;
            let beat_end_song = segments[segments.length - 1].beat_end;

            for (let i in _.range(0, trainable.get_num_layers_clips_to_render())) {
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

        public add_notes_to_clip(notes_to_add_to_clip, index_clip_render) {
            for (let note of notes_to_add_to_clip) {
                this.list_clips[index_clip_render].append(note);
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
            struct_train: StructTrain,
            segment_current: Segment
        ) {

            this.render_regions(
                iterator_matrix_train,
                trainable,
                struct_train,
                segment_current
            );

            this.render_clips(
                trainable,
                struct_train
            );

            this.render_trees(
                struct_train,
                trainable
            );
        }

        public render_trees(struct_train: StructTrain, trainable: Trainable) {
            let messages_render_trees = this.get_messages_render_trees(struct_train, trainable);
            for (let message_tree of messages_render_trees) {
                this.messenger.message(message_tree)
            }
        }

        public get_messages_render_trees(struct_train: StructTrain, trainable: Trainable) {

            if (trainable.b_targeted) {
                return []
            }

            let struct_parse = struct_train as StructParse;

            let color: number[];
            let messages: any[] = [];
            let message: any[];

            for (let coord of struct_parse.coords_roots) {

                let roots_parse_tree;

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

            let index_clip = trainable.coord_to_index_clip_render(coord_clip);

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

        public render_clips(trainable: Trainable, struct_train: StructTrain) {
            let messages_render_clips = this.get_messages_render_clips(trainable, struct_train);
            for (let messages_notes of messages_render_clips) {
                for (let message_note of messages_notes) {
                    this.messenger.message(message_note);
                }
            }
        }

        public get_messages_render_clips(trainable: Trainable, struct_train: StructTrain): any[][] {
            let messages = [];

            if (trainable.b_targeted) {

                let index_clip = 0;

                messages.push(
                    this.get_messages_render_clip(index_clip)
                )

            } else {

                let struct_parse = struct_train as StructParse;

                for (let coord of struct_parse.get_regions_renderable()) {
                    messages.push(
                        this.get_messages_render_clip(
                            trainable.coord_to_index_clip_render(
                                coord
                            )
                        )
                    )
                }
            }

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
            struct_train: StructTrain,
            segment_current: Segment
        ) {

            let interval_current;

            if (iterator_matrix_train.done) {
                interval_current = [
                    segment_current.beat_end,
                    segment_current.beat_end
                ]
            } else {
                let coord_current = iterator_matrix_train.get_coord_current();

                // prediction/detection need the current target, while parse/derive need the current segment
                if (trainable.b_targeted) {

                    let struct_targets = struct_train as StructTargets;

                    let note = struct_targets[coord_current[0]][coord_current[1]].current().iterator_subtarget.current().note;

                    interval_current = trainable.determine_region_present(
                        [note],
                        segment_current
                    );

                } else {

                    let struct_parse = struct_train as StructParse;

                    let coord_segment = [0, coord_current[1]];

                    interval_current = trainable.determine_region_present(
                        struct_parse.get_notes_at_coord(coord_segment),
                        segment_current
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