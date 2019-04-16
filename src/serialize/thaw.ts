import {file} from "../io/file";
import TreeModel = require("tree-model");
import {serialize} from "./serialize";
import {note} from "../note/note";

export namespace thaw {
    import from_json = file.from_json;
    import deserialize_note = serialize.deserialize_note;
    import Note = note.Note;

    export class TrainThawer {

        public static thaw_notes(filepath: string, env: string): TreeModel.Node<Note>[] {
            let notes = [];
            // TODO: this is only valid for forward iteration
            let matrix = TrainThawer.thaw_notes_matrix(filepath, env);
            for (let key_row of Object.keys(matrix)) {
                let col = matrix[key_row];
                for (let key_col of Object.keys(col)) {
                    for (let note_deserialized of matrix[key_row][key_col]) {
                        notes.push(note_deserialized)
                    }

                }
            }

            return notes
        }

        public static thaw_notes_matrix(filepath: string, env: string) {
            let matrix_deserialized = from_json(filepath, env);

            let matrix_notes = matrix_deserialized;

            // TODO: this is only valid for forward iteration
            for (let i_row in matrix_deserialized) {
                let row = matrix_deserialized[Number(i_row)];
                for (let i_col in row) {
                    let col = matrix_deserialized[Number(i_row)][Number(i_col)];
                    if (col === null) {
                        matrix_notes[Number(i_row)][Number(i_col)] = [];
                        continue;
                    }

                    let notes = [];

                    for (let note_serialized of col) {
                        notes.push(deserialize_note(note_serialized))
                    }

                    matrix_notes[Number(i_row)][Number(i_col)] = notes
                }
            }

            return matrix_notes
        }
    }
}