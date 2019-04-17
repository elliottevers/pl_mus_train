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
var parts = ['key_center', 'bass', 'chord', 'melody', 'vocal_harmony'];
var messenger = new Messenger(env, 0);
// let test = () => {
//
// };
var broadcast_dependencies = function () {
    //@ts-ignore
    var list_args = Array.prototype.slice.call(arguments);
    for (var i_option in list_args) {
        var option = list_args[Number(i_option)];
        messenger.message([parts[i_option], 'gate_render_dependency', option]);
    }
};
var broadcast_ground_truth = function (i_option) {
    for (var i_part in parts) {
        if (String(i_part) === String(i_option)) {
            messenger.message([parts[String(i_part)], 'gate_ground_truth', 1]);
            continue;
        }
        messenger.message([parts[String(i_part)], 'gate_ground_truth', 0]);
    }
};
// test();
if (typeof Global !== "undefined") {
    Global.dependency_broadcaster = {};
    Global.dependency_broadcaster.broadcast_dependencies = broadcast_dependencies;
    Global.dependency_broadcaster.broadcast_ground_truth = broadcast_ground_truth;
}

},{"../message/messenger":1}]},{},[2]);

var broadcast_dependencies = Global.dependency_broadcaster.broadcast_dependencies;
var broadcast_ground_truth = Global.dependency_broadcaster.broadcast_ground_truth;