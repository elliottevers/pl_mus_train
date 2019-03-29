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
            // let matrix_deserialized = from_json(filepath, env);

            let notes = [];
            // TODO: this is only valid for forward iteration
            for (let row of TrainThawer.thaw_notes_matrix(filepath, env)) {
                for (let col of row) {
                    if (col === null) {
                        continue;
                    }
                    for (let note_deserialized of col) {
                        notes.push(note_deserialized)
                    }
                }
            }

            return notes
        }

        public static thaw_notes_matrix(filepath: string, env: string) {
            let matrix_deserialized = from_json(filepath, env);

            let matrix_test = matrix_deserialized;

            // TODO: this is only valid for forward iteration
            for (let i_row in matrix_deserialized) {
                let row = matrix_deserialized[Number(i_row)];
                for (let i_col in row) {
                    let col = matrix_deserialized[Number(i_row)][Number(i_col)];
                    if (col === null) {
                        matrix_test[Number(i_row)][Number(i_col)] = [];
                        continue;
                    }

                    let notes = [];

                    for (let note_serialized of col) {
                        notes.push(deserialize_note(note_serialized))
                    }

                    matrix_test[Number(i_row)][Number(i_col)] = notes
                }
            }

            return matrix_test
        }

        // public thaw(filepath: string, config): Trainer {
        //
        //     let trainer;
        //
        //     let matrix_deserialized = from_json(filepath, config['env']);
        //
        //     let logger = new Logger(config['env']);
        //
        //     logger.log(JSON.stringify(matrix_deserialized));
        //
        //     trainer =  new Trainer(
        //         config['window'],
        //         config['user_input_handler'],
        //         config['trainable'],
        //         config['track_target'],
        //         config['track_user_input'],
        //         config['song'],
        //         config['segments'],
        //         config['messenger'],
        //         true
        //     );
        //
        //     trainer.advance(
        //
        //     );
        //
        //     switch (config['trainable'].get_name()) {
        //         case DETECT: {
        //             let notes = [];
        //             // TODO: this is only valid for forward iteration
        //             for (let row of matrix_deserialized) {
        //                 for (let col of row) {
        //                     if (col === null) {
        //                         continue;
        //                     }
        //                     for (let note_serialized of col) {
        //                         notes.push(deserialize_note(note_serialized))
        //                     }
        //                 }
        //             }
        //
        //             let notes_parsed = notes;
        //
        //             let tree: TreeModel = new TreeModel();
        //
        //             for (let note_parsed of notes_parsed) {
        //                 let note_recovered = tree.parse(
        //                     {
        //                         id: -1, // TODO: hashing scheme for clip id and beat start
        //                         note: new Note(
        //                             note_parsed.model.note.pitch,
        //                             note_parsed.model.note.beat_start,
        //                             note_parsed.model.note.beats_duration,
        //                             note_parsed.model.note.velocity,
        //                             note_parsed.model.note.muted
        //                         ),
        //                         children: [
        //
        //                         ]
        //                     }
        //                 );
        //                 trainer.accept_input(
        //                     [note_recovered]
        //                 );
        //             }
        //
        //             // trainer.pause();
        //
        //             break;
        //         }
        //         case PREDICT: {
        //             break;
        //         }
        //         case PARSE: {
        //             let input_left = true;
        //
        //             while (input_left) {
        //                 let coord_current = trainer.iterator_matrix_train.get_coord_current();
        //                 trainer.accept_input(
        //                     matrix_deserialized[coord_current[0]][coord_current[1]].map((note_serialized) => {
        //                         return deserialize_note(note_serialized)
        //                     })
        //                 );
        //
        //                 if (trainer.iterator_matrix_train.done) {
        //                     input_left = false;
        //                 }
        //             }
        //
        //             // trainer.pause();
        //
        //             break;
        //         }
        //         // go until we find a segment without user input
        //         case DERIVE: {
        //             let input_left = true;
        //
        //             while (input_left) {
        //
        //                 let coord_current = trainer.iterator_matrix_train.get_coord_current();
        //
        //                 if (matrix_deserialized[coord_current[0]][coord_current[1]].length === 0) {
        //                     input_left = false;
        //                     continue
        //                 }
        //
        //                 trainer.accept_input(
        //                     matrix_deserialized[coord_current[0]][coord_current[1]]
        //                 );
        //             }
        //
        //             // trainer.pause();
        //
        //             break;
        //         }
        //     }
        //
        //     trainer.virtualized = false;
        //
        //     return trainer;
        // }
    }
}