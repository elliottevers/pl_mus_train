import {note} from "../music/note";
import TreeModel = require("tree-model");

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

    export let serialize_sequence_note = (notes) => {
        if (!notes) {
            return null
        }

        let notes_serialized = [];

        for (let note of notes) {
            notes_serialized.push(serialize_note(note))
        }

        return notes_serialized
    };
}