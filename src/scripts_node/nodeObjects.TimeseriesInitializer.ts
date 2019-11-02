import {message} from "../message/messenger";
import Messenger = message.Messenger;

const max_api = require('max-api');

enum Mode {
    Stream = 'stream',
    BulkWrite = 'bulk_write',
    Query = 'query'
}

let messenger_execute: Messenger;

let length_coll: number;

let max_coll: number;

let min_coll: number;


// TODO: make sure there are num(yields) + 1 calls to next

max_api.addHandler('_0', () => {
    sagaInitTimeseries.next();
});


max_api.addHandler('_1', (length) => {
    length_coll = length;
    sagaInitTimeseries.next();
});

max_api.addHandler('_2', (min) => {
    min_coll = min;
    sagaInitTimeseries.next();
});

max_api.addHandler('_3', (max) => {
    max_coll = max;
    sagaInitTimeseries.next();
});


max_api.addHandler('_4', () => {
    sagaInitTimeseries.next();
});

max_api.addHandler('_5', () => {
    sagaInitTimeseries.next();
});

max_api.addHandler('_6', () => {
    sagaInitTimeseries.next();
});

max_api.addHandler('_7', () => {
    sagaInitTimeseries.next();
});

max_api.addHandler('_8', () => {
    sagaInitTimeseries.next();
});

max_api.addHandler('_9', () => {
    sagaInitTimeseries.next();
});

max_api.addHandler('_10', () => {
    sagaInitTimeseries.next();
});

max_api.addHandler('_11', () => {
    sagaInitTimeseries.next();
});



let sagaInitTimeseries = function* () {

    messenger_execute.message(['_0', Mode.Query]);

    // .setMode(Mode.Query);

    // outlet(0, 'setMode', Mode.Query);

    yield;

    messenger_execute.message(['_1', 'length']);

    // .loadLength()

    yield;

    messenger_execute.message(['_2', 'min']);

    // .loadMin()

    yield;

    messenger_execute.message(['_3', 'max']);

    // .loadMax()

    yield;

    messenger_execute.message(['_4', Mode.BulkWrite]);

    yield;

    messenger_execute.message(['_5', max_coll * 2]);

    yield;

    messenger_execute.message(['_6', length_coll]);

    yield;

    messenger_execute.message(['_7', 0]);

    yield;

    messenger_execute.message(['_8', 'clear']);

    yield;

    messenger_execute.message(['_9', length_coll]);

    yield;

    messenger_execute.message(['_10', 'dump']);

    yield;

    messenger_execute.message(['_11', length_coll]);

    yield;

    messenger_execute.message(['_12', Mode.Stream]);

}();


max_api.addHandler('main', () => {
    sagaInitTimeseries.next();
});
