import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {map} from "../control/map";
import FretMapper = map.FretMapper;
import {live as li} from "../live/live";
import {song} from "../song/song";
import SongDao = song.SongDao;
import Song = song.Song;
import {user_input} from "../control/user_input";

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let set_tempo = (int) => {
    let song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set',
            ),
            new Messenger(env, 0),
            false
        )
    );

    song.set_tempo(int)
};

if (typeof Global !== "undefined") {
    Global.tempo_setter = {};
    Global.tempo_setter.set_tempo = set_tempo;
}
