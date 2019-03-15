"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("../live/live");
var song_1 = require("../song/song");
var SongDao = song_1.song.SongDao;
var Song = song_1.song.Song;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var set_tempo = function (int) {
    var song = new Song(new SongDao(new live_1.live.LiveApiJs('live_set'), new Messenger(env, 0), false));
    song.set_tempo(int);
};
if (typeof Global !== "undefined") {
    Global.tempo_setter = {};
    Global.tempo_setter.set_tempo = set_tempo;
}
//# sourceMappingURL=tempo_setter.js.map