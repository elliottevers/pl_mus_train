import {video as v} from '../video/video';
import Interval = v.Interval;
import Frame = v.Frame;
import Percentile = v.Percentile;
import {functionBreakpoint as f} from "../function/functionBreakpoint";
import {max} from "../max/dao";
import MaxDao = max.MaxDao;

const max_api = require('max-api');

let latestCut: Percentile;

let video: v.Video;

let functionBreakpointPercentile = new f.FunctionBreakpoint<Percentile>(new MaxDao());

let intervalIterator: v.Iterator<Interval<Frame>>;

// @ts-ignore
global.maxObjects = {
    responsesProcessed: 0,
    responsesExpected: 0,
    responses: [],
    dynamicResponse: false,
    locked: false
};

max_api.addHandler('maxObjectsResult', (...res) => {
    // @ts-ignore
    global.maxObjects.responses = global.maxObjects.responses.concat(res.slice(1));

    // @ts-ignore
    global.maxObjects.responsesProcessed += 1;

    // @ts-ignore
    if (global.maxObjects.dynamicResponse) {
        // @ts-ignore
        global.maxObjects.responsesExpected = Number(res[2]) + 2;
        // @ts-ignore
        global.maxObjects.dynamicResponse = false;
    }

    // @ts-ignore
    if (global.maxObjects.responsesProcessed == global.maxObjects.responsesExpected) {
        // @ts-ignore
        global.maxObjects.locked = false;
    }
});

max_api.addHandler('setLatestCutFromFunction', function(){
    functionBreakpointPercentile.loadBreakpoints();
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
    video.getFrameCurrent();
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

    functionBreakpointPercentile.setMode(true, false);
    functionBreakpointPercentile.addBreakpoint(0, 0);
    functionBreakpointPercentile.setMode(false, true);

    video.loop(
        functionBreakpointPercentile.breakpoints.slice(-1)[0][0],
        defaultLoopLength
    )
});

max_api.addHandler('updateLatestCut', () => {

    functionBreakpointPercentile.loadBreakpoints();

    video.loop(
        functionBreakpointPercentile.breakpoints.slice(-2)[0][0],
        functionBreakpointPercentile.breakpoints.slice(-1)[0][0]
    )
});


max_api.addHandler('demoLatestCut', () => {
    video.loop(
        functionBreakpointPercentile.breakpoints.slice(-2)[0][0],
        functionBreakpointPercentile.breakpoints.slice(-1)[0][0]
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

max_api.addHandler('initializeVideo', (path) => {

    video = new v.Video(path, new MaxDao());

    video.load();

    video.loadDuration();

    video.stop();
});
