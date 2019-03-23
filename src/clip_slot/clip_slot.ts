import {live} from "../live/live";

export namespace clip_slot {
    import LiveApiJs = live.LiveApiJs;

    export class ClipSlot {
        clip_slot_dao: ClipSlotDao;

        constructor() {

        }

        b_has_clip() {

        }

        delete_clip() {

        }

        duplicate_clip_to(clip_slot: ClipSlot) {
            this.clip_slot_dao.duplicate_clip_to(clip_slot.get_id())
        }

        get_id() {

        }
    }

    interface iClipSlotDao {

        delete_clip()

        has_clip()

        duplicate_clip_to()

    }

    export class ClipSlotDao implements iClipSlotDao {

        private live_api: LiveApiJs;

        constructor(live_api: LiveApiJs) {
            this.live_api = live_api
        }

        delete_clip() {
            this.live_api.call("delete_clip")
        }

        has_clip() {
            return this.live_api.get("has_clip")[0] === 1
        }

        duplicate_clip_to(id: number) {
            this.live_api.call("duplicate_clip_to", ['id', id].join(' '));
        }
    }
}