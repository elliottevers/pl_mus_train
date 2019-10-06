import {video as v} from "../video/video";
import Point = v.Point;
import Percentile = v.Percentile;
import Interval = v.Interval;
import Frame = v.Frame;
import {message} from "../message/messenger";
import Messenger = message.Messenger;

const max_api = require('max-api');

let BRANCH_QUANTIZE_LATEST_CUT = 1;
let BRANCH_LOOP_WITH_LATEST_CUT = 2;
let BRANCH_CONFIRM_LATEST_CUT = 3;

let beatEstimatesRelative: Percentile[] = [];

let cuts: Point[] = [];

let messenger = new Messenger('node_for_max', 0);

let video: v.Video;

let intervalIterator: v.Iterator<Interval<Frame>>;

let frameCurrent: Frame;

let i = -1;

let y = 0;

let EPSILON = 4;

let BEATS_LOOP_DEFAULT = 4 * 4 + EPSILON;


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


// LOOP WITH LATEST CUT
/////////////////

max_api.addHandler("loopWithLatestCut", () => {

    messenger.message(['gateFunctionOutlet3', BRANCH_LOOP_WITH_LATEST_CUT]);
    messenger.message(['loopWithLatestCut', 'listdump']);
});

max_api.addHandler("loopWithNth", function(){
    let listArgs = Array.prototype.slice.call(arguments);
    let xLastCut = listArgs[2*i];

    let frameLower = video.getConfirmedCuts()[-1];
    let frameUpper = video.frameFromPercentile(xLastCut);

    messenger.message(['loopWithNth', 'looppoints', frameLower, frameUpper])
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


// CONFIRM LATEST CUT
/////////////////

max_api.addHandler("confirmLatestCut", () => {
    // TODO: make a switch to control the flow to another branch
    // open gate confirm latest cut
    messenger.message(['gateFunctionOutlet3', BRANCH_CONFIRM_LATEST_CUT]);
    messenger.message(['confirmLatestCut', 'listdump']);
});

max_api.addHandler("confirmLatestCut", function(){
    let listArgs = Array.prototype.slice.call(arguments);
    let xLastCut = listArgs[2*i];

    video.addCut(xLastCut);

    let frameLower = v.Video.framesFromPercentiles(
        video.getConfirmedCuts(),
        video.getDuration()
    )[-1];

    let diff = video.beatsToFrames(
        BEATS_LOOP_DEFAULT
    );

    messenger.message(['loopNext', 'looppoints', frameLower, frameLower + diff])
});

/////////////////


// BEGIN TRAIN
/////////////////

max_api.addHandler("beginTrain", () => {
    intervalIterator = new v.Iterator<Interval<Frame>>(
        v.Iterator.createIntervals<Frame>(
            v.Video.framesFromPercentiles(
                video.getConfirmedCuts(),
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
});

/////////////////


// ADVANCE INTERVAL
/////////////////

max_api.addHandler("advanceInterval", () => {
    let res = intervalIterator.next();

    let intervalNext = res.value;

    messenger.message(['looppoints'].concat(intervalNext.getInterval().map((n) => {return String(n)})));
});

/////////////////



max_api.addHandler("setDefaultLoopLength", () => {

});


// non-saga handlers

max_api.addHandler("processBeatRelative", (beat) => {
    beatEstimatesRelative = beatEstimatesRelative.concat([parseFloat(beat)])
});

max_api.addHandler("processCut", (x, y) => {
    cuts = cuts.concat([parseFloat(x), parseFloat(y)])
});


// actions
let actionLoadVideo = 'loadVideo';
let actionQueryLength = 'loadLength';
let actionBeatEstimationDone = 'beatEstimationDone';

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

max_api.addHandler(actionAdvanceInterval, () => {
    intervalIterator.next();
});

// workflow:
// 1. load video
// 2. set frame length
// 3. get beat estimates, so that we can snap to grid
// 4. iterate right to left, with a default loop length, perfecting cuts along the way
// 5. begin train, advancing segment when finished

let sagaInitializeVideo = function* (pathVideo) {
    // max_api.outlet(actionLoadVideo, 'read', '/Users/elliottevers/Downloads/white-t-shirt.mp4');

    video = new v.Video(pathVideo, messenger);

    video.load();

    yield;

    video.loadDuration();

    yield;

    max_api.outlet('getBeatEstimates', 'bang');

    yield;

    // ready for snapping
    video.setBeatEstimatesRelative(beatEstimatesRelative);

}();

max_api.addHandler("startSagaInitializeVideo", (pathVideo) => {
    sagaInitializeVideo.next(pathVideo);
});
