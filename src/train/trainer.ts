import {note, note as n} from "../note/note";
import TreeModel = require("tree-model");
import {history} from "../history/history";
import {target} from "../target/target";
import {segment} from "../segment/segment";
import {parse} from "../parse/parse";
import {message} from "../message/messenger";
import {song} from "../song/song";
import {clip} from "../clip/clip";
import {iterate} from "./iterate";
import {window} from "../render/window";
import {track} from "../track/track";
import {user_input} from "../control/user_input";
import {trainable} from "../algorithm/trainable";
import {live} from "../live/live";
const _ = require('underscore');

export namespace trainer {

    import HistoryUserInput = history.HistoryUserInput;
    import TargetIterator = target.TargetIterator;
    import Segment = segment.Segment;
    import Subtarget = target.Subtarget;
    import Target = target.Target;
    import Messenger = message.Messenger;
    import Clip = clip.Clip;
    import SubtargetIterator = target.SubtargetIterator;
    import MatrixParseForest = parse.MatrixParseForest;
    import MatrixIterator = iterate.MatrixIterator;
    import Note = note.Note;
    import Track = track.Track;
    import FactoryMatrixObjectives = iterate.FactoryMatrixObjectives;
    import UserInputHandler = user_input.UserInputHandler;
    import Song = song.Song;
    import MatrixWindow = window.MatrixWindow;
    import Trainable = trainable.Trainable;
    import FREESTYLE = trainable.FREESTYLE;
    import PARSE = trainable.PARSE;
    import DERIVE = trainable.DERIVE;
    import PREDICT = trainable.PREDICT;
    import Env = live.Env;

    export type StructTargets = TargetIterator[][];

    export type StructTrain = MatrixParseForest | StructTargets;

    export let SESSION = 'session';

    export let ARRANGEMENT = 'arrangement';

    export class Trainer {

        public trainable: Trainable;
        public clip_user_input: Clip;

        private window: MatrixWindow;
        private notes_target_track: TreeModel.Node<Note>[];
        private track_target: Track;
        private track_user_input: Track;
        private song: Song;
        private segments: Segment[];
        private messenger: Messenger;

        public history_user_input: HistoryUserInput;
        public struct_train: StructTrain;

        private counter_user_input: number;
        private limit_user_input: number;

        public segment_current: Segment;
        public target_current: Target;
        public subtarget_current: Subtarget;

        public iterator_matrix_train: MatrixIterator;
        private iterator_target_current: TargetIterator;
        private iterator_subtarget_current: SubtargetIterator;

        private user_input_handler: UserInputHandler;

        public env: Env;

        public virtualized: boolean = false;

        public done: boolean = false;

