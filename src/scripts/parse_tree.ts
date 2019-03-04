import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {clip as c} from "../clip/clip";
import {window as w} from "../render/window";
import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {log} from "../log/logger";
import {song as s} from "../song/song";
import {phrase} from "../phrase/phrase";
// import Phrase = phrase.Phrase;
// import Note = note.Note;
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import SegmentIterator = segment.SegmentIterator;
import {utils} from "../utils/utils";
import Logger = log.Logger;

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

// let song_dao = new s.SongDao(
//     new li.LiveApiJs("live_set"),
//     new m.Messenger(env, 0, "song"),
//     true
// );
//
// let song: s.Song = new s.Song(song_dao);
//
// let boundary_change_record_interval = (int) => {
//     song.set_session_record(int);
// };

let pwindow: w.Pwindow;

let elaboration: TreeModel.Node<n.Note>[];

let clip_user_input: c.Clip;

let clip_segment: c.Clip;

// let logger = new log.Logger(env);

let segment_current: Segment;

let segment_iterator: SegmentIterator;

let confirm = () => {

    let bound_lower = segment_current.get_beat_lower();

    let bound_upper = segment_current.get_beat_upper();

    elaboration = clip_user_input.get_notes(bound_lower, 0, bound_upper, 128);

    pwindow.elaborate(
        elaboration,
        bound_lower,
        bound_upper
    );

    let messages_notes = pwindow.get_messages_render_clips();

    let messages_tree = pwindow.get_messages_render_tree();

    // most recent summarization
    let notes_leaves = pwindow.get_notes_leaves();

    // send rendering messages
    messenger.message(["clear"]);

    for (let message of messages_notes) {
        message.unshift('render');
        messenger.message(message);
        // logger.log(message);
    }

    for (let message of messages_tree) {
        message.unshift('render');
        messenger.message(message);
        // logger.log(message);
    }

    let segment_next = segment_iterator.next();

    let val_segment_next = segment_next.value;

    if (segment_next.done) {
        clip_user_input.stop();
        return
    }

    segment_current = val_segment_next;

    // TODO: send messages to deferlow object
    segment_current.set_endpoints_loop();
};

let reset = () => {
    clip_user_input.remove_notes(
        segment_current.beat_start,
        0,
        segment_current.beat_end,
        128
    );
};

function set_clip_segment() {

    let vector_path_live = Array.prototype.slice.call(arguments);

    let logger = new Logger(env);

    logger.log('ran');

    // logger.log(vector_path_live);

    let live_api_clip_segment = new li.LiveApiJs(
        utils.PathLive.to_string(vector_path_live)
    );

    // logger.log(utils.PathLive.to_string(vector_path_live));

    clip_segment = new c.Clip(
        new c.ClipDao(
            live_api_clip_segment,
            new m.Messenger(env, 0),
            false
        )
    );

    logger.log(
        clip_segment.clip_dao.get_path()
    )

    // clip_segment.set_clip_endpoint_lower(
    //     1
    // );
    //
    // clip_segment.set_clip_endpoint_upper(
    //     17
    // )
}

let begin_train = () => {
    let val_segment_next = segment_iterator.next();

    segment_current = val_segment_next.value;

    clip_user_input.fire();
};

let pause_train = () => {
    clip_user_input.stop();
};

let set_clip_user_input = () => {
    let live_api_user_input = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    // TODO: get notes from segment clip

    let notes_segments: TreeModel.Node<n.Note>[] = clip_segment.get_notes_within_markers();

    let key_route = 'clip_user_input';

    clip_user_input = new c.Clip(
        new c.ClipDao(
            live_api_user_input,
            new m.Messenger(env, 0),
            true,
            key_route
        )
    );

    let tree: TreeModel = new TreeModel();

    let note_root = tree.parse(
        {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                notes_segments[0].model.note.pitch,
                notes_segments[0].model.note.beat_start,
                notes_segments[-1].model.note.beat_end - notes_segments[0].model.note.beat_start,
                90,
                0
            ),
            children: [

            ]
        }
    );

    clip_user_input.set_notes(
        [note_root]
    );

    let dim = 16 * 6 * 4;

    pwindow = new w.Pwindow(
        dim,
        dim,
        new m.Messenger(env, 0)
    );

    pwindow.set_root(
        clip_user_input
    );

    clip_user_input.set_path_deferlow(
        'set_path_clip_user_input'
    );

    let segments: Segment[] = [];

    for (let note of notes_segments) {
        segments.push(
            new Segment(
                note.model.note.beat_start,
                note.model.note.beat_end,
                clip_user_input
            )
        )
    }

    segment_iterator = new SegmentIterator(
        segments,
        true
    )
};

if (typeof Global !== "undefined") {
    Global.parse_tree = {};
    Global.parse_tree.confirm = confirm;
    Global.parse_tree.reset = reset;
    Global.parse_tree.set_clip_user_input = set_clip_user_input;
    Global.parse_tree.set_clip_segment = set_clip_segment;
    Global.parse_tree.begin_train = begin_train;
    Global.parse_tree.pause_train = pause_train;
}
