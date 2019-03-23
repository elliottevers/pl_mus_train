"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var song;
(function (song) {
    var Song = /** @class */ (function () {
        function Song(song_dao) {
            this.song_dao = song_dao;
        }
        Song.prototype.get_scene_at_index = function (index) {
        };
        Song.prototype.create_scene_at_index = function (index) {
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
        return Song;
    }());
    song.Song = Song;
    var SongDaoVirtual = /** @class */ (function () {
        function SongDaoVirtual(scenes) {
            this.scenes = scenes;
        }
        SongDaoVirtual.prototype.get_scenes = function () {
            var data = [];
            for (var _i = 0, _a = this.scenes; _i < _a.length; _i++) {
                var scene_1 = _a[_i];
                data.push('id');
                data.push(scene_1.get_id());
            }
            return data;
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
        function SongDao(clip_live, messenger, deferlow) {
            this.clip_live = clip_live;
            this.messenger = messenger;
            this.deferlow = deferlow;
        }
        SongDao.prototype.set_session_record = function (int) {
            this.clip_live.set("session_record", int);
        };
        SongDao.prototype.set_overdub = function (int) {
            this.clip_live.set("overdub", int);
        };
        SongDao.prototype.set_tempo = function (int) {
            this.clip_live.set("tempo", int);
        };
        SongDao.prototype.start = function () {
            this.clip_live.set("is_playing", 1);
        };
        SongDao.prototype.stop = function () {
            this.clip_live.set("is_playing", 0);
        };
        SongDao.prototype.get_scenes = function () {
            return this.clip_live.get("scenes");
        };
        return SongDao;
    }());
    song.SongDao = SongDao;
})(song = exports.song || (exports.song = {}));
//# sourceMappingURL=song.js.map