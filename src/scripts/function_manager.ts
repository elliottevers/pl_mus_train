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

let messenger = new Messenger(env, 0);

let point_beat_estimates: Array<Array<number>> = [];

let points: Array<Array<number>> = [];

let done = false;

let i_current = 0;

let next = () => {
    if (!done) {
        i_current += 1;
        done = i_current > points.length - 1;
        set_loop_endpoints()
    }
};

let set_loop_endpoints = () => {
    messenger.message(['loop_endpoints', points[i_current][0], points[i_current][1]])
};

let parse_dump = (x: string, y: string) => {
    points = points.concat([[parseFloat(x), parseFloat(y)]])
};

let clear_points = () => {
    points = []
};

let clear_beats = () => {
    point_beat_estimates = []
};

let set_beats = () => {
    // for (let i_point in point_beat_estimates) {
    //     if (parseInt(i_point) % 8 == 0) {
    //         // @ts-ignore
    //         messenger.message(['point'].concat(point_beat_estimates[i_point]))
    //     }
    // }
};

let process_beat_relative = (beat_relative: string) => {
    point_beat_estimates = point_beat_estimates.concat([[parseFloat(beat_relative), 0]])
};

let test = () => {

};

if (typeof Global !== "undefined") {
    Global.function_manager = {};
    Global.function_manager.process_beat_relative = process_beat_relative;
    Global.function_manager.set_beats = set_beats;
    Global.function_manager.clear_beats = clear_beats;
    Global.function_manager.next = next;
    Global.function_manager.parse_dump = parse_dump;
    Global.function_manager.clear_points = clear_points;
}
