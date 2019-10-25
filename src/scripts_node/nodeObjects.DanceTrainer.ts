import {video as v} from '../video/video';
import Point = v.Point;
import Interval = v.Interval;
import Frame = v.Frame;
import {message} from '../message/messenger';
import Messenger = message.Messenger;
import {live} from '../live/live';
import Env = live.Env;
import Percentile = v.Percentile;
import {functionBreakpoint as f} from "../function/functionBreakpoint";

const max_api = require('max-api');

let cuts: Point[] = [];

let latestCut: Percentile;

let messenger = new Messenger(Env.NODE_FOR_MAX, 0);

let video: v.Video;

let functionBreakpoint = new f.FunctionBreakpoint<Percentile>();

let intervalIterator: v.Iterator<Interval<Frame>>;

let i = -1;

let y = 0;

let pathVideo: string;


// max_api.addHandler('confirmLatestCut', () => {
//     // TODO: make a switch to control the flow to another branch
//     // open gate confirm latest cut
//     messenger.message(['gateFunctionOutlet3', BRANCH_CONFIRM_LATEST_CUT]);
//     messenger.message(['confirmLatestCut', 'listdump']);
// });


max_api.addHandler('setLatestCut', function(){
    let listArgs = Array.prototype.slice.call(arguments);
    latestCut = listArgs[2*i];
});


max_api.addHandler('confirmLatestCut', function(){
    video.addCut(latestCut);

    const percentileLower = video.getConfirmedCuts()[-1];

    video.loop(
        percentileLower,
        defaultLoopLength
    );
});

max_api.addHandler('setCutAtTimeCurrent', function(timeRaw: string){

    let time: Frame = Number(timeRaw);

    latestCut = video.percentileFromFrame(time);

    functionBreakpoint.load([latestCut, 0]);



});

max_api.addHandler('beginTrain', () => {
    intervalIterator = new v.Iterator<Interval<Frame>>(
        v.Iterator.createIntervals<Frame>(
            video.getConfirmedCuts(),
        ).map(duple => {
            return new Interval<Frame>(
                duple[0],
                duple[1]
            )
        })
    );

    let res = intervalIterator.next();

    let intervalFirst = res.value;

    Interval.send(intervalFirst);
});

max_api.addHandler('advanceInterval', () => {
    let res = intervalIterator.next();

    let intervalNext = res.value;

    Interval.send(intervalNext);
});
/////////////////

let defaultLoopLength: Percentile = 10;

max_api.addHandler('setDefaultLoopLength', (lengthFrames) => {
    defaultLoopLength = lengthFrames
});

// handlers

max_api.addHandler('processCut', (x, y) => {
    cuts = cuts.concat([parseFloat(x), parseFloat(y)])
});

max_api.addHandler('prepareTrainingData', () => {
    // set first cut at 0 frames
    video.addCut(0);
    // loop video with length
    video.loop(
        video.getConfirmedCuts()[-1],
        video.frameFromPercentile(defaultLoopLength)
    )
});

max_api.addHandler('demoLatestCut', () => {
    video.loop(
        video.getConfirmedCuts()[-1],
        latestCut
    )
});

max_api.addHandler('loopDefault', () => {
    video.loop(
        video.getConfirmedCuts()[-1],
        defaultLoopLength
    )
});

// workflow:
// 1. load video
// 2. set frame length
// 3. iterate right to left, with a default loop length, setting perfect cut at each step
// 4. toggle demo new cut, back to default loop
// 5. confirm cut (automatic advance)
// 6. begin train, advancing segment when finished

let sagaInitializeVideo = function* () {

    video = new v.Video(pathVideo, messenger);

    video.load();

    yield;

    video.loadDuration();

    // video.stop();
}();

max_api.addHandler('initializeVideo', (path) => {
    pathVideo = path;
    sagaInitializeVideo.next();
});

max_api.addHandler('load', () => {
    sagaInitializeVideo.next();
});

max_api.addHandler('framecount', (duration) => {
    video.setDuration(duration);
    sagaInitializeVideo.next();
});
