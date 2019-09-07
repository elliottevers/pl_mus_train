import {message} from "../message/messenger";
import Messenger = message.Messenger;

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

let points: Array<Array<number>> = [];

let clear_beats = () => {
    points = []
};

let set_beats = () => {

    let messenger = new Messenger(env, 0);

    for (let i_point in points) {
        if (parseInt(i_point) % 8 == 0) {
            // @ts-ignore
            messenger.message(['point'].concat(points[i_point]))
        }
    }
};

let process_beat_relative = (beat_relative: string) => {
    points = points.concat([[parseFloat(beat_relative), 0]])
};

let test = () => {

};

if (typeof Global !== "undefined") {
    Global.function_manager = {};
    Global.function_manager.process_beat_relative = process_beat_relative;
    Global.function_manager.set_beats = set_beats;
    Global.function_manager.clear_beats = clear_beats;
}
