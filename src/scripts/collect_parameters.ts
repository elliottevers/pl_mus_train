import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live} from "../live/live";
import Env = live.Env;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let pitches_discretization = {};

let reset = () => {
    pitches_discretization = {};
};

let accept = (pitch_midi: number, velocity: number) => {
    pitches_discretization[pitch_midi] = velocity > 0 ? 1 : 0
};

let run = () => {

    let messenger = new Messenger(Env.MAX, 0);

    let pitches_set = [];

    for (let pitch_midi of Object.keys(pitches_discretization)) {
        if (pitches_discretization[pitch_midi] === 1) {
            pitches_set.push(pitch_midi)

        }
    }

    messenger.message(['note_midi_lower', Math.min(...pitches_set)]);
    messenger.message(['note_midi_upper', Math.max(...pitches_set)]);
    messenger.message(['run', 'bang'])
};

if (typeof Global !== "undefined") {
    Global.collect_parameters = {};
    Global.collect_parameters.accept = accept;
    Global.collect_parameters.reset = reset;
    Global.collect_parameters.run = run;
}
