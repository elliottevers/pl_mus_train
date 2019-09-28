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

// workflow:
// 1. load video
// 2. set frame length
// 3. dump cut points (snap to beat estimates)
// 4. affirm cut points
// 5. start iteration
// 6. hit play button

let messenger = new Messenger(env, 0);

let point_beat_estimates: Array<Array<number>> = [];

let points: Array<Array<number>> = [];

let frame_duples: Array<Array<number>> = [];

let bars: Array<number> = [];

let done = false;

let i_current = -1;

let length_frames;

let set_length_frames = (val) => {
    length_frames = val
};

let looppoints = (frame_loop_begin, frame_loop_end) => {
    messenger.message(
        [
            'loop_endpoints_function',
            frame_loop_begin/length_frames,
            0
        ]
    );

    messenger.message(
        [
            'loop_endpoints_function',
            frame_loop_end/length_frames,
            0
        ]
    );
};

let next = () => {
    if (!done) {
        i_current += 1;
        done = i_current > frame_duples.length - 1;
        set_loop_endpoints()
    }
};

let affirm_cuts = () => {
    calculate_frame_duples()
};

let calculate_frame_duples = () => {
    frame_duples = points.map((duple) => {
        return [
            Math.round(length_frames * duple[0]),
            Math.round(length_frames * duple[1])
        ]
    })
};

let set_loop_endpoints = () => {
    messenger.message(['loop_endpoints', frame_duples[i_current][0], frame_duples[i_current][1]])
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



let quantize_point = (beat_raw) => {
    let beat_quantized =  bars.reduce(function(prev, curr) {
        return (Math.abs(curr - beat_raw) < Math.abs(prev - beat_raw) ? curr : prev);
    });
    messenger.message(['point_quantized', beat_quantized, 0])
};

// theoretically, the onset of measures
let calculate_bars = () => {
    for (let i_point in point_beat_estimates) {
        if (parseInt(i_point) % 4 == 0) {
            // @ts-ignore
            // messenger.message(['point'].concat(point_beat_estimates[i_point]))
            bars = bars.concat(point_beat_estimates[i_point])
        }
    }
};

let set_bars = () => {
    for (let bar of bars) {
        // messenger.message(['point'].concat(bar))
    }
};

let process_beat_relative = (beat_relative: string) => {
    point_beat_estimates = point_beat_estimates.concat([[parseFloat(beat_relative), 0]])
};

let test = () => {

};

if (typeof Global !== "undefined") {
    Global.function_manager = {};
    Global.function_manager.process_beat_relative = process_beat_relative;
    Global.function_manager.set_bars = set_bars;
    Global.function_manager.clear_beats = clear_beats;
    Global.function_manager.next = next;
    Global.function_manager.parse_dump = parse_dump;
    Global.function_manager.clear_points = clear_points;
    Global.function_manager.affirm_cuts = affirm_cuts;
    Global.function_manager.set_length_frames = set_length_frames;
    Global.function_manager.looppoints = looppoints;
}
