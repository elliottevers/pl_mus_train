let node = require("deasync");
// @ts-ignore
node.loop = node.runLoopOnce;

export namespace max {

    declare let outlet: any;
    declare let global: any;

    export class MaxDao {

        private deferlow: boolean = false;
        private synchronous: boolean = true;
        private maxApi: any;

        constructor() {
            this.maxApi = require('max-api');
        }

        public withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        public setMode(deferlow: boolean, synchronous: boolean): void {
            this.deferlow = deferlow;
            this.synchronous = synchronous;
        }

        public call(args: string[]): any {
            if ((this.deferlow && this.synchronous) || (!this.deferlow && this.synchronous)) {
                global.maxObjects.locked = true;

                global.maxObjects.responses = [];

                global.maxObjects.responsesProcessed = 0;

                global.maxObjects.responsesExpected = 1;

                this.maxApi.outlet(...args);

                while (global.maxObjects.locked)
                    node.loop();

                return global.maxObjects.responses;
            }

            if ((this.deferlow && !this.synchronous) || (!this.deferlow && !this.synchronous)) {
                this.maxApi.outlet(...args);
            }
        }
    }
}