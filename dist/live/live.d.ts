export declare namespace live {
    interface iLiveApiJs {
        get(property: string): any;
        set(property: string, value: any): void;
        call(func: string): void;
    }
    class LiveApiJs implements iLiveApiJs {
        private live_api;
        constructor(index_track: number, index_clip_slot: number);
        get(property: string): any;
        set(property: string, value: any): void;
        call(func: string, ...args: any[]): any;
    }
}
