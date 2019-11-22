import {note as n} from "../music/note";
import {window} from "../render/window";
import {segment} from "../segment/segment";
import {track} from "../track/track";
import {user_input} from "../control/user_input";
import {targeted} from "./targeted";
import {trainer} from "../train/trainer";
import {modes_texture} from "../constants/constants";
import {history} from "../history/history";
import TreeModel = require("tree-model");
import {trainable} from "./trainable";
import {iterate} from "../train/iterate";
import {live} from "../live/live";
import {message} from "../message/messenger";
const _ = require('underscore');

export namespace predict {
    import UserInputHandler = user_input.UserInputHandler;
    import Targeted = targeted.Targeted;
    import StructTrain = trainer.StructTrain;
    import POLYPHONY = modes_texture.POLYPHONY;
    import Note = n.Note;
    import TypeSequenceTarget = history.TypeSequenceTarget;
    import MONOPHONY = modes_texture.MONOPHONY;
    import PREDICT = trainable.PREDICT;
    import Track = track.Track;
    import Trainer = trainer.Trainer;
    import SESSION = trainer.SESSION;
    import MatrixIterator = iterate.MatrixIterator;
    import FORWARDS = iterate.FORWARDS;
    import Env = live.Env;
    import Messenger = message.Messenger;

    export class Predict extends Targeted {

        constructor(env: Env) {
            super(env);
        }

        public get_name(): string {
            return PREDICT
        }

        public get_view(): string {
            return SESSION
        }

        determine_targets(user_input_handler: UserInputHandler, notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget {

            if (user_input_handler.mode_texture === POLYPHONY) {

                throw 'polyphonic targets for prediction not yet implemented'

            } else if (user_input_handler.mode_texture === MONOPHONY) {

                let notes_grouped: TypeSequenceTarget = [];

                // partition segment into measures

                let position_bimeasure = (node) => {
                    return Math.floor(node.model.note.beat_start/8)
                };

                let note_partitions: TreeModel.Node<Note>[][] = _.groupBy(notes_segment_next, position_bimeasure);

                for (let key_partition of Object.keys(note_partitions)) {
                    let partition = note_partitions[key_partition];
                    notes_grouped.push([partition[Math.round(partition.length/2)]])
                }

                return notes_grouped

            } else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ')
            }
        }

        // TODO: verify that we don't have to do anything here
        initialize_render(
            window: window.MatrixWindow,
            segments: segment.Segment[],
            notes_target_track: TreeModel.Node<n.Note>[],
            struct_train: StructTrain,
            messengerRender: Messenger
        ) {
            messengerRender.message(['pensize', 3, 3]);

            return window
        }

        // NB: we only have to initialize clips in the target track
        initialize_tracks(
            segments: segment.Segment[],
            track_target: track.Track,
            track_user_input: track.Track,
            struct_train: StructTrain
        ) {

            let matrix_targets = struct_train;

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let clip_target = Track.get_clip_at_index(
                    track_target.get_index(),
                    Number(i_segment),
                    this.env
                );

                let clip_user_input = Track.get_clip_at_index(
                    track_user_input.get_index(),
                    Number(i_segment),
                    this.env
                );

                let note_segment = segment.get_note();

                clip_user_input.remove_notes(
                    note_segment.model.note.beat_start,
                    0,
                    note_segment.model.note.get_beat_end(),
                    128
                );

                let note_segment_muted = note_segment;

                note_segment_muted.model.note.muted = 1;

                clip_user_input.setMode(true, false);

                clip_user_input.set_notes(
                    [note_segment_muted]
                );

                clip_user_input.setMode(false, true);

                let targeted_notes_in_segment = matrix_targets[0][Number(i_segment)].get_notes();

                // TODO: this won't work for polyphony
                for (let note of targeted_notes_in_segment) {

                    clip_target.remove_notes(
                        note.model.note.beat_start,
                        0,
                        note.model.note.beats_duration,
                        128
                    );

                    let note_muted = note;

                    note_muted.model.note.muted = 1;

                    clip_target.setMode(true, false);

                    clip_target.set_notes(
                        [note_muted]
                    );

                    clip_target.setMode(false, true);
                }
            }
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
            switch(command) {
                case 'advance_target': {

                    trainer.accept_input([trainer.subtarget_current.note]);

                    break;
                }
                default: {
                    throw ['command', command, 'not recognized'].join(' ')
                }
            }
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

        suppress(messenger: Messenger): void {
            // TODO: put in 'initialize_render', make configurable
            messenger.message(['switch_suppress', 0], true);
        }
    }
}