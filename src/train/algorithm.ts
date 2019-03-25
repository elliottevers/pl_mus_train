import {note, note as n} from "../note/note";
import TreeModel = require("tree-model");
import {harmony} from "../music/harmony";
import {modes_texture} from "../constants/constants";
import {user_input} from "../control/user_input";
import {history} from "../history/history";
import {clip} from "../clip/clip";
import {parse} from "../parse/parse";
import {segment} from "../segment/segment";
import {track} from "../track/track";
import {window} from "../render/window";
import {iterate} from "./iterate";
import {message} from "../message/messenger";
import {target} from "../target/target";
import {live} from "../live/live";
import {scene} from "../scene/scene";
import {utils} from "../utils/utils";
import {song} from "../song/song";
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
    import Messenger = message.Messenger;
    import Subtarget = target.Subtarget;
    import TargetIterator = target.TargetIterator;
    import ClipDao = clip.ClipDao;
    import Target = target.Target;
    import FactoryMatrixObjectives = iterate.FactoryMatrixObjectives;
    import Scene = scene.Scene;
    import UserInputHandler = user_input.UserInputHandler;
    import Clip = clip.Clip;


    interface Temporal {
        determine_region_present(notes_next)
        stream_bounds(messenger: message.Messenger, subtarget_current: Subtarget, segment_current: Segment): void
    }

    interface Renderable {
        initialize_render(window: Window, segments: Segment[], notes_track_target: TreeModel.Node<Note>[])
        get_notes_in_region(target: Target, segment: Segment): TreeModel.Node<Note>[]
    }

    // interface that the trainer uses
    export interface Trainable extends Temporal, Renderable {
        depth: number;
        b_parsed: boolean;
        b_targeted: boolean;

        get_name(): string
        get_depth(): number
        coord_to_index_clip(coord: number[]): number
        initialize(window: Window, segments: Segment[], notes_target_track: TreeModel.Node<Note>[], user_input_handler: UserInputHandler): void
        terminate(struct_parse: StructParse, segments: Segment[])
        unpause(song: Song, scene_current: Scene)
        pause(song: Song, scene_current: Scene)
        create_matrix_targets(user_input_handler: UserInputHandler, segments: Segment[], notes_target_track: TreeModel.Node<Note>[])
        create_struct_parse(segments: Segment[]): StructParse
        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, matrix_target: TargetIterator[][])

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
        initialize_parse(struct_parse, segments, track_target)
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
    abstract class Targeted implements Targetable {

        public b_parsed: boolean = false;
        public b_targeted: boolean = true;
        public depth: number;

        public abstract get_name()

        public abstract initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, matrix_target: target.TargetIterator[][])

        public abstract determine_targets(user_input_handler: UserInputHandler, notes_segment_next: TreeModel.Node<n.Note>[]): TypeSequenceTarget

        public get_depth(): number {
            return 1
        }

        coord_to_index_clip(coord: number[]): number {
            return 0;
        }

        create_struct_parse(segments: Segment[]) {
            return null
        }

        public determine_region_present(notes_target_next: TreeModel.Node<Note>): number[] {
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

        public abstract initialize_render(window: Window, segments: Segment[], notes_target_track: TreeModel.Node<Note>[])

        unpause(song: Song, scene_current: Scene) {
            // not forcing legato so that it starts immediately
            scene_current.fire(false)
        }

        postprocess_user_input(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): TreeModel.Node<note.Note>[] {
            return [subtarget_current.note];
        }

        public abstract postprocess_subtarget(subtarget: Subtarget)

        // TODO: verify that we don't need to do anything
        terminate() {
            return
        }

        pause(song: Song, scene_current: Scene) {
            song.stop()
        }

        warrants_advance(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current): boolean {
            return utils.remainder(notes_user_input[0].model.note.pitch, 12) === utils.remainder(subtarget_current.note.model.note.pitch, 12)
        }

        public create_matrix_targets(user_input_handler: UserInputHandler, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]): TargetIterator[][] {

            let matrix_targets = FactoryMatrixObjectives.create_matrix_objectives(
                this,
                segments
            );

            // TODO: use 'filter' here
            // this.clip_target.load_notes_within_markers();

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

        private static stream_subtarget_bounds(messenger: message.Messenger, subtarget_current: Subtarget, segment_current: Segment) {
            let ratio_bound_lower = (subtarget_current.note.model.note.beat_start - segment_current.get_endpoints_loop()[0])/(segment_current.get_endpoints_loop()[1] - segment_current.get_endpoints_loop()[0]);
            let ratio_bound_upper = (subtarget_current.note.model.note.get_beat_end() - segment_current.get_endpoints_loop()[0])/(segment_current.get_endpoints_loop()[1] - segment_current.get_endpoints_loop()[0]);
            messenger.message(['bounds', ratio_bound_lower, ratio_bound_upper])
        }

        stream_bounds(messenger: message.Messenger, subtarget_current: Subtarget, segment_current: Segment): void {
            Targeted.stream_subtarget_bounds(messenger, subtarget_current, segment_current)
        }

        initialize(window: Window, segments: Segment[], notes_target_track: TreeModel.Node<Note>[], user_input_handler: UserInputHandler) {
            this.create_matrix_targets(user_input_handler, segments, notes_target_track);
            this.initialize_render(window, segments, notes_target_track)
        }
    }

    // logic common to parse and derive
    abstract class Parsed implements Parsable {

        public b_parsed: boolean = true;

        public b_targeted: boolean = false;

        public abstract get_name();

        depth: number;

        public abstract initialize_render(window: Window, segments: Segment[], notes_track_target: TreeModel.Node<Note>[])

        public abstract initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, matrix_target: target.TargetIterator[][])

        public get_depth(): number {
            return this.depth
        }

        set_depth(depth: number) {
            this.depth = depth;
        }

        coord_to_index_clip(coord: number[]): number {
            if (coord[0] === -1) {
                return 0
            } else {
                return coord[0] + 1
            }
        }

        create_matrix_targets(user_input_handler: UserInputHandler, segments: segment.Segment[], notes_target_track: TreeModel.Node<note.Note>[]) {
            return []
        }

        create_struct_parse(segments: Segment[]): StructParse {
            return new StructParse(
                FactoryMatrixObjectives.create_matrix_objectives(
                    this,
                    segments
                )
            )
        }

        determine_region_present(notes_target_next): number[] {
            return [
                notes_target_next[0].model.note.beat_start,
                notes_target_next[notes_target_next.length - 1].model.note.get_beat_end()
            ]
        }

        finish_parse(struct_parse: parse.StructParse, segments: segment.Segment[]): void {
        }

        public abstract get_coords_notes_to_grow(coords_note_input_current): number[][]

        get_notes_in_region(target: target.Target, segment: segment.Segment) {
            return [segment.get_note()]
        }

        public abstract grow_layer(notes_user_input_renderable, notes_to_grow)

        initialize() {
            // TODO: add logic
        }

        public abstract initialize_parse(struct_parse, segments, track_target)


        pause(song: Song, scene_current: Scene) {
            song.set_overdub(0);

            song.set_session_record(0);

            song.stop()
        }

        postprocess_user_input(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): TreeModel.Node<note.Note>[] {
            return notes_user_input;
        }

        stream_bounds(messenger: message.Messenger, subtarget_current: target.Subtarget, segment_current: segment.Segment): void {
            Parsed.stream_segment_bounds(messenger)
        }

        private static stream_segment_bounds(messenger: Messenger) {
            messenger.message(['bounds', 0, 1])
        }

        terminate(struct_parse: StructParse, segments: Segment[]) {
            this.finish_parse(struct_parse, segments)
        }

        unpause(song: Song, scene_current: Scene) {
            song.set_overdub(1);

            song.set_session_record(1);

            scene_current.fire(false);
        }

        update_roots(coords_roots_previous: number[][], coords_notes_to_grow: number[][], coord_notes_current: number[]) {

        }

        warrants_advance(notes_user_input: TreeModel.Node<note.Note>[], subtarget_current: target.Subtarget): boolean {
            return true;
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

                // return [chords_monophonified[Math.floor(Math.random() * chords_monophonified.length)]];
                // return [chords_monophonified[chords_monophonified.length/2]]
                return chords_monophonified

            } else if (user_input_handler.mode_texture === MONOPHONY) {

                let notes_grouped_trivial: TypeSequenceTarget = [];

                for (let note of notes_segment_next) {
                    notes_grouped_trivial.push([note])
                }

                // return notes_grouped_trivial
                // TODO: let's put more weight towards the center of the measure
                // return notes_grouped_trivial[Math.floor(Math.random() * notes_grouped_trivial.length)];
                // return [notes_grouped_trivial[notes_grouped_trivial.length/2]]
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
        initialize_render(window: window.Window, segments: segment.Segment[], notes_target_track: TreeModel.Node<note.Note>[]) {
            return
        }

        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, matrix_target: TargetIterator[][]) {
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
                    Math.floor(node.model.note.beat_start/4)
                };

                let note_partitions: TreeModel.Node<Note>[][] = _.groupBy(notes_segment_next, position_measure);

                for (let partition of note_partitions) {
                    // get the middle note of the measure
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
        initialize_render(window: window.Window, segments: segment.Segment[], notes_target_track: TreeModel.Node<note.Note>[]) {
            return
        }

        // NB: we only have to initialize clips in the target track
        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, matrix_target: TargetIterator[][]) {

            for (let i_segment in segments) {
                let segment = segments[Number(i_segment)];

                let targeted_notes_in_segment = matrix_target[0][Number(i_segment)].get_notes();

                // TODO: this won't work for polyphony
                for (let note of targeted_notes_in_segment) {
                    // clip = track_target.get_clip_at_interval(
                    //     [note.model.note.beat_start, note.model.note.get_beat_end()]
                    // );

                    segment.clip_user_input_async.remove_notes(
                        note.model.note.beat_start,
                        0,
                        note.model.note.get_beat_end(),
                        128
                    );

                    segment.clip_user_input_async.set_notes(
                        [note]
                    )
                }
            }

            // TODO: get the subtargets that are currently in each segment and mute them
        //     for (let target of sequence_targets) {
        //         for (let subtarget of target) {
        //
        //             let subtarget_processed = this.postprocess_subtarget(
        //                 subtarget
        //             );
        //
        //             clip_target_track.remove_notes(
        //                 subtarget_processed.model.note.beat_start,
        //                 0,
        //                 subtarget_processed.model.note.get_beat_end(),
        //                 128
        //             );
        //
        //             clip_target_track.set_notes(
        //                 [subtarget_processed]
        //             )
        //         }
        //     }
        //
        //     for (let i_segment in segments) {
        //
        //         let index_clip_slot_current = Number(i_segment);
        //
        //         let api_clip_target_synchronous = new ApiJs(
        //             track_target.track_dao.get_path().split(' ').concat(['clip_slots', index_clip_slot_current, 'clip']).join(' ')
        //         );
        //
        //         let api_clip_user_input_synchronous = new ApiJs(
        //             track_user_input.track_dao.get_path().split(' ').concat(['clip_slots', index_clip_slot_current, 'clip']).join(' ')
        //         );
        //
        //         let clip_target = new Clip(
        //             new ClipDao(
        //                 api_clip_target_synchronous,
        //                 new Messenger('max', 0)
        //             )
        //         );
        //
        //         let clip_user_input = new Clip(
        //             new ClipDao(
        //                 api_clip_user_input_synchronous,
        //                 new Messenger('max', 0)
        //             )
        //         );
        //
        //         let notes = clip_target.get_notes(
        //             clip_target.get_loop_bracket_lower(),
        //             0,
        //             clip_target.get_loop_bracket_upper(),
        //             128
        //         );
        //
        //         clip_user_input.remove_notes(
        //             clip_target.get_loop_bracket_lower(),
        //             0,
        //             clip_target.get_loop_bracket_upper(),
        //             128
        //         );
        //
        //         clip_user_input.set_notes(
        //             notes
        //         )
        //     }
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
        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, matrix_target: TargetIterator[][]) {
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
        }

        // add the root up to which we're going to parse
        // add the segments as the layer below
        // add the leaf notes
        initialize_render(window: Window, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]) {
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

                let coord_current_virtual_leaves = [this.get_depth() - 1, Number(i_segment)];

                // second layer
                window.add_notes_to_clip(
                    [note_segment],
                    coord_current_virtual_second_layer,
                    this
                );

                // leaves
                window.add_notes_to_clip(
                    notes_leaves,
                    coord_current_virtual_leaves,
                    this
                )
            }
        }

        update_roots(coords_roots_previous: number[][], coords_notes_previous: number[][], coord_notes_current: number[]) {
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
        }

        get_coords_notes_to_grow(coord_notes_input_current) {
            return MatrixIterator.get_coords_below([coord_notes_input_current[0], coord_notes_input_current[1]]);
        }

        // adding the leaf notes to the actual parse tree
        // DO NOT set the root or the segments as nodes immediately below that - do that at the end
        // set the leaf notes as the notes in the target track
        initialize_parse(struct_parse: StructParse, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]) {
            // this is to set the leaves as the notes of the target clip

            for (let i_segment in segments) {
                let segment = segments[Number(i_segment)];

                let notes = notes_target_track.filter(
                    node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                );

                let coord_current_virtual_leaf = [this.get_depth() - 1, Number(i_segment)];

                struct_parse.add(
                    notes,
                    coord_current_virtual_leaf,
                    this
                );
            }
        }

        finish_parse(struct_parse: StructParse, segments: Segment[]): void {

            // make connections with segments
            for (let i_segment in segments) {
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

            // make connections with root
            struct_parse.add(
                [Note.from_note_renderable(struct_parse.get_root())],
                [-1],
                this
            );
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

        // TODO: verify that the segments should already be here so we don't have to do anything
        initialize_tracks(segments: segment.Segment[], track_target: track.Track, track_user_input: track.Track, matrix_target: TargetIterator[][]) {
            return
        }

        initialize_parse(struct_parse: StructParse, segments: Segment[]) {
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
        }

        initialize_render(window: Window, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]) {
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
                    coord_current_virtual_second_layer,
                    this
                );
            }
        }

        finish_parse(struct_parse: StructParse, segments: Segment[]): void {
            return
        }
    }
}