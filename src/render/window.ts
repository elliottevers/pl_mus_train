import TreeModel = require("tree-model");
import {message as m} from "../message/messenger"
import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import {live} from "../live/live";
import * as _ from "lodash";
import {log} from "../log/logger";
import {history} from "../history/history";
let CircularJSON = require('circular-json');

export namespace window {

    import LiveClipVirtual = live.LiveClipVirtual;
    import Logger = log.Logger;
    import HistoryUserInput = history.HisstoryUserInput;

    const red = [255, 0, 0];
    const black = [0, 0, 0];

    interface Renderable {
        add(notes: TreeModel.Node<n.Note>[])
    }

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



        protected constructor(struct) {
            this.struct = struct;
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

    export class ListWindow extends Window implements Renderable {

        constructor(struct) {
            super
            this.struct = struct
        }

    }

    export class TreeWindow extends Window implements Renderable {

    }
}