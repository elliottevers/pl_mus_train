import {video as v} from "../video/video";
import BreakpointFunction = v.BreakpointFunction;
import Point = v.Point;
import Percentile = v.Percentile;
import Interval = v.Interval;
import Frame = v.Frame;
import {message} from "../message/messenger";
import Messenger = message.Messenger;

const max_api = require('max-api');

let BRANCH_QUANTIZE_LATEST_CUT = 1;
let BRANCH_CONFIRM_LATEST_CUT = 2;

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

// max_api.addHandler("quantizeNth", function(){
//     let listArgs = Array.prototype.slice.call(arguments);
//     let xQuantized = video.getQuantizedX(listArgs[2*i]);
//     messenger.message(['quantizeNth', 'list', i, xQuantized, y])
// });

// UI processes


// QUANTIZE LATEST CUT
/////////////////

max_api.addHandler("quantizeLatestCut", () => {
    messenger.message(['gateFunctionOutlet3', BRANCH_QUANTIZE_LATEST_CUT]);
    messenger.message(['quantizeLatestCut', 'listdump'])
});

max_api.addHandler("quantizeNth", function(){
    let listArgs = Array.prototype.slice.call(arguments);
    let xQuantized = video.getQuantizedX(listArgs[2*i]);
    messenger.message(['quantizeNth', 'list', i, xQuantized, y])
});
/////////////////


// CREATE CUT FROM CURRENT FRAME
/////////////////

let sagaCreateNextCutFromCurrentFrame = function*() {

    messenger.message(['gettime']);

    yield;

    let x = video.percentileFromFrame(frameCurrent);

    messenger.message(['createNextCutFromCurrentFrame', x, y])
}();

max_api.addHandler("createNextCutFromCurrentFrame", () => {
    sagaCreateNextCutFromCurrentFrame.next()
});

let actionGetTime = 'time';

max_api.addHandler(actionGetTime, (f) => {
    frameCurrent = f;
    sagaCreateNextCutFromCurrentFrame.next();
});
/////////////////


max_api.addHandler("loopWithLatestCut", () => {
    let x = 1;

    let frameLower = video.getConfirmedCuts()[-1];

    let frameUpper = video.frameFromPercentile(x);

    messenger.message(['loopWithLatestCut', 'looppoints', frameLower, frameUpper])
});

max_api.addHandler("confirmLatestCut", () => {
    // TODO: make a switch to control the flow to another branch
    // open gate confirm latest cut
    messenger.message(['gate', BRANCH_CONFIRM_LATEST_CUT]);
    messenger.message(['confirmLatestCut', 'listdump']);
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

// max_api.addHandler("addCutButton", () => {
//     sagaSetCutButton.next();
// });

// actions
let actionLoadVideo = 'loadVideo';
let actionQueryLength = 'loadLength';
let actionBeatEstimationDone = 'beatEstimationDone';
let actionCutsFinalized = 'cutsFinalized';
let actionUpdateCuts = 'updateCuts';

let actionAdvanceInterval = 'advanceInterval';



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
