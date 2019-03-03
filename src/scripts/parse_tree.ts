import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {clip as c} from "../clip/clip";
import {window as w} from "../render/window";
import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {log} from "../log/logger";
import {song as s} from "../song/song";

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

let song_dao = new s.SongDao(
    new li.LiveApiJs("live_set"),
    new m.Messenger(env, 1, "song"),
    true
);

let song: s.Song = new s.Song(song_dao);

let boundary_change_record_interval = (int) => {
    song.set_session_record(int);
};

let pwindow: w.Pwindow;

let elaboration: TreeModel.Node<n.Note>[];

let clip_user_input: c.Clip;

let clip_target: c.Clip;

let bound_lower, bound_upper;

let logger = new log.Logger(env);

let confirm = () => {

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

    clip_target.remove_notes(
        0,
        0,
        0,
        128
    );

    clip_target.set_notes(
        notes_leaves
    );
};

let reset = () => {
    clip_user_input.remove_notes(
        bound_lower,
        0,
        bound_upper,
        128
    );
};

let init_render = () => {
    // TODO: make configurable
    let dim = 16 * 6 * 4;

    pwindow = new w.Pwindow(
        dim,
        dim,
        new m.Messenger(env, 0)
    );

    pwindow.set_clip(clip_target);
};

let set_clip_target = () => {
    let live_api_to_target = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    let key_route = 'clip_target';

    clip_target = new c.Clip(
        new c.ClipDao(
            live_api_to_target,
            new m.Messenger(env, 0),
            true,
            key_route
        )
    );
    clip_target.set_path_deferlow(
        'set_path_clip_target'
    )
};

let set_clip_user_input = () => {
    let live_api_user_input = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

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
    )
};

let set_bound_upper = (beat) => {
    bound_upper = Number(beat);
};

let set_bound_lower = (beat) => {
    bound_lower = Number(beat);
};

if (typeof Global !== "undefined") {
    Global.parse_tree = {};
    Global.parse_tree.confirm = confirm;
    Global.parse_tree.reset = reset;
    Global.parse_tree.init_render = init_render;
    Global.parse_tree.set_clip_target = set_clip_target;
    Global.parse_tree.set_clip_user_input = set_clip_user_input;
    Global.parse_tree.set_bound_upper = set_bound_upper;
    Global.parse_tree.set_bound_lower = set_bound_lower;
}
