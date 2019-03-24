import {message} from "../message/messenger";
import {live} from "../live/live";
import {scene} from "../scene/scene";
import {utils} from "../utils/utils";

export namespace song {
    import Messenger = message.Messenger;
    import iLiveApiJs = live.iLiveApiJs;
    import Scene = scene.Scene;

    export class Song {

        song_dao: iSongDao;

        constructor(song_dao: iSongDao) {
            this.song_dao = song_dao;
            // automatically set path at time of instantiation
            if (this.song_dao.is_async()) {
                this.set_path_deferlow('set_path_' + this.song_dao.key_route)
            }
        }

        get_scene_at_index(index: number): Scene {
            return
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

        set_path_deferlow(key_route): void {
            this.song_dao.set_path_deferlow(
                key_route,
                this.get_path()
            )
        }

        get_path(): string {
            return this.song_dao.get_path()
        }

    }

    export interface iSongDao {
        key_route;
        set_session_record(int: number)
        set_overdub(int: number)
        set_tempo(int: number)
        start(): void
        stop(): void
        get_scenes(): any[]
        get_path(): string
        set_path_deferlow(key_route_override: string, path_live: string): void
        is_async(): boolean
    }

    export class SongDaoVirtual implements iSongDao {

        private deferlow: boolean;
        public key_route: string;

        scenes: Scene[];

        // constructor(scenes: Scene[], messenger: Messenger, deferlow?: boolean, key_route?: string, env?: string) {
        constructor(scenes: Scene[], messenger: Messenger, deferlow?: boolean, key_route?: string, env?: string) {
            this.scenes = scenes;

            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
        }

        public set_path_deferlow(key_route_override: string, path_live: string): void {
            return
        }

        public is_async(): boolean {
            return this.deferlow
        }

        get_path(): string {
            return 'live_set'
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

        private song_live: iLiveApiJs;
        private messenger: Messenger;
        private deferlow: boolean;
        public key_route: string;
        private env: string;

        constructor(song_live: iLiveApiJs, messenger, deferlow?: boolean, key_route?: string, env?: string) {
        // constructor(song_live: iLiveApiJs, patcher: Patcher, deferlow?: boolean, key_route?: string, env?: string) {
            this.song_live = song_live;
            this.messenger = messenger;
            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
            this.env = env;

            // automatically set the deferlow path
            // this.patcher.getnamed('song').message('set', 'session_record', String(int))
        }

        set_path_deferlow(key_route_override: string, path_live: string): void {
            let mess: any[] = [key_route_override];

            for (let word of utils.PathLive.to_message(path_live)) {
                mess.push(word)
            }

            this.messenger.message(mess)
        }

        public is_async(): boolean {
            return this.deferlow;
        }

        set_session_record(int) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "session_record", String(int)]);
            } else {
                this.song_live.set("session_record", String(int));
            }
            // if (this.deferlow) {
            //     this.patcher.getnamed('song').message('set', 'session_record', String(int))
            // } else {
            //
            // }
        }

        set_overdub(int) {
            this.song_live.set("overdub", int);
        }

        set_tempo(int) {
            this.song_live.set("tempo", int);
        }

        start() {
            this.song_live.set("is_playing", 1);
        }

        stop() {
            this.song_live.set("is_playing", 0);
        }

        get_scenes(): any[] {
            return this.song_live.get("scenes")
        }

        get_path(): string {
            return 'live_set'
        }
    }
}