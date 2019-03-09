import {note, note as n} from "../note/note";
import {clip as c} from "../clip/clip";
import {live} from "../live/live";
import TreeModel = require("tree-model");
import {target} from "../target/target";
import {harmony} from "../music/harmony";
import {modes_texture} from "../constants/constants";

export namespace algorithm {
    export let DETECT = 'detect';
    export let PREDICT = 'predict';
    export let PARSE = 'parse';
    export let DERIVE = 'derive';

    import LiveClipVirtual = live.LiveClipVirtual;
    import Target = target.Target;
    // import TargetType = target.TargetType;
    import Harmony = harmony.Harmony;
    import TargetIterator = target.TargetIterator;

    export interface Temporal {
        determine_region_current

        determine_region_past

        determine_region_upcoming
    }

    export interface Targetable {
        determine_targets
    }

    export interface Algorithm {
        get_name(): string
        get_depth(): number
    }

    abstract class Targeted {
        public b_targeted(): boolean {
            return true;
        }
    }

    export class Detect extends Targeted implements Algorithm, Temporal, Targetable {
        user_input_handler;

        constructor(user_input_handler) {
            this.user_input_handler = user_input_handler
        }

        public get_depth(): number {
            return 1
        }

        public get_name(): string {
            return DETECT
        }

        determine_targets(notes_segment_next: TreeModel.Node<n.Note>[]): TargetIterator {
            if (this.user_input_handler.mode_texture === modes_texture.POLYPHONY) {

                let chords_grouped: TreeModel.Node<n.Note>[][] = Harmony.group(
                    notes_segment_next
                );

                let chords_monophonified: TreeModel.Node<n.Note>[][] = Harmony.monophonify(
                    notes_segment_next
                );

                // Subtarget -> Subtarget Iterator -> Target -> Target Iterator

                return chords_monophonified

            } else if (this.user_input_handler.mode_texture === modes_texture.MONOPONY) {

                let notes_grouped_trivial = [];

                for (let note of notes_segment_next) {
                    notes_grouped_trivial.push(note)
                }

                // Subtarget -> Subtarget Iterator -> Target -> Target Iterator

                return notes_grouped_trivial

            } else {
                throw ['mode', this.mode, 'not supported'].join(' ')
            }
        }

        pre_advance(clip_user_input) {

        }
    }

    export class Predict extends Targeted implements Algorithm, Temporal, Targetable {

        public get_name(): string {
            return PREDICT
        }

        public get_depth(): number {
            return 1
        }

        // TODO: put all calls to Clip in whatever class is a client to algorithms
        // NB: there can be multiple targets per segment
        // TODO: replace the notes in clip_target with these
        determine_targets(notes_segment_next: TreeModel.Node<n.Note>[]): TargetType {
            if (this.mode === HARMONY) {

                let chords_grouped: TreeModel.Node<n.Note>[][] = harmony.group(
                    notes_segment_next
                );

                let chords_monophonified: TreeModel.Node<n.Note>[][] = harmony.monophonify(
                    notes_segment_next
                );

                return chords_monophonified

            } else if (this.mode === mode.MELODY) {

                let notes_grouped_trivial = [];

                for (let note of notes_segment_next) {
                    notes_grouped_trivial.push(note)
                }

                return notes_grouped_trivial

            } else {
                throw ['mode', this.mode, 'not supported'].join(' ')
            }
        }


        determine_region_current(notes_target_next): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ]
        }

        // set right interval
        determine_region_past(notes_target_next): number {
            return notes_target_next[0].model.note.beat_start
        }

        // set left interval
        determine_region_upcoming(notes_target_next): number {
            return notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
        }

        pre_advance() {
            //
        }
    }

    export class Parse implements Algorithm, Temporal {

        depth: number;

        public get_name(): string {
            return PARSE
        }

        public get_depth(): number {
            return this.depth
        }

        set_depth(depth: number) {
            this.depth = depth;
        }

        // happens after loop of first target is set
        post_init(song, clip_user_input) {
            song.set_overdub(1);

            song.set_session_record(1);

            clip_user_input.fire();
        }

        // happens after last target is guessed
        pre_terminate(song, clip_user_input) {
            song.set_overdub(0);

            song.set_session_record(0);

            clip_user_input.stop();
        }

    }

    export class Derive implements Temporal {

        depth: number;

        public get_name(): string {
            return DERIVE
        }

        public get_depth(): number {
            return this.depth
        }

        set_depth(depth: number) {
            this.depth = depth;
        }

        // happens after loop of first target is set
        post_init(song, clip_user_input) {
            song.set_overdub(1);

            song.set_session_record(1);

            clip_user_input.fire();
        }

        // happens after last target is guessed
        pre_terminate(song, clip_user_input) {
            song.set_overdub(0);

            song.set_session_record(0);

            clip_user_input.stop();
        }

        determine_region_current(notes_target_next): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ]
        }

        // set right interval
        determine_region_past(notes_target_next): number {
            return notes_target_next[0].model.note.beat_start
        }

        // set left interval
        determine_region_upcoming(notes_target_next): number {
            return notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
        }

        accept(elaboration: TreeModel.Node<n.Note>[], i_depth: number, i_breadth: number): void {

            this.struct_train.append(elaboration);

            nextthis.iterator_train.next()

            // if (index_layer + 1 > this.clips.length) {
            //     let clip_dao_virtual = new LiveClipVirtual(elaboration);
            //
            //     clip_dao_virtual.beat_start = elaboration[0].model.note.beat_start;
            //     clip_dao_virtual.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
            //
            //     let clip_virtual = new c.Clip(clip_dao_virtual);
            //     this.add_clsip(clip_virtual);
            // } else {
            //     let clip_last = this.clips[this.clips.length - 1];
            //     clip_last.clip_dao.beat_end = elaboration[elaboration.length - 1].model.note.get_beat_end();
            //     clip_last.set_notes(elaboration);
            // }
            //
            // let leaves_within_interval = this.get_leaves_within_interval(beat_start, beat_end);
            //
            // if (index_layer == 1) {
            //     this.add_first_layer(elaboration, this.clips.length - 1)
            // } else {
            //     this.add_layer(leaves_within_interval, elaboration, this.clips.length - 1);
            // }
            //
            // this.update_leaves(leaves_within_interval);
        }

    }
}