import {message} from "../message/messenger";
import {segment} from "../segment/segment";
import {track} from "../track/track";
import {note} from "../note/note";
import TreeModel = require("tree-model");
import {target} from "../target/target";
import {window} from "../render/window";
import {trainer} from "../train/trainer";
import {user_input} from "../control/user_input";
import {song} from "../song/song";
import {iterate} from "../train/iterate";
import {history} from "../history/history";
import {scene} from "../scene/scene";
import {parse} from "../parse/parse";

export namespace trainable {
    import Note = note.Note;
    import Segment = segment.Segment;
    import Subtarget = target.Subtarget;
    import MatrixWindow = window.MatrixWindow;
    import StructTrain = trainer.StructTrain;
    import UserInputHandler = user_input.UserInputHandler;
    import Target = target.Target;
    import Song = song.Song;
    import MatrixIterator = iterate.MatrixIterator;
    import HistoryUserInput = history.HistoryUserInput;
    import Scene = scene.Scene;
    import Track = track.Track;
    import StructParse = parse.StructParse;

    export let DETECT = 'detect';
    export let PREDICT = 'predict';
    export let PARSE = 'parse';
    export let DERIVE = 'derive';
    export let FREESTYLE = 'freestyle';

    interface Temporal {
        determine_region_present(
            notes_next: TreeModel.Node<Note>[],
            segment_current: Segment
        )

        stream_bounds(
            messenger: message.Messenger,
            subtarget_current: Subtarget,
            segment_current: Segment,
            segments: Segment[]
        ): void
    }

    interface Renderable {
        initialize_render(
            window: MatrixWindow,
            segments: Segment[],
            notes_track_target: TreeModel.Node<Note>[],
            struct_train: StructTrain
        ): MatrixWindow

        get_notes_in_region(
            target: Target,
            segment: Segment
        ): TreeModel.Node<Note>[]
    }

    // interface that the trainer uses
    export interface Trainable extends Temporal, Renderable {
        depth: number;
        b_parsed: boolean;
        b_targeted: boolean;

        get_name(): string
        get_num_layers_input(): number
        get_num_layers_clips_to_render(): number
        set_depth(depth: number): void
        coord_to_index_clip_render(coord: number[]): number
        coord_to_index_history_user_input(coord: number[]): number[]
        coord_to_index_struct_train(coord: number[]): number[]

        preprocess_history_user_input(
            history_user_input: HistoryUserInput,
            segments: Segment[]
        ): HistoryUserInput

        create_struct_train(
            window: MatrixWindow,
            segments: Segment[],
            track_target: Track,
            user_input_handler: UserInputHandler,
            struct_train: StructTrain
        ): StructTrain

        terminate(
            struct_train: StructTrain,
            segments: Segment[]
        )

        advance_scene(
            scene_current: Scene,
            song: Song
        )

        unpause(
            song: Song,
            scene_current: Scene
        )

        pause(
            song: Song,
            scene_current: Scene
        )

        preprocess_struct_train(
            struct_train: StructTrain,
            segments: Segment[],
            notes_target_track: TreeModel.Node<Note>[]
        ): StructTrain

        update_struct(
            notes_input_user: TreeModel.Node<Note>[],
            struct_train: StructTrain,
            trainable: Trainable,
            iterator_matrix_train: MatrixIterator
        ): StructTrain

        initialize_tracks(
            segments: segment.Segment[],
            track_target: track.Track,
            track_user_input: track.Track,
            // matrix_target: TargetIterator[][]
            struct_train: StructTrain
        )

        update_history_user_input(
            input_postprocessed: TreeModel.Node<Note>[],
            history_user_input: HistoryUserInput,
            iterator_matrix_train: MatrixIterator,
            trainable: Trainable
        ): HistoryUserInput

        warrants_advance(
            notes_user_input: TreeModel.Node<Note>[],
            subtarget_current: Subtarget
        ): boolean

        postprocess_user_input(
            notes_user_input: TreeModel.Node<Note>[],
            subtarget_current: Subtarget
        ): TreeModel.Node<Note>[]
    }

    // interface common to both parse and derive, but have different implementations
    export interface Parsable extends Trainable {
        preprocess_struct_parse(struct_parse, segments, track_target)
        finish_parse(struct_parse: StructParse, segments: Segment[]): void;
        update_roots(coords_roots_previous: number[][], coords_notes_to_grow: number[][], coord_notes_current: number[])
        get_coords_notes_to_grow(coords_note_input_current): number[][]
        grow_layer(notes_user_input_renderable, notes_to_grow)
    }

    // interface common to both detect and predict, but have different implementations
    export interface Targetable extends Trainable {
        determine_targets(user_input_handler: UserInputHandler, notes_in_segment: TreeModel.Node<Note>[])
        postprocess_subtarget(subtarget: Subtarget)
    }
}