import {live} from "../live/live";


export namespace cue_point {

    import iLiveApi = live.iLiveApi;

    export class CuePoint {

        cue_point_dao: iCuePointDao;

        constructor(cue_point_dao: iCuePointDao) {
            this.cue_point_dao = cue_point_dao;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.cue_point_dao.setMode(deferlow, synchronous)
        }

        get_time(): number {
            return this.cue_point_dao.get_time()
        }

        jump(): void {
            this.cue_point_dao.jump()
        }
    }

    interface iCuePointDao {
        setMode(deferlow: boolean, synchronous: boolean): void;

        get_time(): number

        jump(): void
    }

    export class CuePointDaoVirtual implements iCuePointDao {

        constructor() {

        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            throw 'not implemented'
        }

        get_time(): number {
            throw 'not implemented'
        }

        jump(): void {
            throw 'not implemented'
        }
    }

    export class CuePointDao implements iCuePointDao {

        private live_api: iLiveApi;
        private deferlow: boolean = false;
        private synchronous: boolean = true;

        constructor(live_api: iLiveApi) {
            this.live_api = live_api;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.deferlow = deferlow;
            this.synchronous = synchronous;
        }

        get_time(): number {
            return this.live_api.get('time', this.deferlow, this.synchronous)
        }

        jump(): void {
            this.live_api.call(['jump'], this.deferlow, this.synchronous)
        }
    }
}