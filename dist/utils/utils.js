"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var utils;
(function (utils) {
    utils.cleanse_path = function (path) {
        return path.replace('/"', '');
    };
    utils.get_clip_on_this_device_at_index = function (index) {
        // TODO: implement
        return;
    };
    utils.get_path_this_track = function () {
        // @ts-ignore
        var LiveApiJs = live_1.live.LiveApiJs;
        var this_device = new LiveApiJs('this_device');
        var path_this_device = this_device.get_path();
        return path_this_device.split(' ').slice(0, 3).join(' ');
    };
    utils.get_this_track = function () {
        // TODO: use the method above
        return;
    };
    var PathLive = /** @class */ (function () {
        function PathLive() {
        }
        // pre-sending message
        PathLive.to_vector = function (path_live) {
            var message = [];
            for (var _i = 0, _a = path_live.split(' '); _i < _a.length; _i++) {
                var word = _a[_i];
                var cleansed = word.replace(/"/g, "");
                if (isNaN(Number(cleansed))) {
                    message.push(cleansed);
                }
                else {
                    message.push(Number(cleansed));
                }
            }
            return message;
        };
        PathLive.to_message = function (path_live) {
            return PathLive.to_vector(path_live);
        };
        // parsing sent message
        PathLive.to_string = function (vector_path_live) {
            return PathLive.to_message(vector_path_live.join(' ')).join(' ');
        };
        return PathLive;
    }());
    utils.PathLive = PathLive;
    utils.remainder = function (top, bottom) {
        return ((top % bottom) + bottom) % bottom;
    };
    utils.division_int = function (top, bottom) {
        return Math.floor(top / bottom);
    };
    utils.path_clip_from_list_path_device = function (list_path_device) {
        // list_path_device.shift();
        list_path_device[list_path_device.length - 2] = 'clip_slots';
        list_path_device.push('clip');
        var path_clip = list_path_device.join(' ');
        return path_clip;
    };
    var Set = /** @class */ (function () {
        function Set(items) {
            this.addItem = function (value) {
                this._data[value] = true;
                return this;
            };
            this.removeItem = function (value) {
                delete this._data[value];
                return this;
            };
            this.addItems = function (values) {
                for (var i = 0; i < values.length; i++) {
                    this.addItem(values[i]);
                }
                return this;
            };
            this.removeItems = function (values) {
                for (var i = 0; i < values.length; i++) {
                    this.removeItem(values[i]);
                }
                return this;
            };
            this.contains = function (value) {
                return !!this._data[value];
            };
            this.reset = function () {
                this._data = {};
                return this;
            };
            this.data = function () {
                return Object.keys(this._data);
            };
            this.each = function (callback) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    callback(data[i]);
                }
            };
            this._data = {};
            this.addItems(items);
        }
        return Set;
    }());
    utils.Set = Set;
})(utils = exports.utils || (exports.utils = {}));
//# sourceMappingURL=utils.js.map