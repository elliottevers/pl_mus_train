import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {map} from "../control/map";
import FretMapper = map.FretMapper;

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

let fret_mapper: FretMapper = new FretMapper(messenger);

let test = () => {

};

let midi = (pitch_midi) => {
    fret_mapper.play(pitch_midi)
};

if (typeof Global !== "undefined") {
    Global.map_midi_to_fret = {};
    Global.map_midi_to_fret.midi = midi;
}
