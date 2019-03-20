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
const _ = require('underscore');
const l = require('lodash');

export namespace trainer {

    import HistoryUserInput = history.HistoryUserInput;
    import TargetIterator = target.TargetIterator;
    import Segment = segment.Segment;
    import PARSE = algorithm.PARSE;
    import DERIVE = algorithm.DERIVE;
    import DETECT = algorithm.DETECT;
    import PREDICT = algorithm.PREDICT;
    import Subtarget = target.Subtarget;
    import Target = target.Target;
    import Messenger = message.Messenger;
    import Song = song.Song;
    import Clip = clip.Clip;
    import SubtargetIterator = target.SubtargetIterator;
    import StructParse = parse.StructParse;
    import MatrixIterator = iterate.MatrixIterator;
    import FactoryMatrixTargetIterator = iterate.FactoryMatrixTargetIterator;
    import IteratorTrainFactory = iterate.IteratorTrainFactory;
    import Note = note.Note;
    import Logger = log.Logger;
    import ClipDao = clip.ClipDao;
    import LiveApiJs = live.LiveApiJs;

    export class Trainer {

        private window;
        public algorithm; // TODO: type
        public clip_user_input: Clip;
        public clip_user_input_synchronous: Clip;
        // private clip_target: Clip;
        private notes_target: TreeModel.Node<Note>[];
        private song: Song;
        private segments: Segment[];
        private messenger: Messenger;

        private struct_parse: StructParse;
        public history_user_input: HistoryUserInput;

        private counter_user_input: number;
        private limit_user_input: number;
        private limit_input_reached: boolean;

        private segment_current: Segment;
        private target_current: Target;
        private subtarget_current: Subtarget;

        private matrix_focus: TargetIterator[][];
        public iterator_matrix_train: MatrixIterator;
        private iterator_target_current: TargetIterator;
        private iterator_subtarget_current: SubtargetIterator;

        constructor(window, user_input_handler, algorithm, clip_user_input, clip_user_input_synchronous, notes_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_user_input_synchronous = clip_user_input_synchronous;
            this.notes_target = notes_target;
            this.song = song;
            this.segments = segments;
            this.messenger = messenger;

            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(
                this.algorithm,
                this.segments
            );

            this.matrix_focus = FactoryMatrixTargetIterator.create_matrix_focus(
                this.algorithm,
                this.segments
            );

            this.history_user_input = new HistoryUserInput(
                l.cloneDeep(this.matrix_focus)
            );

            this.window.initialize_clips(
                this.algorithm,
                this.segments
            );

            this.window.set_length_beats(
                this.segments[this.segments.length - 1].beat_end
            );

            if (this.algorithm.b_targeted()) {
                this.create_targets()
            } else {
                this.struct_parse = new StructParse(
                    l.cloneDeep(this.matrix_focus)
                );
                this.initialize_struct_parse();
            }
        }

