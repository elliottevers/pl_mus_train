import {target} from "../target/target";
import {note} from "../note/note";
import TreeModel = require("tree-model");
import {trainer} from "../train/trainer";
import {file} from "../io/file";

export namespace serialize {

    export let serialize_note = (note: TreeModel.Node<note.Note>) => {
        return JSON.stringify(note.model);
    };

    export let deserialize_note = (note_serialized) => {
        if (note_serialized === null) {
            return null
        }
        let tree = new TreeModel();
        return tree.parse(JSON.parse(note_serialized));
    };

    import Subtarget = target.Subtarget;

    export let serialize_subtarget = (subtarget: Subtarget) => {
        let subtarget_serialized: any;
        // TODO: fix
        // let subtarget_serialized = subtarget;
        subtarget_serialized = subtarget;
        subtarget_serialized.note = serialize_note(subtarget.note);
        return subtarget_serialized;
    };

    export let deserialize_subtarget = (subtarget_serialized) => {
        let subtarget_deserialized = subtarget_serialized;
        subtarget_deserialized.note = deserialize_note(subtarget_serialized.note);
        return subtarget_deserialized;
    };

    // import SequenceTarget = history.SequenceTarget;

    export let serialize_target_sequence = (sequence_target) => {
        let sequence_target_serialized = sequence_target;
        for (let i_target in sequence_target) {
            let subtargets = sequence_target[Number(i_target)].iterator_subtarget.subtargets;
            for (let i_subtarget in subtargets) {
                let subtarget = subtargets[Number(i_subtarget)];
                sequence_target_serialized[Number(i_target)][Number(i_subtarget)] = serialize_subtarget(subtarget)
            }
        }
        return sequence_target_serialized;
    };

    // TODO: deserialize
    export let deserialize_target_sequence = (sequence_target_serialized) => {
        let sequence_target_deserialized = sequence_target_serialized;

        for (let i_target in sequence_target_serialized) {
            let subtargets = sequence_target_serialized[Number(i_target)].get_subtargets();
            for (let i_subtarget in subtargets) {
                let subtarget = subtargets[Number(i_subtarget)];
                sequence_target_deserialized[Number(i_target)][Number(i_subtarget)] = deserialize_subtarget(subtarget)
            }
        }
        return sequence_target_deserialized;
    };
}

export namespace freeze {
    import Trainer = trainer.Trainer;
    import serialize_target_sequence = serialize.serialize_target_sequence;
    import to_json = file.to_json;

    export class TrainFreezer {

        env: string;

        constructor(env: string) {
            this.env = env;
        }

        public freeze(trainer: Trainer, filepath: string) {
            let data_serializable = trainer.history_user_input.matrix_data as any;
            for (let i_row in trainer.history_user_input.matrix_data) {
                for (let i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                    data_serializable[Number(i_row)][Number(i_col)] = serialize_target_sequence(
                        trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                    )
                }
            }

            to_json(data_serializable, filepath, this.env)
        }
    }
}

export namespace thaw {
    import Trainer = trainer.Trainer;
    import deserialize_target_sequence = serialize.deserialize_target_sequence;
    import from_json = file.from_json;
    import Note = note.Note;

    export class TrainThawer {
        constructor(env: string) {

        }

        public thaw(filepath: string, config): Trainer {

            let matrix_deserialized = from_json(filepath, config['env']);

            let notes = [];

            for (let row of matrix_deserialized) {
                for (let col of row) {
                    if (col === null) {
                        continue;
                    }
                    for (let sequence_target of col) {
                        for (let note of sequence_target.iterator_subtarget.subtargets) {
                            notes.push(note)
                        }
                    }
                }
            }

            let notes_parsed = notes.map((obj)=>{return JSON.parse(obj.note)});

            let trainer =  new Trainer(
                config['window'],
                config['user_input_handler'],
                config['algorithm'],
                config['clip_user_input'],
                config['clip_target_virtual'],
                config['song'],
                config['segments'],
                config['messenger']
            );

            trainer.init(

            );

            let tree: TreeModel = new TreeModel();

            for (let note_parsed of notes_parsed) {
                let note_recovered = tree.parse(
                    {
                        id: -1, // TODO: hashing scheme for clip id and beat start
                        note: new Note(
                            note_parsed.note.pitch,
                            note_parsed.note.beat_start,
                            note_parsed.note.beats_duration,
                            note_parsed.note.velocity,
                            note_parsed.note.b_muted
                        ),
                        children: [

                        ]
                    }
                );
                trainer.accept_input(
                    [note_recovered]
                );
            }

            return trainer;
        }
    }
}