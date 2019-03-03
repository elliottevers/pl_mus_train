import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live as li} from "../live/live";
import {clip as c} from "../clip/clip";

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


let mute = () => {
    let clip_highlighted = new li.LiveApiJs(
        'live_set view selected_track'// 'live_set view highlighted_clip_slot clip'
    );

    clip_highlighted.set("mute", 1);
    // post(clip_highlighted.get("name"))
};

let unmute = () => {
    let clip_highlighted = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );

    clip_highlighted.set("muted", 0)
};

let counter = 0;

let highlighted_first;

let highlighted_second;

let test = () => {
    let api = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );
    //
    // messenger.message([api.get_path()])

    let clip_highlighted = new c.Clip(
        new c.ClipDao(
            api,
            new m.Messenger(env, 0, "highlighted"),
            true
        )
    );
    if (counter % 2 == 0) {
        clip_highlighted.set_loop_bracket_lower(0);
        clip_highlighted.set_loop_bracket_upper(2);
    } else {
        clip_highlighted.set_loop_bracket_upper(4);
        clip_highlighted.set_loop_bracket_lower(2);
    }

    counter = counter + 1;
    post(counter)
};

let first = () => {
    highlighted_first = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );
    // clip_highlighted.set("mute", 1);
};

let second = () => {
    highlighted_second = new li.LiveApiJs(
        'live_set view highlighted_clip_slot clip'
    );
    // clip_highlighted.set("mute", 1);
};

let mute_first_highlighted = () => {
    highlighted_first.set('muted', 1);
};

// test();

if (typeof Global !== "undefined") {
    Global.parse_tree = {};
    Global.parse_tree.mute = mute;
    Global.parse_tree.unmute = unmute;
    Global.parse_tree.test = test;
    Global.parse_tree.first = first;
    Global.parse_tree.second = second;
    Global.parse_tree.mute_first_highlighted = mute_first_highlighted;
}
