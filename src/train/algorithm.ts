import {note, note as n} from "../note/note";
import TreeModel = require("tree-model");
import {harmony} from "../music/harmony";
import {modes_texture} from "../constants/constants";
import {user_input} from "../control/user_input";
import {history} from "../history/history";
import {parse} from "../parse/parse";
import {segment} from "../segment/segment";
import {track} from "../track/track";
import {window} from "../render/window";
import {iterate} from "./iterate";
import {message} from "../message/messenger";
import {target} from "../target/target";
import {scene} from "../scene/scene";
import {utils} from "../utils/utils";
import {song} from "../song/song";
import {trainer} from "./trainer";
const _ = require('underscore');

export namespace algorithm {
    import Song = song.Song;
    export let DETECT = 'detect';
    export let PREDICT = 'predict';
    export let PARSE = 'parse';
    export let DERIVE = 'derive';
    export let FREESTYLE = 'freestyle';
    import Harmony = harmony.Harmony;
    import POLYPHONY = modes_texture.POLYPHONY;
    import MONOPHONY = modes_texture.MONOPHONY;
    import TypeSequenceTarget = history.TypeSequenceTarget;
    import Note = note.Note;
    import ParseTree = parse.ParseTree;
    import StructParse = parse.StructParse;
    import Segment = segment.Segment;
    import Window = window.Window;
    import Track = track.Track;
    import MatrixIterator = iterate.MatrixIterator;
    import Subtarget = target.Subtarget;
    import TargetIterator = target.TargetIterator;
    import Target = target.Target;
    import FactoryMatrixObjectives = iterate.FactoryMatrixObjectives;
    import Scene = scene.Scene;
    import UserInputHandler = user_input.UserInputHandler;
    import HistoryUserInput = history.HistoryUserInput;
    import StructTrain = trainer.StructTrain;
    import MatrixWindow = window.MatrixWindow;
    import StructTargets = trainer.StructTargets;


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
        initialize_render(window: MatrixWindow, segments: Segment[], notes_track_target: TreeModel.Node<Note>[]): MatrixWindow
        get_notes_in_region(target: Target, segment: Segment): TreeModel.Node<Note>[]
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
            window: Window,
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

    // logic common to detect and predict
    export abstract class Targeted implements Targetable {

        update_history_user_input(
            input_postprocessed: TreeModel.Node<note.Note>[],
            history_user_input: history.HistoryUserInput,
            iterator_matrix_train: iterate.MatrixIterator,
            trainable: Trainable
        ): history.HistoryUserInput {
            history_user_input.concat(
                input_postprocessed,
                // trainable.coord_in_indeiterator_matrix_train.get_coord_current()
                trainable.coord_to_index_history_user_input(
                    iterator_matrix_train.get_coord_current()
                )
            );
            return history_user_input
        }

        public b_parsed: boolean = false;
        public b_targeted: boolean = true;
        public depth: number;

        public abstract get_name()

        public abstract initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, struct_train: StructTrain)

