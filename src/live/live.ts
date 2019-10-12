import TreeModel = require("tree-model");
import {note as n} from "../note/note"
import {clip as module_clip} from "../clip/clip";


let node = require("deasync");
node.loop = node.runLoopOnce;


// declare let LiveAPI: any;

export namespace live {

    import Clip = module_clip.Clip;

    export enum TypeIdentifier {
        PATH,
        ID
    }

    export enum Env {
        NODE_FOR_MAX,
        MAX,
        NODE
    }

    export class LiveApiFactory {
        // TODO: env, type of identifier
        public static create(env: Env, identifier: string, typeIdentifier: TypeIdentifier) {
            switch(env) {
                case Env.NODE_FOR_MAX:
                    return new LiveApiMaxSynchronous(
                        identifier,
                        'node',
                        id ? 'id' : 'path'
                    );
                case Env.MAX:
                    // @ts-ignore
                    this.object = new LiveAPI(null, identifier);
                    return new LiveApiJs(
                        ref
                    );
                case Env.NODE:
                    // TODO: How will we be able to do read queries?
                    break;
                default:
                    throw 'cannot create LiveApi'
            }
        }

        public static createFromConstructor(nameConstructor: string, identifier: string, typeIdentifier: TypeIdentifier) {
            switch(nameConstructor) {
                case 'LiveApiMaxSynchronous':
                    return new LiveApiMaxSynchronous(
                        identifier,
                        'node',
                        id ? 'id' : 'path'
                    );
                case 'LiveApi':
                    // @ts-ignore
                    return new LiveAPI(null, identifier);
                case Env.NODE:
                    // TODO: How will we be able to do read queries?
                    break;
                default:
                    throw 'cannot create LiveApi'
            }
        }
    }

    export interface iLiveApiJs {
        get(property: string): any;
        set(property: string, value: any): void;
        call(...args): void;
        get_id(): any;
        get_path(): any;
        get_children(): any;
    }

    // this should only work for node_for_max (node should just use a virtual dao?)
    export class LiveApiMaxSynchronous implements iLiveApiJs {

        private refLive: string;  // either path or id
        private typeRef: TypeIdentifier;
        private maxApi: any;


        constructor(refLive, typeRef: TypeIdentifier) {
            this.refLive = refLive;
            this.typeRef = typeRef;
            this.maxApi = require('max-api');
        }

        public get(property) {

            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'get', property);

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }

        public set(property, value) {
            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'set', property, value);
        }

        public call(...args) {
            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'call', ...args);
        }

        public get_id() {
            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
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

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
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

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getchildren');

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }
    }
}