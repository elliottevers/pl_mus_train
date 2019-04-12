import {note, note as n} from "../note/note";
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
import {log} from "../log/logger";
import {message} from "../message/messenger";
const _ = require('underscore');

export namespace predict {
    import UserInputHandler = user_input.UserInputHandler;
    import Targeted = targeted.Targeted;
    import StructTrain = trainer.StructTrain;
    import POLYPHONY = modes_texture.POLYPHONY;
    import Note = note.Note;
    import TypeSequenceTarget = history.TypeSequenceTarget;
    import MONOPHONY = modes_texture.MONOPHONY;
    import PREDICT = trainable.PREDICT;
    import Logger = log.Logger;
    import Track = track.Track;
    import Messenger = message.Messenger;

    export class Predict extends Targeted {

        public get_name(): string {
            return PREDICT
        }

        determine_targets(user_input_handler: UserInputHandler, notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget {

            if (user_input_handler.mode_texture === POLYPHONY) {

                // let chords_grouped: TreeModel.Node<n.Note>[][] = Harmony.group(
                //     notes_segment_next
                // );
                //
                // let chords_monophonified: TypeSequenceTarget = [];
                //
                // for (let note_group of chords_grouped) {
                //     chords_monophonified.push(
                //         Harmony.monophonify(
                //             note_group
                //         )
                //     );
                // }

                throw 'polyphonic targets for prediction not yet implemented'

            } else if (user_input_handler.mode_texture === MONOPHONY) {

                let notes_grouped: TypeSequenceTarget = [];

                // partition segment into measures

                let position_measure = (node) => {
                    return Math.floor(node.model.note.beat_start/4)
                };

                let note_partitions: TreeModel.Node<Note>[][] = _.groupBy(notes_segment_next, position_measure);

                // for (let partition of note_partitions) {
                //     // get the middle note of the measure
                //     notes_grouped.push([partition[partition.length/2]])
                // }

                for (let key_partition of Object.keys(note_partitions)) {
                    let partition = note_partitions[key_partition];
                    notes_grouped.push([partition[partition.length/2]])
                }

                return notes_grouped

            } else {
                throw ['texture mode', user_input_handler.mode_texture, 'not supported'].join(' ')
            }
        }

        postprocess_subtarget(note_subtarget) {
            note_subtarget.model.note.muted = 1;
            return note_subtarget;
        }

        // TODO: verify that we don't have to do anythiing here
        initialize_render(
            window: window.MatrixWindow,
            segments: segment.Segment[],
            notes_target_track: TreeModel.Node<note.Note>[],
            struct_train: StructTrain
        ) {
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

            let logger = new Logger('max');

            for (let i_segment in segments) {

                // let segment = segments[Number(i_segment)];

                let clip = Track.get_clip_at_index(
                    track_target.get_index(),
                    Number(i_segment),
                    track_target.track_dao.messenger
                );

                let targeted_notes_in_segment = matrix_targets[0][Number(i_segment)].get_notes();

                // logger.log(JSON.stringify(targeted_notes_in_segment));

                // TODO: this won't work for polyphony
                for (let note of targeted_notes_in_segment) {

                    clip.set_path_deferlow('clip_target');

                    clip.remove_notes(
                        note.model.note.beat_start,
                        0,
                        note.model.note.get_beat_end(),
                        128
                    );

                    let note_muted = note;

                    note_muted.model.note.muted = 1;

                    clip.set_notes(
                        [note_muted]
                    )
                }
            }
        }
    }
}