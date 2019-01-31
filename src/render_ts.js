"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env = 'node';
if (env === 'max') {
    autowatch = 1;
}
var makeArr = function (startValue, stopValue, cardinality) {
    var arr = [];
    var currValue = startValue;
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(currValue + (step * i));
    }
    return arr;
};
var main = function () {
    var arr_lin = makeArr(0, 1000, 75752);
    // let testing = 1;
    var num_samples = arr_lin.length;
    var len_song_ms = Math.round(2.2 * Math.pow(10, 5));
    var len_window_pixels = Math.round(1.0 * Math.pow(10, 4));
    var len_sample_pixels = len_window_pixels / num_samples;
    var testing = 1;
    // for (let message in messages) {
    //     outlet(0, message)
    // }
};
if (typeof Global !== "undefined") {
    Global.render_ts = {};
    Global.render_ts.main = main;
}
main();
//# sourceMappingURL=render_ts.js.map