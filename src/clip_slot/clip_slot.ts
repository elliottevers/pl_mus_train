import {live} from "../live/live";
import {clip} from "../clip/clip";
import {message} from "../message/messenger";
import {log} from "../log/logger";

export namespace clip_slot {
    import LiveApiJs = live.LiveApiJs;
    import Clip = clip.Clip;
    import ClipDao = clip.ClipDao;
    import Messenger = message.Messenger;
    import Logger = log.Logger;

    export class ClipSlot {

        clip: Clip;

        clip_slot_dao: iClipSlotDao;

        constructor(clip_slot_dao: iClipSlotDao) {
            this.clip_slot_dao = clip_slot_dao;
        }

        b_has_clip(): boolean {
            return this.clip !== null
        }

        delete_clip(): void {
            this.clip_slot_dao.delete_clip()
        }

        duplicate_clip_to(clip_slot: ClipSlot): void {
            this.clip_slot_dao.duplicate_clip_to(clip_slot.get_id())
        }

        get_id(): number {
            return this.clip_slot_dao.get_id()
        }

        create_clip(length_beats: number): void {
            this.clip_slot_dao.create_clip(length_beats);
        }

        load_clip(): void {
            this.clip = this.clip_slot_dao.get_clip();
        }

        get_clip(): Clip {
            return this.clip
        }
    }

    interface iClipSlotDao {

        delete_clip()

        has_clip()

        duplicate_clip_to(id: number)

        get_clip(): Clip

        get_path()

        get_id()

        create_clip(length_beats: number): void

    }

    export class ClipSlotDao implements iClipSlotDao {

        private live_api: LiveApiJs;
        private messenger: Messenger;

        constructor(live_api: LiveApiJs, messenger: Messenger) {
            this.live_api = live_api;
            this.messenger = messenger;
        }

        create_clip(length_beats: number) {
            this.live_api.call("create_clip", String(length_beats))
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

        get_clip(): Clip {
            let logger = new Logger('max');
            // logger.log(String(this.live_api.get('clip')));
            // logger.log(this.live_api.get('clip').split(',').join(' '));
            return new Clip(
                new ClipDao(
                    new LiveApiJs(
                        String(this.live_api.get('clip')).split(',').join(' ')
                    ),
                    this.messenger
                )
            )
        }

        get_path(): string {
            return this.live_api.get_path()
        }

        get_id(): number {
            return this.live_api.get_id()
        }
    }
}