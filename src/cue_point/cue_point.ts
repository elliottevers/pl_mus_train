import {message} from "../message/messenger";
import {live} from "../live/live";


export namespace cue_point {

    import Messenger = message.Messenger;
    import iLiveApiJs = live.iLiveApiJs;

    export class CuePoint {

        name: string;

        time: number;

        cue_point_dao: iCuePointDao;

        constructor(cue_point_dao: iCuePointDao) {
            this.cue_point_dao = cue_point_dao;
        }

        get_name(): string {
            return this.cue_point_dao.get_name()
        }

        get_time(): number {
            return this.cue_point_dao.get_time()
        }

        jump(): void {
            this.cue_point_dao.jump()
        }
    }

    interface iCuePointDao {
        get_name(): string

        get_time(): number

        jump(): void
    }

    export class CuePointDaoVirtual implements iCuePointDao {

        // TODO: we'll need to pass in dependencies
        constructor() {

        }

        get_name(): string {
            return ''
        }

        get_time(): number {
            return 0
        }

        jump(): void {

        }
    }

    export class CuePointDao implements iCuePointDao {

        private live_api: iLiveApiJs;
        private messenger: Messenger;

        constructor(live_api: iLiveApiJs, messenger: Messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }

        get_name(): string {
            return this.live_api.get('name')
        }

        get_time(): number {
            return this.live_api.get('time')
        }

        jump(): void {
            this.live_api.call('jump')
        }
    }
}