        constructor(
            window: MatrixWindow,
            user_input_handler: UserInputHandler,
            trainable: Trainable,
            track_target: Track,
            track_user_input: Track,
            song: Song,
            segments: Segment[],
            messenger: Messenger,
            env: Env,
            virtualized?: boolean
        ) {
            this.window = window;
            this.trainable = trainable;
            this.track_target = track_target;
            this.track_user_input = track_user_input;
            this.song = song;
            this.user_input_handler = user_input_handler;
            this.segments = segments;
            this.messenger = messenger;
            this.env = env;
            this.virtualized = virtualized;

            this.trainable.suppress(this.messenger);

            this.notes_target_track = this.trainable.get_notes_focus(
                track_target
            );

            this.iterator_matrix_train = this.trainable.get_iterator_train(this.segments);

            this.history_user_input = new HistoryUserInput(
                FactoryMatrixObjectives.create_matrix_user_input_history(
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

            this.history_user_input = this.trainable.preprocess_history_user_input(
                this.history_user_input,
                this.segments
            );

            this.struct_train = this.trainable.create_struct_train(
                this.window,
                this.segments,
                this.track_target,
                this.user_input_handler
            );

            this.struct_train = this.trainable.preprocess_struct_train(
                this.struct_train,
                this.segments,
                this.notes_target_track
            );

            this.trainable.initialize_set(
                this.song,
                this.segments
            );

            this.trainable.initialize_tracks(
                this.segments,
                this.track_target,
                this.track_user_input,
                this.struct_train
            );

            this.window = this.trainable.initialize_render(
                this.window,
                this.segments,
                this.notes_target_track,
                this.struct_train
            );
        }

        public clear_window() {
            if (!this.virtualized) {
                this.window.clear()
            }
        }

        public render_window() {
            if (!this.virtualized) {

                this.window.clear();

                this.window.render(
                    this.iterator_matrix_train,
                    this.trainable,
                    this.struct_train,
                    this.segment_current
                )
            }
        }

        public unpause() {
            if (!this.virtualized) {
                this.trainable.unpause(this.song, this.segment_current.scene)
            }
        }

        public pause() {
            if (!this.virtualized) {
                this.trainable.pause(this.song, this.segment_current.scene)
            }
        }

        private advance() {
            if (this.trainable.b_parsed) {
                this.advance_segment()
            } else if (this.trainable.b_targeted) {
                this.advance_subtarget()
            } else if (this.trainable.get_name() === FREESTYLE) {
                this.advance_loop_song()
            } else {
                throw 'cannot determine how to advance'
            }
        }

        public commence() {
            this.advance();
        }

        private shut_down() {
            this.done = true;
            if (!this.virtualized) {
                this.trainable.terminate(this.struct_train, this.segments);

                this.trainable.pause(this.song, this.segment_current.scene);
            }
        }

        private advance_segment() {

            let obj_next_coord = this.iterator_matrix_train.next();

            if (obj_next_coord.done) {

                this.shut_down();

                return
            }

            this.next_segment()
        }

        private advance_subtarget() {

            let matrix_targets = this.struct_train as StructTargets;

            let have_not_begun: boolean = (!this.iterator_matrix_train.b_started);

            if (have_not_begun) {
                this.iterator_matrix_train.next();

                let coord_current = this.iterator_matrix_train.get_coord_current();

                this.iterator_target_current = matrix_targets[coord_current[0]][coord_current[1]];

                this.iterator_target_current.next();

                this.target_current = this.iterator_target_current.current();

                this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                this.iterator_subtarget_current.next();

                this.subtarget_current = this.iterator_subtarget_current.current();

                this.next_segment();

                return
            }

            let obj_next_subtarget = this.iterator_subtarget_current.next();

            if (obj_next_subtarget.done) {

                let obj_next_target = this.iterator_target_current.next();

                if (obj_next_target.done) {

                    let obj_next_coord = this.iterator_matrix_train.next();

                    if (obj_next_coord.done) {

                        this.shut_down();

                        return
                    }

                    let coord_next = obj_next_coord.value;

                    this.iterator_target_current = matrix_targets[coord_next[0]][coord_next[1]];

                    let obj_next_target_twice_nested = this.iterator_target_current.next();

                    this.target_current = obj_next_target_twice_nested.value;

                    let obj_next_subtarget_twice_nested = this.target_current.iterator_subtarget.next();

                    this.subtarget_current = obj_next_subtarget_twice_nested.value;

                    this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                    this.next_segment();

                    return
                }

                this.target_current = obj_next_target.value;

                let obj_next_subtarget_once_nested = this.target_current.iterator_subtarget.next();

                this.subtarget_current = obj_next_subtarget_once_nested.value;

                this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                this.stream_bounds();

                return
            }

            this.subtarget_current = obj_next_subtarget.value;

            this.stream_bounds();
        }

        private stream_bounds() {
            if (!this.virtualized) {
                this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current, this.segments);
            }
        }

        private advance_scene() {
            if (!this.virtualized) {

                this.trainable.advance_scene(
                    this.segment_current.scene,
                    this.song
                );

                this.trainable.stream_bounds(
                    this.messenger,
                    this.subtarget_current,
                    this.segment_current,
                    this.segments
                )
            }
        }

        advance_loop_song() {
            this.advance_segment();

            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];

            let endpoints_loop = this.segment_current.get_endpoints_loop();

            this.song.set_loop_start(endpoints_loop[0]);

            this.song.set_loop_length(endpoints_loop[1] - endpoints_loop[0]);

            this.song.set_current_song_time(endpoints_loop[0]);

            let b_first_segment = this.segment_current.beat_start === 0;

            if (b_first_segment) {
                this.song.start()
            } else {
                this.segment_current.cue_point.jump()
            }
        }

        // e.g., clips and scenes
        update_session_constucts() {
            // this.segment_current.scene.set_path_deferlow('scene');

            this.clip_user_input = this.segment_current.clip_user_input;

            // this.clip_user_input.set_path_deferlow('clip_user_input');

            this.advance_scene()
        }

        next_segment() {
            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];

            if (this.trainable.get_view() === SESSION) {
                this.update_session_constucts()
            }
        }

        accept_input(notes_input_user: TreeModel.Node<n.Note>[]) {

            this.counter_user_input++;

            if (this.counter_user_input >= this.limit_user_input) {
                return
            }

            if (this.trainable.warrants_advance(notes_input_user, this.subtarget_current)) {

                let input_postprocessed = this.trainable.postprocess_user_input(
                    notes_input_user,
                    this.subtarget_current
                );

                this.history_user_input = this.trainable.update_history_user_input(
                    input_postprocessed,
                    this.history_user_input,
                    this.iterator_matrix_train,
                    this.trainable
                );

                this.struct_train = this.trainable.update_struct(
                    input_postprocessed,
                    this.struct_train,
                    this.trainable,
                    this.iterator_matrix_train
                );

                this.window.add_notes_to_clip(
                    input_postprocessed,
                    this.trainable.coord_to_index_clip_render(
                        this.iterator_matrix_train.get_coord_current()
                    )
                );

                this.advance();

                this.render_window();
            }
        }

        public accept_command(command) {
            this.trainable.handle_command(command, this);
        }

        public accept_midi(pitch: number, velocity: number) {
            this.trainable.handle_midi(pitch, velocity, this)
        }

        public restore_user_input() {

            if (!_.contains([DERIVE, PARSE], this.trainable.get_name())) {
                return
            }

            let matrix_parse_forest = this.struct_train as MatrixParseForest;

            let inputs_most_recent = matrix_parse_forest.get_most_recent_input(this.trainable);

            for (let i_input_most_recent in inputs_most_recent) {
                let input_most_recent = inputs_most_recent[Number(i_input_most_recent)];

                let segment = this.segments[Number(i_input_most_recent)];

                if (input_most_recent.length === 0) {
                    continue;
                }

                let clip_user_input = Track.get_clip_at_index(
                    this.track_user_input.get_index(),
                    Number(i_input_most_recent),
                    this.track_user_input.track_dao.messenger,
                    this.env
                );

                clip_user_input.remove_notes(
                    segment.beat_start,
                    0,
                    segment.beat_end,
                    128
                );

                clip_user_input.set_notes(
                    input_most_recent
                )
            }
        }
    }
}