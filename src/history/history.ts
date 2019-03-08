import {note as n} from "../note/note";
import {log} from "../log/logger";
import TreeModel = require("tree-model");
import {utils} from "../utils/utils";

export namespace history {
    import Logger = log.Logger;
    import division_int = utils.division_int;
    import remainder = utils.remainder;

    class HistoryUserInput {

    }

    export class MatrixIterator {
        private num_rows: number;
        private num_columns: number;

        private row_current: number;
        private column_current: number;

        private i;

        constructor(num_rows: number, num_columns: number) {
            this.num_rows = num_rows;
            this.num_columns = num_columns;

            this.i = -1;
        }

        private next_row() {
            this.i = this.i + this.num_columns;
        }

        private next_column() {
            this.i = this.i + 1;
        }

        public next() {

            let value: number[] = null;

            this.next_column();

            if (this.i === this.num_columns * this.num_rows + 1) {
                return {
                    value: value,
                    done: true
                }
            }

            let pos_row = division_int(this.i + 1, this.num_columns);
            let pos_column = remainder(this.i + 1, this.num_columns);

            value = [pos_row, pos_column];

            return {
                value: value,
                done: false
            };
        }
    }

    type TypeSubtarget = TreeModel.Node<n.Note>;

    type TypeTarget = TypeSubtarget[]

    type SegmentTargetable = TypeTarget[]

    export type TypeHistoryList = SegmentTargetable[]

    export type TypeHistoryMatrix = SegmentTargetable[][]

    export class HistoryList extends HistoryUserInput {

        private list_history: TypeHistoryList;

        public add_subtarget(subtarget: TypeSubtarget): void {

        }

        get_list(): TypeHistoryList {
            return
        }

        set_list(): void {

        }
    }

    export class HistoryMatrix extends HistoryUserInput {

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