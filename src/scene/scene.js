"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var scene;
(function (scene) {
    var Scene = /** @class */ (function () {
        function Scene(scene_dao) {
            this.scene_dao = scene_dao;
        }
        Scene.prototype.fire = function (force_legato) {
            this.scene_dao.fire(force_legato);
        };
        Scene.prototype.get_id = function () {
            // TODO: implement
            return;
        };
        return Scene;
    }());
    scene.Scene = Scene;
    var SceneDaoVirtual = /** @class */ (function () {
        function SceneDaoVirtual() {
        }
        SceneDaoVirtual.prototype.fire = function (force_legato) {
            return;
        };
        return SceneDaoVirtual;
    }());
    scene.SceneDaoVirtual = SceneDaoVirtual;
    var SceneDao = /** @class */ (function () {
        function SceneDao(live_api, messenger, deferlow, key_route, env) {
            this.live_api = live_api;
            this.messenger = messenger;
            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
            this.env = env;
        }
        SceneDao.prototype.set_path_deferlow = function (key_route_override, path_live) {
            var mess = [key_route_override];
            for (var _i = 0, _a = utils_1.utils.PathLive.to_message(path_live); _i < _a.length; _i++) {
                var word = _a[_i];
                mess.push(word);
            }
            this.messenger.message(mess);
        };
        SceneDao.prototype.fire = function (force_legato) {
            // if (this.deferlow) {
            //     this.messenger.message([this.key_route, "set", "loop_end", beat]);
            // } else {
            //     this.clip_live.set('loop_end', beat);
            // }
            if (this.deferlow) {
                this.messenger.message([this.key_route, "call", "fire", force_legato ? '1' : '0']);
            }
            else {
                this.live_api.call("fire", force_legato ? '1' : '0');
            }
        };
        return SceneDao;
    }());
    scene.SceneDao = SceneDao;
    var SceneIterator = /** @class */ (function () {
        function SceneIterator(scenes, direction_forward) {
            this.scenes = scenes;
            this.direction_forward = direction_forward;
            this.i = -1;
        }
        // TODO: type declarations
        SceneIterator.prototype.next = function () {
            var value_increment = (this.direction_forward) ? 1 : -1;
            this.i += value_increment;
            if (this.i < 0) {
                throw 'segment iterator < 0';
            }
            if (this.i < this.scenes.length) {
                return {
                    value: this.scenes[this.i],
                    done: false
                };
            }
            else {
                return {
                    value: null,
                    done: true
                };
            }
        };
        SceneIterator.prototype.current = function () {
            if (this.i > -1) {
                return this.scenes[this.i];
            }
            else {
                return null;
            }
        };
        SceneIterator.prototype.reset = function () {
            this.i = -1;
        };
        SceneIterator.prototype.get_index_current = function () {
            return this.i;
        };
        return SceneIterator;
    }());
    scene.SceneIterator = SceneIterator;
})(scene = exports.scene || (exports.scene = {}));
//# sourceMappingURL=scene.js.map