import {file} from "../io/file";
import TreeModel = require("tree-model");
import {serialize} from "./serialize";
import {note} from "../note/note";
import {log} from "../log/logger";

export namespace thaw {
    import from_json = file.from_json;
    import deserialize_note = serialize.deserialize_note;
    import Note = note.Note;
    import Logger = log.Logger;

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

            let logger = new Logger('max');

            // TODO: this is only valid for forward iteration
            for (let i_row in matrix_deserialized) {
                let row = matrix_deserialized[Number(i_row)];
                for (let i_col in row) {
                    let col = matrix_deserialized[Number(i_row)][Number(i_col)];

                    if (typeof col === 'string') {
                        col = [col]
                    }

                    if (col === null) {
                        matrix_notes[Number(i_row)][Number(i_col)] = [];
                        continue;
                    }

                    let logger = new Logger('max');

                    logger.log(col);

                    let notes = [];

                    // logger.log(col);

                    // for (let note_serialized of col) {
                    //     notes.push(deserialize_note(note_serialized))
                    // }

                    for (let note_serialized of col) {
                        notes.push(deserialize_note(note_serialized))
                    }

                    // notes.push(deserialize_note(col));

                    matrix_notes[Number(i_row)][Number(i_col)] = notes
                }
            }

            return matrix_notes
        }
    }
}