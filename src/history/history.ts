import {note as n} from "../note/note";
import {log} from "../log/logger";
import TreeModel = require("tree-model");
import {utils} from "../utils/utils";

export namespace history {
    import Logger = log.Logger;
    import division_int = utils.division_int;
    import remainder = utils.remainder;

    export let serialize = (note: TreeModel.Node<note.Note>) => {
        return JSON.stringify(note.model);
    };

    export let deserialize = (note_serialized) => {
        if (note_serialized === null) {
            return null
        }
        let tree = new TreeModel();
        return tree.parse(JSON.parse(note_serialized));
    };

    interface HistoryUserInput {
        save(filename: string): void

        load(filename: string): HistoryUserInput
    }

    class TargetHistory implements HistoryUserInput {

        matrix_data: SequenceTarget[][];

        constructor(algorithm, segments) {
            let matrix_data = [];
            for (let i=0; i < 1; i++) {
                matrix_data[i] = new Array(segments.length);
            }
            this.matrix_data = matrix_data;
        }

        set_sequence_target(sequence_target: SequenceTarget, coord_matrix: number[]) {
            this.matrix_data[coord_matrix[0]][coord_matrix[1]] = sequence_target;
        }

        get_notes(i_height, i_width): SequenceTarget {
            return this.matrix_data[i_height][i_width]
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

        public load(filename): HistoryUserInput {
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

    type TypeSubtarget = TreeModel.Node<n.Note>;

    type TypeTarget = TypeSubtarget[]

    type SequenceNote = TreeModel.Node<n.Note>[];

    type SequenceTarget = TypeTarget[]

    // export type TypeHistoryList = SegmentTargetable[]
    //
    // export type TypeHistoryMatrix = SegmentTargetable[][]

    export class ParseHistory implements HistoryUserInput {

        // data: TreeModel.Node<note.Note>[][][];

        matrix_data: SequenceNote[][];

        logger: Logger;

        constructor(algorithm, segments) {
            let matrix_data = [];
            for (let i=0; i < algorithm.get_depth(); i++) {
                if (i == 0) {
                    matrix_data[i] = new Array(1); // root of tree
                } else {
                    matrix_data[i] = new Array(segments.length);
                }
            }
            this.matrix_data = matrix_data;
        }

        save(filename) {
            // let data_serializable = this.data as any;
            // for (let i_row in this.data) {
            //     for (let i_col in this.data[Number(i_row)]) {
            //         data_serializable[Number(i_row)][Number(i_col)] = ParseMatrix.serialize(this.data[Number(i_row)][Number(i_col)])
            //     }
            // }

            let f = new File(filename,"write","JSON");

            if (f.isopen) {
                post("saving session");
                f.writestring(JSON.stringify(data_serializable));
                f.close();
            } else {
                post("could not save session");
            }
        }

        public load(filename): HistoryUserInput {
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

            // let data_deserialized = data_serialized as any;
            //
            // for (let i_row in data_serialized) {
            //     for (let i_col in data_serialized[Number(i_row)]) {
            //         data_deserialized[Number(i_row)][Number(i_col)] = ParseMatrix.deserialize(data_serialized[Number(i_row)][Number(i_col)])
            //     }
            // }

            return data_deserialized
        }
    }
}