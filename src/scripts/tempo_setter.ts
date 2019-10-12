import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {song} from "../song/song";
import SongDao = song.SongDao;
import Song = song.Song;
import Env = live.Env;
import LiveApiFactory = live.LiveApiFactory;
import TypeIdentifier = live.TypeIdentifier;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

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
            ),
            new Messenger(Env.MAX, 0)
        )
    );

    song.set_tempo(int)
};

if (typeof Global !== "undefined") {
    Global.tempo_setter = {};
    Global.tempo_setter.set_tempo = set_tempo;
}
