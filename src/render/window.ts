import TreeModel = require("tree-model");
import {message as m} from "../message/messenger"
import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";

export namespace window {
    export class Pwindow {
        height: number;
        width: number;
        messenger: m.Messenger;
        clips: c.Clip[];
        beats_per_measure: number;
        parse_tree: TreeModel;
        list_leaves_current: TreeModel.Node<Node>[];

        constructor(height: number, width: number, messenger: m.Messenger) {
            this.height = height;
            this.width = width;
            this.messenger = messenger;
            this.clips = [];
            // this.grans_per_measure = 24; // sixteenth and sixteenth triplets quantization
            this.beats_per_measure = 4;
            this.parse_tree = null;
            this.list_leaves_current = null;
            // need to count number of measures in clip
            // then multiply that by 24 = granule/measure
            // this is the min size of window in pixels
            // make the width be an integer multiple of this, for convenience
        }

        // NB: this makes the assumption that the end marker is at the end of the clip
        get_num_measures_clip(): number {
            return this.clips[0].get_num_measures();
        }

        // TODO: make node have indices to both clip and note
        get_centroid(node: TreeModel.Node<n.Note>): number[] {

            var dist_from_left_beat_start, dist_from_left_beat_end, dist_from_top_note_top, dist_from_top_note_bottom;

            // var index_clip = node.get_index_clip();
            // var index_note = node.get_index_note();
            // var clip = this.clips[index_clip];
            // clip.load_notes();
            // var note = clip.get_notes()[index_note];

            var index_clip = node.depth;

            // TODO: determine how to get the index of the clip from just depth of the node

            dist_from_left_beat_start = this.get_dist_from_left(node.data.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(node.data.beat_start + node.data.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(node.data.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(node.data.pitch - 1, index_clip);

            return [
                dist_from_left_beat_end - ((dist_from_left_beat_end - dist_from_left_beat_start) / 2),
                dist_from_top_note_bottom - ((dist_from_top_note_bottom - dist_from_top_note_top) / 2)
            ]
        };

        // TODO: add capability to automatically determine parent/children relationships between adjacent tracks
        add_clip(clip: c.Clip): void {
            this.clips.push(clip);
            if (this.clips.length === 1) {
                // TODO: fix this, we're assuming the first clip has only the root note for now
                // if (notes_parents === null) {
                //     this.parse_tree = new tr.Tree(null, notes_parents[0]);
                //     return notes_parents;
                // }
                // this.parse_tree = new tr.Tree(null, clip.get_notes()[0]);
                this.parse_tree = clip.get_notes()[0];
                this.list_leaves_current = [this.parse_tree];
                return
            }
            var notes_parent = this.list_leaves_current;
            var notes_child = clip.get_notes();
            // l.log(notes_child);
            var notes_diff = this.get_diff_notes(notes_parent, notes_child);
            var notes_parent_diff = notes_diff['parent'];
            var notes_child_diff = notes_diff['child'];
            this.list_leaves_current = this._add_layer(notes_parent_diff, notes_child_diff);
        };

        // TODO: complete return signature
        get_diff_notes(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]) {
            let same_start, same_duration, notes_parent_diff, notes_child_diff, index_start_diff, index_end_diff;

            for (var i=0; i < notes_child.length; i++) {
                same_start = (notes_child[i].data.beat_start === notes_parent[i].data.beat_start);
                same_duration = (notes_child[i].data.beats_duration === notes_parent[i].data.beats_duration);
                if (!(same_start && same_duration)) {
                    index_start_diff = i;
                    break;
                }
            }

            for (i=-1; i > -1 * (notes_child.length + 1); i--) {
                same_start = (notes_child.slice(i)[0].data.beat_start === notes_parent.slice(i)[0].data.beat_start);
                same_duration = (notes_child.slice(i)[0].data.beats_duration === notes_parent.slice(i)[0].data.beats_duration);
                if (!(same_start && same_duration)) {
                    index_end_diff = i;
                    break;
                }
            }

            notes_parent_diff = notes_parent.slice(index_start_diff, notes_parent.length + 1 - index_end_diff);
            notes_child_diff = notes_child.slice(index_start_diff, notes_child.length + 1 - index_end_diff);

            return {
                'parent': notes_parent_diff,
                'child': notes_child_diff
            }
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
            // iterator = ....  callback that sends messages to draw line segments using node.data.start_beat and node.depth
            // this.tree.traverseDown(iterator)

            var messages = [];

            // function iterator (node) {
            //     var pixel_coord_centroid_child, pixel_coord_centroid_parent;
            //     if (node.parent !== null) {
            //         pixel_coord_centroid_parent = this.get_centroid(node.parent);
            //         pixel_coord_centroid_child = this.get_centroid(node);
            //
            //         messages.push([
            //             "linesegment",
            //             pixel_coord_centroid_child[0],
            //             pixel_coord_centroid_child[1],
            //             pixel_coord_centroid_parent[0],
            //             pixel_coord_centroid_parent[1]
            //         ])
            //     }
            //
            // }

            // TODO: store all roots of trees

            // var nodesGt100 = root.all(function (node) {
            //     return node.model.id > 100;
            // });

            this.parse_tree.root.walk(function (node) {
                // Halt the traversal by returning false
                if (node.model.id === 121) return false;
            });

            // this.parse_tree.traverseDown(iterator.bind(this));

            return messages;
        };

        // NB: only works top down currently
        private add_layer(notes_parent: TreeModel.Node<n.Note>[], notes_child: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[] {

            // // TODO: fix this, we're assuming the first clip has only the root note for now
            // if (notes_parents === null) {
            //     this.parse_tree = new tr.Tree(null, notes_parents[0]);
            //     return notes_parents;
            // }

            var note_parent_best, b_successful, note_child;

            var num_successes = 0;

            for (var i = 0; i < notes_child.length; i++) {
                note_child = notes_child[i];
                note_parent_best = note_child.data.get_best_candidate(notes_parent);
                b_successful = note_child.data.choose();
                if (b_successful) {
                    note_parent_best.appendChild(note_child);
                    num_successes += 1;
                }
            }

            var b_layer_successful = (num_successes === notes_child.length);

            if (b_layer_successful) {
                return notes_child // new leaves
            } else {
                throw 'adding layer unsuccessful'
            }
        };

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
            for (var j = 0; j < this.clips.length; j++) {
                messages = messages.concat(this.get_messages_render_notes(j))
            }
            return messages;
        };

        get_messages_render_notes(index_clip: number) {
            var clip = this.clips[index_clip];
            var i, notes, quadruplets;
            quadruplets = [];
            notes = clip.get_notes();
            for (i = 0; i < notes.length; i++) {
                quadruplets.push(this.get_position_quadruplet(notes[i], index_clip));
            }
            return quadruplets.map(function (tuplet) {
                return ["paintrect"].concat(tuplet)
            })
        };

        get_position_quadruplet(note: n.Note, index_clip: number) {
            var dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom;

            dist_from_left_beat_start = this.get_dist_from_left(note.data.beat_start);
            dist_from_left_beat_end = this.get_dist_from_left(note.data.beat_start + note.data.beats_duration);
            dist_from_top_note_top = this.get_dist_from_top(note.data.pitch, index_clip);
            dist_from_top_note_bottom = this.get_dist_from_top(note.data.pitch - 1, index_clip);

            return [dist_from_left_beat_start, dist_from_top_note_top, dist_from_left_beat_end, dist_from_top_note_bottom]
        };

        get_dist_from_top(pitch: number, index_clip: number): number {
            var clip = this.clips[index_clip];
            var dist = (clip.get_pitch_max() - pitch) * this.get_height_note(index_clip);
            return dist + (this.get_height_clip() * index_clip);

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

function test() {

    function assert(statement) {
        if (!eval(statement)) {
            throw statement
        }
    }

    // NB: assume latter is desired value
    function assert_equals(outcome, expectation) {
        var statement = 'JSON.stringify(' + outcome + ') === JSON.stringify(' + expectation + ')';
        if (!eval(statement)) {
            // throw statement
            l.log('FAILED: ' + outcome + ' === ' + expectation);
            l.log('expected ' + expectation + ' got ' + eval(outcome));
        } else {
            l.log('PASSED: '  + outcome + ' === ' + expectation)
        }
    }

    // TODO: stub the quarter note ascending major scale line
    // TODO: figure out how to run entire test suite automatically

    var index_track_test = 12;
    var index_clip_slot_test = 0;
    var deferlow = false;

    var clip = new c.Clip(index_track_test, index_clip_slot_test, 0, deferlow);

    clip.load_notes();

    var test = 16 * 6 * 4;
    var pwindow = new Pwindow(test, test);

    pwindow.add_clip(clip);

    pwindow.render_clips();

    var notes = clip.get_notes();

    assert_equals(
        'pwindow.get_height_note(0)',
        '64'
    );

    assert_equals(
        'pwindow.get_position_quadruplet(notes[0], 0)', '[0, 320, 96, 384]'
    );

    assert_equals(
        'pwindow.get_position_quadruplet(notes[1], 0)', '[96, 192, 192, 256]'
    );

    assert_equals(
        'pwindow.get_position_quadruplet(notes[2], 0)', '[192, 64, 288, 128]'
    );

    assert_equals(
        'pwindow.get_position_quadruplet(notes[3], 0)', '[288, 0, 384, 64]'
    );
}

var index_track_1 = 12; // bottom
var index_track_2 = 13;
var index_track_3 = 14;
var index_track_4 = 15; // top

var index_clip_slot_universal = 0;

function test_2() {

    function assert(statement) {
        if (!eval(statement)) {
            throw statement
        }
    }

    // NB: assume latter is desired value
    function assert_equals(outcome, expectation) {
        var statement = 'JSON.stringify(' + outcome + ') === JSON.stringify(' + expectation + ')';
        if (!eval(statement)) {
            // throw statement
            l.log('FAILED: ' + outcome + ' === ' + expectation);
            l.log('expected ' + expectation + ' got ' + eval(outcome));
        } else {
            l.log('PASSED: '  + outcome + ' === ' + expectation)
        }
    }

    // var path_clip_1 = "live_set tracks " + index_track_1 + " clip_slots 0 clip";
    // var path_clip_2 = "live_set tracks " + index_track_2 + " clip_slots 0 clip";
    // var path_clip_3 = "live_set tracks " + index_track_3 + " clip_slots 0 clip";
    // var path_clip_4 = "live_set tracks " + index_track_4 + " clip_slots 0 clip";

    var deferlow = false;

    var int_outlet = 0;

    var messenger = m.Messenger('max', int_outlet);

    var clip_1 = new c.Clip(cd.ClipDao(index_track_1, index_clip_slot_universal, messenger, deferlow));
    var clip_2 = new c.Clip(cd.ClipDao(index_track_2, index_clip_slot_universal, messenger, deferlow));
    var clip_3 = new c.Clip(cd.ClipDao(index_track_3, index_clip_slot_universal, messenger, deferlow));
    var clip_4 = new c.Clip(cd.ClipDao(index_track_4, index_clip_slot_universal, messenger, deferlow));

    clip_1.load_notes();
    clip_2.load_notes();
    clip_3.load_notes();
    clip_4.load_notes();

    // 16 beats
    // 24 grans
    // 6 grans per beat
    var test = 16 * 6 * 4;
    var pwindow = new Pwindow(test, test);

    pwindow.add_clip(clip_1);
    pwindow.add_clip(clip_2);
    pwindow.add_clip(clip_3);
    pwindow.add_clip(clip_4);

    pwindow.render_clips();
    pwindow.render_tree();
}