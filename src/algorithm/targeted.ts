import {note as n, note} from "../note/note";
import {history} from "../history/history";
import {iterate} from "../train/iterate";
import {segment} from "../segment/segment";
import {track} from "../track/track";
import {target} from "../target/target";
import {utils} from "../utils/utils";
import {message} from "../message/messenger";
import {window} from "../render/window";
import {user_input} from "../control/user_input";
import {trainer} from "../train/trainer";
import {scene} from "../scene/scene";
import {song} from "../song/song";
import {trainable} from "./trainable";
import TreeModel = require("tree-model");
import {live} from "../live/live";
const _ = require('underscore');

export namespace targeted {

    // logic common to detect and predict
    import Targetable = trainable.Targetable;
    import Trainable = trainable.Trainable;
    import UserInputHandler = user_input.UserInputHandler;
    import StructTrain = trainer.StructTrain;
    import Song = song.Song;
    import TargetIterator = target.TargetIterator;
    import FactoryMatrixObjectives = iterate.FactoryMatrixObjectives;
    import StructTargets = trainer.StructTargets;
    import Note = note.Note;
    import Subtarget = target.Subtarget;
    import HistoryUserInput = history.HistoryUserInput;
    import Scene = scene.Scene;
    import TypeSequenceTarget = history.TypeSequenceTarget;
    import Segment = segment.Segment;
    import MatrixWindow = window.MatrixWindow;
    import Trainer = trainer.Trainer;
    import Track = track.Track;
    import Env = live.Env;

    export abstract class Targeted implements Targetable {

        env: Env;

        constructor(env: Env) {
            this.env = env;
        }

        update_history_user_input(
            input_postprocessed: TreeModel.Node<note.Note>[],
            history_user_input: history.HistoryUserInput,
            iterator_matrix_train: iterate.MatrixIterator,
            trainable: Trainable
        ): history.HistoryUserInput {
            history_user_input.concat(
                input_postprocessed,
                trainable.coord_to_index_history_user_input(
                    iterator_matrix_train.get_coord_current()
                )
            );
            return history_user_input
        }

        public b_parsed: boolean = false;
        public b_targeted: boolean = true;
        public depth: number;
        direction: string;

        public abstract get_name()

        public abstract get_view(): string

        public initialize_set(song: song.Song): void {

        }

        public abstract initialize_tracks(
            segments: segment.Segment[],
            track_target: track.Track,
            track_user_input: track.Track,
            struct_train: StructTrain
        )

