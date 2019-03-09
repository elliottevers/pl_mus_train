import {history} from "../history/history";
import {target} from "../target/target";
import {note} from "../note/note";
import TreeModel = require("tree-model");
import {trainer} from "../train/trainer";

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
        let subtarget_serialized = subtarget;
        subtarget_serialized.note = serialize_note(subtarget.note);
        return subtarget_serialized;
    };

    export let deserialize_subtarget = (subtarget_serialized) => {
        let subtarget_deserialized = subtarget_serialized;
        subtarget_deserialized.note = deserialize_note(subtarget_serialized.note)
        return subtarget_deserialized;
    };

    // import SequenceTarget = history.SequenceTarget;

    export let serialize_target_sequence = (sequence_target) => {
        let sequence_target_serialized = sequence_target;
        for (let i_target in sequence_target) {
            let subtargets = sequence_target[Number(i_target)].get_subtargets();
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

    export class TrainFreezer {
        constructor(env: string) {

        }

        public freeze(trainer: Trainer, filepath: string) {

        }
    }
}

export namespace thaw {
    import Trainer = trainer.Trainer;

    export class TrainThawer {
        constructor(env: string) {

        }

        public thaw(filepath: string): Trainer {
            return
        }
    }
}