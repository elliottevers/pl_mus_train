import {note, note as n} from "../note/note";
import TreeModel = require("tree-model");
import {algorithm} from "./algorithm";
import {history} from "../history/history";
import {target} from "../target/target";
import {segment} from "../segment/segment";
import {parse} from "../parse/parse";
import {message} from "../message/messenger";
import {song} from "../song/song";
import {clip} from "../clip/clip";
import {iterate} from "./iterate";
import {log} from "../log/logger";
import {window} from "../render/window";
import {utils} from "../utils/utils";
import {live} from "../live/live";
import {track} from "../track/track";
import {user_input} from "../control/user_input";
import {scene} from "../scene/scene";
// import {get_notes_on_track} from "../scripts/segmenter";
const _ = require('underscore');
const l = require('lodash');

export namespace trainer {

    import HistoryUserInput = history.HistoryUserInput;
    import TargetIterator = target.TargetIterator;
    import Segment = segment.Segment;
    import Subtarget = target.Subtarget;
    import Target = target.Target;
    import Messenger = message.Messenger;
    import Clip = clip.Clip;
    import SubtargetIterator = target.SubtargetIterator;
    import StructParse = parse.StructParse;
    import MatrixIterator = iterate.MatrixIterator;
    import IteratorTrainFactory = iterate.IteratorTrainFactory;
    import Note = note.Note;
    import Track = track.Track;
    import FactoryMatrixObjectives = iterate.FactoryMatrixObjectives;
    import Trainable = algorithm.Trainable;
    import UserInputHandler = user_input.UserInputHandler;
    import Song = song.Song;
    import MatrixWindow = window.MatrixWindow;
    import Scene = scene.Scene;
    import SceneDao = scene.SceneDao;
    import Logger = log.Logger;

    export type StructTargets = TargetIterator[][];

    export type StructTrain = StructParse | StructTargets;

    export class Trainer {

        private window: MatrixWindow;
        public trainable: Trainable; // TODO: type
        public clip_user_input: Clip;
        // public clip_user_input_sync: Clip;
        // private clip_target: Clip;
        private notes_target_track: TreeModel.Node<Note>[];
        private track_target: Track;
        private track_user_input: Track;
        private song: Song;
        private segments: Segment[];
        private messenger: Messenger;

        // public struct_parse: StructParse;
        public history_user_input: HistoryUserInput;
        public struct_train: StructTrain;

        private counter_user_input: number;
        private limit_user_input: number;
        private limit_input_reached: boolean;

        private segment_current: Segment;
        public target_current: Target;
        private subtarget_current: Subtarget;

        // private matrix_targets: TargetIterator[][];
        public iterator_matrix_train: MatrixIterator;
        private iterator_target_current: TargetIterator;
        private iterator_subtarget_current: SubtargetIterator;

        private user_input_handler: UserInputHandler;

        constructor(
            window: MatrixWindow,
            user_input_handler: UserInputHandler,
            trainable: Trainable,
            track_target: Track,
            track_user_input: Track,
            song: Song,
            segments: Segment[],
            messenger: Messenger
        ) {
            this.window = window;
            this.trainable = trainable;
            this.track_target = track_target;
            this.track_user_input = track_user_input;
            this.song = song;

            this.user_input_handler = user_input_handler;

            this.segments = segments;

            // TODO: pull notes from clip user input track and transform into segments
            // this.segments = Segment.from_notes(
            //     this.track_user_input.get_notes()
            // );
            //
            // // assign scenes to segments
            // for (let segment of this.segments) {
            //     segment.set_scene(
            //         new Scene(
            //             new SceneDao(
            //
            //             )
            //         )
            //     )
            // }

            // this.segments = segments;
            this.messenger = messenger;

            // this.notes_target_track = track.get_notes_on_track(
            //     track_target.get_path()
            // );

            this.notes_target_track = track_target.get_notes();

            // let logger = new Logger('max');
            // logger.log(JSON.stringify(this.notes_target_track));

            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(
                this.trainable,
                this.segments
            );

            this.history_user_input = new HistoryUserInput(
                FactoryMatrixObjectives.create_matrix_objectives(
                    this.trainable,
                    this.segments
                )
            );

            this.window.initialize_clips(
                this.trainable,
                this.segments
            );

            this.window.set_length_beats(
                this.segments[this.segments.length - 1].beat_end
            );

            // this.trainable.initialize(
            //     this.window,
            //     this.segments,
            //     this.track_target,
            //     this.user_input_handler,
            //     this.struct_parse
            // );

            this.window = this.trainable.initialize_render(
                this.window,
                this.segments,
                this.notes_target_track
            );

            this.history_user_input = this.trainable.preprocess_history_user_input(
                this.history_user_input,
                this.segments
            );

            this.struct_train = this.trainable.create_struct_train(
                this.window,
                this.segments,
                this.track_target,
                this.user_input_handler,
                this.struct_train
            );

            this.struct_train = this.trainable.preprocess_struct_train(
                this.struct_train,
                this.segments,
                this.notes_target_track
            );

            // this.trainable.initialize(
            //     this.window,
            //     this.segments,
            //     this.track_target,
            //     this.user_input_handler,
            //     this.struct_train
            // );

            // TODO: figure out getting notes from the target track
            // this.matrix_targets = this.trainable.create_matrix_targets(
            //     this.user_input_handler,
            //     this.segments,
            //     this.notes_target_track
            // );

            // this.struct_train = this.trainable.create_struct_train(
            //
            // );

            // this.struct_parse = this.trainable.create_struct_parse(
            //     this.segments
            // );

            // let logger = new Logger('max');

            // logger.log(JSON.stringify(this.segments));

            this.trainable.initialize_tracks(
                this.segments,
                this.track_target,
                this.track_user_input,
                this.struct_train
            )
        }

