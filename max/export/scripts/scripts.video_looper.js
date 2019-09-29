(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message;
(function (message_1) {
    var Messenger = /** @class */ (function () {
        function Messenger(env, outlet, key_route) {
            this.env = env;
            this.outlet = outlet;
            this.key_route = key_route;
        }
        Messenger.prototype.get_key_route = function () {
            return this.key_route;
        };
        Messenger.prototype.message = function (message, override) {
            switch (this.env) {
                case 'max': {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_max(message);
                    break;
                }
                case 'node': {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_node(message);
                    break;
                }
                case 'node_for_max': {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_node_for_max(message);
                    break;
                }
            }
        };
        Messenger.prototype.message_max = function (message) {
            outlet(this.outlet, message);
        };
        Messenger.prototype.message_node = function (message) {
            console.log("Messenger:");
            console.log("\n");
            console.log(message);
            console.log("\n");
        };
        Messenger.prototype.message_node_for_max = function (message) {
            // const Max = require('max-api');
            // Max.outlet(message);
        };
        return Messenger;
    }());
    message_1.Messenger = Messenger;
})(message = exports.message || (exports.message = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// TODO: beat estimates
// workflow:
// 1. load video
// 2. set frame length
// 2.5. get beat estimates
// user cuts
// 3. dump cut points (snap to beat estimates)
// 4. affirm cut points
// 5. start iteration
// 6. hit play button
var messenger = new Messenger(env, 0);
var initialize = function () {
    messenger.message(["load_video"]);
    messenger.message(["getduration"]);
};
var set_length_frames = function (length_frames) {
};
// declare let patcher: any;
// let video = new Video('/Users/elliottevers/Downloads/white-t-shirt.mp4', patcher);
// video.load();
//
// video.estimate_beats();
//
// let looper_video = new VideoLooper(video);
var path_video;
var set_path_video = function (path) {
    path_video = path;
};
var set_loop_points = function () {
    var frame_lower = 0;
    var frame_upper = 1;
    messenger.message(['looppoints', frame_lower, frame_upper]);
};
var set_frame_length = function () {
};
var get_frame_length = function () {
};
var get_beat_estimates = function () {
    messenger.message(['beat_estimates', 'bang']);
};
var set_beat_estimates = function () {
};
var set_cuts = function () {
};
var attribute = 0;
var set_attribute = function () {
    attribute += 1;
};
var bang = function () {
    // function * generatorFunction() { // Line 1
    //     // console.log('This will be executed first.');
    //     yield 'Hello, ';   // Line 2
    //     // console.log('I will be printed after the pause');
    //     yield 'World!';
    // }
    // const generatorObject = generatorFunction(); // Line 3
    // messenger.message([generatorObject.next().value]); // Line 4
    // messenger.message([generatorObject.next().value]); // Line 5
    // messenger.message([generatorObject.next().value]); // Line 6
    // outlet(0, "bang");
    // outlet(0, "anything");
    //
    // outlet(0, "set_attribute");
    // outlet(0, attribute)
    var handler = {
        get: function (target, name) {
            return name in target ? target[name] : 42;
        }
    };
    var p = new Proxy({}, handler);
    p.a = 1;
    // console.log(p.a, p.b); // 1, 42
    post(p.a);
    post(p.b);
};
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
if (typeof Global !== "undefined") {
    Global.video_looper = {};
    Global.video_looper.bang = bang;
    Global.video_looper.set_attribute = set_attribute;
    // Global.function_manager.set_bars = set_bars;
    // Global.function_manager.clear_beats = clear_beats;
    // Global.function_manager.next = next;
    // Global.function_manager.parse_dump = parse_dump;
    // Global.function_manager.clear_points = clear_points;
    // Global.function_manager.affirm_cuts = affirm_cuts;
    // Global.function_manager.set_length_frames = set_length_frames;
    // Global.function_manager.looppoints = looppoints;
}

},{"../message/messenger":1}]},{},[2]);

var bang = Global.video_looper.bang;
var set_attribute = Global.video_looper.set_attribute;