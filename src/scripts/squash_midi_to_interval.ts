import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import Env = live.Env;

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let intervalDesired: [number, number];

let messenger: Messenger = new Messenger(Env.MAX, 0);

// let withinRange = (candidate: number, range: [number, number]): boolean => {
//     return candidate >= range[0] && candidate <= range[1]
// };

let map = (pitch_midi_raw) => {
    if (pitch_midi_raw > intervalDesired[1]) {
        while (pitch_midi_raw > intervalDesired[1]) {
            pitch_midi_raw -= 12
        }
    } else if (pitch_midi_raw < intervalDesired[0]) {
        while (pitch_midi_raw < intervalDesired[1]) {
            pitch_midi_raw += 12
        }
    }

    messenger.message([pitch_midi_raw])
};

let setInterval = (pitch_midi_upper, pitch_midi_lower) => {
    intervalDesired = [pitch_midi_lower, pitch_midi_upper]
};

if (typeof Global !== "undefined") {
    Global.squash_midi_to_interval = {};
    Global.squash_midi_to_interval.map = map;
    Global.squash_midi_to_interval.setInterval = setInterval;
}
