import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {harmony} from "../music/harmony";
import {modes_texture} from "../constants/constants";
import {user_input} from "../control/user_input";
import {history} from "../history/history";

export namespace algorithm {
    import UserInputHandler = user_input.UserInputHandler;
    export let DETECT = 'detect';
    export let PREDICT = 'predict';
    export let PARSE = 'parse';
    export let DERIVE = 'derive';
    export let FREESTYLE = 'freestyle';
    import Harmony = harmony.Harmony;
    import POLYPHONY = modes_texture.POLYPHONY;
    import MONOPHONY = modes_texture.MONOPHONY;
    import TypeSequenceTarget = history.TypeSequenceTarget;
    import TypeTarget = history.TypeTarget;

    export interface Temporal {
        determine_region_present
    }

    export interface Targetable {
        determine_targets
    }

    export interface Algorithm {
        get_name(): string
        get_depth(): number
        b_targeted(): boolean
    }

    abstract class Targeted {
        user_input_handler: UserInputHandler;

        constructor(user_input_handler) {
            this.user_input_handler = user_input_handler;
        }

        public b_targeted(): boolean {
            return true;
        }
    }

    abstract class Parsed {
        user_input_handler: UserInputHandler;

        constructor(user_input_handler) {
            this.user_input_handler = user_input_handler;
        }

        public b_targeted(): boolean {
            return false;
        }
    }

    export class Detect extends Targeted implements Algorithm, Temporal, Targetable {

        constructor(user_input_handler) {
            super(user_input_handler);
        }

        public get_depth(): number {
            return 1
        }

        public get_name(): string {
            return DETECT
        }

        determine_targets(notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget {
            let targets;

            switch(this.user_input_handler.mode_texture) {
                // case POLYPHONY: {
                //     let chords_grouped: TypeTarget[] = Harmony.group(
                //         notes_segment_next
                //     );
                //
                //     let chords_monophonified: TypeTarget[] = [];
                //
                //     for (let chord of chords_grouped) {
                //         let notes_monophonified: TypeTarget = Harmony.monophonify(
                //             chord
                //         );
                //
                //         chords_monophonified.push(notes_monophonified)
                //     }
                //
                //     targets = chords_monophonified;
                //
                //     break;
                // }
                case MONOPHONY: {
                    let notes_grouped_trivial = [];

                    for (let note of notes_segment_next) {
                        notes_grouped_trivial.push([note])
                    }

                    targets = notes_grouped_trivial;

                    break;
                }
                default: {
                    throw ['texture mode', this.user_input_handler.mode_texture, 'not supported'].join(' ')
                }
            }
            return targets;
        }

        public determine_region_present(notes_target_next): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[0].model.note.get_beat_end()
            ]
        }

        pre_advance(clip_user_input) {

        }

        post_init(song, clip_user_input) {
            clip_user_input.fire();
        }

        pre_terminate(song, clip_user_input) {
            song.stop();
            clip_user_input.stop();
        }
    }

    export class Predict extends Targeted implements Algorithm, Temporal, Targetable {

        public get_name(): string {
            return PREDICT
        }

        public get_depth(): number {
            return 1
        }

        determine_targets(notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget {
            if (this.user_input_handler.mode_texture === POLYPHONY) {

                let chords_grouped: TreeModel.Node<n.Note>[][] = Harmony.group(
                    notes_segment_next
                );

                let chords_monophonified: TreeModel.Node<n.Note>[][] = [];

                for (let note_group of chords_grouped) {
                    chords_monophonified.push(
                        Harmony.monophonify(
                            note_group
                        )
                    );
                }

                return chords_monophonified

            } else if (this.user_input_handler.mode_texture === MONOPHONY) {

                let notes_grouped_trivial = [];

                for (let note of notes_segment_next) {
                    notes_grouped_trivial.push([note])
                }

                return notes_grouped_trivial

            } else {
                throw ['texture mode', this.user_input_handler.mode_texture, 'not supported'].join(' ')
            }
        }


        determine_region_present(notes_target_next): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ]
        }

        pre_advance(clip_user_input) {

        }

        post_init(song, clip_user_input) {
            clip_user_input.fire();
        }

        pre_terminate(song, clip_user_input) {
            song.stop();
            clip_user_input.stop();
        }
    }

    export class Parse extends Parsed implements Algorithm, Temporal {

        depth: number;

        constructor(user_input_handler) {
            super(user_input_handler);
        }

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

        determine_region_present(notes_target_next): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ]
        }
    }

    export class Derive extends Parsed implements Temporal {

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

        determine_region_present(notes_target_next): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ]
        }
    }
}