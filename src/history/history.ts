import {note, note as n} from "../note/note";
import {log} from "../log/logger";
import TreeModel = require("tree-model");
import {utils} from "../utils/utils";
import {serialize} from "../serialize/serialize";
import {algorithm} from "../train/algorithm";
import {target} from "../target/target";
import {trainer} from "../train/trainer";

export namespace history {

    import serialize_target_sequence = serialize.serialize_target_sequence;
    import deserialize_target_sequence = serialize.deserialize_target_sequence;
    import DETECT = algorithm.DETECT;
    import PREDICT = algorithm.PREDICT;
    import PARSE = algorithm.PARSE;
    import DERIVE = algorithm.DERIVE;
    import Subtarget = target.Subtarget;
    import MatrixIterator = trainer.MatrixIterator;
    import Target = target.Target;
    import Note = note.Note;

    export type TypeSubtarget = TreeModel.Node<n.Note>;

    export type TypeTarget = TypeSubtarget[]

    export type TypeSequenceNote = TreeModel.Node<n.Note>[];

    export type TypeSequenceTarget = TypeTarget[]

    // export class SequenceTarget {
    //     data: TypeSequenceTarget;
    //
    //     constructor() {
    //
    //     }
    //
    //     get_subtargets() {
    //
    //     }
    // }

    export class FactoryHistoryUserInput {
        public static create_history_user_input(algorithm, segments) {
            switch (algorithm.get_name()) {
                case DETECT: {
                    return new TargetHistory();
                }
                case PREDICT: {
                    return new TargetHistory();
                }
                case PARSE: {
                    return new PhaseHistory();
                }
                case DERIVE: {
                    return new PhaseHistory();
                }
                default: {
                    throw 'factory history user input'
                }
            }
        }
    }

    export interface HistoryUserInput {
        set_matrix(matrix): void;
        add(struct, coord): void;
        // get(coord);
    }

    export class PhaseHistory implements HistoryUserInput {
        matrix_notes: TreeModel.Node<Note>[][][];

        constructor() {

        }

        set_matrix(matrix) {
            this.matrix_notes = matrix
        }

        add(notes: TreeModel.Node<Note>[], coord: number[]) {
            this.matrix_notes[coord[0]][coord[1]] = notes;
        }

        get(coord: number[]): TreeModel.Node<n.Note>[] {
            return this.matrix_notes[coord[0]][coord[1]];
        }
    }

    export class TargetHistory implements HistoryUserInput {

        matrix_data: Target[][][];

        // constructor(algorithm, segments) {
        //     let matrix_data = [];
        //     for (let i=0; i < 1; i++) {
        //         matrix_data[i] = new Array(segments.length);
        //     }
        //     this.matrix_data = matrix_data;
        // }

        constructor() {

        }

        set_matrix(matrix) {
            this.matrix_data = matrix
        }

        // set_sequence_target(sequence_target: TypeSequenceTarget, coord_matrix: number[]) {
        //     this.matrix_data[coord_matrix[0]][coord_matrix[1]] = sequence_target;
        // }
        //
        // get_sequence_target(i_height, i_width): TypeSequenceTarget {
        //     return this.matrix_data[i_height][i_width]
        // }

        // add_subtarget(subtarget: Subtarget, iterator_matrix_train: MatrixIterator) {
        //     let coord = iterator_matrix_train.get_coord_current();
        //     this.matrix_data[coord[0]][coord[1]] = subtarget.note
        // }

        add(target_sequence: Target[], coord: number[]) {
            this.matrix_data[coord[0]][coord[1]] = target_sequence;
        }
    }
}