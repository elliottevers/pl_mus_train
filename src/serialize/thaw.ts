import {file} from "../io/file";
import TreeModel = require("tree-model");
import {serialize} from "./serialize";
import {note} from "../music/note";
import {history} from "../history/history";
import {live} from "../live/live";

export namespace thaw {
    import from_json = file.from_json;
    import deserialize_note = serialize.deserialize_note;
    import Note = note.Note;
    import HistoryUserInput = history.HistoryUserInput;
    import Env = live.Env;

    export class TrainThawer {

        public static recover_history_user_input(
            filepath: string,
            env: Env,
            history_user_input: HistoryUserInput
        ): HistoryUserInput {

            let matrix = TrainThawer.thaw_notes_matrix(filepath, env);

            for (let key_row of Object.keys(matrix)) {
                let col = matrix[key_row];
                for (let key_col of Object.keys(col)) {
                    for (let note_deserialized of matrix[key_row][key_col]) {
                        history_user_input.concat([note_deserialized], [Number(key_row), Number(key_col)])
                    }

                }
            }

            return history_user_input
        }

        public static thaw_notes(filepath: string, env: Env): TreeModel.Node<Note>[] {
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

        public static thaw_notes_matrix(filepath: string, env: Env) {
            let matrix_deserialized = from_json(filepath, env);

            let matrix_notes = matrix_deserialized;

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