import {trainer} from "../train/trainer";
import {algorithm} from "../train/algorithm";
import {file} from "../io/file";
import {serialize} from "./serialize";

export namespace freeze {

    import Trainer = trainer.Trainer;
    import DETECT = algorithm.DETECT;
    import PREDICT = algorithm.PREDICT;
    import PARSE = algorithm.PARSE;
    import to_json = file.to_json;
    import serialize_sequence_note = serialize.serialize_sequence_note;
    import DERIVE = algorithm.DERIVE;

    export class TrainFreezer {

        env: string;

        constructor(env: string) {
            this.env = env;
        }

        public freeze(trainer: Trainer, filepath: string) {
            let data_serializable = trainer.history_user_input.matrix_data as any;

            switch (trainer.trainable.get_name()) {
                case DETECT: {
                    for (let i_row in trainer.history_user_input.matrix_data) {
                        for (let i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                            // data_serializable[Number(i_row)][Number(i_col)] = serialize_target_sequence(
                            //     trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                            // )
                            data_serializable[Number(i_row)][Number(i_col)] = serialize_sequence_note(
                                trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                            )
                        }
                    }
                    break;
                }
                case PREDICT: {
                    // TODO
                    break;
                }
                case PARSE: {
                    for (let i_row in trainer.history_user_input.matrix_data) {
                        for (let i_col in trainer.history_user_input.matrix_data[Number(i_row)]) {
                            data_serializable[Number(i_row)][Number(i_col)] = serialize_sequence_note(
                                trainer.history_user_input.matrix_data[Number(i_row)][Number(i_col)]
                            )
                        }
                    }
                    break;
                }
                case DERIVE: {
                    // TODO
                    break;
                }
            }

            to_json(data_serializable, filepath, this.env)
        }
    }
}