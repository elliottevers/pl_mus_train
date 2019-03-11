import {note as n} from "../note/note";
import TreeModel = require("tree-model");
// import {parse_matrix, pwindow} from "../scripts/parse_tree";
import {algorithm, algorithm as algo} from "./algorithm";
import {history} from "../history/history";
import {target} from "../target/target";
import {segment} from "../segment/segment";
import {parse} from "../parse/parse";
import {utils} from "../utils/utils";
import {window} from "../render/window";
import {message} from "../message/messenger";
import {song} from "../song/song";
import {clip} from "../clip/clip";
const _ = require('underscore');
const l = require('lodash');

export namespace trainer {

    // import Targetable = train.algorithm.Targetable;
    import HistoryUserInput = history.HistoryUserInput;
    // import TargetType = target.TargetType;
    import TargetIterator = target.TargetIterator;
    // import MatrixIterator = history.MatrixIterator;
    import Segment = segment.Segment;
    // import ParseTree = parse.ParseTree;
    import Algorithm = algorithm.Algorithm;
    import division_int = utils.division_int;
    import remainder = utils.remainder;
    import PARSE = algorithm.PARSE;
    import DERIVE = algorithm.DERIVE;
    import DETECT = algorithm.DETECT;
    import PREDICT = algorithm.PREDICT;
    import Parse = algorithm.Parse;
    import Renderable = window.Renderable;
    import TreeRenderable = window.TreeRenderable;
    import Subtarget = target.Subtarget;
    import Target = target.Target;
    import Messenger = message.Messenger;
    import Song = song.Song;
    import Clip = clip.Clip;
    import FactoryHistoryUserInput = history.FactoryHistoryUserInput;
    import SubtargetIterator = target.SubtargetIterator;
    import ParseMatrix = parse.ParseMatrix;

    export class MatrixIterator {
        private num_rows: number;
        private num_columns: number;

        private row_current: number;
        private column_current: number;

        private downward: boolean;
        private rightward: boolean;

        private i;

        constructor(num_rows: number, num_columns: number, downward?: boolean, rightward?: boolean) {
            this.num_rows = num_rows;
            this.num_columns = num_columns;

            this.downward = downward ? downward : true;
            this.rightward = rightward ? rightward : true;

            if (this.downward && this.rightward) {
                this.i = -1;
            } else if (!this.downward && this.rightward) {
                this.i = this.num_columns * this.num_rows + 1 - this.num_columns
            } else if (this.downward && !this.rightward) {
                this.i = -1 + this.num_columns
            } else if (!this.downward && !this.rightward) {
                this.i = this.num_columns * this.num_rows + 1
            } else {
                throw 'matrix iterator'
            }
        }

        private next_row() {
            if (this.downward && this.rightward) {
                this.i = this.i + this.num_columns;
            } else if (!this.downward && this.rightward) {
                this.i = this.i - 3;
            } else if (this.downward && !this.rightward) {
                this.i = this.i + 3;
            } else if (!this.downward && !this.rightward) {
                this.i = this.i - this.num_columns;
            } else {
                throw 'matrix iterator'
            }
        }

        private next_column() {
            if (this.downward && this.rightward) {
                this.i++;
            } else if (!this.downward && this.rightward) {
                if (remainder(this.i + 1, this.num_rows) === 0) {
                    this.i = this.i - (this.num_columns - 1) - this.num_columns
                } else {
                    this.i++
                }
            } else if (this.downward && !this.rightward) {
                if (remainder(this.i + 1, this.num_rows) === 0) {
                    this.i = this.i + (this.num_columns - 1) + this.num_columns
                } else {
                    this.i--
                }
            } else if (!this.downward && !this.rightward) {
                this.i--;
            } else {
                throw 'matrix iterator'
            }
        }

        private get_index_done(): number {
            if (this.downward && this.rightward) {
                return this.num_columns * this.num_rows
            } else if (!this.downward && this.rightward) {
                return -1 * this.num_rows
            } else if (this.downward && !this.rightward) {
                return this.num_columns * this.num_rows - 1 + this.num_rows
            } else if (!this.downward && !this.rightward) {
                return -1
            } else {
                throw 'matrix iterator'
            }
        }

        public next() {

            let value: number[] = null;

            this.next_column();

            if (this.i === this.get_index_done()) {
                return {
                    value: value,
                    done: true
                }
            }

            return {
                value: this.get_coord_current(),
                done: false
            };
        }