        public clear_window() {
            this.window.clear()
        }

        public render_window() {
            this.window.render(
                this.iterator_matrix_train,
                this.trainable,
                // this.target_current,
                this.struct_train,
                this.segment_current
            )
        }

        public unpause() {
            this.trainable.unpause(this.song, this.segment_current.scene)
        }

        public pause() {
            this.trainable.pause(this.song, this.segment_current.scene)
        }

        private advance() {
            if (this.trainable.b_parsed) {
                this.advance_segment()
            } else if (this.trainable.b_targeted) {
                this.advance_subtarget()
            } else {
                throw 'cannot determine how to advance'
            }
        }

        public commence() {
            this.advance();
            // this.render_window();
        }

        private advance_segment() {

            let obj_next_coord = this.iterator_matrix_train.next();

            if (obj_next_coord.done) {

                this.trainable.terminate(this.struct_train, this.segments);

                this.trainable.pause(this.song, this.segment_current.scene);

                return
            }

            this.next_segment()
        }

        private advance_subtarget() {

            let logger = new Logger('max');

            let matrix_targets = this.struct_train as StructTargets;

            let have_not_begun: boolean = (!this.iterator_matrix_train.b_started);

            if (have_not_begun) {
                this.iterator_matrix_train.next();

                this.iterator_target_current = matrix_targets[0][0];

                this.iterator_target_current.next();

                this.target_current = this.iterator_target_current.current();

                this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                this.iterator_subtarget_current.next();

                this.subtarget_current = this.iterator_subtarget_current.current();

                logger.log(JSON.stringify(this.subtarget_current));

                this.next_segment();

                // this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current);

                return
            }

            let obj_next_subtarget = this.iterator_subtarget_current.next();

            if (obj_next_subtarget.done) {

                let obj_next_target = this.iterator_target_current.next();

                if (obj_next_target.done) {

                    let obj_next_coord = this.iterator_matrix_train.next();

                    if (obj_next_coord.done) {

                        this.trainable.terminate(this.struct_train, this.segments);

                        this.trainable.pause(this.song, this.segment_current.scene);

                        return
                    }

                    let coord_next = obj_next_coord.value;

                    this.iterator_target_current = matrix_targets[coord_next[0]][coord_next[1]];

                    let obj_next_target_twice_nested = this.iterator_target_current.next();

                    this.target_current = obj_next_target_twice_nested.value;

                    let obj_next_subtarget_twice_nested = this.target_current.iterator_subtarget.next();

                    this.subtarget_current = obj_next_subtarget_twice_nested.value;

                    this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                    logger.log(JSON.stringify(this.subtarget_current));

                    this.next_segment();

                    // this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current);

                    return
                }

                this.target_current = obj_next_target.value;

                let obj_next_subtarget_once_nested = this.target_current.iterator_subtarget.next();

                this.subtarget_current = obj_next_subtarget_once_nested.value;

                logger.log(JSON.stringify(this.subtarget_current));

                this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current, this.segments);

                return
            }

            this.subtarget_current = obj_next_subtarget.value;

            this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current, this.segments);
        }

        next_segment() {
            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];

            this.segment_current.scene.set_path_deferlow('scene');

            this.trainable.advance_scene(
                this.segment_current.scene,
                this.song
            );

            this.clip_user_input = this.segment_current.clip_user_input;

            this.clip_user_input.set_path_deferlow('clip_user_input');

            this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current, this.segments)
        }

        accept_input(notes_input_user: TreeModel.Node<n.Note>[]) {

            this.counter_user_input++;

            if (this.counter_user_input >= this.limit_user_input) {
                this.limit_input_reached = true
            }

            if (this.limit_input_reached) {
                // completely ignore
                return
            }

            if (this.trainable.warrants_advance(notes_input_user, this.subtarget_current)) {

                let input_postprocessed = this.trainable.postprocess_user_input(notes_input_user, this.subtarget_current);

                this.history_user_input = this.trainable.update_history_user_input(
                    input_postprocessed,
                    this.history_user_input,
                    this.iterator_matrix_train
                );

                this.struct_train = this.trainable.update_struct(
                    input_postprocessed,
                    this.struct_train,
                    this.trainable,
                    this.iterator_matrix_train
                );

                // this.history_user_input.concat(
                //     input_postprocessed,
                //     this.iterator_matrix_train.get_coord_current()
                // );

                this.window.add_notes_to_clip(
                    input_postprocessed,
                    this.iterator_matrix_train.get_coord_current(),
                    this.trainable
                );

                this.advance();

                this.render_window();
            }
        }
    }
}