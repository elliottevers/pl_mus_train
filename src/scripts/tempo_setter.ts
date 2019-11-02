import {live} from "../live/live";
import {song} from "../song/song";
import SongDao = song.SongDao;
import Song = song.Song;
import Env = live.Env;
import LiveApiFactory = live.LiveApiFactory;
import TypeIdentifier = live.TypeIdentifier;

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let set_tempo = (int) => {
    let song = new Song(
        new SongDao(
            LiveApiFactory.create(
                Env.MAX,
                'live_set',
                TypeIdentifier.PATH
            )
        )
    );

    song.set_tempo(int)
};

if (typeof Global !== "undefined") {
    Global.tempo_setter = {};
    Global.tempo_setter.set_tempo = set_tempo;
}
