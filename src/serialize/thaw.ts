import {trainer} from "../train/trainer";
import {file} from "../io/file";
import {algorithm} from "../train/algorithm";
import TreeModel = require("tree-model");
import {serialize} from "./serialize";
import {note} from "../note/note";

export namespace thaw {
    import Trainer = trainer.Trainer;
    import from_json = file.from_json;
    import DETECT = algorithm.DETECT;
    import PREDICT = algorithm.PREDICT;
    import PARSE = algorithm.PARSE;
    import deserialize_note = serialize.deserialize_note;
    import Note = note.Note;
    import DERIVE = algorithm.DERIVE;

    export class TrainThawer {
        env: string;

        constructor(env: string) {
            this.env = env;
        }

        public thaw(filepath: string, config): Trainer {

            let trainer;

            let matrix_deserialized = from_json(filepath, config['env']);

            trainer =  new Trainer(
                config['window'],
                config['user_input_handler'],
                config['trainable'],
                config['track_target'],
                config['track_user_input'],
                config['song'],
                config['segments'],
                config['messenger']
            );

            trainer.commence(
                // true
            );

            switch (config['trainable'].get_name()) {
                case DETECT: {
                    let notes = [];
                    // TODO: this is only valid for forward iteration
                    for (let row of matrix_deserialized) {
                        for (let col of row) {
                            if (col === null) {
                                continue;
                            }
                            // for (let sequence_target of col) {
                            //     for (let note of sequence_target.iterator_subtarget.subtargets) {
                            //         notes.push(note)
                            //     }
                            // }
                            for (let note_serialized of col) {
                                notes.push(deserialize_note(note_serialized))
                            }
                        }
                    }
                    // let notes_parsed = notes.map((obj)=>{return JSON.parse(obj.note)});
                    let notes_parsed = notes;

                    let tree: TreeModel = new TreeModel();

                    for (let note_parsed of notes_parsed) {
                        let note_recovered = tree.parse(
                            {
                                id: -1, // TODO: hashing scheme for clip id and beat start
                                note: new Note(
                                    note_parsed.model.note.pitch,
                                    note_parsed.model.note.beat_start,
                                    note_parsed.model.note.beats_duration,
                                    note_parsed.model.note.velocity,
                                    note_parsed.model.note.muted
                                ),
                                children: [

                                ]
                            }
                        );
                        trainer.accept_input(
                            [note_recovered]
                        );
                    }

                    trainer.pause();

                    break;
                }
                case PREDICT: {
                    break;
                }
                case PARSE: {
                    let input_left = true;

                    while (input_left) {
                        let coord_current = trainer.iterator_matrix_train.get_coord_current();
                        trainer.accept_input(
                            matrix_deserialized[coord_current[0]][coord_current[1]].map((note_serialized) => {
                                return deserialize_note(note_serialized)
                            })
                        );

                        if (trainer.iterator_matrix_train.done) {
                            input_left = false;
                        }
                    }

                    trainer.pause();

                    break;
                }
                // go until we find a segment without user input
                case DERIVE: {
                    let input_left = true;

                    while (input_left) {

                        // if (trainer.iterator_matrix_train.done) {
                        //     input_left = false;
                        //     continue
                        // }
                        let coord_current = trainer.iterator_matrix_train.get_coord_current();

                        if (matrix_deserialized[coord_current[0]][coord_current[1]].length === 0) {
                            input_left = false;
                            continue
                        }

                        trainer.accept_input(
                            matrix_deserialized[coord_current[0]][coord_current[1]]
                        );
                    }

                    trainer.pause();

                    break;
                }
            }


            return trainer;
        }
    }
}