import TreeModel = require("tree-model");
import {message as m} from "../message/messenger"
import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";
import {log} from "../log/logger";
let CircularJSON = require('circular-json');

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;
    import Logger = log.Logger;

    const red = [255, 0, 0];
    const black = [0, 0, 0];

    export class Pwindow {
        height: number;
        width: number;
        messenger: m.Messenger;
        clips: c.Clip[];
        beats_per_measure: number;
        root_parse_tree: TreeModel.Node<n.Note>;
        leaves: TreeModel.Node<n.Note>[];
        logger: Logger;

        constructor(height: number, width: number, messenger: m.Messenger) {
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            this.clips = [];
            this.beats_per_measure = 4;
            this.logger = new Logger('max');
        }

        get_notes_leaves(): TreeModel.Node<n.Note>[] {
            return this.leaves;
        }

        set_root(note_root: TreeModel.Node<n.Note>) {
            let clip_dao_virtual = new LiveClipVirtual([note_root]);

            let clip_virtual = new c.Clip(clip_dao_virtual);

            this.add_clip(clip_virtual);

            note_root.model.id = 0;  // index of first clip

            this.root_parse_tree = note_root;

            this.leaves = [note_root];
        }

        elaborate(elaboration: TreeModel.Node<n.Note>[], beat_start: number, beat_end: number, index_layer: number): void {

            if (index_layer + 1 > this.clips.length) {
                let clip_dao_virtual = new LiveClipVirtual(elaboration);
                let clip_virtual = new c.Clip(clip_dao_virtual);
                this.add_clip(clip_virtual);
            } else {
                let clip_last = this.clips[this.clips.length - 1];
                clip_last.set_notes(elaboration)
            }

            let leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);

            if (index_layer == 1) {
                this.add_first_layer(elaboration, this.clips.length - 1)
            } else {
                this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
            }

            this.update_leaves(leaves_within_interval);
        }

        splice_notes(notes_subset: TreeModel.Node<n.Note>[], clip: c.Clip, interval_beats: number[]): TreeModel.Node<n.Note>[] {
            let notes_clip = _.cloneDeep(clip.get_notes_within_markers());
            let num_notes_to_replace = this.get_order_of_note_at_beat_end(notes_clip, interval_beats[1]) - this.get_order_of_note_at_beat_start(notes_clip, interval_beats[0]) + 1;
            let index_start = this.get_note_index_at_beat(interval_beats[0], notes_clip);
            notes_clip.splice(index_start, num_notes_to_replace, ...notes_subset);
            return notes_clip
        }

        get_note_index_at_beat(beat: number, notes: TreeModel.Node<n.Note>[]): number {
            let val =  _.findIndex(notes, (node)=>{
                return node.model.note.beat_start === beat
            });
            return val;
        }

        get_leaves_within_interval(beat_start: number, beat_end: number): TreeModel.Node<n.Note>[] {
            let val =  this.leaves.filter((node) =>{
                // return node.model.note.beat_start >= beat_start && node.model.note.get_beat_end() <= beat_end
                return (node.model.note.beat_start >= beat_start && node.model.note.beat_start <= beat_end) || (node.model.note.get_beat_end() <= beat_end && node.model.note.get_beat_end() >= beat_start)

            });
            // this.logger.log(CircularJSON.stringify(this.leaves));
            return val;
        }

        // NB: this makes the assumption that the end marker is at the end of the clip
        get_num_measures_clip(): number {
            return this.clips[0].get_num_measures();
        }

        // TODO: make node have indices to both clip and note
        get_centroid(node: TreeModel.Node<n.Note>): number[] {

            let dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;

            let index_clip = node.model.id;

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

        // TODO: add capability to automatically determine parent/children relationships between adjacent tracks
        add_clip(clip: c.Clip): void {
            this.clips.push(clip);
        };

        get_diff_index_start(notes_new: TreeModel.Node<n.Note>[], notes_old: TreeModel.Node<n.Note>[]): number {
            let same_start, same_duration, index_start_diff;
            for (let i=0; i < notes_old.length; i++) {
                same_start = (notes_old[i].model.note.beat_start === notes_new[i].model.note.beat_start);
                same_duration = (notes_old[i].model.note.beats_duration === notes_new[i].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_start_diff = i;
                    break;
                }
            }

            return index_start_diff;
        }

        get_diff_index_end(notes_new: TreeModel.Node<n.Note>[], notes_old: TreeModel.Node<n.Note>[]): number {
            let same_start, same_duration, index_end_diff;
            for (let i=-1; i > -1 * (notes_new.length + 1); i--) {
                same_start = (notes_new.slice(i)[0].model.note.beat_start === notes_old.slice(i)[0].model.note.beat_start);
                same_duration = (notes_new.slice(i)[0].model.note.beats_duration === notes_old.slice(i)[0].model.note.beats_duration);
                if (!(same_start && same_duration)) {
                    index_end_diff = i;
                    break;
                }
            }

            // NB: add one in order to use with array slice, unless of course the index is -1, then you'll access the front of the array
            return index_end_diff;
        }

        // TODO: complete return method signature
        get_diff_index_notes(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): number[] {
            return [
                this.get_diff_index_start(notes_child, notes_parent),
                this.get_diff_index_end(notes_child, notes_parent)
            ];
        };

        render_tree(): void {
            var messages = this.get_messages_render_tree();
            for (var i=0; i < messages.length; i++) {
                this.messenger.message(
                    messages[i]
                )
            }
        };

        // TODO: how do we render when there is no singular root (i.e. parsing, not sampling, sentence)?
        get_messages_render_tree() {
            let color: number[], messages: any[] = [], message: any[];

            this.root_parse_tree.walk((node)=>{
                if (node.hasChildren()) {
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

            return messages;
        };

        private add_first_layer(notes: TreeModel.Node<n.Note>[], index_new_layer: number): void {
            // var note_parent_best, b_successful;

            for (let node of notes) {
                node.model.id = index_new_layer;
                this.root_parse_tree.addChild(node);
            }
        }

        // NB: only works top down currently
        // private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
        private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[], index_new_layer: number): void {

            var note_parent_best, b_successful;

            for (let node of notes_child) {
                note_parent_best = node.model.note.get_best_candidate(notes_parent);
                b_successful = node.model.note.choose();
                if (b_successful) {
                    node.model.id = index_new_layer;
                    note_parent_best.addChild(node);
                }
            }
        };

        private update_leaves(leaves: TreeModel.Node<n.Note>[]) {
            // find leaves in parse/derive beat interval

            // splice them with their children
            let leaves_spliced = this.leaves;
            let children_to_insert, i_leaf_to_splice;
            for (let leaf of leaves) {
                // find index of leaf to "splice"
                // always splice only one leaf
                // find corresponding leaf in leaves_spliced
                children_to_insert = [];
                if (leaf.hasChildren()) {
                    i_leaf_to_splice = _.findIndex(leaves_spliced, (leaf_to_splice)=>{
                        // assuming monophony, i.e., no overlap
                        return leaf_to_splice.model.note.beat_start === leaf.model.note.beat_start
                    });

                    let beat_end_children_greatest = -Infinity, beat_start_children_least = Infinity;

                    for (let child of leaf.children) {
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
                        leaves_spliced.splice(
                            i_leaf_to_splice,
                            0,
                            ...children_to_insert
                        )
                    } else {
                        leaves_spliced.splice(
                            i_leaf_to_splice,
                            1,
                            ...children_to_insert
                        )
                    }
                    // leaves_spliced.splice(
                    //     i_leaf_to_splice,
                    //     1,
                    //     ...children_to_insert
                    // )
                }
            }

            this.leaves = leaves_spliced;
        }

        render_clips(): void {
            var messages = this.get_messages_render_clips();
            for (var i=0; i < messages.length; i++) {
                this.messenger.message(
                    messages[i]
                )
            }
        };

        // TODO: return signature
        get_messages_render_clips()  {
            var messages = [];
            for (let index_clip in this.clips) {
                messages = messages.concat(this.get_messages_render_notes(Number(index_clip)))
            }
            return messages;
        };

        get_messages_render_notes(index_clip: number) {
            var clip = this.clips[index_clip];
            let quadruplets = [];
            for (let node of clip.get_notes_within_markers()) {
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
            var clip = this.clips[index_clip];
            let offset = index_clip;
            // TODO: make this configurable
            if (false) {
                offset = this.clips.length - 1 - index_clip;
            }
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(index_clip);
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
            return this.height / this.clips.length;
        };

        get_height_note(index_clip: number): number {
            var ambitus = this.get_ambitus(index_clip);
            var dist_pitch = ambitus[1] - ambitus[0] + 1;
            return this.get_height_clip() / dist_pitch;
        };

        get_ambitus(index_clip: number): number[] {
            return this.clips[index_clip].get_ambitus();
        };
    }
}