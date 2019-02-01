import {control} from "./control/control";
import Fretboard = control.Fretboard;
import {message} from "./message/messenger";
import Messenger = message.Messenger;

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

let messenger = new Messenger(env, 0);

let fretboard = new Fretboard(6, 12, messenger);

let fret = (coordinate_scalar) => {
    fretboard.fret(fretboard.get_coordinate_duple(coordinate_scalar))
};

let pluck = (position_string) => {
    fretboard.pluck(position_string);
};

let dampen = (position_string) => {
    fretboard.dampen(position_string);
};

let test = () => {
    // TODO: why 1) off by one error 2) second pluck doesn't return 65?
    fret(1);
    fret(3);
    pluck(1);
    dampen(1);
    pluck(1);
    dampen(1);
};

test();

if (typeof Global !== "undefined") {
    Global.control_server = {};
    Global.control_server.fret = fret;
    Global.control_server.pluck = pluck;
    Global.control_server.dampen = dampen;
    Global.command_shell.test = test;
}
