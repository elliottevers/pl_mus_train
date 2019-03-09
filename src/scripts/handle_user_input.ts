import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip as c} from "../clip/clip";
import {window as w} from "../render/window";
import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {log} from "../log/logger";
import {song as s} from "../song/song";
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import SegmentIterator = segment.SegmentIterator;
import {utils} from "../utils/utils";
import Logger = log.Logger;
import LiveClipVirtual = live.LiveClipVirtual;
import {parse} from "../parse/parse";
// import TreeDepthIterator = parse.TreeDepthIterator;
// import ParseTreeIterator = parse.ParseTreeIterator;
// import ParseMatrix = parse.ParseMatrix;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let messenger: Messenger = new Messenger(env, 0);

let logger = new Logger(env);

let song_dao = new s.SongDao(
    new li.LiveApiJs("live_set", env),
    new m.Messenger(env, 0, "song"),
    true
);

let song: s.Song = new s.Song(song_dao);

// export let pwindow: w.Pwindow;

let elaboration: TreeModel.Node<n.Note>[];

let clip_user_input: c.Clip;

let clip_segment: c.Clip;

let segment_current: Segment;

let segment_iterator: SegmentIterator;

// let tree_depth_iterator: TreeDepthIterator;
//
// let parse_tree_iterator: ParseTreeIterator;

let layer_parse_tree_current: number;

let depth_parse_tree: number;

// export let parse_matrix: ParseMatrix;

let notes_segments: TreeModel.Node<n.Note>[];





let confirm = () => {

    elaboration = clip_user_input.get_notes(
        segment_current.beat_start,
        0,
        segment_current.beat_end - segment_current.beat_start,
        128
    );

    // add_to_tree(
    //     elaboration,
    //     segment_current.beat_start,
    //     segment_current.beat_end
    // );
};

// let start = () => {
//     message
//     this.messenger.mess
// };
//
// let resume = () => {
//
// };
//
// let pause = () => {
//
// };

let load = (filename) => {
    // start_session_train(
    //     ParseMatrix.load(
    //         filename
    //     )
    // )

};

let save = (filename) => {
    // parse_matrix.save(filename);
    // stop_session(clip_user_input, song)
};
