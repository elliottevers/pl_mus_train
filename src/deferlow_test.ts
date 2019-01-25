import {clip as c} from "./clip/clip";
import {message as m} from "./message/messenger";
import {live as li, live} from "./live/live";
import LiveApiJs = live.LiveApiJs;
import {note} from "./note/note";

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    autowatch = 1;
}

let live_api_summarization: LiveApiJs;

live_api_summarization = new li.LiveApiJs(
    "live_set tracks " + 18 + " clip_slots " + 0 + " clip"
);

let clip_summarization = new c.Clip(
    new c.ClipDao(
        live_api_summarization,
        new m.Messenger(env, 0),
        false
    )
);

let live_api_user_input: LiveApiJs;

live_api_user_input = new li.LiveApiJs(
    "live_set tracks " + 17 + " clip_slots " + 0 + " clip"
);

let clip_user_input = new c.Clip(
    new c.ClipDao(
        live_api_user_input,
        new m.Messenger(env, 0),
        false
    )
);

let reset = (index_track_user_input) => {
    clip_user_input.remove_notes(0, 0, 2, 128);
};

let set = () => {
    clip_summarization.set_notes(
        clip_user_input.get_notes(0, 0, 2, 128)
    )
};

let get = () => {
    let notes = clip_user_input.get_notes(0, 0, 2, 128);
    for (let node of notes) {
        post("beat_start");
        post("\n");
        post(node.model.note.beat_start);
        post("\n");
        post("pitch");
        post("\n");
        post(node.model.note.pitch);
        post("\n");
    }
};


if (typeof Global !== "undefined") {
    Global.deferlow_test = {};
    Global.deferlow_test.reset = reset;
    Global.deferlow_test.get = get;
    Global.deferlow_test.set = set;
}