        private initialize_struct_parse() {

            let note_segment_last = this.segments[this.segments.length - 1].get_note();

            let tree: TreeModel = new TreeModel();

            let note_length_full = tree.parse(
                {
                    id: -1, // TODO: hashing scheme for clip id and beat start
                    note: new n.Note(
                        note_segment_last.model.note.pitch,
                        this.segments[0].get_note().model.note.beat_start,
                        (note_segment_last.model.note.beat_start + note_segment_last.model.note.beats_duration) - this.segments[0].get_note().model.note.beat_start,
                        note_segment_last.model.note.velocity,
                        note_segment_last.model.note.muted
                    ),
                    children: [

                    ]
                }
            );

            this.struct_parse.set_root(
                note_length_full
            );

            if (this.algorithm.get_name() === DERIVE) {
                this.struct_parse.coords_roots = [[-1]];
            }

            // TODO: make the root the length of the entire song

            this.window.add_note_to_clip_root(
                note_length_full
            );

            // set first layer, which are the various key center estimates

            for (let i_segment in this.segments) {

                let segment = this.segments[Number(i_segment)];

                // let logger = new Logger('max');
                //
                // logger.log(JSON.stringify(segment));

                let note = segment.get_note();

                let coord_current_virtual = [0, Number(i_segment)];

                switch (this.algorithm.get_name()) {
                    case DERIVE: {
                        this.struct_parse.add(
                            [note],
                            coord_current_virtual,
                            this.algorithm
                        );
                        break;
                    }
                    case PARSE: {
                        this.struct_parse.set_notes(
                            [note],
                            coord_current_virtual
                        );
                        break;
                    }
                }

                this.window.add_notes_to_clip(
                    [note],
                    coord_current_virtual
                );

                this.history_user_input.add(
                    [note],
                    coord_current_virtual
                );

                this.stream_segment_bounds();
            }

            switch (this.algorithm.get_name()) {
                case PARSE: {

                    // let notes_within_segment = notes_clip.filter(
                    //     node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                    // );

                    // TODO: use 'filter'
                    for (let i_segment in this.segments) {
                        let segment = this.segments[Number(i_segment)];
                        // let notes = this.clip_target.get_notes(
                        //     segment.beat_start,
                        //     0,
                        //     segment.beat_end - segment.beat_start,
                        //     128
                        // );

                        let notes = this.notes_target.filter(
                            node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                        );

                        let coord_current_virtual = [this.algorithm.get_depth() - 1, Number(i_segment)];

                        this.struct_parse.set_notes(
                            notes,
                            coord_current_virtual
                        );
                        this.window.add_notes_to_clip(
                            notes,
                            coord_current_virtual
                        )
                    }
                    break;
                }
                case DERIVE: {
                    //  TODO: anything?
                    break;
                }
                default: {
                    throw ['algorithm of name', this.algorithm.get_name(), 'not supported'].join(' ')
                }
            }
        }

