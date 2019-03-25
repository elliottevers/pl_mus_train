import {algorithm, algorithm as algo} from "./algorithm";
import {utils} from "../utils/utils";
import {segment} from "../segment/segment";

export namespace iterate {
    import division_int = utils.division_int;
    import remainder = utils.remainder;
    // import Algorithm = algorithm.Algorithm;
    import Segment = segment.Segment;
    import Trainable = algorithm.Trainable;

    export class MatrixIterator {

        private num_rows: number;
        private num_columns: number;

        private downward: boolean;
        private rightward: boolean;

        private index_row_start: number;
        private index_row_stop: number;

        private i;
        private index_start;
        private index_stop;

        private history: number[];
        public done: boolean;
        public b_started: boolean;

        constructor(num_rows: number, num_columns: number, downward?: boolean, rightward?: boolean, start_at_row?: number, stop_at_row?: number) {
            this.num_rows = num_rows;
            this.num_columns = num_columns;

            this.downward = (downward == null) ? true : downward;
            this.rightward = (rightward == null) ? true : rightward;

            this.index_row_start = start_at_row;
            this.index_row_stop = stop_at_row;

            this.determine_index_start();
            this.determine_index_stop();

            this.i = this.index_start ? this.index_start : -1;
            this.history = [];
            this.done = false;
            this.b_started = false;
        }

        private determine_index_start() {

            let i_start;

            if (this.downward && this.rightward) {
                i_start = -1 + (this.num_columns * this.index_row_start)
            } else if (!this.downward && this.rightward) {
                i_start = (this.num_columns * (this.index_row_start + 2)) - 1 - this.num_columns
            } else if (this.downward && !this.rightward) {
                throw 'not yet supported'
            }
            else if (!this.downward && !this.rightward) {
                throw 'not yet supported'
            }
            else {
                throw 'not yet supported'
            }

            this.index_start = i_start;
        }

        private determine_index_stop() {

            let i_stop;

            if (this.downward && this.rightward) {
                i_stop = this.index_row_stop * this.num_columns
            } else if (!this.downward && this.rightward) {
                i_stop = (this.index_row_stop - 1) * this.num_columns
            } else if (this.downward && !this.rightward) {
                throw 'not yet supported'
            }
            else if (!this.downward && !this.rightward) {
                throw 'not yet supported'
            }
            else {
                throw 'not yet supported'
            }

            this.index_stop = i_stop;
        }

        private next_column() {
            if (this.downward && this.rightward) {
                this.i++;
            } else if (!this.downward && this.rightward) {
                if (remainder(this.i + 1, this.num_columns) === 0) {
                    this.i = this.i - (this.num_columns - 1) - this.num_columns
                } else {
                    this.i++
                }
            } else if (this.downward && !this.rightward) {
                // if (remainder(this.i + 1, this.num_rows) === 0) {
                //     this.i = this.i + (this.num_columns - 1) + this.num_columns
                // } else {
                //     this.i--
                // }
                throw 'not yet supported'
            } else if (!this.downward && !this.rightward) {
                // this.i--;
                throw 'not yet supported'
            } else {
                throw 'not yet supported'
            }
        }

        add_history(i): void {
            this.history.push(i)
        }

        get_history(): number[] {
            return this.history
        }

        public next() {

            this.b_started = true;

            let value: number[] = null;

            this.next_column();

            this.add_history(this.i);

            if (this.i === this.index_stop) {
                this.done = true;
                return {
                    value: value,
                    done: this.done
                }
            }

            return {
                value: this.get_coord_current(),
                done: false
            };
        }

        public get_coord_current(): number[] {
            return MatrixIterator.get_coord(this.get_state_current(), this.num_columns)
        }

        public get_state_current(): number {
            return this.i;
        }

        public static get_coord(i, num_columns): number[] {
            let pos_row = division_int(i, num_columns);
            let pos_column = remainder(i, num_columns);
            return [pos_row, pos_column]
        }

        public static get_coords_above(coord): number[][] {
            if (coord[0] === 0) {
                return [[-1]]
            } else {
                return [[coord[0] - 1, coord[1]]]
            }
            // return [[coord[0] - 1, coord[1]]]
        }

        public static get_coords_below(coord): number[][] {
            return [[coord[0] + 1, coord[1]]]
        }
    }

    export class FactoryMatrixObjectives {
        public static create_matrix_objectives(trainable: Trainable, segments: Segment[]): any[][] {

            let matrix_data = [];

            switch(trainable.get_name()) {
                case algo.DETECT: {
                    for (let i=0; i < 1; i++) {
                        matrix_data.push([]);
                        for (let i_segment in segments) {
                            matrix_data[i][Number(i_segment)] = []
                        }
                    }
                    break;
                }
                case algo.PREDICT: {
                    for (let i=0; i < 1; i++) {
                        matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                case algo.PARSE: {
                    for (let i=0; i < trainable.get_depth(); i++) {
                        matrix_data[i] = new Array(segments.length);
                    }
                    break;
                }
                case algo.DERIVE: {
                    for (let i=0; i < trainable.get_depth(); i++) {
                        matrix_data.push([]);
                        for (let i_segment in segments) {
                            matrix_data[i][Number(i_segment)] = []
                        }
                    }
                    // for (let i=0; i < trainable.get_depth(); i++) {
                    //     matrix_data[i] = new Array(segments.length);
                    // }
                    break;
                }
                default: {
                    throw 'case not considered';
                }
            }
            return matrix_data;
        }
    }

    export class IteratorTrainFactory {
        public static get_iterator_train(trainable: Trainable, segments: Segment[]) {

            let iterator: MatrixIterator;

            let downward, rightward;

            switch (trainable.get_name()) {
                case algo.DETECT: {
                    iterator = new MatrixIterator(
                        1,
                        segments.length,
                        true,
                        true,
                        0,
                        1
                    );
                    break;
                }
                case algo.PREDICT: {
                    iterator = new MatrixIterator(1, segments.length);
                    break;
                }
                case algo.PARSE: {
                    downward = false;
                    rightward = true;
                    let index_row_start = trainable.get_depth() - 1;
                    let index_row_stop = 1;
                    iterator = new MatrixIterator(
                        trainable.get_depth(),
                        segments.length,
                        downward,
                        rightward,
                        index_row_start,
                        index_row_stop
                    );
                    break;
                }
                case algo.DERIVE: {
                    downward = true;
                    rightward = true;
                    let index_row_start = 1;
                    let index_row_stop = trainable.get_depth();
                    iterator = new MatrixIterator(
                        trainable.get_depth(),
                        segments.length,
                        downward,
                        rightward,
                        index_row_start,
                        index_row_stop
                    );
                    break;
                }
                default: {
                    throw ['algorithm of name', trainable.get_name(), 'not supported'].join(' ')
                }
            }
            return iterator
        }
    }
}