import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {map} from "../control/map";
import FretMapper = map.FretMapper;
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

let messenger: Messenger = new Messenger(Env.MAX, 0);

let fret_mapper: FretMapper = new FretMapper(messenger);

let midi = (pitch_midi) => {
    fret_mapper.play(pitch_midi)
};

if (typeof Global !== "undefined") {
    Global.map_midi_to_fret = {};
    Global.map_midi_to_fret.midi = midi;
}
