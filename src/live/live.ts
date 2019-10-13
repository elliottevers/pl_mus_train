let node = require("deasync");
node.loop = node.runLoopOnce;

// declare let LiveAPI: any;

export namespace live {

    export enum TypeIdentifier {
        PATH = 'path',
        ID = 'id'
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
                        typeIdentifier
                    );
                case Env.MAX:
                    // @ts-ignore
                    this.object = new LiveAPI(null, identifier);
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
                    let res = new LiveApiMaxSynchronous(
                        identifier,
                        typeIdentifier,
                    );
                    return res;
                case 'LiveApi':
                    // @ts-ignore
                    return new LiveAPI(null, identifier);
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

        constructor(refLive: string, typeRef: TypeIdentifier) {
            this.refLive = refLive;
            this.typeRef = typeRef;
            this.maxApi = require('max-api');
        }

        public get(property) {

            // @ts-ignore
            global.liveApi.locked = true;

            // @ts-ignore
            global.liveApi.responses = [];

            // @ts-ignore
            global.liveApi.responsesProcessed = 0;

            // @ts-ignore
            global.liveApi.responsesExpected = 1;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'get', property);

            // @ts-ignore
            while (global.liveApi.locked)
                node.loop();

            // @ts-ignore
            return global.liveApi.responses;
        }

        public set(property, value) {
            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'set', property, value);
        }

        public call(...args) {

            // @ts-ignore
            global.liveApi.locked = true;

            // @ts-ignore
            global.liveApi.responses = [];

            // @ts-ignore
            global.liveApi.responsesProcessed = 0;

            // @ts-ignore
            global.liveApi.responsesExpected = 1;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'call', ...args);

            // @ts-ignore
            while (global.liveApi.locked)
                node.loop();

            // @ts-ignore
            return global.liveApi.responses;
        }

        public get_id() {
            // // @ts-ignore
            // global.liveApiMaxSynchronousLocked = true;
            //
            // this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
            // this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getid');
            //
            // // @ts-ignore
            // while (global.liveApiMaxSynchronousLocked)
            //     node.loop();
            //
            // // @ts-ignore
            // return global.liveApiMaxSynchronousResult

            // @ts-ignore
            global.liveApi.locked = true;

            // @ts-ignore
            global.liveApi.responses = [];

            // @ts-ignore
            global.liveApi.responsesProcessed = 0;

            // @ts-ignore
            global.liveApi.responsesExpected = 1;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getid');

            // @ts-ignore
            while (global.liveApi.locked)
                node.loop();

            // @ts-ignore
            return global.liveApi.responses;
        }

        public get_path() {
            // // @ts-ignore
            // global.liveApiMaxSynchronousLocked = true;
            //
            // this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
            // this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getpath');
            //
            // // @ts-ignore
            // while (global.liveApiMaxSynchronousLocked)
            //     node.loop();
            //
            // // @ts-ignore
            // return global.liveApiMaxSynchronousResult

            // @ts-ignore
            global.liveApi.locked = true;

            // @ts-ignore
            global.liveApi.responses = [];

            // @ts-ignore
            global.liveApi.responsesProcessed = 0;

            // @ts-ignore
            global.liveApi.responsesExpected = 1;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getpath');

            // @ts-ignore
            while (global.liveApi.locked)
                node.loop();

            // @ts-ignore
            return global.liveApi.responses;
        }

        public get_children() {
            // // @ts-ignore
            // global.liveApiMaxSynchronousLocked = true;
            //
            // this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));
            // this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getchildren');
            //
            // // @ts-ignore
            // while (global.liveApiMaxSynchronousLocked)
            //     node.loop();
            //
            // // @ts-ignore
            // return global.liveApiMaxSynchronousResult

            // @ts-ignore
            global.liveApi.locked = true;

            // @ts-ignore
            global.liveApi.responses = [];

            // @ts-ignore
            global.liveApi.responsesProcessed = 0;

            // @ts-ignore
            global.liveApi.responsesExpected = 1;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.typeRef, ...this.refLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getchildren');

            // @ts-ignore
            while (global.liveApi.locked)
                node.loop();

            // @ts-ignore
            return global.liveApi.responses;
        }
    }
}