"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils;
(function (utils) {
    var PathLive = /** @class */ (function () {
        function PathLive() {
        }
        PathLive.to_message = function (path_live) {
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
        return PathLive;
    }());
    utils.PathLive = PathLive;
})(utils = exports.utils || (exports.utils = {}));
//# sourceMappingURL=utils.js.map