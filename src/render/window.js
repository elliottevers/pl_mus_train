"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CircularJSON = require('circular-json');
var window;
(function (window_1) {
    var red = [255, 0, 0];
    var black = [0, 0, 0];
    var window = /** @class */ (function () {
        function window() {
        }
        // height: number;
        // width: number;
        // messenger: m.Messenger;
        // clips: c.Clip[];
        // beats_per_measure: number;
        // root_parse_tree: TreeModel.Node<n.Note>;
        // leaves: TreeModel.Node<n.Note>[];
        // logger: Logger;
        // history_user_input: HistoryUserInput;
        window.prototype.wipe_render = function (messenger) {
            var msg_clear = ["clear"];
            msg_clear.unshift('render');
            this.messenger.message(msg_clear);
        };
        return window;
    }());
    window_1.window = window;
})(window = exports.window || (exports.window = {}));
//# sourceMappingURL=window.js.map