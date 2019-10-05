import {video as v} from "../video/video";
import BreakpointFunction = v.BreakpointFunction;
import Point = v.Point;
import BeatPositionPercentile = v.BeatPositionPercentile;

export {}
const max_api = require('max-api');




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



// let receive_message_saga = (name_saga, val_saga) => {
//     // post(Global);
//     // this["test"]()
//     // eval(name_saga + ".next();")
//     // saga_dance.next()
// };
//
// // TODO: do we ever need to use yield to set value of variable?
// // TODO: what about using libraries in between async calls?



let beatEstimatesRelative: BeatPositionPercentile[] = [];

let cuts: Point[] = [];

let video: v.Video;

let breakpointFunction: BreakpointFunction;


max_api.addHandler("processBeatRelative", (beat) => {
    beatEstimatesRelative = beatEstimatesRelative.concat([parseFloat(beat)])
});

max_api.addHandler("processUpdateCuts", () => {
    // beatEstimatesRelative = beatEstimatesRelative.concat([parseFloat(beat)])
    breakpointFunction.dump();  // NB: async
    cuts = [];
});

max_api.addHandler("processCut", (x, y) => {
    // beatEstimatesRelative = beatEstimatesRelative.concat([parseFloat(beat)])
    // breakpointFunction.dump();  // NB: async
    // cuts = [];
    cuts = cuts.concat([parseFloat(x), parseFloat(y)])
});

// actions
let actionLoadVideo = 'loadVideo';
let actionQueryLength = 'loadLength';
let actionBeatEstimationDone = 'beatEstimationDone';
let actionCutsFinalized = 'cutsFinalized';
let actionUpdateCuts = 'updateCuts';


// action handlers
max_api.addHandler(actionLoadVideo, () => {
    sagaInitializeVideo.next();
});

max_api.addHandler(actionQueryLength, (duration) => {
    // durationFrames = duration;
    video.setDuration(duration);
    // sagaLoopVideo.next(durationFrames);
    sagaInitializeVideo.next();
});

max_api.addHandler(actionBeatEstimationDone, () => {
    // video.setBeatEstimates()
    video.setBeatEstimatesRelative(beatEstimatesRelative);
    sagaInitializeVideo.next();
});

max_api.addHandler(actionCutsFinalized, () => {
    // video.setBeatEstimates()
    // video.setBeatEstimatesRelative(beatEstimatesRelative);
    sageFinalizeCuts.next();
});


// workflow:
// 1. load video
// 2. set frame length
// 2.5. get beat estimates

// user cuts

// 3. dump cut points (snap to beat estimates)
// 4. affirm cut points
// 5. start iteration
// 6. hit play button

let sageLoopVideo = function* () {

    let intervalIterator: //Iterator

    yield;



}();


let sageFinalizeCuts = function* () {

    yield;



}();


let sagaInitializeVideo = function* (pathVideo) {
    // max_api.outlet(actionLoadVideo, 'read', '/Users/elliottevers/Downloads/white-t-shirt.mp4');

    video = new v.Video(pathVideo);

    video.load();

    yield;

    // max_api.outlet(actionQueryLength, 'getduration');

    video.loadDuration();

    // let d = yield;
    yield;

    // yield;
    // max_api.post("duration is " + d);

    max_api.outlet('getBeatEstimates', 'bang');

    yield;

    // for (let beat of pointBeatEstimates) {
    //     max_api.post(beat);
    // }


    // ready for snapping
    video.setBeatEstimatesRelative(beatEstimatesRelative);

    yield;

    breakpointFunction = new BreakpointFunction();

    yield;

    // TODO: set cut, confirm (most recent) cut, delete (most recent) cut

}();
//
// let start_saga_dance = () => {
//     saga_dance.next();
//     // saga_dance.next();
//     // saga_dance.next();
// };

max_api.addHandler("startSaga", (pathVideo) => {
    sagaInitializeVideo.next(pathVideo);
});
