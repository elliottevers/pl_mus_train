import {video as v} from '../video/video';
import Interval = v.Interval;
import Frame = v.Frame;
import {message} from '../message/messenger';
import Messenger = message.Messenger;
import {live} from '../live/live';
import Env = live.Env;
import Percentile = v.Percentile;
import {functionBreakpoint as f} from "../function/functionBreakpoint";

const max_api = require('max-api');

let latestCut: Percentile;

let messenger = new Messenger(Env.NODE_FOR_MAX, 0);

let video: v.Video;

let functionBreakpointPercentile = new f.FunctionBreakpoint<Percentile>();

let intervalIterator: v.Iterator<Interval<Frame>>;

let pathVideo: string;


let setLatestCutFromFunctionSaga = function*() {
    functionBreakpointPercentile.listDump();

    yield;

    latestCut = functionBreakpointPercentile.breakpoints.slice(-1)[0][0]
}();

max_api.addHandler('setLatestCutFromFunction', function(){
    setLatestCutFromFunctionSaga.next()
});

max_api.addHandler('parseListDump', function(){
    let listArgs = Array.prototype.slice.call(arguments);
    let breakpoints = listArgs.reduce(function (r, a, i) {
        if (i % 2) {
            r[r.length - 1].push(a);
        } else {
            r.push([a]);
        }
        return r;
    }, []);
    functionBreakpointPercentile.breakpoints = breakpoints;
});

max_api.addHandler('confirmLatestCut', function(){
    functionBreakpointPercentile.addBreakpoint(latestCut, 0);

    const percentileLower = functionBreakpointPercentile.breakpoints[-1][0];

    video.loop(
        percentileLower,
        defaultLoopLength
    );
});

max_api.addHandler('setLatestCutAtTimeCurrent', function(){
    video.requestFrameCurrent();
});

max_api.addHandler('outletVideo', function(){
    let listArgs = Array.prototype.slice.call(arguments);

    switch (String(listArgs[0])) {
        case 'time':
            latestCut = video.percentileFromFrame(Number(listArgs[1]));
            break;
        case 'duration':
            video.setDuration(Number(listArgs[1]));
            sagaInitializeVideo.next();
            break;
        case 'read':
            sagaInitializeVideo.next();
            break;
        default:
            return
    }
});

max_api.addHandler('beginTrain', () => {
    intervalIterator = new v.Iterator<Interval<Frame>>(
        v.Iterator.createIntervals<Frame>(
            functionBreakpointPercentile.breakpoints.map(interval => interval[0]),
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

let defaultLoopLength: Percentile = .10;

max_api.addHandler('setDefaultLoopLength', (lengthFrames) => {
    defaultLoopLength = lengthFrames
});

// handlers

max_api.addHandler('prepareTrainingData', () => {
    // set first cut at 0 frames
    functionBreakpointPercentile.addBreakpoint(0, 0);
    // loop video with length
    video.loop(
        functionBreakpointPercentile.breakpoints.slice(-1)[0][0],
        defaultLoopLength
    )
});

max_api.addHandler('demoLatestCut', () => {
    video.loop(
        functionBreakpointPercentile.breakpoints.slice(-1)[0][0],
        latestCut
    )
});

max_api.addHandler('loopDefault', () => {
    video.loop(
        functionBreakpointPercentile.breakpoints.slice(-1)[0][0],
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

    video.requestDuration();

    video.stop();
}();

max_api.addHandler('initializeVideo', (path) => {
    pathVideo = path;
    sagaInitializeVideo.next();
});
