import {live as li} from "../live/live";
import {song} from "../song/song";
import SongDao = song.SongDao;
import Song = song.Song;
import {message} from "../message/messenger";
import Messenger = message.Messenger;

export {}
const max_api = require('max-api');

max_api.addHandler('liveApiMaxSynchronousResult', (...res) => {
    // @ts-ignore
    global.liveApiMaxSynchronousResult = res;
    // @ts-ignore
    global.liveApiMaxSynchronousLocked = false;
});

max_api.addHandler('run', () => {

    let song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set',
                'node'
            ),
            // new Messenger('node_for_max', 0),
            null,
            false
        )
    );

    // song.start()
    max_api.post(song.get_tempo());
    max_api.post('finished');
});