        public abstract determine_targets(user_input_handler: UserInputHandler, notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget

        public get_num_layers_input(): number {
            return 1
        }

        public determine_region_focus(
            segment_current: Segment,
            struct_train: StructTrain,
            coord_train_current: number[]
        ): number[] {

            let struct_targets = struct_train as StructTargets;

            let notes_target_next = struct_targets[coord_train_current[0]][coord_train_current[1]].current().iterator_subtarget.current().note;

            return [
                notes_target_next.model.note.beat_start,
                notes_target_next.model.note.get_beat_end()
            ]
        }

        public abstract initialize_render(
            window: MatrixWindow,
            segments: Segment[],
            notes_target_track: TreeModel.Node<Note>[],
            struct_train: StructTrain
        ): MatrixWindow

        unpause(song: Song, scene_current: Scene) {
            scene_current.fire(false);
            song.set_session_record(1);
            song.set_overdub(1);
        }

        postprocess_user_input(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): TreeModel.Node<note.Note>[] {
            return [subtarget_current.note];
        }

        // TODO: verify that we don't need to do anything
        terminate(struct_train: StructTrain, segments: Segment[]) {
            return
        }

        pause(song: Song, scene_current: Scene) {
            song.stop()
        }

        warrants_advance(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current): boolean {
            return utils.remainder(notes_user_input[0].model.note.pitch, 12) === utils.remainder(subtarget_current.note.model.note.pitch, 12)
        }

        preprocess_struct_train(struct_train: StructTrain, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): StructTrain {
            return this.preprocess_struct_targets(struct_train as StructTargets, segments, notes_target_track) as StructTrain
        }

        preprocess_struct_targets(struct_targets: StructTargets, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): StructTargets {
            return struct_targets
        }

        public create_matrix_targets(user_input_handler: UserInputHandler, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): TargetIterator[][] {

            let matrix_targets = FactoryMatrixObjectives.create_matrix_targets(
                this,
                segments
            );

            for (let i_segment in segments) {
                let segment = segments[Number(i_segment)];

                let notes_in_segment = notes_target_track.filter(
                    node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                );

                let sequence_targets = this.determine_targets(
                    user_input_handler,
                    notes_in_segment
                );

                matrix_targets[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            }

            return matrix_targets
        }

        private static stream_subtarget_bounds(messenger: message.Messenger, subtarget_current: Subtarget, segment_current: Segment, segments: Segment[]) {
            let duration_training_data = segments[segments.length - 1].beat_end;
            messenger.message(['duration_training_data', duration_training_data], true);

            messenger.message(
                [
                    'bounds',
                    subtarget_current.note.model.note.beat_start / duration_training_data,
                    subtarget_current.note.model.note.get_beat_end() / duration_training_data
                ],
                true
            )
        }

        stream_bounds(
            messenger: message.Messenger,
            subtarget_current: Subtarget,
            segment_current: Segment,
            segments: Segment[]
        ): void {
            Targeted.stream_subtarget_bounds(messenger, subtarget_current, segment_current, segments)
        }

        update_struct(notes_input_user: TreeModel.Node<note.Note>[], struct_train: StructTrain, trainable: Trainable, iterator_matrix_train: iterate.MatrixIterator): StructTrain {
            return struct_train;
        }

        create_struct_train(window: window.MatrixWindow, segments: segment.Segment[], track_target: track.Track, user_input_handler: user_input.UserInputHandler, struct_train: trainer.StructTrain): trainer.StructTrain {
            let notes_target_track = track_target.get_notes();
            return this.create_matrix_targets(user_input_handler, segments, notes_target_track);
        }

        set_depth(): void {

        }

        advance_scene(scene_current: scene.Scene, song: song.Song) {
            scene_current.fire(false);
        }

        preprocess_history_user_input(history_user_input: history.HistoryUserInput, segments: segment.Segment[]): HistoryUserInput {
            return history_user_input
        }

        get_num_layers_clips_to_render(): number {
            return 1;
        }

        coord_to_index_clip_render(coord: number[]): number {
            return 0;
        }

        coord_to_index_history_user_input(coord: number[]): number[] {
            return coord;
        }

        coord_to_index_struct_train(coord: number[]): number[] {
            return coord;
        }

        public abstract handle_command(command: string, trainer: trainer.Trainer): void

        public abstract handle_midi(pitch: number, velocity: number, trainer: trainer.Trainer): void

        public get_notes_focus(track_target: Track): TreeModel.Node<note.Note>[] {
            return track_target.get_notes();
        }

        restore(trainer: Trainer, history_user_input_recovered: HistoryUserInput): void {

            trainer.commence();

            let input_left = true;

            let coord_current: number[];

            while (input_left) {
                coord_current = trainer.iterator_matrix_train.get_coord_current();

                let coord_user_input_history = this.coord_to_index_history_user_input(
                    trainer.iterator_matrix_train.get_coord_current()
                );

                if (trainer.iterator_matrix_train.done || history_user_input_recovered.matrix_data[coord_user_input_history[0]][coord_user_input_history[1]].length === 0) {

                    input_left = false;

                    continue;
                }

                let notes_segment = history_user_input_recovered.matrix_data[coord_user_input_history[0]][coord_user_input_history[1]];

                for (let note of notes_segment) {
                    trainer.accept_input(
                        [note]
                    );
                }

                if (_.isEqual(trainer.iterator_matrix_train.get_coord_current(), coord_current)) {
                    input_left = false;
                }
            }
        }

        get_direction(): string {
            return this.direction;
        }

        set_direction(direction: string): void {
            this.direction = direction
        }

        public abstract get_iterator_train(segments: segment.Segment[]): iterate.MatrixIterator
    }
}