import {live} from "../live/live";
import {clip} from "../clip/clip";
import {message} from "../message/messenger";
import {note} from "../music/note";
import {clip_slot} from "../clip_slot/clip_slot";
import {utils} from "../utils/utils";
import TreeModel = require("tree-model");

const _ = require('underscore');

export namespace track {
    import Clip = clip.Clip;
    import Messenger = message.Messenger;
    import Note = note.Note;
    import ClipSlot = clip_slot.ClipSlot;
    import ClipSlotDao = clip_slot.ClipSlotDao;
    import ClipDao = clip.ClipDao;
    import ClipSlotDaoVirtual = clip_slot.ClipSlotDaoVirtual;
    import iLiveApi = live.iLiveApi;
    import LiveClipVirtual = clip.LiveClipVirtual;
    import LiveApiFactory = live.LiveApiFactory;
    import TypeIdentifier = live.TypeIdentifier;
    import Env = live.Env;

    export class Track {

        public track_dao: iTrackDao;

        clip_slots: ClipSlot[] = [];

        constructor(track_dao: iTrackDao) {
            this.track_dao = track_dao;
        }

        public static get_clip_at_index(index_track: number, index_clip_slot: number, env: Env): Clip {
            if (env == Env.NODE_FOR_MAX || env == Env.MAX) {
                return new Clip(
                    new ClipDao(
                        LiveApiFactory.create(
                            env,
                            ['live_set', 'tracks', String(index_track), 'clip_slots', String(index_clip_slot), 'clip'].join(' '),
                            TypeIdentifier.PATH
                        )
                    )
                );
            } else {
                return new Clip(
                    new LiveClipVirtual([])
                );
            }
        }

        public static get_clip_slot_at_index(index_track: number, index_clip_slot: number, messenger: Messenger, env: Env): ClipSlot {
            let clip_slot_dao;

            if (env == Env.NODE_FOR_MAX || env == Env.MAX) {
                clip_slot_dao = LiveApiFactory.create(
                    env,
                    ['live_set', 'tracks', String(index_track), 'clip_slots', String(index_clip_slot)].join(' '),
                    TypeIdentifier.PATH
                )
            } else {
                clip_slot_dao = new LiveClipVirtual([])
            }

            return new ClipSlot(
                new ClipSlotDao(
                    clip_slot_dao
                )
            );
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.track_dao.setMode(deferlow, synchronous)
        }

        public get_index(): number {
            return Number(this.track_dao.get_path().split(' ')[2])
        }

        public load_clip_slots(): void {
            this.clip_slots = this.track_dao.get_clip_slots();
        }

        public mute() {
            this.track_dao.mute(true);
        }

        public unmute() {
            this.track_dao.mute(false);
        }

        public load_clips() {
            this.load_clip_slots();

            for (let clip_slot of this.clip_slots) {
                clip_slot.load_clip();
            }
        }

        public delete_clips() {
            for (let clip_slot of this.clip_slots) {
                if (clip_slot.b_has_clip()) {
                    clip_slot.delete_clip()
                }
            }
        }

        public create_clip_at_index(index: number, length_beats: number): void {
            this.clip_slots[index].create_clip(length_beats)
        }

        public get_clip_slot_at_index(index_clip_slot: number): ClipSlot {
            return this.clip_slots[index_clip_slot]
        }

        // TODO: should return null if the there aren't even that many scenes
        public get_clip_at_index(index: number): Clip {
            let clip_slot = this.clip_slots[index];
            return clip_slot.get_clip()
        }

        public get_num_clip_slots() {
            return this.get_clip_slots().length
        }

        public get_clip_slots() {
            return this.track_dao.get_clip_slots()
        }

        // NB: assumes that the clips form a perfect partition of the duration inside the start, end marker
        get_notes(): TreeModel.Node<Note>[] {
            let notes_amassed = [];
            for (let clip_slot of this.clip_slots) {
                if (clip_slot.b_has_clip()) {
                    notes_amassed = notes_amassed.concat(
                        clip_slot.get_clip().get_notes_within_markers()
                    )
                }
            }
            return notes_amassed;
        }

        public get_path(): string {
            // TODO: implement
            return this.track_dao.get_path()
        }
    }

    export interface iTrackDao {
        setMode(deferlow: boolean, synchronous: boolean): void;

        get_clip_slots()

        get_path()

        mute(b: boolean): void;
    }

    // TODO: please change everything in here
    export class TrackDaoVirtual implements iTrackDao {
        clips: Clip[];
        messenger: Messenger;

        constructor(clips: Clip[], messenger: Messenger) {
            this.clips = clips;
            this.messenger = messenger;
        }


        setMode(deferlow: boolean, synchronous: boolean): void {

        }

        mute() {

        }

        get_notes(): TreeModel.Node<Note>[] {
            let notes_amassed = [];
            for (let clip of this.clips) {
                notes_amassed = notes_amassed.concat(
                    clip.get_notes(
                        clip.get_loop_bracket_lower(),
                        0,
                        clip.get_loop_bracket_upper(),
                        128
                    )
                )
            }
            return notes_amassed;
        }

        // only return as many clip slots as there are clips
        get_clip_slots(): ClipSlot[] {
            let clip_slots = [];
            for (let clip of this.clips) {
                clip_slots.push(
                    new ClipSlot(
                        new ClipSlotDaoVirtual(
                            clip
                        )
                    )
                )
            }
            return clip_slots
        }

        get_path(): string {
            return
        }
    }

    export class TrackDao implements iTrackDao {

        live_api: iLiveApi;
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

        get_clip_slots(): ClipSlot[] {
            let data_clip_slots = this.live_api.get("clip_slots", this.deferlow, this.synchronous);

            let clip_slots = [];

            let clip_slot = [];

            for (let i_datum in data_clip_slots) {

                let datum = data_clip_slots[Number(i_datum)];

                clip_slot.push(datum);

                if (Number(i_datum) % 2 === 1) {
                    clip_slots.push(clip_slot);
                    clip_slot = [];
                }
            }

            return clip_slots.map((list_id_clip_slot) => {
                return new ClipSlot(
                    new ClipSlotDao(
                        LiveApiFactory.createFromConstructor(
                            this.live_api.constructor.name,
                            list_id_clip_slot.join(' '),
                            TypeIdentifier.ID
                        )
                    )
                )
            });
        }

        // TODO: use deferlow?
        mute(val: boolean) {
            if (val) {
                this.live_api.set('solo', '0', this.deferlow, this.synchronous)
            } else {
                this.live_api.set('solo', '1', this.deferlow, this.synchronous)
            }
        }

        get_path(): string {
            return utils.cleanse_path(this.live_api.get_path(this.deferlow, this.synchronous))
        }
    }
}