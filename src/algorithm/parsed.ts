import {segment} from "../segment/segment";
import {track} from "../track/track";
import {parse} from "../parse/parse";
import {target} from "../target/target";
import {note} from "../music/note";
import {message} from "../message/messenger";
import {window} from "../render/window";
import {user_input} from "../control/user_input";
import {trainer} from "../train/trainer";
import {scene} from "../scene/scene";
import {song} from "../song/song";
import {history} from "../history/history";
import {trainable} from "./trainable";
import {iterate} from "../train/iterate";
import TreeModel = require("tree-model");
import {live} from "../live/live";

export namespace parsed {

    import Parsable = trainable.Parsable;
    import Scene = scene.Scene;
    import Segment = segment.Segment;
    import Song = song.Song;
    import StructTrain = trainer.StructTrain;
    import FactoryMatrixObjectives = iterate.FactoryMatrixObjectives;
    import MatrixIterator = iterate.MatrixIterator;
    import Note = note.Note;
    import HistoryUserInput = history.HistoryUserInput;
    import Trainable = trainable.Trainable;
    import MatrixParseForest = parse.MatrixParseForest;
    import MatrixWindow = window.MatrixWindow;
    import Trainer = trainer.Trainer;
    import Track = track.Track;
    import Env = live.Env;
    import Messenger = message.Messenger;

    export abstract class Parsed implements Parsable {

        env: Env;

        constructor(env: Env) {
            this.env = env;
        }

        public b_parsed: boolean = true;

        public b_targeted: boolean = false;

        public abstract get_name();

        public abstract get_view(): string

        depth: number;

        direction: string;

        update_struct(notes_input_user: TreeModel.Node<Note>[], struct_train: StructTrain, trainable: Trainable, iterator_matrix_train: MatrixIterator): StructTrain {

            let matrix_parse_forest = struct_train as MatrixParseForest;

            matrix_parse_forest.add(
                notes_input_user,
                trainable.coord_to_index_struct_train(
                    iterator_matrix_train.get_coord_current()
                ),
                trainable as Parsable
            );

            return matrix_parse_forest
        }

        public abstract initialize_render(
            window: MatrixWindow,
            segments: Segment[],
            notes_track_target: TreeModel.Node<Note>[],
            struct_train: StructTrain,
            messengerRender: Messenger
        ): MatrixWindow

        public abstract initialize_set(song: song.Song): void

        public abstract initialize_tracks(
            segments: segment.Segment[],
            track_target: track.Track,
            track_user_input: track.Track,
            struct_train: StructTrain
        )

        public update_history_user_input(
            input_postprocessed: TreeModel.Node<Note>[],
            history_user_input: HistoryUserInput,
            iterator_matrix_train: MatrixIterator,
            trainable: Trainable
        ): HistoryUserInput {

            history_user_input.concat(
                input_postprocessed,
                trainable.coord_to_index_history_user_input(
                    iterator_matrix_train.get_coord_current()
                )
            );

            return history_user_input
        }

        public abstract get_num_layers_input(): number

        set_depth(depth: number) {
            this.depth = depth;
        }

        coord_to_index_clip_render(coord: number[]): number {
            // TODO: get rid of -1
            if (coord[0] === -1) {
                return 0
            } else {
                return coord[0] + 1
            }
        }

        create_matrix_parse_forest(segments: Segment[]): MatrixParseForest {
            return new MatrixParseForest(
                FactoryMatrixObjectives.create_matrix_parse(
                    this,
                    segments
                )
            )
        }

        determine_region_focus(
            segment_current: Segment,
            struct_train: StructTrain,
            coord_train_current: number[]
        ): number[] {

            return [
                segment_current.beat_start,
                segment_current.beat_end
            ]
        }

        finish_parse(matrix_parse_forest: parse.MatrixParseForest, segments: segment.Segment[]): void {

        }

        public abstract get_coords_notes_to_grow(coords_note_input_current): number[][]

        public abstract grow_layer(notes_user_input_renderable, notes_to_grow)


