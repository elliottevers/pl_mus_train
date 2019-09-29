import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {video as v} from "../video/video";
import Video = v.Video;

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

// TODO: beat estimates
// workflow:
// 1. load video
// 2. set frame length
// 2.5. get beat estimates

// user cuts

// 3. dump cut points (snap to beat estimates)
// 4. affirm cut points
// 5. start iteration
// 6. hit play button

let messenger = new Messenger(env, 0);

let initialize = () => {
    messenger.message(["load_video"]);
    messenger.message(["getduration"]);
};

let set_length_frames = (length_frames) => {

};

// declare let patcher: any;


// let video = new Video('/Users/elliottevers/Downloads/white-t-shirt.mp4', patcher);

// video.load();
//
// video.estimate_beats();
//
// let looper_video = new VideoLooper(video);

let path_video: string;

let set_path_video = (path) => {
    path_video = path;
};

let set_loop_points = () => {
    let frame_lower = 0;
    let frame_upper = 1;
    messenger.message(['looppoints', frame_lower, frame_upper])
};

let set_frame_length = () => {

};

let get_frame_length = () => {

};

let get_beat_estimates = () => {
    messenger.message(['beat_estimates', 'bang'])
};

let set_beat_estimates = () => {

};

let set_cuts = () => {

};

let attribute = 0;

let set_attribute = () => {
    attribute += 1
};

// TODO: beat estimates
// workflow:
// 1. load video
// 2. set frame length
// 2.5. get beat estimates

// user cuts

// 3. dump cut points (snap to beat estimates)
// 4. affirm cut points
// 5. start iteration
// 6. hit play button

let test = () => {
    post("hello world!");
};

let receive_message_saga = (name_saga, val_saga) => {
    // post(Global);
    // this["test"]()
    // eval(name_saga + ".next();")
    // saga_dance.next()
};

// TODO: do we ever need to use yield to set value of variable?
// TODO: what about using libraries in between async calls?
let saga_dance = function* () {
    post("loading video...");
    messenger.message(["load_video"]);
    yield;
    post("setting frame length...");
    messenger.message(["set_frame_length"]);
    yield;
    post("getting beat estimates...");
    messenger.message(["get_beat_estimates"]);
}();

let start_saga_dance = () => {
    saga_dance.next();
    // saga_dance.next();
    // saga_dance.next();
};

// let saga = function* () {
//     post("doing first thing...");
//     yield;
//     post("doing second thing...");
//     yield;
//     post("doing third thing...");
// }();
//
// let advanceSaga = () => {
//     saga.next();
// };

// var test = function*(){
//     console.log(1);
//     yield
//     console.log(2);
//     yield
// }

let bang = () => {
    // function * generatorFunction() { // Line 1
    //     // console.log('This will be executed first.');
    //     yield 'Hello, ';   // Line 2
    //     // console.log('I will be printed after the pause');
    //     yield 'World!';
    // }
    // const generatorObject = generatorFunction(); // Line 3
    // messenger.message([generatorObject.next().value]); // Line 4
    // messenger.message([generatorObject.next().value]); // Line 5
    // messenger.message([generatorObject.next().value]); // Line 6


    // outlet(0, "bang");
    // outlet(0, "anything");
    //
    // outlet(0, "set_attribute");
    // outlet(0, attribute)

    var handler = {
        get: function(target, name) {
            return name in target ? target[name] : 42;
        }
    };

    var p = new Proxy({}, handler);
    p.a = 1;
    // console.log(p.a, p.b); // 1, 42
    post(p.a);
    post(p.b);
};

// let set_bars = () => {
//     for (let bar of looper_video.get_bars()) {
//         messenger.message(['point'].concat(bar))
//     }
// };

// let point_beat_estimates: Array<Array<number>> = [];
//
// let points: Array<Array<number>> = [];
//
// let frame_duples: Array<Array<number>> = [];
//
// let bars: Array<number> = [];
//
// let done = false;
//
// let i_current = -1;
//
// let length_frames;
//
// let set_length_frames = (val) => {
//     length_frames = val
// };
//
// let looppoints = (frame_loop_begin, frame_loop_end) => {
//     messenger.message(
//         [
//             'loop_endpoints_function',
//             frame_loop_begin/length_frames,
//             0
//         ]
//     );
//
//     messenger.message(
//         [
//             'loop_endpoints_function',
//             frame_loop_end/length_frames,
//             0
//         ]
//     );
// };
//
// let next = () => {
//     if (!done) {
//         i_current += 1;
//         done = i_current > frame_duples.length - 1;
//         set_loop_endpoints()
//     }
// };
//
// let affirm_cuts = () => {
//     calculate_frame_duples()
// };
//
// let calculate_frame_duples = () => {
//     frame_duples = points.map((duple) => {
//         return [
//             Math.round(length_frames * duple[0]),
//             Math.round(length_frames * duple[1])
//         ]
//     })
// };
//
// let set_loop_endpoints = () => {
//     messenger.message(['loop_endpoints', frame_duples[i_current][0], frame_duples[i_current][1]])
// };
//
// let parse_dump = (x: string, y: string) => {
//     points = points.concat([[parseFloat(x), parseFloat(y)]])
// };
//
// let clear_points = () => {
//     points = []
// };
//
// let clear_beats = () => {
//     point_beat_estimates = []
// };
//
//
// let quantize_point = (beat_raw) => {
//     let beat_quantized =  bars.reduce(function(prev, curr) {
//         return (Math.abs(curr - beat_raw) < Math.abs(prev - beat_raw) ? curr : prev);
//     });
//     messenger.message(['point_quantized', beat_quantized, 0])
// };
//
// // theoretically, the onset of measures
// let calculate_bars = () => {
//     for (let i_point in point_beat_estimates) {
//         if (parseInt(i_point) % 4 == 0) {
//             // @ts-ignore
//             // messenger.message(['point'].concat(point_beat_estimates[i_point]))
//             bars = bars.concat(point_beat_estimates[i_point])
//         }
//     }
// };
//
// let set_bars = () => {
//     for (let bar of bars) {
//         messenger.message(['point'].concat(bar))
//     }
// };
//
// let process_beat_relative = (beat_relative: string) => {
//     point_beat_estimates = point_beat_estimates.concat([[parseFloat(beat_relative), 0]])
// };
//
// let test = () => {
//
// };

if (typeof Global !== "undefined") {
    Global.video_looper = {};
    Global.video_looper.bang = bang;
    Global.video_looper.set_attribute = set_attribute;
    Global.video_looper.receive_message_saga = receive_message_saga;
    Global.video_looper.start_saga_dance = start_saga_dance;
    // Global.video_looper.saga_dance = saga_dance();
    // Global.video_looper.test = test;
    // Global.function_manager.set_bars = set_bars;
    // Global.function_manager.clear_beats = clear_beats;
    // Global.function_manager.next = next;
    // Global.function_manager.parse_dump = parse_dump;
    // Global.function_manager.clear_points = clear_points;
    // Global.function_manager.affirm_cuts = affirm_cuts;
    // Global.function_manager.set_length_frames = set_length_frames;
    // Global.function_manager.looppoints = looppoints;
}
