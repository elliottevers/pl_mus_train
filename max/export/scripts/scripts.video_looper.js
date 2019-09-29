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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var test = function () {
    post("hello world!");
};
var receive_message_saga = function (name_saga, val_saga) {
    // post(Global);
    // this["test"]()
    // eval(name_saga + ".next();")
    // saga_dance.next()
};
// TODO: do we ever need to use yield to set value of variable?
// TODO: what about using libraries in between async calls?
var saga_dance = function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                post("loading video...");
                messenger.message(["load_video"]);
                return [4 /*yield*/];
            case 1:
                _a.sent();
                post("setting frame length...");
                messenger.message(["set_frame_length"]);
                return [4 /*yield*/];
            case 2:
                _a.sent();
                post("getting beat estimates...");
                messenger.message(["get_beat_estimates"]);
                return [2 /*return*/];
        }
    });
}();
var start_saga_dance = function () {
    saga_dance.next();
    saga_dance.next();
    saga_dance.next();
};
// var test = function*(){
//     console.log(1);
//     yield
//     console.log(2);
//     yield
// }
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
    Global.video_looper.receive_message_saga = receive_message_saga;
    Global.video_looper.start_saga_dance = start_saga_dance;
    // Global.video_looper.saga_dance = saga_dance();
    // Global.video_looper.test = test;
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
var receive_message_saga = Global.video_looper.receive_message_saga;
var start_saga_dance = Global.video_looper.start_saga_dance;
// var saga_dance = Global.video_looper.saga_dance;