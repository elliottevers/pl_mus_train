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

        set_overdub(int) {
            this.song_dao.set_overdub(int);
        }

        set_tempo(int) {
            this.song_dao.set_tempo(int);
        }

        start() {
            this.song_dao.start()
        }

        stop() {
            this.song_dao.stop()
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

        set_overdub(int) {
            this.clip_live.set("overdub", int);
        }

        set_tempo(int) {
            this.clip_live.set("tempo", int);
        }

        start() {
            this.clip_live.set("is_playing", 1);
        }

        stop() {
            this.clip_live.set("is_playing", 0);
        }
    }
}