(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message;
(function (message_1) {
    // TODO: the following
    // type Env = 'max' | 'node';
    var Messenger = /** @class */ (function () {
        function Messenger(env, outlet, key_route) {
            this.env = env;
            this.outlet = outlet;
            this.key_route = key_route;
        }
        Messenger.prototype.get_key_route = function () {
            return this.key_route;
        };
        Messenger.prototype.message = function (message) {
            if (this.env === 'max') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_max(message);
            }
            else if (this.env === 'node') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_node(message);
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
var messenger;
// let conversion_filetype = (filename_to_convert, destination_filetype) => {
//     var base = filename_to_convert.substr(0, filename_to_convert.lastIndexOf('.')) || filename_to_convert;
//     let filename_destination = [base, '.', destination_filetype].join('');
//     messenger = new Messenger(env, 0);
//     messenger.message([filename_destination]);
// };
var test = function () {
    // let file_to_convert = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/audio/youtube/tswift_teardrops.webm';
    // let destination_filetype = 'mp3';
    // var base = file_to_convert.substr(0, file_to_convert.lastIndexOf('.')) || file_to_convert;
    // let filename_destination = [base, '.', destination_filetype].join('');
    // let testing = 1;
};
var midi = function (pitch_midi) {
    messenger = new Messenger(env, 0);
    if (pitch_midi == 69) {
        messenger.message([2, 5, 1]);
    }
    else {
        messenger.message([2, 5, 0]);
    }
};
if (typeof Global !== "undefined") {
    Global.map_midi_to_fret = {};
    Global.map_midi_to_fret.midi = midi;
}

},{"../message/messenger":1}]},{},[2]);

var midi = Global.map_midi_to_fret.midi;

