import {note, note as n} from "../music/note";
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

        concat(struct: TreeModel.Node<Note>[], coord: number[]) {
            this.matrix_data[coord[0]][coord[1]] = this.matrix_data[coord[0]][coord[1]].concat(struct);
        }

        get(coord: number[]): any {
            return this.matrix_data[coord[0]][coord[1]];
        }
    }
}