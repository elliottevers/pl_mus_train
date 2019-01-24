declare let LiveAPI: any;

export namespace live {

    export interface iLiveApiJs {
        get(property: string): any;
        set(property: string, value: any): void;
        call(func: string): void;
    }

    export class LiveApiJs implements iLiveApiJs {
        private live_api: any;

        constructor(index_track: number, index_clip_slot: number) {
            let path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
            this.live_api = new LiveAPI(null, path);
        }

        get(property: string): any {
            return this.live_api.get(property)
        }

        set(property: string, value: any): void {
            this.live_api.set(property, value)
        }

        call(func: string, ...args: any[]): any {
            return this.live_api.call(func, ...args);
        }
    }

}