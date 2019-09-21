import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {video as v} from "../video/video";
import Video = v.Video;
import {execute} from "../execute/executor";
import CallableMax = execute.CallableMax;
import SynchronousDagExecutor = execute.SynchronousDagExecutor;

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
// 3. dump cut points (snap to beat estimates)
// 4. affirm cut points
// 5. start iteration
// 6. hit play button

declare let patcher: any;

let messenger = new Messenger(env, 0);

let video = new Video('/Users/elliottevers/Downloads/white-t-shirt.mp4', patcher);

video.load();

video.estimate_beats();

let looper_video = new VideoLooper(video);

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

// let set_bars = () => {
//     for (let bar of looper_video.get_bars()) {
//         messenger.message(['point'].concat(bar))
//     }
// };

// executor = new SynchronousDagExecutor(
//     [
//         new CallableMax( // 0
//             "load",
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 1
//             'set_length_frame',
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 2
//             'estimate_beats',
//             null,
//             hook_set_length,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 3
//             'min',
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 4
//             'min',
//             null,
//             hook_set_min,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 5
//             'max',
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 6
//             'max',
//             null,
//             hook_set_max,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 7
//             Mode.BulkWrite,
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 8
//             null,
//             null,
//             null,
//             hook_calculate_scale_factor,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 9
//             null,
//             null,
//             null,
//             hook_get_length,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 10
//             0,
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 11
//             'clear',
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 12 - initialize buffer size
//             null,
//             null,
//             null,
//             hook_get_length,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 13
//             'dump',
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 14 - send size of buffer out of outlet
//             null,
//             null,
//             null,
//             hook_get_length,
//             null,
//             messenger_execute
//         ),
//         new CallableMax( // 15
//             Mode.Stream,
//             null,
//             null,
//             null,
//             null,
//             messenger_execute
//         ),
//     ],
//     messenger_execute
// );


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
    // Global.function_manager.process_beat_relative = process_beat_relative;
    // Global.function_manager.set_bars = set_bars;
    // Global.function_manager.clear_beats = clear_beats;
    // Global.function_manager.next = next;
    // Global.function_manager.parse_dump = parse_dump;
    // Global.function_manager.clear_points = clear_points;
    // Global.function_manager.affirm_cuts = affirm_cuts;
    // Global.function_manager.set_length_frames = set_length_frames;
    // Global.function_manager.looppoints = looppoints;
}
