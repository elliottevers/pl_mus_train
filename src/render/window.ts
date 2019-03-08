import TreeModel = require("tree-model");
import {message as m} from "../message/messenger"
import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";
import {log} from "../log/logger";
import {history} from "../history/history";
import {struct} from "../train/struct";
import {parse} from "../parse/parse";
let CircularJSON = require('circular-json');

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;
    import Logger = log.Logger;
    import HistoryUserInput = history.HisstoryUserInput;
    import HistoryList = history.HistoryList;
    import HistoryMatrix = history.HistoryMatrix;
    import ParseTree = parse.ParseTree;

    const red = [255, 0, 0];
    const black = [0, 0, 0];

    // interface Renderable {
    //     add(notes: TreeModel.Node<n.Note>[])
    // }

    abstract class Window {
        // height: number;
        // width: number;
        // messenger: m.Messenger;
        // clips: c.Clip[];
        // beats_per_measure: number;
        // root_parse_tree: TreeModel.Node<n.Note>;
        // leaves: TreeModel.Node<n.Note>[];
        // logger: Logger;
        // history_user_input: HistoryUserInput;

        struct;

        protected constructor() {
        }


        public clear(messenger) {
            let msg_clear = ["clear"];
            msg_clear.unshift('render');
            this.messenger.message(msg_clear);
        }

        public add(notes: TreeModel.Node<n.Note>[]) {

        }

        // public insert(notes: TreeModel.Node<n.Note>[]) {
        //     this.history_user_input.add(notes)
        //
        // }

        // public render() {
        //
        // }

    }

    interface Renderable {

    }

    export class ListWindow extends Window {
        constructor() {
            super();
            this.struct = new struct.StructList();
        }

        public render_regions(history_list: HistoryList) {

        }

        public render_notes(history_list: HistoryList) {

        }

    }

    export class TreeWindow extends Window {
        constructor() {
            super();
            this.struct = new struct.StructList();
        }

        public render_regions(history_matrix: HistoryMatrix) {

        }

        public render_notes(history_matrix: HistoryMatrix) {

        }

        public render_trees(list_parse_trees: ParseTree[]) {

        }


    }
}