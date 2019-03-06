import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
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
import LiveClipVirtual = live.LiveClipVirtual;
import {parse} from "../parse/parse";
import TreeDepthIterator = parse.TreeDepthIterator;
import ParseTreeIterator = parse.ParseTreeIterator;
import ParseMatrix = parse.ParseMatrix;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'node';

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

let pwindow: w.Pwindow;

let elaboration: TreeModel.Node<n.Note>[];

let clip_user_input: c.Clip;

let clip_segment: c.Clip;

// let logger = new log.Logger(env);

let segment_current: Segment;

let segment_iterator: SegmentIterator;

let tree_depth_iterator: TreeDepthIterator;

let parse_tree_iterator: ParseTreeIterator;

let layer_parse_tree_current: number;

let depth_parse_tree: number;

let parse_matrix: ParseMatrix;

let notes_segments: TreeModel.Node<n.Note>[];


let add_to_tree = (notes, beat_start, beat_end) => {
    add_to_tree_export(notes, beat_start, beat_end, clip_user_input, song, messenger)
};


export let add_to_tree_export = (notes, beat_start, beat_end, clip_user_input, song, messenger) => {

    pwindow.elaborate(
        notes,
        beat_start,
        beat_end,
        tree_depth_iterator.get_index_current()
    );

    parse_matrix.set_notes(
        tree_depth_iterator.get_index_current(),
        segment_iterator.get_index_current(),
        notes
    );

    let messages_notes = pwindow.get_messages_render_clips();

    let messages_tree = pwindow.get_messages_render_tree();

    let msg_clear = ["clear"];
    msg_clear.unshift('render');
    messenger.message(msg_clear);

    for (let message of messages_notes) {
        message.unshift('render');
        messenger.message(message);
    }

    for (let message of messages_tree) {
        message.unshift('render');
        messenger.message(message);
    }

    let segment_next = parse_tree_iterator.next();

    let val_segment_next = segment_next.value;

    layer_parse_tree_current = tree_depth_iterator.get_index_current();

    if (segment_next.done) {

        // TODO: handle for testing
        song.set_overdub(0);

        song.set_session_record(0);

        clip_user_input.stop();

        return
    }

    segment_current = val_segment_next;

    let interval = segment_current.get_endpoints_loop();

    clip_user_input.set_endpoints_loop(
        interval[0],
        interval[1]
    );
};

let confirm = () => {

    elaboration = clip_user_input.get_notes(
        segment_current.beat_start,
        0,
        segment_current.beat_end - segment_current.beat_start,
        128
    );

    add_to_tree(
        elaboration,
        segment_current.beat_start,
        segment_current.beat_end
    );
};

let reset = () => {
    clip_user_input.set_notes(
        parse_matrix.get_notes(
            tree_depth_iterator.get_index_current(),
            segment_iterator.get_index_current()
        )
    );
};

let erase = () => {
    let epsilon = 1/(48 * 2);

    clip_user_input.remove_notes(
        segment_current.beat_start - epsilon,
        0,
        segment_current.beat_end - segment_current.beat_start,
        128
    );
};

function set_clip_segment() {

    let vector_path_live = Array.prototype.slice.call(arguments);

    let live_api_clip_segment = new li.LiveApiJs(
        utils.PathLive.to_string(vector_path_live)
    );

    clip_segment = new c.Clip(
        new c.ClipDao(
            live_api_clip_segment,
            new m.Messenger(env, 0),
            false
        )
    );

    // TODO: in information retreival phase, save the start and end points of the song and retreive them here
    clip_segment.set_clip_endpoint_lower(
        1
    );

    clip_segment.set_clip_endpoint_upper(
        16 * 4
    );

    notes_segments = clip_segment.get_notes_within_markers();
}

let set_depth_tree = (depth) => {
    set_depth_tree_export(depth)
};

export let set_depth_tree_export = (depth) => {
    depth_parse_tree = depth;
};

let begin_train = () => {
    begin_train_export(notes_segments, clip_user_input, song, add_to_tree, messenger)
};

