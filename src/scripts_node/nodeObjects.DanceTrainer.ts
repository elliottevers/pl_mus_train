import {video as v} from "../video/video";
import BreakpointFunction = v.BreakpointFunction;
import Point = v.Point;
import Percentile = v.Percentile;
import Interval = v.Interval;
import Frame = v.Frame;
import {message} from "../message/messenger";
import Messenger = message.Messenger;

export {}
const max_api = require('max-api');


// let set_bars = () => {
//     for (let bar of looper_video.get_bars()) {
//         messenger.message(['point'].concat(bar))
//     }
// };

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


let beatEstimatesRelative: Percentile[] = [];

let cuts: Point[] = [];

let messenger = new Messenger('node_for_max', 0);

let video: v.Video;

let breakpointFunction: BreakpointFunction;

let intervalIterator: v.Iterator<Interval<Frame>>;

let frameCurrent: Frame;

let i = -1;

let y = 0;

// TODO: branch for getting latest cut?

max_api.addHandler("quantizeNth", function(){
    let listArgs = Array.prototype.slice.call(arguments);
    let xQuantized = video.getQuantizedX(listArgs[2*i]);
    messenger.message(['quantizeNth', 'list', i, xQuantized, y])
});

// UI handlers

max_api.addHandler("quantizeLatestCut", () => {
    // TODO: make a switch to control the flow to another branch
    // open gate quantizeNth
    messenger.message(['quantizeLatestCut', 'listdump'])
});

max_api.addHandler("loopWithLatestCut", () => {
    let x = 1;

    let frameLower = video.getConfirmedCuts()[-1];

    let frameUpper = video.frameFromPercentile(x);

    messenger.message(['loopWithLatestCut', 'looppoints', frameLower, frameUpper])
});

max_api.addHandler("createNextCutFromCurrentFrame", () => {

});

max_api.addHandler("confirmLatestCut", () => {
    // TODO: make a switch to control the flow to another branch
    // open gate confirm latest cut
    messenger.message(['confirmLatestCut', 'listdump'])
});

max_api.addHandler("setDefaultLoopLength", () => {

});

max_api.addHandler("beginTrain", () => {

});

max_api.addHandler("advanceInterval", () => {

});


// non-saga handlers

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

max_api.addHandler("addCutButton", () => {
    sagaSetCutButton.next();
});

// actions
let actionLoadVideo = 'loadVideo';
let actionQueryLength = 'loadLength';
let actionBeatEstimationDone = 'beatEstimationDone';
let actionCutsFinalized = 'cutsFinalized';
let actionUpdateCuts = 'updateCuts';

let actionAdvanceInterval = 'advanceInterval';

let actionGetTime = 'getTime';


// action handlers
max_api.addHandler(actionLoadVideo, () => {
    sagaInitializeVideo.next();
});

max_api.addHandler(actionQueryLength, (duration) => {
    video.setDuration(duration);
    sagaInitializeVideo.next();
});

max_api.addHandler(actionBeatEstimationDone, () => {
    video.setBeatEstimatesRelative(beatEstimatesRelative);
    sagaInitializeVideo.next();
});

max_api.addHandler(actionCutsFinalized, () => {
    sageFinalizeCuts.next();
});


max_api.addHandler(actionAdvanceInterval, () => {
    intervalIterator.next();
});

max_api.addHandler(actionGetTime, (f) => {
    frameCurrent = f

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

let sagaSetCutButton = function* () {
    messenger.message(['gettime']);

    yield;

    messenger.message(['setCutButton', frameCurrent/video.getDuration()]);
}();

let sagaLoopVideo = function* () {

    intervalIterator = new v.Iterator<Interval<Frame>>(
        v.Iterator.createIntervals<Frame>(
            v.Video.framesFromPercentiles(
                breakpointFunction.getCuts().map((c) => {
                    return c[0]
                }),
                video.getDuration()
            )
        ).map(duple => {
            return new Interval<Frame>(
                duple[0],
                duple[1]
            )
        })
    );

    let res = intervalIterator.next();

    let intervalFirst = res.value;

    messenger.message(['looppoints'].concat(intervalFirst.getInterval().map((n) => {return String(n)})));

    yield;

    // TODO: anything?

}();


let sageFinalizeCuts = function* () {

    yield;


}();


let sagaInitializeVideo = function* (pathVideo) {
    // max_api.outlet(actionLoadVideo, 'read', '/Users/elliottevers/Downloads/white-t-shirt.mp4');

    video = new v.Video(pathVideo, messenger);

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

max_api.addHandler("startSagaInitializeVideo", (pathVideo) => {
    sagaInitializeVideo.next(pathVideo);
});
