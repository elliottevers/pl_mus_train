import {message} from "../message/messenger";
import {live} from "../live/live";
import {scene} from "../scene/scene";

export namespace song {
    import Messenger = message.Messenger;
    import iLiveApiJs = live.iLiveApiJs;
    import Scene = scene.Scene;

    export class Song {

        song_dao: iSongDao;

        constructor(song_dao: iSongDao) {
            this.song_dao = song_dao;
        }

        get_scene_at_index(index: number) {

        }

        create_scene_at_index(index: number) {

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

        get_scenes(): any[] {
            return this.song_dao.get_scenes()
        }

        get_num_scenes(): number {
            return this.get_scenes().length/2
        }
    }

    export interface iSongDao {
        set_session_record(int: number)
        set_overdub(int: number)
        set_tempo(int: number)
        start(): void
        stop(): void
        get_scenes(): any[]
    }

    export class SongDaoVirtual implements iSongDao {

        scenes: Scene[];

        constructor(scenes: Scene[]) {
            this.scenes = scenes
        }

        get_scenes(): string[] {
            let data: string[] = [];
            for (let scene of this.scenes) {
                data.push('id');
                data.push(scene.get_id());
            }
            return data;
        }

        set_overdub(int: number) {
            return
        }

        set_session_record(int: number) {
            return
        }

        set_tempo(int: number) {
            return
        }

        start(): void {
            return
        }

        stop(): void {
            return
        }
    }

    export class SongDao implements iSongDao {

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

        get_scenes(): any[] {
            return this.clip_live.get("scenes")
        }
    }
}