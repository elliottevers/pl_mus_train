import {live} from '../live/live';
import {scene} from '../scene/scene';
import {track} from '../track/track';
import {cue_point} from '../cue_point/cue_point';

export namespace song {
    import iLiveApi = live.iLiveApi;
    import Scene = scene.Scene;
    import Track = track.Track;
    import SceneDao = scene.SceneDao;
    import CuePoint = cue_point.CuePoint;
    import CuePointDao = cue_point.CuePointDao;
    import LiveApiFactory = live.LiveApiFactory;
    import TypeIdentifier = live.TypeIdentifier;

    export class Song {

        song_dao: iSongDao;

        scenes: Scene[];

        tracks: Track[];

        cue_points: CuePoint[];

        constructor(song_dao: iSongDao) {
            this.song_dao = song_dao;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.song_dao.setMode(deferlow, synchronous)
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

        set_tempo(int): void {
            this.song_dao.set_tempo(int);
        }

        get_tempo(): number {
            return this.song_dao.get_tempo();
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

        get_path(): string {
            return this.song_dao.get_path()
        }

    }

    export interface iSongDao {
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
        get_tempo(): number
        start(): void
        stop(): void
        get_scenes(): any[]
        get_path(): string
        create_scene(index: number): void

        setMode(deferlow: boolean, synchronous: boolean): void;
    }

    export class SongDaoVirtual implements iSongDao {

        scenes: Scene[];

        constructor(scenes: Scene[]) {
            this.scenes = scenes;
        }

        setMode(deferlow: boolean, synchronous: boolean): void {

        }

        public create_scene(index: number): void {
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

        get_tempo(): number {
            return 0
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

        private live_api: iLiveApi;
        private deferlow: boolean = false;
        private synchronous: boolean = true;

        constructor(live_api: iLiveApi) {
            this.live_api = live_api;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.deferlow = deferlow;
            this.synchronous = synchronous;
        }

        set_session_record(int) {
            this.live_api.set('session_record', int, this.deferlow, this.synchronous);
        }

        set_overdub(int) {
            this.live_api.set('overdub', int, this.deferlow, this.synchronous);
        }

        set_tempo(int) {
            this.live_api.set('tempo', int, this.deferlow, this.synchronous);
        }

        get_tempo(): number {
            return Number(this.live_api.get('tempo', this.deferlow, this.synchronous));
        }

        start() {
            this.live_api.set('is_playing', 1, this.deferlow, this.synchronous);
        }

        stop() {
            this.live_api.set('is_playing', 0, this.deferlow, this.synchronous);
        }

        get_scenes(): any[] {
            let data_scenes = this.live_api.get('scenes', this.deferlow, this.synchronous);

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
                        LiveApiFactory.createFromConstructor(
                            this.live_api.constructor.name,
                            id_scene,
                            TypeIdentifier.ID
                        )
                    )
                )
            });
        }

        get_path(): string {
            return 'live_set'
        }

        create_scene(index: number): void {
            this.live_api.call(['create_scene', String(index)], this.deferlow, this.synchronous)
        }

        loop(status: boolean) {
            this.live_api.set('loop', status ? 1 : 0, this.deferlow, this.synchronous)
        }

        set_loop_length(length_beats: number) {
            this.live_api.set('loop_length', length_beats, this.deferlow, this.synchronous)
        }

        set_loop_start(beat_start: number) {
            this.live_api.set('loop_start', beat_start, this.deferlow, this.synchronous)
        }

        set_current_song_time(beat: number): void {
            this.live_api.set('current_song_time', String(beat), this.deferlow, this.synchronous);
        }

        jump_to_next_cue(): void {
            this.live_api.call(['jump_to_next_cue'], this.deferlow, this.synchronous);
        }

        set_or_delete_cue(): void {
            this.live_api.call(['set_or_delete_cue'], this.deferlow, this.synchronous);
        }

        get_cue_points() {
            let data_cue_points = this.live_api.get('cue_points', this.deferlow, this.synchronous);

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

            return cue_points.map((list_id_cue_point) => {
                return new CuePoint(
                    new CuePointDao(
                        LiveApiFactory.createFromConstructor(
                            this.live_api.constructor.name,
                            list_id_cue_point.join(' '),
                            TypeIdentifier.ID
                        )
                    )
                )
            });
        }
    }
}