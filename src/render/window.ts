import TreeModel = require("tree-model");
import {message as m} from "../message/messenger"
import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;

    const red = [255, 0, 0];
    const black = ["0", "0", "0"];

    export class Pwindow {
        height: number;
        width: number;
        messenger: m.Messenger;
        clips: c.Clip[];
        beats_per_measure: number;
        root_parse_tree: TreeModel.Node<n.Note>;
        // list_leaves_current: TreeModel.Node<n.Note>[];
        leaves: TreeModel.Node<n.Note>[];

        constructor(height: number, width: number, messenger: m.Messenger) {
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            this.clips = [];
            // this.grans_per_measure = 24; // sixteenth and sixteenth triplets quantization
            this.beats_per_measure = 4;
            // this.root_parse_tree = null;
            // this.list_leaves_current = null;
            // need to count number of measures in clip
            // then multiply that by 24 = granule/measure
            // this is the min size of window in pixels
            // make the width be an integer multiple of this, for convenience
        }

        // TODO: this assumes it only gets called once
        // TODO: assumes we only have one note to begin with
        set_clip(clip: c.Clip) {
            // this.clips.push(clip);
            this.add_clip(clip);
            let note = clip.get_notes()[0];  // first clip only has one note
            note.model.id = 0;  // index of first clip
            this.root_parse_tree = note;
            this.leaves = [note];
        }

        elaborate(elaboration: TreeModel.Node<n.Note>[], beat_start: number, beat_end: number): void {
            // splice clip into clip
            // TODO: pick up here on adding the fourth and last clip
            let notes_new = this.splice_notes(elaboration, this.clips[this.clips.length - 1], [beat_start, beat_end]);
            // add clip to this.clips
            let clip_dao_new = new LiveClipVirtual(notes_new);
            let clip_new = new c.Clip(clip_dao_new);
            // this.clips.push(clip_new);
            this.add_clip(clip_new);
            // splice clip into leaves?  How to splice?  Same logic as above, though instead of replacing, we set children
            // TODO: why are the clips in this.clips not full length?
            // create_layer_from_notes(notes_splice: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
            //     let interval_splice: number[] = [
            //         notes_splice[0].model.note.beat_start,
            //         notes_splice[notes_splice.length - 1].model.note.get_beat_end()
            //     ];
            //
            //     this.get_leaves_within_interval(interval_splice[0], interval_splice[1]);
            //
            //     return
            // }

            // TODO: maintain a list of current leaves
            let leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);
            this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
            // TODO: note working for the fourth and last clip
            this.update_leaves(leaves_within_interval);
            // set list of current leaves
        }

        // deep_copy(obj) {
        //     return JSON.parse(JSON.stringify(obj));
        // }

        // TODO: why are we updated notes in this.clips here?
        // TODO: doesn't work with last clip
        splice_notes(notes_subset: TreeModel.Node<n.Note>[], clip: c.Clip, interval_beats: number[]): TreeModel.Node<n.Note>[] {
            // NB: beginning of interval must equal beat_start of some note in clip, and the end of the interval must equal beat_end of some note in clip
            // let interval_beats = get_interval_beats(notes);
            let notes_clip = _.cloneDeep(clip.get_notes());
            let num_notes_to_replace = this.get_order_of_note_at_beat_end(notes_clip, interval_beats[1]) - this.get_order_of_note_at_beat_start(notes_clip, interval_beats[0]) + 1;
            // this should be 2?
            // TODO: this method only works if the two sets of notes are the same length
            // TODO: should we replace *all* of the notes?
            // let index_start = this.get_diff_index_start(
            //     notes,
            //     notes_clip
            // );
            // this should be 2
            let index_start = this.get_note_index_at_beat(interval_beats[0], notes_clip);
            // NB: stateful
            notes_clip.splice(index_start, num_notes_to_replace, ...notes_subset);
            return notes_clip
        }

        get_note_index_at_beat(beat: number, notes: TreeModel.Node<n.Note>[]): number {
            let val =  _.findIndex(notes, (node)=>{
                // checking number against string
                return node.model.note.beat_start === beat
            });
            return val;
        }

        get_leaves_within_interval(beat_start: number, beat_end: number): TreeModel.Node<n.Note>[] {
            let val =  this.leaves.filter((node) =>{
                return node.model.note.beat_start >= beat_start && node.model.note.get_beat_end() <= beat_end
            });
            return val;
        }

        // NB: this makes the assumption that the end marker is at the end of the clip
        get_num_measures_clip(): number {
            return this.clips[0].get_num_measures();
        }

        // TODO: make node have indices to both clip and note
        get_centroid(node: TreeModel.Node<n.Note>): number[] {

            let dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;

            // var index_clip = node.get_index_clip();
            // var index_note = node.get_index_note();
            // var clip = this.clips[index_clip];
            // clip.load_notes();
            // var note = clip.get_notes()[index_note];

            // var index_clip = node.depth;
            // TODO: this isn't always true
            // let index_clip = node.getPath().length - 1;
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

        // num_notes_in_interval(notes: TreeModel.Node<n.Note>[], beat_start: number, beat_end: number): number {
        //     return notes.filter((node) =>{
        //         return node.model.note.beat_start > beat_start && (node.model.note.get_beat_end()) < beat_end
        //     }).length;
        // }

        get_interval_beats(notes: TreeModel.Node<n.Note>[]): number[] {
            return [
                notes[0].model.note.beat_start,
                notes[notes.length - 1].model.note.get_beat_end()
            ];
        }


        // create_layer_from_notes(notes_splice: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
        //     let interval_splice: number[] = [
        //         notes_splice[0].model.note.beat_start,
        //         notes_splice[notes_splice.length - 1].model.note.get_beat_end()
        //     ];
        //
        //     this.get_leaves_within_interval(interval_splice[0], interval_splice[1]);
        //
        //     return
        // }

        // TODO: add capability to automatically determine parent/children relationships between adjacent tracks
        add_clip(clip: c.Clip): void {
            // for (let node of clip.get_notes()) {
            //     node.model.id = this.clips.length; // soon to be the new index of this clip
            // }
            this.clips.push(clip);
            // if (this.clips.length === 1) {
            //     // TODO: fix this, we're assuming the first clip has only the root note for now
            //     // let tree: TreeModel = new TreeModel();
            //     // this.root_parse_tree = tree.parse(
            //     //     {
            //     //         id: -1, // TODO: hashing scheme for clip id and beat start
            //     //         note: clip.get_notes()[0],
            //     //         children: []
            //     //     }
            //     // );
            //     this.root_parse_tree = clip.get_notes()[0];
            //     // this.list_leaves_current = [
            //     //     this.root_parse_tree
            //     // ];
            //     return
            // }
            // // var notes_parent: TreeModel.Node<n.Note>[] = this.list_leaves_current; // TODO: don't make parental candidates leaves
            // // TODO: make method that takes to clip indices and finds the diff
            // // TODO: we don't need to support adding entire clip, if we know what the diff will be beforehand
            // var notes_parent: TreeModel.Node<n.Note>[] = this.clips[this.clips.length - 2].get_notes();
            // var notes_child: TreeModel.Node<n.Note>[] = clip.get_notes();
            // var notes_diff = this.get_diff_notes(notes_parent, notes_child);
            // var notes_parent_diff = notes_diff['parent'];
            // var notes_child_diff = notes_diff['child'];
            // // this.add_layer(notes_parent_diff, notes_child_diff);
            // this.add_layer(this.get_leaves_within_interval())
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

        // TODO: complete return signature
        get_diff_index_notes(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): number[] {
            // let same_start, same_duration, notes_parent_diff, notes_child_diff, index_start_diff, index_end_diff;
            //
            // for (let i=0; i < notes_child.length; i++) {
            //     same_start = (notes_child[i].model.note.beat_start === notes_parent[i].model.note.beat_start);
            //     same_duration = (notes_child[i].model.note.beats_duration === notes_parent[i].model.note.beats_duration);
            //     if (!(same_start && same_duration)) {
            //         index_start_diff = i;
            //         break;
            //     }
            // }
            //
            // for (let i=-1; i > -1 * (notes_child.length + 1); i--) {
            //     same_start = (notes_child.slice(i)[0].model.note.beat_start === notes_parent.slice(i)[0].model.note.beat_start);
            //     same_duration = (notes_child.slice(i)[0].model.note.beats_duration === notes_parent.slice(i)[0].model.note.beats_duration);
            //     if (!(same_start && same_duration)) {
            //         index_end_diff = i;
            //         break;
            //     }
            // }


            return [
                this.get_diff_index_start(notes_child, notes_parent),
                this.get_diff_index_end(notes_child, notes_parent)
            ];
        };

        // TODO: finish if necessary
        // get_diff_notes(index_start_diff: number, index_end_diff: number) {
        //     // notes_parent_diff = notes_parent.slice(index_start_diff, notes_parent.length + 1 - index_end_diff);
        //     // notes_child_diff = notes_child.slice(index_start_diff, notes_child.length + 1 - index_end_diff);
        //
        //     if (index_end_diff === -1) {
        //         // peculiarity of slice API
        //         notes_parent_diff = notes_parent.slice(index_start_diff, index_end_diff);
        //         notes_child_diff = notes_child.slice(index_start_diff, index_end_diff);
        //         notes_parent_diff.push(notes_parent[notes_parent.length - 1]);
        //         notes_child_diff.push(notes_child[notes_child.length - 1]);
        //     } else {
        //         notes_parent_diff = notes_parent.slice(index_start_diff, index_end_diff + 1);
        //         notes_child_diff = notes_child.slice(index_start_diff, index_end_diff + 1);
        //     }
        //
        //
        //     // TODO: write signature
        //     return {
        //         'parent': notes_parent_diff,
        //         'child': notes_child_diff
        //     }
        // }


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

        // NB: only works top down currently
        // private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {
        private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[], index_new_layer: number): void {

            // // TODO: fix this, we're assuming the first clip has only the root note for now
            // if (notes_parents === null) {
            //     this.parse_tree = new tr.Tree(null, notes_parents[0]);
            //     return notes_parents;
            // }

            var note_parent_best, b_successful;

            // var num_successes = 0;

            for (let node of notes_child) {
                note_parent_best = node.model.note.get_best_candidate(notes_parent);
                b_successful = node.model.note.choose();
                if (b_successful) {
                    node.model.id = index_new_layer;
                    note_parent_best.addChild(node);
                    // num_successes += 1;
                }
            }

            // TODO: set list of current leaves by splicing

            // var b_layer_successful = (num_successes === notes_child.length);

            // // TODO: don't set leaves as the diff
            // if (b_layer_successful) {
            //     return notes_child // new leaves
            // } else {
            //     throw 'adding layer unsuccessful'
            // }
        };

        private update_leaves(leaves: TreeModel.Node<n.Note>[]) {
            // find leaves in elaboration beat interval

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
                    for (let child of leaf.children) {
                        children_to_insert.push(child);
                    }
                    leaves_spliced.splice(
                        i_leaf_to_splice,
                        1,
                        ...children_to_insert
                    )
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
            for (let node of clip.get_notes()) {
                quadruplets.push(this.get_position_quadruplet(node, index_clip));
            }
            return quadruplets.map(function (tuplet) {
                return ["paintrect"].concat(tuplet).concat(black)
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