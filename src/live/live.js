"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live;
(function (live) {
    var LiveApiJs = /** @class */ (function () {
        function LiveApiJs(index_track, index_clip_slot) {
            var path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
            this.live_api = new LiveAPI(null, path);
        }
        LiveApiJs.prototype.get = function (property) {
            return this.live_api.get(property);
        };
        LiveApiJs.prototype.set = function (property, value) {
            this.live_api.set(property, value);
        };
        LiveApiJs.prototype.call = function (func) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.live_api).call.apply(_a, [func].concat(args));
        };
        return LiveApiJs;
    }());
    live.LiveApiJs = LiveApiJs;
})(live = exports.live || (exports.live = {}));
//# sourceMappingURL=live.js.map