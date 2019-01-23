export namespace message {

    type Env = 'max' | 'node';

    export class Messenger {

        private env: Env;

        private outlet: number;

        constructor (env: Env, outlet: number) {
            this.env = env;
            this.outlet = outlet;
        }

        message(message: string) {
            if (this.env === 'max') {
                this.message_max(message);
            } else if (this.env === 'node') {
                this.message_node(message);
            }
        }

        message_max(message: string): void {
            outlet(this.outlet, message);
        }

        message_node(message: string): void {
            console.log("Messenger:");
            console.log("\n");
            console.log(message);
            console.log("\n");
        }
    }
}