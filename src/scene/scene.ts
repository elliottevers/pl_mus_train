import {live as li} from "../live/live";

export namespace scene {

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
    }

    export interface iSceneDao {
        fire(force_legato: boolean)
    }

    export class SceneDaoVirtual implements iSceneDao {
        fire(force_legato: boolean) {
            return
        }
    }

    export class SceneDao implements iSceneDao {
        live_api: li.LiveApiJs;

        constructor(live_api: li.LiveApiJs) {
            this.live_api = live_api
        }

        public fire(force_legato: boolean) {
            this.live_api.call("fire", force_legato ? '1' : '0')
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