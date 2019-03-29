import {trainer} from "../train/trainer";
import {file} from "../io/file";
import {serialize} from "./serialize";

export namespace freeze {

    import Trainer = trainer.Trainer;
    import to_json = file.to_json;
    import serialize_sequence_note = serialize.serialize_sequence_note;

    export class TrainFreezer {

        constructor() {

        }

        public static freeze(trainer: Trainer, filepath: string, env: string) {
            let data_serializable = trainer.history_user_input.matrix_data as any;

            for (let i_row in trainer.history_user_input.matrix_data) {
                for (let i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                    data_serializable[Number(i_row)][Number(i_col)] = serialize_sequence_note(
                        trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                    )
                }
            }

            to_json(data_serializable, filepath, env)
        }
    }
}