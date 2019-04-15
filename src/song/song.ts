import {message} from "../message/messenger";
import {live} from "../live/live";
import {scene} from "../scene/scene";
import {utils} from "../utils/utils";
import {track} from "../track/track";
import {log} from "../log/logger";
import {cue_point} from "../cue_point/cue_point";

export namespace song {
    import Messenger = message.Messenger;
    import iLiveApiJs = live.iLiveApiJs;
    import Scene = scene.Scene;
    import Track = track.Track;
    import SceneDao = scene.SceneDao;
    import LiveApiJs = live.LiveApiJs;
    import Logger = log.Logger;
    import CuePoint = cue_point.CuePoint;
    import CuePointDao = cue_point.CuePointDao;

    export class Song {

        song_dao: iSongDao;

        scenes: Scene[];

        tracks: Track[];

        cue_points: CuePoint[];

        constructor(song_dao: iSongDao) {
            this.song_dao = song_dao;
        }

        get_cue_points() {
            return this.song_dao.get_cue_points()
        }

        set_or_delete_cue() {
            this.song_dao.set_or_delete_cue()
        }

        jump_to_next_cue() {
            this.song_dao.jump_to_next_cue()
        }

        set_current_song_time(beat: number) {
            this.song_dao.set_current_song_time(beat);
        }

        loop(status: boolean) {
            this.song_dao.loop(status);
        }

        set_loop_start(beat_start: number) {
            this.song_dao.set_loop_start(beat_start);

        }

        set_loop_length(length_beats: number) {
            this.song_dao.set_loop_length(length_beats);
        }

        load_scenes(): void {
            this.scenes = this.song_dao.get_scenes();
        }

        get_scene_at_index(index: number): Scene {
            if (this.scenes.length > index) {
                return this.scenes[index]
            } else {
                return null
            }
        }

        create_scene_at_index(index: number) {
            this.song_dao.create_scene(index)
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
                'set_path_' + key_route,
                this.get_path()
            )
        }

        get_path(): string {
            return this.song_dao.get_path()
        }

    }

    export interface iSongDao {
        key_route;
        get_cue_points()
        set_or_delete_cue(): void
        jump_to_next_cue(): void
        set_current_song_time(beat: number): void
        loop(status: boolean): void
        set_loop_start(beat_start: number): void
        set_loop_length(length_beats: number): void
        set_session_record(int: number)
        set_overdub(int: number)
        set_tempo(int: number)
        start(): void
        stop(): void
        get_scenes(): any[]
        get_path(): string
        set_path_deferlow(key_route_override: string, path_live: string): void
        create_scene(index: number): void
    }

    export class SongDaoVirtual implements iSongDao {

        public key_route: string;

        scenes: Scene[];

        constructor(scenes: Scene[]) {
            this.scenes = scenes;
        }

        public create_scene(index: number): void {
            return
        }

        public set_path_deferlow(key_route_override: string, path_live: string): void {
            return
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

        load_scenes(): void {

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

        loop(status: boolean) {

        }

        set_loop_length(length_beats: number) {

        }

        set_loop_start(beat_start: number) {

        }

        set_current_song_time(beat: number): void {

        }

        jump_to_next_cue(): void {

        }

        set_or_delete_cue(): void {

        }

        get_cue_points() {

        }
    }

    export class SongDao implements iSongDao {

        private song_live;
        private messenger: Messenger;
        private deferlow: boolean;
        public key_route: string;
        private env: string;

        constructor(song_live: iLiveApiJs, messenger, deferlow?: boolean, key_route?: string, env?: string) {
            this.song_live = song_live;
            this.messenger = messenger;
            if (deferlow && !key_route) {
                throw new Error('key route not specified when using deferlow');
            }
            this.deferlow = deferlow;
            this.key_route = key_route;
            this.env = env;
        }

        set_path_deferlow(key_route_override: string, path_live: string): void {
            let mess: any[] = [key_route_override];

            for (let word of utils.PathLive.to_message(path_live)) {
                mess.push(word)
            }

            this.messenger.message(mess)
        }

        set_session_record(int) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "session_record", String(int)]);
            } else {
                this.song_live.set("session_record", int);

            }
        }

        set_overdub(int) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "overdub", String(int)]);
            } else {
                // this.song_live.set("overdub", int);
                this.song_live.set("overdub", int);

            }
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
            let data_scenes = this.song_live.get("scenes");

            let scenes = [];

            let scene = [];

            for (let i_datum in data_scenes) {

                let datum = data_scenes[Number(i_datum)];

                scene.push(datum);

                if (Number(i_datum) % 2 === 1) {
                    scenes.push(scene)
                }
            }

            return scenes.map((id_scene) => {
                return new Scene(
                    new SceneDao(
                        new LiveApiJs(
                            id_scene
                        ),
                        this.messenger
                    )
                )
            });
        }

        get_path(): string {
            return 'live_set'
        }

        create_scene(index: number): void {
            this.song_live.call('create_scene', String(index))
        }

        loop(status: boolean) {
            this.song_live.set("loop", status ? 1 : 0)
        }

        set_loop_length(length_beats: number) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "loop_length", String(length_beats)]);
            } else {
                this.song_live.set("loop_length", length_beats)
            }
        }

        set_loop_start(beat_start: number) {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "loop_start", String(beat_start)]);
            } else {
                this.song_live.set("loop_start", beat_start)
            }
        }

        set_current_song_time(beat: number): void {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "set", "current_song_time", String(beat)]);
            } else {
                this.song_live.set("current_song_time", String(beat));
            }
        }

        jump_to_next_cue(): void {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "call", "jump_to_next_cue"]);
            } else {
                this.song_live.call("jump_to_next_cue");
            }
        }

        set_or_delete_cue(): void {
            if (this.deferlow) {
                this.messenger.message([this.key_route, "call", "set_or_delete_cue"]);
            } else {
                this.song_live.call("set_or_delete_cue");
            }
        }

        get_cue_points() {
            let data_cue_points = this.song_live.get("cue_points");

            let logger = new Logger('max');

            let cue_points = [];

            let cue_point = [];

            for (let i_datum in data_cue_points) {

                let datum = data_cue_points[Number(i_datum)];

                cue_point.push(datum);

                if (Number(i_datum) % 2 === 1) {
                    cue_points.push(cue_point);
                    cue_point = [];
                }
            }

            logger.log(JSON.stringify(data_cue_points));

            return cue_points.map((list_id_cue_point) => {
                return new CuePoint(
                    new CuePointDao(
                        new LiveApiJs(
                            list_id_cue_point.join(' ')
                        ),
                        new Messenger('max', 0)
                    )
                )
            });
        }
    }
}