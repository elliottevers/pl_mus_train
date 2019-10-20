import {live} from '../live/live';
import {clip, clip as module_clip} from '../clip/clip';
import {utils} from '../utils/utils';

export namespace clip_slot {
    import Clip = module_clip.Clip;
    import ClipDao = clip.ClipDao;
    import LiveApiFactory = live.LiveApiFactory;
    import TypeIdentifier = live.TypeIdentifier;
    import iLiveApi = live.iLiveApi;

    export class ClipSlot {

        clip: Clip;

        clip_slot_dao: iClipSlotDao;

        constructor(clip_slot_dao: iClipSlotDao) {
            this.clip_slot_dao = clip_slot_dao;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.clip_slot_dao.setMode(deferlow, synchronous)
        }

        b_has_clip(): boolean {
            return this.clip_slot_dao.has_clip()
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
            if (this.b_has_clip()) {
                this.clip = this.clip_slot_dao.get_clip();
            }
        }

        // TODO: we should consider checking whether it exists here
        get_clip(): Clip {
            return this.clip
        }
    }

    export interface iClipSlotDao {

        delete_clip()

        has_clip()

        duplicate_clip_to(id: number)

        get_clip(): Clip

        get_path()

        get_id()

        create_clip(length_beats: number): void

        setMode(deferlow: boolean, synchronous: boolean): void;
    }

    export class ClipSlotDaoVirtual implements iClipSlotDao {

        private clip: Clip;

        constructor(clip: Clip) {
            this.clip = clip;
        }

        setMode(deferlow: boolean, synchronous: boolean): void {

        }

        create_clip(length_beats: number): void {
            throw 'ClipSlotDaoVirtual.create_clip'
        }

        delete_clip() {
            throw 'ClipSlotDaoVirtual.delete_clip'
        }

        duplicate_clip_to(id: number) {
            throw 'ClipSlotDaoVirtual.duplicate_clip_to'
        }

        get_clip(): clip.Clip {
            return this.clip
        }

        get_id() {
            throw 'ClipSlotDaoVirtual.get_id'
        }

        get_path() {
            throw 'ClipSlotDaoVirtual.get_path'
        }

        has_clip() {
            return true
        }
    }

    export class ClipSlotDao implements iClipSlotDao {

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

        create_clip(length_beats: number) {
            this.live_api.call(['create_clip', String(length_beats)], this.deferlow, this.synchronous)
        }

        delete_clip() {
            this.live_api.call(['delete_clip'], this.deferlow, this.synchronous)
        }

        has_clip() {
            return this.live_api.get('has_clip')[0] === 1
        }

        duplicate_clip_to(id: number) {
            this.live_api.call(['duplicate_clip_to', ['id', id].join(' ')], this.deferlow, this.synchronous);
        }

        get_clip(): Clip {
            return new Clip(
                new ClipDao(
                    LiveApiFactory.createFromConstructor(
                        this.live_api.constructor.name,
                        utils.cleanse_id(this.live_api.get('clip', this.deferlow, this.synchronous)),
                        TypeIdentifier.ID
                    )
                )
            )
        }

        get_path(): string {
            return utils.cleanse_path(this.live_api.get_path(this.deferlow, this.synchronous))
        }

        get_id(): number {
            return this.live_api.get_id(this.deferlow, this.synchronous)
        }
    }
}