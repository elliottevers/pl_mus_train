import {live as li, live} from "../live/live";
import {clip} from "../clip/clip";
import {message} from "../message/messenger";
const _ = require('underscore');

export namespace track {
    import LiveApiJs = live.LiveApiJs;
    import Clip = clip.Clip;
    import ClipDao = clip.ClipDao;
    import Messenger = message.Messenger;

    export let get_notes_on_track = (path_track) => {
        let index_track = Number(path_track.split(' ')[2]);

        let track = new Track(
            new TrackDao(
                new li.LiveApiJs(path_track)
            )
        );

        let num_clip_slots = track.get_num_clip_slots();

        // let track = new li.LiveApiJs(path_track);

        // let num_clipslots = track.get("clip_slots").length/2;

        let notes_amassed = [];

        for (let i_clipslot of _.range(0, num_clip_slots)) {
            let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');

            let clip = new Clip(
                new ClipDao(
                    new li.LiveApiJs(
                        path_clipslot.split(' ').concat(['clip']).join(' ')
                    ),
                    new Messenger('max', 0)
                )
            );

            notes_amassed = notes_amassed.concat(
                clip.get_notes(
                    clip.get_loop_bracket_lower(),
                    0,
                    clip.get_loop_bracket_upper(),
                    128
                )
            );
        }

        return notes_amassed
    };

    export class Track {

        public track_dao;

        constructor(track_dao: TrackDao) {
            this.track_dao = track_dao;
        }

        public get_num_clip_slots() {
            return this.get_clip_slots().length
        }

        public get_clip_slots() {
            return this.track_dao.get_clip_slots()
        }

        // public static get_notes_on_track(path_track) {
        //     let index_track = Number(path_track.split(' ')[2]);
        //
        //     let track = new li.LiveApiJs(path_track);
        //
        //     let num_clipslots = track.get("clip_slots").length/2;
        //
        //     let notes_amassed = [];
        //
        //     for (let i_clipslot of _.range(0, num_clipslots)) {
        //         let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
        //
        //         let clip = new Clip(
        //             new ClipDao(
        //                 new li.LiveApiJs(
        //                     path_clipslot.split(' ').concat(['clip']).join(' ')
        //                 ),
        //                 new Messenger('max', 0)
        //             )
        //         );
        //
        //         notes_amassed = notes_amassed.concat(
        //             clip.get_notes(
        //                 clip.get_loop_bracket_lower(),
        //                 0,
        //                 clip.get_loop_bracket_upper(),
        //                 128
        //             )
        //         );
        //     }
        //
        //     return notes_amassed
        // };
    }

    export class TrackDao {

        private live_api: LiveApiJs;

        constructor(live_api: LiveApiJs) {
            this.live_api = live_api
        }

        get_clip_slots() {
            let data_clip_slots = this.live_api.get("clip_slots");

            let clip_slots = [];

            let clip_slot = [];

            for (let i_datum in data_clip_slots) {

                let datum = Number(i_datum);

                clip_slot.push(datum);

                if (Number(i_datum) % 2 === 1) {
                    clip_slots.push(clip_slot)
                }
            }

            return clip_slots
        }
    }
}