import {message} from "./message/messenger";
import Messenger = message.Messenger;
const _ = require("underscore");

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

let messenger = new Messenger(env, 0);

let num_frets = 12;

let num_strings = 6;

let frets = _.times(num_frets * num_strings, _.constant(0));

let nuts = _.times(num_strings, _.constant(0));

let render = (position_string, position_fret, state) => {
    if (Number(position_fret) === 0) {
        let nuts_clone = _.clone(nuts);
        nuts_clone[position_string - 1] = state;
        messenger.message(['nuts'].concat(nuts_clone))
    } else {
        let frets_clone = _.clone(frets);
        frets_clone[((position_string - 1) * num_frets) + position_fret - 1] = state;
        messenger.message(['frets'].concat(frets_clone));
    }
};

if (typeof Global !== "undefined") {
    Global.monitor_server = {};
    Global.monitor_server.render = render;
}
