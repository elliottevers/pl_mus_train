import {message} from "../message/messenger";
import {live} from "../live/live";

export namespace song {
    import Messenger = message.Messenger;
    import iLiveApiJs = live.iLiveApiJs;

    export class Song {

        song_dao: SongDao;

        constructor(song_dao) {
            this.song_dao = song_dao;
        }

        set_session_record(int) {
            this.song_dao.set_session_record(int);
        }
    }

    export class SongDao {

        private clip_live: iLiveApiJs;
        private messenger: Messenger;
        private deferlow: boolean;

        constructor(clip_live: iLiveApiJs, messenger, deferlow: boolean) {
            this.clip_live = clip_live;
            this.messenger = messenger;
            this.deferlow = deferlow;
        }

        set_session_record(int) {
            this.clip_live.set("session_record", int);
        }
    }
}