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
    [15, 15, 15],
    [13, 13, 13],
    [12, 12, 12], // 2
    [11, 11, 11],
    [10, 10, 10], // 4
    [9, 9, 9], // 5
    [7, 7, 7],
    [6, 6, 6],  // 7
    [5, 5, 5],
    [4, 4, 4], // 9
    [3, 3, 3],
    [1, 1, 1] // 11
];

let map_monitor_fz = [
    [0, 0, 15],
    [5, 10, 6],
    [0, 15, 15], // 2
    [0, 10, 5],
    [0, 15, 0], // 4
    [15, 15, 0], // 5
    [10, 5, 0],
    [15, 0, 0],  // 7
    [15, 0, 5],
    [15, 0, 10], // 9
    [15, 0, 15],
    [8, 0, 15] // 11
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
        messenger.message(map_feedback_fz[Number(diff)])
    } else {
        messenger.message(map_monitor_fz[Number(diff)])
    }
};

if (typeof Global !== "undefined") {
    Global.color_getter = {};
    Global.color_getter.feedback_fz = feedback_fz;
    Global.color_getter.set_feedback = set_feedback;
    Global.color_getter.rgb_to_fz = rgb_to_fz;
}
