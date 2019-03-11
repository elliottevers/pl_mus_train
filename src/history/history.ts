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

    // export class FactoryHistoryUserInput {
    //     public static create_history_user_input(algorithm, matrix_target_iterator) {
    //         switch (algorithm.get_name()) {
    //             case DETECT: {
    //                 return new TargetHistory(matrix_target_iterator);
    //             }
    //             case PREDICT: {
    //                 return new TargetHistory(matrix_target_iterator);
    //             }
    //             case PARSE: {
    //                 return new PhaseHistory(matrix_target_iterator);
    //             }
    //             case DERIVE: {
    //                 return new PhaseHistory(matrix_target_iterator);
    //             }
    //             default: {
    //                 throw 'factory history user input'
    //             }
    //         }
    //     }
    // }

    export class HistoryUserInput {
        matrix_data: TreeModel.Node<Note>[][][];

        constructor(matrix) {
            this.matrix_data = matrix;
        }

        add(struct: any, coord: number[]) {
            this.matrix_data[coord[0]][coord[1]] = struct;
        }

        get(coord: number[]): any {
            return this.matrix_data[coord[0]][coord[1]];
        }
    }

    // export class PhaseHistory implements HistoryUserInput {
    //     matrix_data: TreeModel.Node<Note>[][][];
    //
    //     constructor(matrix) {
    //         this.matrix_data = matrix;
    //     }
    //
    //     add(notes: TreeModel.Node<Note>[], coord: number[]) {
    //         this.matrix_data[coord[0]][coord[1]] = notes;
    //     }
    //
    //     get(coord: number[]): TreeModel.Node<n.Note>[] {
    //         return this.matrix_data[coord[0]][coord[1]];
    //     }
    // }
    //
    // export class TargetHistory implements HistoryUserInput {
    //
    //     matrix_data: Target[][][];
    //
    //     constructor(matrix) {
    //         this.matrix_data = matrix
    //     }
    //
    //     add(target_sequence: Target[], coord: number[]) {
    //         this.matrix_data[coord[0]][coord[1]] = target_sequence;
    //     }
    //
    //     get(coord: number[]) {
    //         return this.matrix_data[coord[0]][coord[1]];
    //     }
    // }
}