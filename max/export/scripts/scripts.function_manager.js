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
// workflow:
// 1. load video
// 2. set frame length
// 3. set cut points (snap to beat estimates)
// 4. affirm cut points
// 5. start iteration
// 6. hit play button
var messenger = new Messenger(env, 0);
var point_beat_estimates = [];
var points = [];
var frame_duples = [];
var done = false;
var i_current = -1;
var length_frames;
// let get_length_frames = () => {
//     messenger.message(['length_frames', length_frames])
// };
var set_length_frames = function (val) {
    length_frames = val;
};
// let init = () => {
//     // TODO:
//     get_length_frames()
// };
var next = function () {
    if (!done) {
        i_current += 1;
        done = i_current > frame_duples.length - 1;
        set_loop_endpoints();
    }
};
var affirm_cuts = function () {
    calculate_frame_duples();
};
var calculate_frame_duples = function () {
    frame_duples = points.map(function (duple) {
        return [
            Math.round(length_frames * duple[0]),
            Math.round(length_frames * duple[1])
        ];
    });
};
var set_loop_endpoints = function () {
    messenger.message(['loop_endpoints', frame_duples[i_current][0], frame_duples[i_current][1]]);
};
var parse_dump = function (x, y) {
    points = points.concat([[parseFloat(x), parseFloat(y)]]);
};
var clear_points = function () {
    points = [];
};
var clear_beats = function () {
    point_beat_estimates = [];
};
var set_beats = function () {
    // for (let i_point in point_beat_estimates) {
    //     if (parseInt(i_point) % 8 == 0) {
    //         // @ts-ignore
    //         messenger.message(['point'].concat(point_beat_estimates[i_point]))
    //     }
    // }
};
var process_beat_relative = function (beat_relative) {
    point_beat_estimates = point_beat_estimates.concat([[parseFloat(beat_relative), 0]]);
};
var test = function () {
};
if (typeof Global !== "undefined") {
    Global.function_manager = {};
    Global.function_manager.process_beat_relative = process_beat_relative;
    Global.function_manager.set_beats = set_beats;
    Global.function_manager.clear_beats = clear_beats;
    Global.function_manager.next = next;
    Global.function_manager.parse_dump = parse_dump;
    Global.function_manager.clear_points = clear_points;
    Global.function_manager.affirm_cuts = affirm_cuts;
    Global.function_manager.set_length_frames = set_length_frames;
}

},{"../message/messenger":1}]},{},[2]);

var process_beat_relative = Global.function_manager.process_beat_relative;
var set_beats = Global.function_manager.set_beats;
var clear_beats = Global.function_manager.clear_beats;
var next = Global.function_manager.next;
var parse_dump = Global.function_manager.parse_dump;
var clear_points = Global.function_manager.clear_points;
var affirm_cuts = Global.function_manager.affirm_cuts;
var set_length_frames = Global.function_manager.set_length_frames;