        public get_coord_current(): number[] {
            return MatrixIterator.get_coord(this.get_state_current() + 1, this.num_columns)
        }

        public get_state_current(): number {
            return this.i;
        }

        public static get_coord(i, num_columns): number[] {
            let pos_row = division_int(i, num_columns);
            let pos_column = remainder(i, num_columns);
            return [pos_row, pos_column]
        }
    }

    class FactoryMatrixTargetIterator {
        public static get_iterator_target(algorithm: Algorithm, segments: Segment[]): any[][] {
            let matrix_data = [];
            switch(algorithm.get_name()) {
                case algo.DETECT || algo.PREDICT: {
                    for (let i=0; i < 1; i++) {
                        matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                case algo.PARSE || algo.DERIVE: {
                    for (let i=0; i < algorithm.get_depth(); i++) {
                        if (i == 0) {
                            matrix_data[i] = new Array(1); // root of tree
                        } else {
                            matrix_data[i] = new Array(segments.length);
                        }
                    }
                    break;
                }
                default: {
                    throw 'case not considered';
                }
            }
            return matrix_data;
        }
    }

    class IteratorTrainFactory {
        public static get_iterator_train(algorithm: Algorithm, segments: Segment[]) {

            let iterator: MatrixIterator;

            let downward, rightward;

            switch (algorithm.get_name()) {
                case algo.DETECT: {
                    iterator = new MatrixIterator(1, segments.length);
                    break;
                }
                case algo.PREDICT: {
                    iterator = new MatrixIterator(1, segments.length);
                    break;
                }
                case algo.PARSE: {
                    downward = false;
                    rightward = true;
                    iterator = new MatrixIterator(algorithm.get_depth() + 1, segments.length, downward, rightward);
                    break;
                }
                case algo.DERIVE: {
                    iterator = new MatrixIterator(algorithm.get_depth() + 1, segments.length);
                    break;
                }
                default: {
                    throw ['algorithm of name', algorithm.get_name(), 'not supported'].join(' ')
                }
            }
            return iterator
        }
    }

    export class Trainer {

        private window;
        private algorithm; // TODO: type
        private clip_user_input: Clip;
        private clip_target: Clip;
        private song: Song;
        private segments: Segment[];
        private messenger: Messenger;

        // private list_parse_tree: ParseTree[];
        private parse_matrix: ParseMatrix;
        public history_user_input;

        private counter_user_input: number;
        private limit_user_input: number;
        private limit_input_reached: boolean;

        private segment_current: Segment;
        private target_current: Target;
        private subtarget_current: Subtarget;

        private matrix_target_iterator: TargetIterator[][];
        private iterator_target_current: TargetIterator;

        private iterator_matrix_train: MatrixIterator;

        private iterator_subtarget_current: SubtargetIterator;

        constructor(window, user_input_handler, algorithm, clip_user_input, clip_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_target = clip_target;
            this.song = song;
            this.segments = segments;
            this.messenger = messenger;

            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(
                this.algorithm,
                this.segments
            );

            this.matrix_target_iterator = FactoryMatrixTargetIterator.get_iterator_target(
                this.algorithm,
                this.segments
            );

            this.history_user_input = FactoryHistoryUserInput.create_history_user_input(
                this.algorithm,
                this.segments
            );

            this.history_user_input.set_matrix(
                l.cloneDeep(this.matrix_target_iterator)
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
                this.parse_matrix = new ParseMatrix(
                    l.cloneDeep(this.matrix_target_iterator)
                );
                this.initialize_parse_matrix();
            }
        }

        // TODO: everytime we add a note, call next() on matrix iterator
        private initialize_parse_matrix() {

            // set root
            let coord_root = [0, 0];

            let note_root = this.segments[0].get_note();

            this.parse_matrix.matrix_note_sequence[coord_root[0]][coord_root[1]] = [note_root];

            // initialize
            this.iterator_matrix_train.next();

            // set first layer, which are the various key center estimates

            for (let i_segment of this.segments) {
                let segment = this.segments[Number(i_segment)];
                this.parse_matrix.matrix_note_sequence[1][Number(i_segment)] = [segment.get_note()];
                this.iterator_matrix_train.next();
            }

            switch (this.algorithm.get_name()) {
                case PARSE: {
                    for (let i_segment of this.segments) {
                        let segment = this.segments[Number(i_segment)];
                        let notes = this.clip_user_input.get_notes(
                            segment.beat_start,
                            0,
                            segment.beat_end - segment.beat_start,
                            128
                        );
                        this.parse_matrix.matrix_note_sequence[this.algorithm.get_depth()][Number(i_segment)] = notes
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

            this.clip_target.load_notes_within_markers();

            for (let i_segment in this.segments) {
                let sequence_targets = this.algorithm.determine_targets(
                    this.clip_target.get_notes(
                        this.segments[Number(i_segment)].beat_start,
                        0,
                        this.segments[Number(i_segment)].beat_end - this.segments[Number(i_segment)].beat_start,
                        128
                    )
                );
                this.matrix_target_iterator[0][Number(i_segment)] = TargetIterator.from_sequence_target(sequence_targets);
            }
        }

        public clear_window() {
            this.window.clear()
        }

        public render_window() {
            this.window.render(
                this.iterator_matrix_train,
                this.matrix_target_iterator,
                this.history_user_input,
                this.algorithm,
                this.parse_matrix
            )
        }

        public reset_user_input() {
            if (_.contains([DETECT, PREDICT], this.algorithm.get_name())) {
                let coords = this.iterator_matrix_train.get_coord_current();
                let notes_last = this.matrix_target_iterator[coords[0] - 1][coords[1]].get_notes();
                this.clip_user_input.set_notes(
                    notes_last
                );
            } else {
                return
            }
        }

        private set_loop() {
            let interval = this.segment_current.get_endpoints_loop();

            this.clip_user_input.set_endpoints_loop(
                interval[0],
                interval[1]
            )
        }

        public resume() {
            this.algorithm.post_init()
        }

        public pause() {
            this.algorithm.pre_terminate()
        }

        public terminate() {
            this.algorithm.pre_terminate()
        }

        public init() {
            if (this.algorithm.b_targeted()) {
                this.advance_subtarget();
            } else {
                this.advance_segment();
            }
            this.algorithm.post_init(this.song, this.clip_user_input)
        }

        private advance_segment() {
            // TODO:
            let obj_next_coord = this.iterator_matrix_train.next();

            if (obj_next_coord.done) {
                this.algorithm.terminate()
            }

            let coord = obj_next_coord.value;

            this.segment_current = this.segments[coord[1]];
        }

        private advance_subtarget() {

            let possibly_history: Target[] = this.iterator_target_current.targets;

            let coord_at_time: number[] = this.iterator_matrix_train.get_coord_current();

            let obj_next_subtarget = this.iterator_subtarget_current.next();

            if (obj_next_subtarget.done) {

                let obj_next_target = this.iterator_target_current.next();

                if (obj_next_target.done) {

                    let obj_next_coord = this.iterator_matrix_train.next();

                    this.history_user_input.add_sequence_target(
                        possibly_history,
                        coord_at_time
                    );

                    if (obj_next_coord.done) {
                        this.history_user_input.add_sequence_target(
                            possibly_history,
                            coord_at_time
                        );

                        // this.window.add(
                        //     this.matrix_target_iterator[coord_current[0]][coord_current[1]].get_notes(),
                        //     coord_current,
                        //     this.segment_current
                        // );

                        this.algorithm.pre_terminate();

                        return
                    }

                    let coord_next = obj_next_coord.value;

                    this.iterator_target_current = this.matrix_target_iterator[coord_next[0]][coord_next[1]];

                    this.segment_current = this.segments[coord_next[1]];

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

        // user input can be either 1) a pitch or 2) a sequence of notes
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

                // TODO: implement
                this.parse_matrix.add(
                    notes_input_user,
                    this.parse_matrix,
                    this.iterator_matrix_train
                );

                this.advance_segment();

                this.render_window();

                return
            }

            // detect/predict logic
            // NB: assumes we're only giving list of a single note as input
            if (notes_input_user[0].model.note.pitch === this.subtarget_current.note.model.note.pitch) {

                this.window.add_note_to_clip(
                    this.subtarget_current.note,
                    this.iterator_matrix_train.get_coord_current()
                );

                if (this.algorithm.b_targeted()) {
                    // set the targets and shit
                }

                this.advance_subtarget();

                this.set_loop();

                // this.render_window();
            }
        }
    }
}