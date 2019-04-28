import {note, note as n} from "../note/note";
import {window} from "../render/window";
import {segment} from "../segment/segment";
import {track} from "../track/track";
import {targeted} from "./targeted";
import {user_input} from "../control/user_input";
import {trainer} from "../train/trainer";
import {harmony} from "../music/harmony";
import {modes_texture} from "../constants/constants";
import {history} from "../history/history";
import TreeModel = require("tree-model");
import {trainable} from "./trainable";
import {iterate} from "../train/iterate";

export namespace detect {

    import Targeted = targeted.Targeted;
    import UserInputHandler = user_input.UserInputHandler;
    import StructTrain = trainer.StructTrain;
    import Harmony = harmony.Harmony;
    import POLYPHONY = modes_texture.POLYPHONY;
    import TypeSequenceTarget = history.TypeSequenceTarget;
    import MatrixWindow = window.MatrixWindow;
    import MONOPHONY = modes_texture.MONOPHONY;
    import DETECT = trainable.DETECT;
    import Note = note.Note;
    import Trainer = trainer.Trainer;
    import SESSION = trainer.SESSION;
    import MatrixIterator = iterate.MatrixIterator;
    import FORWARDS = iterate.FORWARDS;
    import Track = track.Track;

    export class Detect extends Targeted {

        constructor() {
            super();
        }

        determine_targets(user_input_handler: UserInputHandler, notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget {
            if (user_input_handler.mode_texture === POLYPHONY) {

                let chords_grouped: TreeModel.Node<n.Note>[][] = Harmony.group(
                    notes_segment_next
                );

                let chords_monophonified: TypeSequenceTarget = [];

                for (let note_group of chords_grouped) {
                    chords_monophonified.push(
                        Harmony.monophonify(
                            note_group
                        )
                    );
                }

                return chords_monophonified

            } else if (user_input_handler.mode_texture === MONOPHONY) {

                let notes_grouped_trivial: TypeSequenceTarget = [];

                for (let note of notes_segment_next) {
                    notes_grouped_trivial.push([note])
                }
                return notes_grouped_trivial

            } else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ')
            }
        }

        public get_name(): string {
            return DETECT
        }

        public get_view(): string {
            return SESSION
        }

        initialize_render(
            window: window.MatrixWindow,
            segments: segment.Segment[],
            notes_target_track: TreeModel.Node<note.Note>[],
            struct_train: StructTrain
        ): MatrixWindow {
            return window
        }

        initialize_tracks(
            segments: segment.Segment[],
            track_target: track.Track,
            track_user_input: track.Track,
            struct_train: StructTrain
        ) {

            for (let i_segment in segments) {
                let segment = segments[Number(i_segment)];

                let clip_user_input = Track.get_clip_at_index(
                    track_user_input.get_index(),
                    Number(i_segment),
                    track_user_input.track_dao.messenger
                );

                clip_user_input.set_path_deferlow('clip_user_input');

                let note_segment = segment.get_note();

                clip_user_input.remove_notes(
                    note_segment.model.note.beat_start,
                    0,
                    note_segment.model.note.get_beat_end(),
                    128
                );

                let note_segment_muted = note_segment;

                note_segment_muted.model.note.muted = 1;

                clip_user_input.set_notes(
                    [note_segment_muted]
                );
            }

            track_target.unmute()
        }

        handle_midi(pitch: number, velocity: number, trainer: Trainer): void {
            let tree: TreeModel = new TreeModel();
            let note = tree.parse(
                {
                    id: -1,
                    note: new Note(
                        pitch,
                        -Infinity,
                        Infinity,
                        velocity,
                        0
                    ),
                    children: [

                    ]
                }
            );
            trainer.accept_input(
                [note]
            );
        }

        handle_command(command: string, trainer: trainer.Trainer): void {
            throw ['algorithm of name', this.get_name(), 'does not support commands']
        }

        get_iterator_train(segments: segment.Segment[]): MatrixIterator {
            return new MatrixIterator(
                1,
                segments.length,
                true,
                this.get_direction() === FORWARDS,
                0,
                1
            );
        }
    }
}