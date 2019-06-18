import {message} from "../message/messenger";
import Messenger = message.Messenger;
const _ = require('underscore');

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

// lookup Lemur color by feedback value

// lookup Lemur color by RGB of render value

// 0
// +1
// +2
// +3
// +4
// +5
// +-6
// -5
// -4
// -3
// -2
// -1

let map_feedback = [
    1080834,
    1015422,
    475006,
    126,
    4128894,
    8192126,
    8192002,
    8208131,
    8283442,
    8355634,
    6651698,
    4161027
];

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

// needs feedback values as keys, and Lemur codes as values
let colormap_feedback = {
    "33,254,6": 1080834,
    "32,254,254": 1015422,
    "15,127,254": 475006,
    "0,0,254": 126, // 4
    "128,0,254": 4128894,
    "251,2,254": 8192126,
    "251,1,6": 8192002,
    "252,128,8": 8208131, // 8
    "253,204,101": 8283442,
    "255,255,102": 8355634,
    "204,255,102": 6651698,
    "127,254,7": 4161027  // 12
};


// needs RGB as keys, and Lemur codes as values, since that's what user will be picking
let colormap_render = {
    "128,0,63": 4128799,
    "64,0,127": 2031679,
    "7,63,128": 204607,
    "16,127,1": 474880,
    "127,127,3": 4144897,
    "127,0,2": 4128768
};

// RBG keys, Lemur code values
let colormap_default = {
    "255,255,255": 8355711,
    "0,0,0": 0
};

let messenger: Messenger = new Messenger(env, 0);

let b_feedback = false;

let test = () => {

};

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

// let render_fz = (r,g,b) => {
//     messenger.message([r,g,b])
// };

let render_lemur = (r,g,b) => {
    messenger.message(colormap_render[[r,g,b].toString()])
};

let feedback_fz = (diff) => {
    if (b_feedback) {
        messenger.message(map_feedback_fz[diff])
    } else {
        // white
        messenger.message([15, 15, 15])
    }
};

let feedback_lemur = (diff) => {
    if (b_feedback) {
        messenger.message([map_feedback[diff]])
    } else {
        // black
        messenger.message([0])
    }
};

let render_default_lemur = (r,g,b) => {
    messenger.message(colormap_default[[r,g,b].toString()])
};

let clear_lemur = () => {
    for (let i_string of _.range(1, 6 + 1)) {
        for (let i_fret of _.range(1, 12 + 1)) {
            // /string_6_fret_6 @color 8355711 0
            messenger.message(
                [
                    '/string' + '_' + i_string + '_' + 'fret' + '_' + i_fret,
                    '@color',
                    colormap_default["255,255,255"],
                    colormap_default["0,0,0"]
                ]
            )
        }
        // /nut_1 @color 8355711
        messenger.message(['/nut_' + i_string, '@color', colormap_default["255,255,255"]])
    }
};

// test();

if (typeof Global !== "undefined") {
    Global.color_getter = {};
    Global.color_getter.render_lemur = render_lemur;
    Global.color_getter.render_default_lemur = render_default_lemur;
    Global.color_getter.feedback_fz = feedback_fz;
    Global.color_getter.feedback_lemur = feedback_lemur;
    Global.color_getter.clear_lemur = clear_lemur;
    Global.color_getter.set_feedback = set_feedback;
    Global.color_getter.rgb_to_fz = rgb_to_fz;
}
