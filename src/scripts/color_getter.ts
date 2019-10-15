import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import Env = live.Env;
const _ = require('underscore');

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let map_feedback_fz = [
    [2, 15, 0],
    [2, 15, 15],
    [1, 8, 15],
    [0, 0, 15], // 4
    [8, 0, 15],
    [15, 0, 15],
    [15, 0, 1],
    [15, 8, 1],  // 8
    [15, 12, 7],
    [15, 15, 7],
    [12, 15, 7],
    [8, 15, 0] // 12
];

let messenger: Messenger = new Messenger(Env.MAX, 0);

let b_feedback = false;

let rgb_to_fz = (r, g, b) => {

    messenger.message(
        [
            Math.floor(r/16),
            Math.floor(g/16),
            Math.floor(b/16)
        ]
    )
};

let set_feedback = (val) => {
    b_feedback = Boolean(val)
};

let feedback_fz = (diff) => {
    if (b_feedback) {
        messenger.message(map_feedback_fz[diff])
    } else {
        // white
        messenger.message([15, 15, 15])
    }
};

if (typeof Global !== "undefined") {
    Global.color_getter = {};
    Global.color_getter.feedback_fz = feedback_fz;
    Global.color_getter.set_feedback = set_feedback;
    Global.color_getter.rgb_to_fz = rgb_to_fz;
}
