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
            post("setting session record");
            post("\n");
            this.clip_live.set("session_record", int);
        };
        return SongDao;
    }());
    song.SongDao = SongDao;
})(song = exports.song || (exports.song = {}));
//# sourceMappingURL=song.js.map