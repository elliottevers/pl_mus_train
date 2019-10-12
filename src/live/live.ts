import TreeModel = require("tree-model");
import {note as n} from "../note/note"
import {clip as module_clip} from "../clip/clip";


let node = require("deasync");
node.loop = node.runLoopOnce;


// declare let LiveAPI: any;

export namespace live {

    import Clip = module_clip.Clip;

    export class LiveApiFactory {
        public static create(name: string, ref: string, id?: boolean) {
            switch(name) {
                case 'LiveApiMaxSynchronous':
                    return new LiveApiJs(
                        ref,
                        'node',
                        id ? 'id' : 'path'
                    );
                case 'LiveApiJs':
                    return new LiveApiJs(
                        ref
                    );
                default:
                    throw 'cannot create LiveApiJs'
            }
        }
    }

    export interface iLiveApiJs {
        get(property: string): any;
        set(property: string, value: any): void;
        call(func: string): void;
        get_id(): any;
        get_path(): any;
        get_children(): any;
    }

    export class LiveApiMaxSynchronous implements iLiveApiJs {

        private idLive: string;  // either path or id
        private maxApi: any;
        private type_id: string;

        constructor(idLive, maxApi, type_id) {
            this.idLive = idLive;
            this.maxApi = maxApi;
            this.type_id = type_id;
        }

        public get(property) {

            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'get', property);

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }

        public set(property, value) {
            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'set', property, value);
        }

        public call(...args) {
            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'call', ...args);
        }

        public get_id() {
            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getid');

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }

        public get_path() {
            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getpath');

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }

        public get_children() {
            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getchildren');

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }
    }

    export class LiveApiJs implements iLiveApiJs {
        public object: any;

        // TODO: do dependency injection that's actually good
        constructor(path: string, env?: string, type_id?: string) {
            if (env == 'node') {
                const max_api = require('max-api');
                this.object = new LiveApiMaxSynchronous(path, max_api, type_id);
            } else {
                // @ts-ignore
                this.object = new LiveAPI(null, path);
            }
        }

        get(property: string): any {
            return this.object.get(property);
        }

        set(property: string, value: any): void {
            this.object.set(property, value)
        }

        call(func: string, ...args: any[]): any {
            return this.object.call(func, ...args);
        }

        get_id(): any {
            return this.object.id;
        }

        get_path(): string {
            return this.object.path;
        }

        get_children(): any {
            return this.object.children;
        }
    }
}