        public abstract determine_targets(user_input_handler: UserInputHandler, notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget

        public get_num_layers_input(): number {
            return 1
        }

        // coord_to_index_clip(coord: number[]): number {
        //     return 0;
        // }

        public determine_region_present(notes_target_next: TreeModel.Node<Note>[], segment_current: Segment): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[0].model.note.get_beat_end()
            ]
        }

        get_notes_in_region(target: target.Target, segment: segment.Segment) {
            return target.iterator_subtarget.subtargets.map((subtarget) => {
                return subtarget.note
            })
        }

        public abstract initialize_render(window: Window, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): MatrixWindow

        unpause(song: Song, scene_current: Scene) {
            // not forcing legato so that it starts immediately
            scene_current.fire(false);
            song.set_session_record(1);
            song.set_overdub(1);
        }

        postprocess_user_input(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): TreeModel.Node<note.Note>[] {
            return [subtarget_current.note];
        }

        public abstract postprocess_subtarget(subtarget: Subtarget)

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
                    subtarget_current.note.model.note.beat_start/duration_training_data,
                    subtarget_current.note.model.note.get_beat_end()/duration_training_data
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

        create_struct_train(window: window.Window, segments: segment.Segment[], track_target: track.Track, user_input_handler: user_input.UserInputHandler, struct_train: trainer.StructTrain): trainer.StructTrain {
            let notes_target_track = track_target.get_notes();
            return this.create_matrix_targets(user_input_handler, segments, notes_target_track);
        }

        set_depth(): void {

        }

        advance_scene(scene_current: scene.Scene, song: song.Song) {
            scene_current.fire(true);
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
    }

    // logic common to parse and derive
    export abstract class Parsed implements Parsable {

        public b_parsed: boolean = true;

        public b_targeted: boolean = false;

        public abstract get_name();

        depth: number;

        update_struct(notes_input_user: TreeModel.Node<Note>[], struct_train: StructTrain, trainable: Trainable, iterator_matrix_train: MatrixIterator): StructTrain {

            let struct_parse = struct_train as StructParse;

            struct_parse.add(
                notes_input_user,
                // iterator_matrix_train.get_coord_current(),
                trainable.coord_to_index_struct_train(
                    iterator_matrix_train.get_coord_current()
                ),
                trainable as Parsable
            );

            return struct_parse
        }

        public abstract initialize_render(window: Window, segments: Segment[], notes_track_target: TreeModel.Node<Note>[]): MatrixWindow

        public abstract initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, struct_train: StructTrain)

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
            if (coord[0] === -1) {
                return 0
            } else {
                return coord[0] + 1
            }
        }

        create_struct_parse(segments: Segment[]): StructParse {
            return new StructParse(
                FactoryMatrixObjectives.create_matrix_parse(
                    this,
                    segments
                )
            )
        }

        determine_region_present(notes_target_next: TreeModel.Node<Note>[], segment_current: Segment): number[] {
            // return [
            //     notes_target_next[0].model.note.beat_start,
            //     notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            // ]
            // let logger = new Logger('max');
            // logger.log(JSON.stringify(segment_current));
            return [
                segment_current.beat_start,
                segment_current.beat_end
            ]
        }

        finish_parse(struct_parse: parse.StructParse, segments: segment.Segment[]): void {
        }

        public abstract get_coords_notes_to_grow(coords_note_input_current): number[][]

        get_notes_in_region(target: target.Target, segment: segment.Segment) {
            return [segment.get_note()]
        }

        public abstract grow_layer(notes_user_input_renderable, notes_to_grow)


        preprocess_struct_train(struct_train: StructTrain, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): StructTrain {
            return this.preprocess_struct_parse(struct_train as StructParse, segments, notes_target_track)
        }

        public abstract preprocess_struct_parse(struct_parse, segments, track_target)

        pause(song: Song, scene_current: Scene) {

            song.set_overdub(0);

            song.set_session_record(0);

            song.stop()
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
            this.finish_parse(struct_train as StructParse, segments)
        }

        unpause(song: Song, scene_current: Scene) {
            scene_current.fire(false);

            song.set_overdub(1);

            song.set_session_record(1);
        }

        public abstract update_roots(coords_roots_previous: number[][], coords_notes_to_grow: number[][], coord_notes_current: number[])

        warrants_advance(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): boolean {
            return true;
        }

        create_struct_train(window: window.Window, segments: segment.Segment[], track_target: track.Track, user_input_handler: user_input.UserInputHandler, struct_train: trainer.StructTrain): trainer.StructTrain {
            return this.create_struct_parse(segments);
        }

        advance_scene(scene_current: scene.Scene, song: song.Song) {
            scene_current.fire(true);

            song.set_overdub(1);

            song.set_session_record(1);
        }

        preprocess_history_user_input(history_user_input: history.HistoryUserInput, segments: segment.Segment[]): HistoryUserInput {
            // for (let i_segment in segments) {
            //     let segment = segments[Number(i_segment)];
            //     history_user_input.concat(
            //         [segment.get_note()],
            //         [0, Number(i_segment)]
            //     )
            // }
            return history_user_input
        }

        public abstract get_num_layers_clips_to_render(): number

        // we skip over the root and the segments layer
        // to_index_history_user_input(coord: number[]): number[] {
        //     return [coord[0] - 2, coord[1]];
        // }

        // the root is prepended to clips
        // coord_to_index_clip_render(coord: number[]): number {
        //     return coord[0] + 1;
        // }

        // we skip over the segments layer
        coord_to_index_history_user_input(coord: number[]): number[] {
            return [coord[0] - 1, coord[1]];
        }

        // the root is not included in iteration
        coord_to_index_struct_train(coord: number[]): number[] {
            // return [coord[0] - 1, coord[1]];
            return coord
        }
    }

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

        postprocess_subtarget(note_subtarget) {
            return note_subtarget
        }

        // TODO: verify that we don't have to do anything here
        initialize_render(window: window.MatrixWindow, segments: segment.Segment[], notes_target_track: TreeModel.Node<note.Note>[]): MatrixWindow {
            return window
        }

        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, struct_train: StructTrain) {
            return
        }
    }

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
        initialize_render(window: window.MatrixWindow, segments: segment.Segment[], notes_target_track: TreeModel.Node<note.Note>[]) {
            return window
        }

        // NB: we only have to initialize clips in the target track
        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, struct_train: StructTrain) {

            let matrix_targets = struct_train;

            for (let i_segment in segments) {
                let segment = segments[Number(i_segment)];

                let targeted_notes_in_segment = matrix_targets[0][Number(i_segment)].get_notes();

                // TODO: this won't work for polyphony
                for (let note of targeted_notes_in_segment) {

                    segment.clip_user_input.remove_notes(
                        note.model.note.beat_start,
                        0,
                        note.model.note.get_beat_end(),
                        128
                    );

                    segment.clip_user_input.set_notes(
                        [note]
                    )
                }
            }
        }
    }

    export class Parse extends Parsed {

        constructor() {
            super();
        }

        public get_name(): string {
            return PARSE
        }

        grow_layer(notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(
                notes_user_input_renderable,
                notes_to_grow,
                -1
            )
        }

        // TODO: we don't need the target track - we should 1) transfer all notes over to user input track and 2) mute the track
        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, struct_train: StructTrain) {
            // transfer notes from target track to user input track
            for (let i_segment in segments) {

                let clip_target = track_target.get_clip_at_index(Number(i_segment));

                let clip_user_input = track_user_input.get_clip_at_index(Number(i_segment));

                let notes = clip_target.get_notes(
                    clip_target.get_loop_bracket_lower(),
                    0,
                    clip_target.get_loop_bracket_upper(),
                    128
                );

                clip_user_input.remove_notes(
                    clip_target.get_loop_bracket_lower(),
                    0,
                    clip_target.get_loop_bracket_upper(),
                    128
                );

                clip_user_input.set_notes(
                    notes
                )
            }

            // mute target track
            track_target.mute()
        }

        // add the root up to which we're going to parse
        // add the segments as the layer below
        // add the leaf notes
        initialize_render(window: MatrixWindow, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): MatrixWindow {
            // first layer
            window.add_note_to_clip_root(
                StructParse.create_root_from_segments(
                    segments
                )
            );

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let note_segment = segment.get_note();

                let coord_current_virtual_second_layer = [0, Number(i_segment)];

                let notes_leaves = notes_target_track.filter(
                    node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                );

                let coord_current_virtual_leaves = [this.depth - 1, Number(i_segment)];

                // second layer
                window.add_notes_to_clip(
                    [note_segment],
                    this.coord_to_index_clip_render(
                        coord_current_virtual_second_layer
                    )
                );

                // leaves
                window.add_notes_to_clip(
                    notes_leaves,
                    this.coord_to_index_clip_render(
                        coord_current_virtual_leaves
                    )
                )
            }

            return window
        }

        update_roots(coords_roots_previous: number[][], coords_notes_previous: number[][], coord_notes_current: number[]): number[][] {
            let coords_roots_new = [];

            // remove references to old leaves
            for (let coord_notes_previous of coords_notes_previous) {
                coords_roots_new = coords_roots_new.concat(
                    coords_roots_previous.filter((x) => {
                        return !(x[0] === coord_notes_previous[0] && x[1] === coord_notes_previous[1])
                    })
                );
            }

            // add references to new leaves
            coords_roots_new.push(
                coord_notes_current
            );

            return coords_roots_new
        }

        get_coords_notes_to_grow(coord_notes_input_current) {
            return MatrixIterator.get_coords_below([coord_notes_input_current[0], coord_notes_input_current[1]]);
        }

        // adding the leaf notes to the actual parse tree
        // DO NOT set the root or the segments as nodes immediately below that - do that at the end
        // set the leaf notes as the notes in the target track
        preprocess_struct_parse(struct_parse: StructParse, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]) {
            // this is to set the leaves as the notes of the target clip

            // struct_parse.set_root(
            //     ParseTree.create_root_from_segments(
            //         segments
            //     )
            // );

            for (let i_segment in segments) {
                let segment = segments[Number(i_segment)];

                let notes = notes_target_track.filter(
                    node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                );

                let coord_parse_current_virtual_leaf = [this.depth - 1, Number(i_segment)];

                struct_parse.add(
                    notes,
                    coord_parse_current_virtual_leaf,
                    this,
                    true
                );
            }

            return struct_parse
        }

        finish_parse(struct_parse: StructParse, segments: Segment[]): void {

            let coords_to_grow = [];

            // make connections with segments
            for (let i_segment in segments) {
                coords_to_grow.push([0, Number(i_segment)]);
                let segment = segments[Number(i_segment)];
                struct_parse.add(
                    [segment.get_note()],
                    [0, Number(i_segment)],
                    this
                );
            }

            struct_parse.set_root(
                StructParse.create_root_from_segments(
                    segments
                )
            );

            for (let coord_to_grow of coords_to_grow) {

                let notes_to_grow = struct_parse.get_notes_at_coord(coord_to_grow);

                this.grow_layer(
                    [struct_parse.get_root()],
                    notes_to_grow
                );
            }

            struct_parse.coords_roots = this.update_roots(
                struct_parse.coords_roots,
                coords_to_grow,
                [-1]
            );
        }

        // segments layer and leaves layer don't count
        get_num_layers_input(): number {
            return this.depth - 2;
        }

        get_num_layers_clips_to_render(): number {
            return this.depth + 1;
        }
    }

    export class Derive extends Parsed {

        public get_name(): string {
            return DERIVE
        }

        get_coords_notes_to_grow(coords_note_input_current) {
            return MatrixIterator.get_coords_above([coords_note_input_current[0], coords_note_input_current[1]])
        }

        grow_layer(notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(
                notes_to_grow,
                notes_user_input_renderable,
                -1
            )
        }

        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, struct_train: StructTrain) {
            track_target.mute();
        }

        preprocess_struct_parse(struct_parse: StructParse, segments: Segment[]): StructParse {
            // add the root to the tree immediately
            struct_parse.set_root(
                ParseTree.create_root_from_segments(
                    segments
                )
            );

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let note = segment.get_note();

                let coord_current_virtual = [0, Number(i_segment)];

                struct_parse.add(
                    [note],
                    coord_current_virtual,
                    this
                );
            }

            return struct_parse
        }

        initialize_render(window: MatrixWindow, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): MatrixWindow {
            // first layer (root)
            window.add_note_to_clip_root(
                StructParse.create_root_from_segments(
                    segments
                )
            );

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let note_segment = segment.get_note();

                let coord_current_virtual_second_layer = [0, Number(i_segment)];

                // second layer
                window.add_notes_to_clip(
                    [note_segment],
                    this.coord_to_index_clip_render(
                        coord_current_virtual_second_layer
                    )
                )
            }

            return window
        }

        finish_parse(struct_parse: StructParse, segments: Segment[]): void {
            return
        }

        update_roots(coords_roots_previous: number[][], coords_notes_previous: number[][], coord_notes_current: number[]) {
            return coords_roots_previous
        }

        // the layer of segments don't count
        get_num_layers_input(): number {
            return this.depth - 1;
        }

        get_num_layers_clips_to_render(): number {
            return this.depth + 1;
        }
    }
}