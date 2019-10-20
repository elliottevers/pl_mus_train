import {live} from "../live/live";
import {utils} from "../utils/utils";

export namespace scene {

    import iLiveApi = live.iLiveApi;

    export class Scene {

        scene_dao: iSceneDao;

        constructor(scene_dao) {
            this.scene_dao = scene_dao;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.scene_dao.setMode(deferlow, synchronous)
        }

        public fire(force_legato: boolean) {
            this.scene_dao.fire(force_legato)
        }

        // WARNING: this doesn't do anything meaningful
        public get_id(): string {
            return this.scene_dao.get_id()
        }

        public get_path(): string {
            return this.scene_dao.get_path()
        }
    }

    export interface iSceneDao {
        fire(force_legato: boolean)

        get_path(): string

        setMode(deferlow: boolean, synchronous: boolean): void;

        get_id(): string;
    }

    export class SceneDaoVirtual implements iSceneDao {
        fire(force_legato: boolean) {

        }

        get_path(): string {
            return "";
        }

        setMode(deferlow: boolean, synchronous: boolean): void {

        }

        get_id(): string {
            return "";
        }
    }

    export class SceneDao implements iSceneDao {
        live_api: iLiveApi;
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

        public fire(force_legato: boolean) {
            if (force_legato) {
                this.live_api.call(['fire', '1'], this.deferlow, this.synchronous)
            } else {
                this.live_api.call(['fire'], this.deferlow, this.synchronous)
            }
        }

        get_path(): string {
            return utils.cleanse_path(this.live_api.get_path(this.deferlow, this.synchronous));
        }

        // WARNING: verify
        get_id(): string {
            return this.live_api.get_id(this.deferlow, this.synchronous);
        }
    }

    export class SceneIterator {
        private scenes: Scene[];
        public direction_forward: boolean;
        private i: number;

        constructor(scenes: Scene[], direction_forward: boolean) {
            this.scenes = scenes;
            this.direction_forward = direction_forward;
            this.i = -1;
        }

        // TODO: type declarations
        public next() {
            let value_increment = (this.direction_forward) ? 1 : -1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'segment iterator < 0'
            }

            if (this.i < this.scenes.length) {
                return {
                    value: this.scenes[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.scenes[this.i];
            } else {
                return null;
            }
        }

        public reset() {
            this.i = -1;
        }

        public get_index_current() {
            return this.i;
        }
    }
}