        preprocess_struct_train(struct_train: StructTrain, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): StructTrain {
            return this.preprocess_matrix_parse_forest(struct_train as MatrixParseForest, segments, notes_target_track)
        }

        public abstract preprocess_matrix_parse_forest(matrix_parse_forest, segments, track_target)

        pause(song: Song, scene_current: Scene) {

            scene_current.setMode(true, false);
            song.setMode(true, false);

            song.set_overdub(0);
            song.set_session_record(0);
            song.stop();

            scene_current.setMode(false, true);
            song.setMode(false, true);
        }

        postprocess_user_input(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): TreeModel.Node<note.Note>[] {
            return notes_user_input;
        }

        stream_bounds(
            messenger: message.Messenger,
            subtarget_current: target.Subtarget,
            segment_current: segment.Segment,
            segments: Segment[]
        ): void {
            Parsed.stream_segment_bounds(messenger, subtarget_current, segment_current, segments)
        }

        private static stream_segment_bounds(
            messenger: message.Messenger,
            subtarget_current: target.Subtarget,
            segment_current: segment.Segment,
            segments: Segment[]
        ) {
            messenger.message(['duration_training_data', segments[segments.length - 1].beat_end], true);
            messenger.message(['bounds', 0, 1], true)
        }

        terminate(struct_train: StructTrain, segments: Segment[]) {
            this.finish_parse(struct_train as MatrixParseForest, segments)
        }

        unpause(song: Song, scene_current: Scene) {
            scene_current.setMode(true, false);
            song.setMode(true, false);

            scene_current.fire(false);
            song.set_overdub(1);
            song.set_session_record(1);

            scene_current.setMode(false, true);
            song.setMode(false, true);
        }

        public abstract update_roots(coords_roots_previous: number[][], coords_notes_to_grow: number[][], coord_notes_current: number[])

        warrants_advance(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): boolean {
            return true;
        }

        create_struct_train(window: window.MatrixWindow, segments: segment.Segment[], track_target: track.Track, user_input_handler: user_input.UserInputHandler): trainer.StructTrain {
            return this.create_matrix_parse_forest(segments);
        }

        advance_scene(scene_current: scene.Scene, song: song.Song) {
            scene_current.setMode(true, false);
            song.setMode(true, false);

            scene_current.fire(false);

            song.set_overdub(1);

            song.set_session_record(1);

            scene_current.setMode(false, true);
            song.setMode(false, true);
        }

        preprocess_history_user_input(history_user_input: history.HistoryUserInput, segments: segment.Segment[]): HistoryUserInput {
            return history_user_input
        }

        public abstract get_num_layers_clips_to_render(): number

        // we skip over the segments layer
        coord_to_index_history_user_input(coord: number[]): number[] {
            return [coord[0] - 1, coord[1]];
        }

        // the root is not included in iteration
        coord_to_index_struct_train(coord: number[]): number[] {
            return coord
        }

        public abstract handle_command(command: string, trainer: trainer.Trainer): void

        public abstract handle_midi(pitch: number, velocity: number, trainer: trainer.Trainer): void

        public get_notes_focus(track_target: Track): TreeModel.Node<note.Note>[] {
            return track_target.get_notes();
        }

        restore(trainer: Trainer, segments_train: Segment[], matrix_deserialized: MatrixParseForest) {
            trainer.commence();

            let input_left = true;

            while (input_left) {
                let coord_current = trainer.iterator_matrix_train.get_coord_current();

                let coord_user_input_history = this.coord_to_index_history_user_input(coord_current);

                if (trainer.iterator_matrix_train.done || matrix_deserialized[coord_user_input_history[0]][coord_user_input_history[1]].length === 0) {

                    input_left = false;

                    continue;
                }

                trainer.accept_input(
                    matrix_deserialized[coord_user_input_history[0]][coord_user_input_history[1]]
                );
            }
        }

        get_direction(): string {
            return this.direction;
        }

        set_direction(direction: string): void {
            this.direction = direction;
        }

        public abstract get_iterator_train(segments: segment.Segment[]): iterate.MatrixIterator

        public abstract suppress(messenger: message.Messenger): void
    }
}