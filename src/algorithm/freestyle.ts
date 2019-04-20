import {trainable} from "./trainable";
import {song} from "../song/song";
import {note} from "../note/note";
import {history} from "../history/history";
import {message} from "../message/messenger";
import {scene} from "../scene/scene";
import {target} from "../target/target";
import {user_input} from "../control/user_input";
import {trainer} from "../train/trainer";
import {segment} from "../segment/segment";
import {window} from "../render/window";
import {track} from "../track/track";
import {iterate} from "../train/iterate";
import TreeModel = require("tree-model");
const _ = require('underscore');

export namespace freestyle {
    import Trainable = trainable.Trainable;
    import ARRANGEMENT = trainer.ARRANGEMENT;
    import Track = track.Track;
    import MatrixIterator = iterate.MatrixIterator;
    import FORWARDS = iterate.FORWARDS;

    export class Freestyle implements Trainable {
        b_parsed: boolean;
        b_targeted: boolean;
        depth: number;
        direction: string;

        public get_view(): string {
            return ARRANGEMENT
        }

        advance_scene(scene_current: scene.Scene, song: song.Song) {
            return
        }

        coord_to_index_clip_render(coord: number[]): number {
            return 0;
        }

        // TODO: this seems important...
        coord_to_index_history_user_input(coord: number[]): number[] {
            return coord;
        }

        // TODO: this seems important...
        coord_to_index_struct_train(coord: number[]): number[] {
            return coord;
        }

        // TODO: this seems important...
        create_struct_train(window: window.MatrixWindow, segments: segment.Segment[], track_target: track.Track, user_input_handler: user_input.UserInputHandler, struct_train: trainer.StructTrain): trainer.StructTrain {
            return null;
        }

        determine_region_present(notes_next: TreeModel.Node<note.Note>[], segment_current: segment.Segment) {

        }

        get_name(): string {
            return "freestyle";
        }

        get_num_layers_clips_to_render(): number {
            return 0;
        }

        get_num_layers_input(): number {
            return 0;
        }

        // TODO: look how others handle this - should we advance song's loop here?
        handle_command(command: string, trainer: trainer.Trainer): void {
            switch(command) {
                case 'advance': {

                    trainer.advance_loop_song();

                    break;
                }
                default: {
                    throw ['command', command, 'not recognized'].join(' ')
                }
            }
        }

        handle_midi(pitch: number, velocity: number, trainer: trainer.Trainer): void {

        }

        initialize_render(window: window.MatrixWindow, segments: segment.Segment[], notes_track_target: TreeModel.Node<note.Note>[], struct_train: trainer.StructTrain): window.MatrixWindow {
            return null;
        }

        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, struct_train: trainer.StructTrain) {

        }

        initialize_set(song: song.Song, segments: segment.Segment[]) {

            song.loop(true);

            // TODO: can we please not use effective setTimeouts here?

            // create cue points based on segments

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let task_set_current_song_time = new Task(
                    () => {
                        song.set_current_song_time(segment.beat_start);
                    }
                );

                let task_create_cue = new Task(
                    () => {
                        song.set_or_delete_cue()
                    }
                );

                task_set_current_song_time.schedule(Number(i_segment)*500);

                task_create_cue.schedule(Number(i_segment)*500 + 250);

                if (Number(i_segment) === segments.length - 1) {
                    let task_jump_to_first = new Task(
                        () => {
                            let cue_points = song.get_cue_points();

                            cue_points = _.sortBy(
                                cue_points,
                                (cue_point) => {return cue_point.get_time()}
                            );

                            for (let i_segment in segments) {
                                let segment = segments[Number(i_segment)];
                                segment.set_cue_point(cue_points[Number(i_segment)]);
                            }

                            cue_points[0].jump()
                        }
                    );

                    task_jump_to_first.schedule(Number(i_segment)*500 + 500);
                }
            }
        }

        // TODO: see how other's implement
        pause(song: song.Song, scene_current: scene.Scene) {
            song.stop()
        }

        postprocess_user_input(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): TreeModel.Node<note.Note>[] {
            return [];
        }

        preprocess_history_user_input(history_user_input: history.HistoryUserInput, segments: segment.Segment[]): history.HistoryUserInput {
            return undefined;
        }

        preprocess_struct_train(struct_train: trainer.StructTrain, segments: segment.Segment[], notes_target_track: TreeModel.Node<note.Note>[]): trainer.StructTrain {
            return null;
        }

        set_depth(depth: number): void {

        }

        stream_bounds(messenger: message.Messenger, subtarget_current: target.Subtarget, segment_current: segment.Segment, segments: segment.Segment[]): void {

        }

        // TODO: see how others implement
        terminate(struct_train: trainer.StructTrain, segments: segment.Segment[]) {
            return
        }

        // TODO: see how others implement
        unpause(song: song.Song, scene_current: scene.Scene) {
            song.start()
        }

        update_history_user_input(input_postprocessed: TreeModel.Node<note.Note>[], history_user_input: history.HistoryUserInput, iterator_matrix_train: iterate.MatrixIterator, trainable: trainable.Trainable): history.HistoryUserInput {
            return null;
        }

        update_struct(notes_input_user: TreeModel.Node<note.Note>[], struct_train: trainer.StructTrain, trainable: trainable.Trainable, iterator_matrix_train: iterate.MatrixIterator): trainer.StructTrain {
            return null;
        }

        // although we should never be giving MIDI input here...
        warrants_advance(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): boolean {
            return true;
        }

        public get_notes_focus(track_target: Track): TreeModel.Node<note.Note>[] {
            return null;
        }

        get_direction(): string {
            return this.direction;
        }

        set_direction(direction: string): void {
            this.direction = direction
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

        determine_region_focus(segment_current: segment.Segment, struct_train: trainer.StructTrain, coord_train_current: number[]) {
            return [0, 0]
        }
    }
}