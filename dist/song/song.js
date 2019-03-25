"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var live_1 = require("../live/live");
var scene_1 = require("../scene/scene");
var utils_1 = require("../utils/utils");
var song;
(function (song) {
    var Scene = scene_1.scene.Scene;
    var SceneDao = scene_1.scene.SceneDao;
    var LiveApiJs = live_1.live.LiveApiJs;
    var Song = /** @class */ (function () {
        function Song(song_dao) {
            this.song_dao = song_dao;
            // automatically set path at time of instantiation
            if (this.song_dao.is_async()) {
                this.set_path_deferlow('set_path_' + this.song_dao.key_route);
            }
        }
        Song.prototype.load_scenes = function () {
            this.scenes = this.song_dao.get_scenes();
        };
        Song.prototype.get_scene_at_index = function (index) {
            return this.scenes[index];
        };
        Song.prototype.create_scene_at_index = function (index) {
            this.song_dao.create_scene(index);
        };
        Song.prototype.set_session_record = function (int) {
            this.song_dao.set_session_record(int);
        };
        Song.prototype.set_overdub = function (int) {
            this.song_dao.set_overdub(int);
        };
        Song.prototype.set_tempo = function (int) {
            this.song_dao.set_tempo(int);
        };
        Song.prototype.start = function () {
            this.song_dao.start();
        };
        Song.prototype.stop = function () {
            this.song_dao.stop();
        };
        Song.prototype.get_scenes = function () {
            return this.song_dao.get_scenes();
        };
        Song.prototype.get_num_scenes = function () {
            return this.get_scenes().length / 2;
        };
        Song.prototype.set_path_deferlow = function (key_route) {
            this.song_dao.set_path_deferlow(key_route, this.get_path());
        };
        Song.prototype.get_path = function () {
            return this.song_dao.get_path();
        };
        return Song;
    }());
    song.Song = Song;
    var SongDaoVirtual = /** @class */ (function () {
        // constructor(scenes: Scene[], messenger: Messenger, deferlow?: boolean, key_route?: string, env?: string) {
        function SongDaoVirtual(scenes) {
            this.scenes = scenes;
            // if (deferlow && !key_route) {
            //     throw new Error('key route not specified when using deferlow');
            // }
            // this.deferlow = deferlow;
            // this.key_route = key_route;
        }
        SongDaoVirtual.prototype.create_scene = function (index) {
        };
        SongDaoVirtual.prototype.set_path_deferlow = function (key_route_override, path_live) {
            return;
        };
        SongDaoVirtual.prototype.is_async = function () {
            // return this.deferlow
            return false;
        };
        SongDaoVirtual.prototype.get_path = function () {
            return 'live_set';
        };
        SongDaoVirtual.prototype.get_scenes = function () {
            var data = [];
            for (var _i = 0, _a = this.scenes; _i < _a.length; _i++) {
                var scene_2 = _a[_i];
                data.push('id');
                data.push(scene_2.get_id());
            }
            return data;
        };
        SongDaoVirtual.prototype.load_scenes = function () {
        };
        SongDaoVirtual.prototype.set_overdub = function (int) {
            return;
        };
        SongDaoVirtual.prototype.set_session_record = function (int) {
            return;
        };
        SongDaoVirtual.prototype.set_tempo = function (int) {
            return;
        };
        SongDaoVirtual.prototype.start = function () {
            return;
        };
        SongDaoVirtual.prototype.stop = function () {
            return;
        };
        return SongDaoVirtual;
    }());
    song.SongDaoVirtual = SongDaoVirtual;
    var SongDao = /** @class */ (function () {
        function SongDao(song_live, messenger, deferlow, key_route, env) {
            // constructor(song_live: iLiveApiJs, patcher: Patcher, deferlow?: boolean, key_route?: string, env?: string) {
            this.song_live = song_live;
            this.messenger = messenger;
            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
            this.env = env;
            // automatically set the deferlow path
            // this.patcher.getnamed('song').message('set', 'session_record', String(int))
        }
        SongDao.prototype.set_path_deferlow = function (key_route_override, path_live) {
            var mess = [key_route_override];
            for (var _i = 0, _a = utils_1.utils.PathLive.to_message(path_live); _i < _a.length; _i++) {
                var word = _a[_i];
                mess.push(word);
            }
            this.messenger.message(mess);
        };
        SongDao.prototype.is_async = function () {
            return this.deferlow;
        };
        SongDao.prototype.set_session_record = function (int) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "session_record", String(int)]);
            }
            else {
                this.song_live.set("session_record", String(int));
            }
            // if (this.deferlow) {
            //     this.patcher.getnamed('song').message('set', 'session_record', String(int))
            // } else {
            //
            // }
        };
        SongDao.prototype.set_overdub = function (int) {
            this.song_live.set("overdub", int);
        };
        SongDao.prototype.set_tempo = function (int) {
            this.song_live.set("tempo", int);
        };
        SongDao.prototype.start = function () {
            this.song_live.set("is_playing", 1);
        };
        SongDao.prototype.stop = function () {
            this.song_live.set("is_playing", 0);
        };
        SongDao.prototype.get_scenes = function () {
            var _this = this;
            var data_scenes = this.song_live.get("scenes");
            var scenes = [];
            var scene = [];
            for (var i_datum in data_scenes) {
                var datum = data_scenes[Number(i_datum)];
                scene.push(datum);
                if (Number(i_datum) % 2 === 1) {
                    scenes.push(scene);
                }
            }
            return scenes.map(function (id_scene) {
                return new Scene(new SceneDao(new LiveApiJs(id_scene), _this.messenger));
            });
        };
        SongDao.prototype.get_path = function () {
            return 'live_set';
        };
        SongDao.prototype.create_scene = function (index) {
            this.song_live.call('create_scene', String(index));
        };
        return SongDao;
    }());
    song.SongDao = SongDao;
})(song = exports.song || (exports.song = {}));
//# sourceMappingURL=song.js.map