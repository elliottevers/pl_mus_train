import {note, note as n} from "../note/note";
import TreeModel = require("tree-model");

export namespace history {
    import Note = note.Note;

    export type TypeSubtarget = TreeModel.Node<n.Note>;

    export type TypeTarget = TypeSubtarget[]

    export type TypeSequenceTarget = TypeTarget[]

    export class HistoryUserInput {
        matrix_data: TreeModel.Node<Note>[][][];

        constructor(matrix) {
            this.matrix_data = matrix;
        }

        // TODO: does this only work for parsing/deriving?
        add(struct: any, coord: number[]) {
            this.matrix_data[coord[0]][coord[1]] = struct;
        }

        get(coord: number[]): any {
            return this.matrix_data[coord[0]][coord[1]];
        }
    }
}