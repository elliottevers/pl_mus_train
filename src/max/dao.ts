let node = require("deasync");
// @ts-ignore
node.loop = node.runLoopOnce;

export namespace max {

    declare let outlet: any;
    declare let global: any;

    export class MaxDao {

        private deferlow: boolean = false;
        private synchronous: boolean = true;

        constructor() {

        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.deferlow = deferlow;
            this.synchronous = synchronous;
        }

        // // @ts-ignore
        // global.liveApi.locked = true;
        //
        // // @ts-ignore
        // global.liveApi.responses = [];
        //
        // // @ts-ignore
        // global.liveApi.responsesProcessed = 0;
        //
        // // @ts-ignore
        // global.liveApi.responsesExpected = 1;
        //
        // this.maxApi.outlet('batch', 'deferlow', 'delegateAsync', this.typeRef, this.refLive, 'get', property);
        //
        // // @ts-ignore
        // while (global.liveApi.locked)
        // // @ts-ignore
        // node.loop();
        //
        // // @ts-ignore
        // return global.liveApi.responses;




    //     if ((deferlow && synchronous) || (!deferlow && synchronous)) {
    //     // @ts-ignore
    //     global.liveApi.locked = true;
    //
    //     // @ts-ignore
    //     global.liveApi.responses = [];
    //
    //     // @ts-ignore
    //     global.liveApi.responsesProcessed = 0;
    //
    //     // @ts-ignore
    //     global.liveApi.responsesExpected = 1;
    //
    //     this.maxApi.outlet('batch', 'prioritize', 'delegateSync', this.typeRef, this.refLive, 'set', property, value);
    //
    //     // @ts-ignore
    //     while (global.liveApi.locked)
    //     // @ts-ignore
    //     node.loop();
    // }
    //
    // if ((deferlow && !synchronous) || (!deferlow && !synchronous)) {
    //     this.maxApi.outlet('batch', 'deferlow', 'delegateAsync', this.typeRef, this.refLive, 'set', property, value);
    // }

        public call(args: string[]): any {
            if ((this.deferlow && this.synchronous) || (!this.deferlow && this.synchronous)) {
                global.liveApi.locked = true;

                global.liveApi.responses = [];

                global.liveApi.responsesProcessed = 0;

                global.liveApi.responsesExpected = 1;

                max_api.outlet(...args);

                while (global.liveApi.locked)
                    node.loop();

                return global.liveApi.responses;
            }

            if ((this.deferlow && !this.synchronous) || (!this.deferlow && !this.synchronous)) {
                max_api.outlet(...args);
            }
        }
    }
}