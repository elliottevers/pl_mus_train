"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var song;
(function (song) {
    var Song = /** @class */ (function () {
        function Song(song_dao) {
            this.song_dao = song_dao;
        }
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
        return Song;
    }());
    song.Song = Song;
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
        return SongDao;
    }());
    song.SongDao = SongDao;
})(song = exports.song || (exports.song = {}));
//# sourceMappingURL=song.js.map