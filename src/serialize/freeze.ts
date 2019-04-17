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
            let dict = {};

            let data_serializable_max = {};

            for (let i_row in trainer.history_user_input.matrix_data) {
                data_serializable_max[i_row] = {};
                for (let i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                    data_serializable_max[i_row][i_col] = serialize_sequence_note(
                        trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                    )
                }
            }

            dict['history_user_input'] = data_serializable_max;

            to_json(dict, filepath, env)
        }
    }
}