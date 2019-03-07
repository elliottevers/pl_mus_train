"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var struct_1 = require("../train/struct");
var CircularJSON = require('circular-json');
var window;
(function (window) {
    var red = [255, 0, 0];
    var black = [0, 0, 0];
    var Window = /** @class */ (function () {
        function Window() {
        }
        Window.prototype.clear = function (messenger) {
            var msg_clear = ["clear"];
            msg_clear.unshift('render');
            this.messenger.message(msg_clear);
        };
        Window.prototype.add = function (notes) {
        };
        return Window;
    }());
    var ListWindow = /** @class */ (function (_super) {
        __extends(ListWindow, _super);
        function ListWindow() {
            var _this = _super.call(this) || this;
            _this.struct = new struct_1.struct.StructList();
            return _this;
        }
        return ListWindow;
    }(Window));
    window.ListWindow = ListWindow;
    var TreeWindow = /** @class */ (function (_super) {
        __extends(TreeWindow, _super);
        function TreeWindow() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TreeWindow;
    }(Window));
    window.TreeWindow = TreeWindow;
})(window = exports.window || (exports.window = {}));
//# sourceMappingURL=window.js.map