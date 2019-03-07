import {note} from "../note/note";
import {log} from "../log/logger";
import TreeModel = require("tree-model");

export namespace history {
    import Logger = log.Logger;

    export class HistoryUserInput {

    }

    export class List {

    }

    export class Matrix {

        data: TreeModel.Node<note.Note>[][][];

        logger: Logger;

        constructor(height: number, width: number) {
            this.data = [];
            for(let i=0; i<height; i++) {
                this.data[i] = new Array(width);
            }
            this.logger = new Logger('max')
        }

        set_notes(i_height, i_width, notes): void {
            this.data[i_height][i_width] = notes
        }

        get_notes(i_height, i_width): TreeModel.Node<note.Note>[] {
            return this.data[i_height][i_width]
        }

        private static serialize(notes: TreeModel.Node<note.Note>[]) {
            return notes.map((note) => {
                return JSON.stringify(note.model);
            })
        }

        private static deserialize(notes_serialized) {
            if (notes_serialized === null) {
                return null
            }
            let tree = new TreeModel();
            return notes_serialized.map((note) => {
                return tree.parse(JSON.parse(note));
            })
        }

        save(filename) {
            let data_serializable = this.data as any;
            for (let i_row in this.data) {
                for (let i_col in this.data[Number(i_row)]) {
                    data_serializable[Number(i_row)][Number(i_col)] = ParseMatrix.serialize(this.data[Number(i_row)][Number(i_col)])
                }
            }

            let f = new File(filename,"write","JSON");

            if (f.isopen) {
                post("saving session");
                f.writestring(JSON.stringify(data_serializable)); //writes a string
                f.close();
            } else {
                post("could not save session");
            }
        }

        public static load(filename) {
            let f = new File(filename, "read","JSON");
            let a, data_serialized;

            if (f.isopen) {
                post("reading file");
                // @ts-ignore
                while ((a = f.readline()) != null) {
                    data_serialized = JSON.parse(a)
                }
                f.close();
            } else {
                post("could not open file");
            }

            let data_deserialized = data_serialized as any;

            for (let i_row in data_serialized) {
                for (let i_col in data_serialized[Number(i_row)]) {
                    // post(i_row);
                    // post(i_col);
                    data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)])
                }
            }

            return data_deserialized
        }
    }
}