export let begin_train_export = (notes_segments, clip_user_input, song, callback_add_to_tree, messenger) => {

    let segments: Segment[] = [];

    for (let note of notes_segments) {
        let clip_dao_virtual = new LiveClipVirtual([note]);
        let clip_segment_virtual = new c.Clip(clip_dao_virtual);
        segments.push(
            new Segment(
                note.model.note.beat_start,
                note.model.note.get_beat_end(),
                clip_segment_virtual
            )
        )
    }

    parse_matrix = new ParseMatrix(
        depth_parse_tree,
        segments.length
    );

    segment_iterator = new SegmentIterator(
        segments,
        true
    );

    tree_depth_iterator = new TreeDepthIterator(
        depth_parse_tree,
        true
    );

    parse_tree_iterator = new ParseTreeIterator(
        segment_iterator,
        tree_depth_iterator
    );

    let tree: TreeModel = new TreeModel();

    let note_root = tree.parse(
        {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                notes_segments[0].model.note.pitch,
                notes_segments[0].model.note.beat_start,
                notes_segments[notes_segments.length - 1].model.note.get_beat_end() - notes_segments[0].model.note.beat_start,
                90,
                0
            ),
            children: [

            ]
        }
    );

    let dim = 16 * 6 * 4;

    pwindow = new w.Pwindow(
        dim,
        dim,
        messenger
    );

    pwindow.set_root(
        note_root
    );

    parse_tree_iterator.next();

    pwindow.elaborate(
        notes_segments,
        notes_segments[0].model.note.beat_start,
        notes_segments[notes_segments.length - 1].model.note.get_beat_end(),
        1
    );

    // pwindow.add_first_layer(
    //     notes_segments,
    //     1
    // );

    // pwindow.update_leaves(
    //     notes_segments
    // );

    let messages_notes = pwindow.get_messages_render_clips();

    let messages_tree = pwindow.get_messages_render_tree();

    let msg_clear = ["clear"];
    msg_clear.unshift('render');
    messenger.message(msg_clear);

    for (let message of messages_notes) {
        message.unshift('render');
        messenger.message(message);
    }

    for (let message of messages_tree) {
        message.unshift('render');
        messenger.message(message);
    }

    // for (let i in notes_segments) {
    //     callback_add_to_tree.call(
    //         this,
    //         [
    //             notes_segments[Number(i)]
    //         ],
    //         notes_segments[Number(i)].model.note.beat_start,
    //         notes_segments[Number(i)].model.note.get_beat_end(),
    //         clip_user_input,
    //         song,
    //         messenger
    //     );
    // }

    song.set_overdub(1);

    song.set_session_record(1);

    // TODO: uncomment
    clip_user_input.fire();
};

let pause_train = () => {
    clip_user_input.stop();
};

let resume_train = () => {
    clip_user_input.fire();
};

let set_clip_user_input = () => {
    let live_api_user_input = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    // TODO: get notes from segment clip

    // let notes_segments: TreeModel.Node<n.Note>[] = clip_segment.get_notes_within_markers();

    let key_route = 'clip_user_input';

    clip_user_input = new c.Clip(
        new c.ClipDao(
            live_api_user_input,
            new m.Messenger(env, 0),
            true,
            key_route
        )
    );

    clip_user_input.set_path_deferlow(
        'set_path_clip_user_input'
    );

    let beats_duration_song = 16 * 4;

    clip_user_input.remove_notes(
        notes_segments[0].model.note.beat_start,
        0,
        beats_duration_song,
        128
    );

    clip_user_input.set_notes(
        notes_segments
    );
};

if (typeof Global !== "undefined") {
    Global.parse_tree = {};
    Global.parse_tree.confirm = confirm;
    Global.parse_tree.reset = reset;
    Global.parse_tree.erase = erase;
    Global.parse_tree.set_clip_user_input = set_clip_user_input;
    Global.parse_tree.set_clip_segment = set_clip_segment;
    Global.parse_tree.begin_train = begin_train;
    Global.parse_tree.pause_train = pause_train;
    Global.parse_tree.resume_train = resume_train;
    Global.parse_tree.set_depth_tree = set_depth_tree;
}