        // now we can assume we have a list instead of a matrix
        private create_targets() {

            // TODO: use 'filter' here
            // this.clip_target.load_notes_within_markers();

            for (let i_segment in this.segments) {
                let segment = this.segments[Number(i_segment)];

                let notes_in_segment = this.notes_target.filter(
                    node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                );

                let sequence_targets = this.algorithm.determine_targets(
                    // this.clip_target.get_notes(
                    //     this.segments[Number(i_segment)].beat_start,
                    //     0,
                    //     this.segments[Number(i_segment)].beat_end - this.segments[Number(i_segment)].beat_start,
                    //     128
                    // )
                    notes_in_segment
                );

                for (let target of sequence_targets) {
                    for (let subtarget of target) {

                        let subtarget_processed = this.algorithm.postprocess_subtarget(
                            subtarget
                        );

                        this.clip_user_input.remove_notes(
                            subtarget_processed.model.note.beat_start,
                            0,
                            subtarget_processed.model.note.get_beat_end(),
                            128
                        );

                        this.clip_user_input.set_notes(
                            [subtarget_processed]
                        )
                    }
                }

                this.matrix_focus[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            }


        }

        public clear_window() {
            this.window.clear()
        }

        public render_window() {
            let notes = [];
            if (this.algorithm.b_targeted()) {
                notes = this.target_current.iterator_subtarget.subtargets.map((subtarget) => {
                    return subtarget.note
                })
            }
            // } else {
            //     // notes = [this.segment_current.get_note()]
            //     notes = []
            // }
            this.window.render(
                this.iterator_matrix_train,
                notes,
                this.algorithm,
                this.struct_parse
            )
        }

        public reset_user_input() {
            if (_.contains([DETECT, PREDICT], this.algorithm.get_name())) {
                let coords = this.iterator_matrix_train.get_coord_current();
                let notes_last = this.matrix_focus[coords[0] - 1][coords[1]].get_notes();
                this.clip_user_input.set_notes(
                    notes_last
                );
            } else {
                return
            }
        }

        // private set_loop() {
        //     let interval = this.segment_current.get_endpoints_loop();
        //
        //     this.clip_user_input.set_endpoints_loop(
        //         interval[0],
        //         interval[1]
        //     )
        // }

        private advance_scene(first_time?: boolean) {
            this.segment_current.scene.fire(true);

            if (first_time) {
                return
            }

            // clip user input synchronous
            let list_path_current_s = this.clip_user_input_synchronous.get_path().split(' ');
            let index_clipslot_current_s = list_path_current_s[list_path_current_s.length - 2];
            let list_path_next_s = list_path_current_s;
            list_path_next_s[list_path_next_s.length - 2] = index_clipslot_current_s + 1;

            this.clip_user_input_synchronous = new Clip(
                new ClipDao(
                    new LiveApiJs(
                        list_path_next_s.join(' ')
                    ),
                    new Messenger('max', 0)
                )
            );

            // clip user input deferred
            let list_path_current = this.clip_user_input.get_path().split(' ');
            let index_clipslot_current = list_path_current[list_path_current.length - 2];
            let list_path_next = list_path_current;
            list_path_next[list_path_next.length - 2] = index_clipslot_current + 1;
            let clip_user_input_next = new Clip(
                new ClipDao(
                    new LiveApiJs(
                        list_path_next.join(' ')
                    ),
                    new Messenger('max', 0),
                    true,
                    'clip_user_input'
                )
            );
            clip_user_input_next.set_path_deferlow('set_path_clip_user_input');

            this.clip_user_input = clip_user_input_next;
        }

        public resume() {
            this.algorithm.post_init()
        }

        public pause() {
            this.algorithm.pre_terminate(this.song, this.clip_user_input)
        }

        public terminate() {
            this.algorithm.pre_terminate(this.song, this.clip_user_input)
        }

        public init(virtual?: boolean) {
            if (this.algorithm.b_targeted()) {
                this.advance_subtarget();
            } else {
                this.advance_segment(true);
            }
            if (!virtual) {
                this.algorithm.post_init(this.song, this.clip_user_input)

            }
        }

        private advance_segment(first_time?: boolean) {

            let obj_next_coord = this.iterator_matrix_train.next();

            if (obj_next_coord.done) {
                switch(this.algorithm.get_name()) {
                    case PARSE: {

                        // make connections with segments
                        for (let i_segment in this.segments) {
                            let segment = this.segments[Number(i_segment)];
                            this.struct_parse.add(
                                [segment.get_note()],
                                [0, Number(i_segment)],
                                this.algorithm
                            );
                        }

                        // make connections with root
                        this.struct_parse.add(
                            [Note.from_note_renderable(this.struct_parse.get_root())],
                            [-1],
                            this.algorithm
                        );
                        break;
                    }
                    case DERIVE: {
                        break;
                    }
                    default: {
                        throw 'error advancing segment'
                    }
                }

                this.algorithm.pre_terminate(this.song, this.clip_user_input);

                return
            }

            let coord = obj_next_coord.value;

            this.segment_current = this.segments[coord[1]];

            // TODO: PLEASE put back in
            // this.advance_scene(first_time);
        }

        private advance_subtarget() {

            let have_not_begun: boolean = (!this.iterator_matrix_train.b_started);

            if (have_not_begun) {
                this.iterator_matrix_train.next();

                this.iterator_target_current = this.matrix_focus[0][0];

                this.iterator_target_current.next();

                this.target_current = this.iterator_target_current.current();

                this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                this.iterator_subtarget_current.next();

                this.subtarget_current = this.iterator_subtarget_current.current();

                this.handle_boundary_change();

                return
            }

            let notes_in_segment_at_time = this.notes_target.filter(
                node => node.model.note.beat_start >= this.segment_current.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= this.segment_current.get_endpoints_loop()[1]
            );

            let targets_at_time: Target[] = this.iterator_target_current.targets;

            let coord_at_time: number[] = this.iterator_matrix_train.get_coord_current();

            let obj_next_subtarget = this.iterator_subtarget_current.next();

            if (obj_next_subtarget.done) {

                let obj_next_target = this.iterator_target_current.next();

                if (obj_next_target.done) {

                    let obj_next_coord = this.iterator_matrix_train.next();

                    // TODO: can we add all notes in segment for predict here?

                    let notes_to_add_to_history = [];

                    if (this.algorithm.get_name() === PREDICT) {
                        notes_to_add_to_history = notes_in_segment_at_time
                    } else {
                        notes_to_add_to_history = targets_at_time
                    }

                    this.history_user_input.add(
                        notes_to_add_to_history,
                        coord_at_time
                    );

                    if (obj_next_coord.done) {
                        // TODO: can we add all notes in segment for predict here?
                        this.history_user_input.add(
                            notes_to_add_to_history,
                            coord_at_time
                        );

                        this.algorithm.pre_terminate();

                        return
                    }

                    let coord_next = obj_next_coord.value;

                    this.iterator_target_current = this.matrix_focus[coord_next[0]][coord_next[1]];

                    this.handle_boundary_change();

                    let obj_next_target_twice_nested = this.iterator_target_current.next();

                    this.target_current = obj_next_target_twice_nested.value;

                    let obj_next_subtarget_twice_nested = this.target_current.iterator_subtarget.next();

                    this.subtarget_current = obj_next_subtarget_twice_nested.value;

                    this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                    return
                }

                this.target_current = obj_next_target.value;

                let obj_next_subtarget_once_nested = this.target_current.iterator_subtarget.next();

                this.subtarget_current = obj_next_subtarget_once_nested.value;

                this.iterator_subtarget_current = this.target_current.iterator_subtarget;

                return
            }

            this.subtarget_current = obj_next_subtarget.value;
        }

        handle_boundary_change() {
            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];

            // TODO: PLEASE put back in
            // this.advance_scene(first_time);

            // if (this.algorithm.b_targeted()) {
            this.stream_subtarget_bounds();
            // } else {
            //     this.stream_segment_bounds();
            // }
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

            // parse/derive logic
            if (!this.algorithm.b_targeted()) {

                this.history_user_input.add(
                    notes_input_user,
                    this.iterator_matrix_train.get_coord_current()
                );

                this.window.add_notes_to_clip(
                    notes_input_user,
                    this.iterator_matrix_train.get_coord_current()
                );

                // TODO: implement
                this.struct_parse.add(
                    notes_input_user,
                    this.iterator_matrix_train.get_coord_current(),
                    this.algorithm
                );

                this.advance_segment();

                this.stream_segment_bounds();

                this.render_window();

                return
            }

            // let logger = new Logger('max');
            //
            // logger.log(JSON.stringify(notes_input_user[0].model.note.pitch));
            // logger.log(JSON.stringify(this.subtarget_current));
            // logger.log('------------');


            // detect/predict logic
            if (utils.remainder(notes_input_user[0].model.note.pitch, 12) === utils.remainder(this.subtarget_current.note.model.note.pitch, 12)) {

                this.window.add_notes_to_clip(
                    [this.subtarget_current.note],
                    this.iterator_matrix_train.get_coord_current()
                );

                if (this.algorithm.b_targeted()) {
                    // set the targets and shit
                }

                this.advance_subtarget();

                this.stream_subtarget_bounds();

                this.render_window();
            }
        }

        stream_subtarget_bounds() {
            let ratio_bound_lower = (this.subtarget_current.note.model.note.beat_start - this.segment_current.get_endpoints_loop()[0])/(this.segment_current.get_endpoints_loop()[1] - this.segment_current.get_endpoints_loop()[0]);
            let ratio_bound_upper = (this.subtarget_current.note.model.note.get_beat_end() - this.segment_current.get_endpoints_loop()[0])/(this.segment_current.get_endpoints_loop()[1] - this.segment_current.get_endpoints_loop()[0]);
            this.messenger.message(['bounds', ratio_bound_lower, ratio_bound_upper])
        }

        stream_segment_bounds() {
            this.messenger.message(['bounds', 0, 1])
        }
    }
}