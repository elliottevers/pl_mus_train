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
        Messenger.prototype.message = function (message) {
            switch (this.env) {
                case 'max': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_max(message);
                    break;
                }
                case 'node': {
                    if (this.key_route) {
                        message.unshift(this.key_route);
                    }
                    this.message_node(message);
                    break;
                }
                case 'node_for_max': {
                    if (this.key_route) {
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
            var Max = require('max-api');
            Max.outlet(message);
            Max.post('sdkjflsdkjfl');
            Max.addHandler("bang", function () {
                Max.post("Who you think you bangin'?");
            });
        };
        return Messenger;
    }());
    message_1.Messenger = Messenger;
})(message = exports.message || (exports.message = {}));
//# sourceMappingURL=messenger.js.map