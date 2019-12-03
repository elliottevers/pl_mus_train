import {live} from "../live/live";

declare function outlet(n: number, o: any): void;

export namespace message {

    import Env = live.Env;

    export class Messenger {

        public env: Env;

        private outlet: number;

        private key_route: string;

        constructor (env: Env, outlet: number, key_route?: string) {
            this.env = env;
            this.outlet = outlet;
            this.key_route = key_route;
        }

        public get_key_route(): string {
            return this.key_route;
        }

        message(message: any[], override?: boolean) {
            switch (this.env) {
                case Env.MAX: {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_max(message);
                    break;
                }
                case Env.NODE: {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_node(message);
                    break;
                }
                case Env.NODE_FOR_MAX: {
                    if (this.key_route && !override) {
                        message.unshift(this.key_route);
                    }
                    this.message_node_for_max(message);
                    break;
                }
            }
        }

        message_max(message: any[]): void {
            outlet(this.outlet, message);
        }

        message_node(message: any[]): void {
            console.log("Messenger:");
            console.log("\n");
            console.log(message);
            console.log("\n");
        }

        message_node_for_max(message: any[]): void {
            // const Max = require('max-api');
            // Max.outlet(message);
        }
    }
}