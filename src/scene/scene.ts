import {live, live as li} from "../live/live";
import {message} from "../message/messenger";
import {utils} from "../utils/utils";

export namespace scene {

    import Messenger = message.Messenger;
    import iLiveApiJs = live.iLiveApiJs;

    export class Scene {

        scene_dao: SceneDao;

        constructor(scene_dao) {
            this.scene_dao = scene_dao;
        }

        public fire(force_legato: boolean) {
            this.scene_dao.fire(force_legato)
        }

        public get_id(): string {
            // TODO: implement
            return
        }

        set_path_deferlow(key_route): void {
            this.scene_dao.set_path_deferlow(
                'set_path_' + key_route,
                this.get_path()
            )
        }

        public get_path(): string {
            return this.scene_dao.get_path()
        }
    }

    export interface iSceneDao {
        fire(force_legato: boolean)
        get_path(): string
    }

    export class SceneDaoVirtual implements iSceneDao {
        fire(force_legato: boolean) {
            return
        }

        get_path(): string {
            return "";
        }
    }

    export class SceneDao implements iSceneDao {
        live_api;
        messenger: Messenger;
        deferlow: boolean;
        key_route: string;
        env: string;

        constructor(live_api: iLiveApiJs, messenger, deferlow?: boolean, key_route?: string, env?: string) {
            this.live_api = live_api;
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

        public fire(force_legato: boolean) {
            // if (this.deferlow) {
            //     this.messenger.message([this.key_route, "set", "loop_end", beat]);
            // } else {
            //     this.clip_live.set('loop_end', beat);
            // }
            if (this.deferlow) {
                this.messenger.message([this.key_route, "call", "fire", force_legato ? '1' : '0']);
            } else {
                this.live_api.call("fire", force_legato ? '1' : '0')

            }
        }

        get_path(): string {
            return utils.cleanse_path(this.live_api.get_path());
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