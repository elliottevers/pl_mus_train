// import {live as li, live} from "../live/live";
// import {clip} from "../clip/clip";
// import {message} from "../message/messenger";
// import {note} from "../note/note";
// import TreeModel = require("tree-model");
// const _ = require('underscore');
//
// export namespace track {
//     import LiveApiJs = live.LiveApiJs;
//     import Clip = clip.Clip;
//     import ClipDao = clip.ClipDao;
//     import Messenger = message.Messenger;
//     import Note = note.Note;
//
//     // export let get_notes_on_track = (path_track) => {
//     //     let index_track = Number(path_track.split(' ')[2]);
//     //
//     //     let track = new Track(
//     //         new TrackDao(
//     //             new li.LiveApiJs(path_track)
//     //         )
//     //     );
//     //
//     //     let num_clip_slots = track.get_num_clip_slots();
//     //
//     //     let notes_amassed = [];
//     //
//     //     for (let i_clipslot of _.range(0, num_clip_slots)) {
//     //         let path_clipslot = ['live_set', 'tracks', index_track, 'clip_slots', Number(i_clipslot)].join(' ');
//     //
//     //         let clip = new Clip(
//     //             new ClipDao(
//     //                 new li.LiveApiJs(
//     //                     path_clipslot.split(' ').concat(['clip']).join(' ')
//     //                 ),
//     //                 new Messenger('max', 0)
//     //             )
//     //         );
//     //
//     //         notes_amassed = notes_amassed.concat(
//     //             clip.get_notes(
//     //                 clip.get_loop_bracket_lower(),
//     //                 0,
//     //                 clip.get_loop_bracket_upper(),
//     //                 128
//     //             )
//     //         );
//     //     }
//     //
//     //     return notes_amassed
//     // };
//
//     export class Track {
//
//         public track_dao;
//
//         constructor(track_dao: TrackDao) {
//             this.track_dao = track_dao;
//         }
//
//         public static get_clip_at_index(index_track: number, index_clip_slot: number): Clip {
//             return new Clip(
//                 new ClipDao(
//                     new LiveApiJs(
//                         path_clipslot.split(' ').concat(['clip']).join(' ')
//                     ),
//                     new Messenger(env, 0)
//                 )
//             );
//         }
//
//         public get_index() {
//
//         }
//
//         public load_clip_slots() {
//
//         }
//
//         public load_clips() {
//
//         }
//
//         public load() {
//
//         }
//
//         public delete_clips() {
//
//         }
//
//         public create_clip_at_index() {
//
//         }
//
//         public get_clip_slot_at_index() {
//
//         }
//
//         // TODO: should return null if the there aren't even that many scenes
//         public get_clip_at_index() {
//
//         }
//
//         public get_num_clip_slots() {
//             return this.get_clip_slots().length
//         }
//
//         public get_clip_slots() {
//             return this.track_dao.get_clip_slots()
//         }
//
//         // NB: assumes that the clips form a perfect partition of the duration inside the start, end marker
//         get_notes(): TreeModel.Node<Note>[] {
//             let notes_amassed = [];
//             for (let clip of this.clip_slots) {
//                 notes_amassed = notes_amassed.concat(
//                     clip.get_notes_within_markers()
//                 )
//             }
//             return notes_amassed;
//         }
//     }
//
//     export interface iTrackDao {
//         get_notes(): TreeModel.Node<Note>[]
//         get_clip_slots(int: number)
//     }
//
//     export class TrackDaoVirtual implements iTrackDao {
//
//         num_clip_slots: number;
//         clips: Clip[];
//
//         constructor(num_clip_slots: number, clips: Clip[]) {
//             this.num_clip_slots = num_clip_slots;
//             this.clips = clips;
//         }
//
//         get_num_clip_slots(): number {
//             return this.num_clip_slots;
//         }
//
//         get_notes(): TreeModel.Node<Note>[] {
//             let notes_amassed = [];
//             for (let clip of this.clips) {
//                 notes_amassed = notes_amassed.concat(
//                     clip.get_notes(
//                         clip.get_loop_bracket_lower(),
//                         0,
//                         clip.get_loop_bracket_upper(),
//                         128
//                     )
//                 )
//             }
//             return notes_amassed;
//         }
//
//         get_clip_slots() {
//             // let data_clip_slots = this.live_api.get("clip_slots");
//             //
//             // let clip_slots = [];
//             //
//             // let clip_slot = [];
//             //
//             // for (let i_datum in data_clip_slots) {
//             //
//             //     let datum = Number(i_datum);
//             //
//             //     clip_slot.push(datum);
//             //
//             //     if (Number(i_datum) % 2 === 1) {
//             //         clip_slots.push(clip_slot)
//             //     }
//             // }
//             //
//             // return clip_slots
//
//             let data: string[] = [];
//             for (let i of _.range(0, this.num_clip_slots)) {
//                 data.push('id');
//                 data.push(String(i));
//             }
//             return data;
//         }
//     }
//
//     export class TrackDao {
//
//         private live_api: LiveApiJs;
//
//         constructor(live_api: LiveApiJs) {
//             this.live_api = live_api
//         }
//
//         get_clip_slots() {
//             let data_clip_slots = this.live_api.get("clip_slots");
//
//             let clip_slots = [];
//
//             let clip_slot = [];
//
//             for (let i_datum in data_clip_slots) {
//
//                 let datum = Number(i_datum);
//
//                 clip_slot.push(datum);
//
//                 if (Number(i_datum) % 2 === 1) {
//                     clip_slots.push(clip_slot)
//                 }
//             }
//
//             return clip_slots
//         }
//     }
// }
//# sourceMappingURL=track.js.map