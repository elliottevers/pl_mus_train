declare function outlet(n: number, o: any): void;

export namespace message {

    // TODO: the following
    // type Env = 'max' | 'node';

    export class Messenger {


        private env: string;

        private outlet: number;

        private key_route: string;

        constructor (env: string, outlet: number, key_route?: string) {
            this.env = env;
            this.outlet = outlet;
            this.key_route = key_route;
        }

        message(message: any[]) {
            if (this.env === 'max') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_max(message);
            } else if (this.env === 'node') {
                if (this.key_route) {
                    message.unshift(this.key_route);
                }
                this.message_node(message);
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
    }
}