import {control} from "../control/control";
import Fretboard = control.Fretboard;
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

let messenger = new Messenger(Env.MAX, 0);

let fretboard = new Fretboard(6, 12, messenger);

let fret = (position_string, position_fret, status) => {
    fretboard.fret(Number(position_string), Number(position_fret), Boolean(status));
};

let pluck = (position_string) => {
    fretboard.pluck(position_string);
};

let dampen = (position_string) => {
    fretboard.dampen(position_string);
};

let test = () => {
    // fret(1, 1, 1);
    // fret(1, 3, 1);
    // pluck(1);
    // dampen(1);
    // fret(1, 1, 0);
    // fret(1, 3, 0);
    // fret(1, 1, 1);
    // pluck(1);
    // dampen(1);
    // fret(1, 1, 0);
    // pluck(1);
    fret(6, 3, 1);
    pluck(6);
    fret(6, 3, 0);
    pluck(6)
};

if (typeof Global !== "undefined") {
    Global.control_server = {};
    Global.control_server.fret = fret;
    Global.control_server.pluck = pluck;
    Global.control_server.dampen = dampen;
    Global.control_server.test = test;
}
