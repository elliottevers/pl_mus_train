// import {note as n} from "../note/note";
// import TreeModel = require("tree-model");
// import {live} from "../live/live";
// import {message} from "../message/messenger";
// import {log} from "../log/logger";
// import {utils} from "../utils/utils";
//
// export namespace clip {
//
//     import Messenger = message.Messenger;
//     import Logger = log.Logger;
//     import ClipLive = live.ClipLive;
//
//     export class ClipVirtual implements ClipLive {
//
//     }
//
//     export class Clip implements ClipLive {
//
//         public clip_dao;
//
//         private notes: TreeModel.Node<n.Note>[];
//
//         private logger: Logger;
//
//         constructor(clip_dao) {
//             this.clip_dao = clip_dao;
//             this.logger = new Logger('max')
//         }
//
//         public set_endpoints_loop(beat_start, beat_end) {
//             if (beat_start >= this.clip_dao.get_loop_bracket_upper()) {
//                 this.clip_dao.set_loop_bracket_upper(beat_end);
//                 this.clip_dao.set_loop_bracket_lower(beat_start);
//             } else {
//                 this.clip_dao.set_loop_bracket_lower(beat_start);
//                 this.clip_dao.set_loop_bracket_upper(beat_end);
//             }
//         }
//
//         public set_endpoint_markers(beat_start, beat_end) {
//             if (beat_start >= this.clip_dao.get_end_marker()) {
//                 this.clip_dao.set_clip_endpoint_upper(beat_end);
//                 this.clip_dao.set_clip_endpoint_lower(beat_start);
//             } else {
//                 this.clip_dao.set_clip_endpoint_lower(beat_start);
//                 this.clip_dao.set_clip_endpoint_upper(beat_end);
//             }
//         }
//
//         get_index_track(): number {
//             return this.clip_dao.get_path().split(' ')[2]
//         }
//
//         get_beat_start(): number {
//             return this.clip_dao.beat_start
//         }
//
//         get_beat_end(): number {
//             return this.clip_dao.beat_end
//         }
//
//         get_path(): string {
//             return this.clip_dao.get_path();
//         }
//
//         set_path_deferlow(key_route): void {
//             this.clip_dao.set_path_deferlow(
//                 key_route,
//                 this.get_path()
//             )
//         }
//
//         get_num_measures(): number {
//             return (this.get_end_marker() - this.get_start_marker()) / 4;
//         }
//
//         get_end_marker(): number {
//             return this.clip_dao.get_end_marker();
//         }
//
//         get_start_marker(): number {
//             return this.clip_dao.get_start_marker();
//         }
//
//         // TODO: annotations
//         load_notes_within_loop_brackets(): void {
//             this.notes = this.get_notes(
//                 this.get_loop_bracket_lower(),
//                 0,
//                 this.get_loop_bracket_upper(),
//                 128
//             )
//         }
//
//         // TODO: annotations
//         load_notes_within_markers(): void {
//             this.notes = this.get_notes(
//                 this.get_start_marker(),
//                 0,
//                 this.get_end_marker(),
//                 128
//             )
//         }
//
//         // TODO: annotations
//         get_pitch_max(interval?): number {
//             let pitch_max = 0;
//
//             let interval_search = interval ? interval : [this.get_loop_bracket_lower(), this.get_loop_bracket_upper()];
//
//             for (let node of this.get_notes(interval_search[0], 0, interval_search[1], 128)) {
//                 if (node.model.note.pitch > pitch_max) {
//                     pitch_max = node.model.note.pitch;
//                 }
//             }
//
//             return pitch_max;
//         }
//
//         // TODO: annotations
//         get_pitch_min(interval?): number {
//             let pitch_min = 128;
//
//             let interval_search = interval ? interval : [this.get_loop_bracket_lower(), this.get_loop_bracket_upper()];
//
//             for (let node of this.get_notes(interval_search[0], 0, interval_search[1], 128)) {
//                 if (node.model.note.pitch < pitch_min) {
//                     pitch_min = node.model.note.pitch;
//                 }
//             }
//
//             return pitch_min;
//         }
//
//         get_ambitus(interval?): number[] {
//             return [this.get_pitch_min(interval), this.get_pitch_max(interval)];
//         }
//
//         set_loop_bracket_lower(beat: number): void {
//             this.clip_dao.set_loop_bracket_lower(beat);
//         }
//
//         set_loop_bracket_upper(beat: number): void {
//             this.clip_dao.set_loop_bracket_upper(beat);
//         }
//
//         get_loop_bracket_lower(): number {
//             return this.clip_dao.get_loop_bracket_lower()[0];
//         }
//
//         get_loop_bracket_upper(): number {
//             return this.clip_dao.get_loop_bracket_upper()[0];
//         }
//
//         set_clip_endpoint_lower(beat: number): void {
//             this.clip_dao.set_clip_endpoint_lower(beat);
//         }
//
//         set_clip_endpoint_upper(beat: number): void {
//             this.clip_dao.set_clip_endpoint_upper(beat);
//         }
//
//         fire(): void {
//             this.clip_dao.fire();
//         }
//
//         stop(): void {
//             this.clip_dao.stop();
//         }
//
//         get_notes_within_markers(use_cache?: boolean): TreeModel.Node<n.Note>[] {
//             if (!this.notes || !use_cache) {
//                 this.load_notes_within_markers();
//             }
//             return this.notes;
//         }
//
//         get_notes_within_loop_brackets(use_cache?: boolean): TreeModel.Node<n.Note>[] {
//             if (!this.notes || !use_cache) {
//                 this.load_notes_within_loop_brackets();
//             }
//             return this.notes;
//         }
//
//         // TODO: only works virtual clips currently
//         public append(note: TreeModel.Node<n.Note>) {
//             this.clip_dao.append(note);
//         }
//
//         public get_notes(beat_start: number, pitch_midi_min: number, beat_duration: number, pitch_midi_max: number): TreeModel.Node<n.Note>[] {
//             return Clip._parse_notes(
//                 this._get_notes(
//                     beat_start,
//                     pitch_midi_min,
//                     beat_duration,
//                     pitch_midi_max
//                 )
//             );
//         }
//
//         public set_notes(notes: TreeModel.Node<n.Note>[]): void {
//             this.clip_dao.set_notes(notes);
//         }
//
//         // TODO: *actually* make private
//         public _get_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): string[] {
//             return this.clip_dao.get_notes(
//                 beat_start,
//                 pitch_midi_min,
//                 beat_end,
//                 pitch_midi_max
//             )
//         }
//
//         public remove_notes(beat_start: number, pitch_midi_min: number, beat_duration: number, pitch_midi_max: number): void {
//             let epsilon = 1/(48 * 2);
//             this.clip_dao.remove_notes(
//                 beat_start - epsilon,
//                 pitch_midi_min,
//                 beat_duration,
//                 pitch_midi_max
//             )
//         }
//
//         public static parse_note_messages(messages: string[]) {
//
//             let notes: TreeModel.Node<n.Note>[] = [];
//
//             for (let i_mess in messages) {
//                 if (i_mess == String(0)) {
//                     continue
//                 }
//
//                 if (i_mess == String(messages.length - 1)) {
//                     continue
//                 }
//
//                 let tree: TreeModel = new TreeModel();
//
//                 let splitted = messages[i_mess].split(' ');
//
//                 notes.push(
//                     tree.parse(
//                         {
//                             id: -1, // TODO: hashing scheme for clip id and beat start
//                             note: new n.Note(
//                                 Number(splitted[0]),
//                                 Number(splitted[1]),
//                                 Number(splitted[2]),
//                                 Number(splitted[3]),
//                                 Number(splitted[4])
//                             ),
//                             children: [
//
//                             ]
//                         }
//                     )
//                 )
//             }
//
//             return notes
//         }
//
//         // TODO: remove underscore prefix
//         public static _parse_notes(notes: string[]): TreeModel.Node<n.Note>[] {
//             let data: any = [];
//             let notes_parsed = [];
//
//             let pitch;
//             let beat_start;
//             let beats_duration;
//             let velocity;
//             let b_muted;
//
//             let index_num_expected_notes = null;
//
//             for (var i = 0; i < notes.length; i++) {
//
//                 if (notes[i] === 'done') {
//                     continue;
//                 }
//
//                 if (notes[i] === 'note') {
//                     data = [];
//                     continue;
//                 }
//
//                 if (notes[i] === 'notes') {
//                     data = [];
//                     continue;
//                 }
//
//                 if (i === index_num_expected_notes) {
//                     data = [];
//                     continue;
//                 }
//
//                 data.push(notes[i]);
//
//                 if (data.length === 5) {
//
//                     pitch = data[0];
//                     beat_start = data[1];
//                     beats_duration = data[2];
//                     velocity = data[3];
//                     b_muted = data[4];
//
//                     let tree: TreeModel = new TreeModel();
//
//                     notes_parsed.push(
//                         tree.parse(
//                             {
//                                 id: -1, // TODO: hashing scheme for clip id and beat start
//                                 note: new n.Note(
//                                     pitch,
//                                     beat_start,
//                                     beats_duration,
//                                     velocity,
//                                     b_muted
//                                 ),
//                                 children: [
//
//                                 ]
//                             }
//                         )
//                     );
//                 }
//             }
//
//             function compare(note_former,note_latter) {
//                 if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
//                     return -1;
//                 if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
//                     return 1;
//                 return 0;
//             }
//
//             notes_parsed.sort(compare);
//
//             // TODO: fail gracefully
//             // if (notes_parsed.length !== num_expected_notes) {
//             //     throw "notes retrieved from clip less than expected"
//             // }
//
//             return notes_parsed;
//         }
//     }
//
//     export class ClipDao {
//
//         private clip_live;
//         private messenger: Messenger;
//         private deferlow: boolean;
//         private key_route: string;
//         private env: string;
//         private notes_cached: string[];
//
//         constructor(clip_live: live.iLiveApiJs, messenger, deferlow?: boolean, key_route?: string, env?: string) {
//             this.clip_live = clip_live;
//             this.messenger = messenger;
//             if (deferlow && !key_route) {
//                 throw new Error('key route not specified when using deferlow');
//             }
//             this.deferlow = deferlow;
//             this.key_route = key_route;
//             this.env = env;
//         }
//
//         set_path_deferlow(key_route_override: string, path_live: string): void {
//             let mess: any[] = [key_route_override];
//
//             for (let word of utils.PathLive.to_message(path_live)) {
//                 mess.push(word)
//             }
//
//             this.messenger.message(mess)
//         }
//
//         // TODO: check if these actually return arrays
//         get_end_marker(): number {
//             return this.clip_live.get('end_marker')[0];
//         }
//
//         // TODO: check if these actually return arrays
//         get_start_marker(): number {
//             return this.clip_live.get('start_marker')[0];
//         }
//
//         get_path(): string {
//             return this.clip_live.get_path();
//         }
//
//         set_loop_bracket_lower(beat: number) {
//             if (this.deferlow) {
//                 this.messenger.message([this.key_route, "set", "loop_start", beat])
//             } else {
//                 this.clip_live.set('loop_start', beat);
//             }
//         }
//
//         set_loop_bracket_upper(beat: number) {
//             if (this.deferlow) {
//                 this.messenger.message([this.key_route, "set", "loop_end", beat]);
//             } else {
//                 this.clip_live.set('loop_end', beat);
//             }
//         }
//
//         get_loop_bracket_lower(): number {
//             return this.clip_live.get('loop_start');
//         }
//
//         get_loop_bracket_upper(): number {
//             return this.clip_live.get('loop_end');
//         }
//
//         set_clip_endpoint_lower(beat: number) {
//             if (this.deferlow) {
//                 this.messenger.message([this.key_route, "set", "start_marker", beat]);
//             } else {
//                 this.clip_live.set('start_marker', beat);
//             }
//         }
//
//         set_clip_endpoint_upper(beat: number) {
//             if (this.deferlow) {
//                 this.messenger.message([this.key_route, "set", "end_marker", beat]);
//             } else {
//                 this.clip_live.set('end_marker', beat);
//             }
//         }
//
//         fire(): void {
//             if (this.deferlow) {
//                 this.messenger.message([this.key_route, "call", "fire"]);
//             } else {
//                 this.clip_live.call('fire');
//             }
//         };
//
//         stop(): void {
//             if (this.deferlow) {
//                 this.messenger.message([this.key_route, "call", "stop"]);
//             } else {
//                 this.clip_live.call('stop');
//             }
//         };
//
//         get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): string[] {
//             if (this.env === 'node_for_max') {
//                 return this.notes_cached
//             } else {
//                 return this.clip_live.call(
//                     'get_notes',
//                     beat_start,
//                     pitch_midi_min,
//                     beat_end,
//                     pitch_midi_max
//                 );
//             }
//         };
//
//         remove_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): void {
//             if (this.deferlow) {
//                 this.messenger.message(
//                     [
//                         this.key_route,
//                         "call",
//                         "remove_notes",
//                         beat_start,
//                         pitch_midi_min,
//                         beat_end,
//                         pitch_midi_max
//                     ]
//                 );
//             } else {
//                 this.clip_live.call(
//                     'remove_notes',
//                     beat_start,
//                     pitch_midi_min,
//                     beat_end,
//                     pitch_midi_max
//                 );
//             }
//         };
//
//         set_notes(notes: TreeModel.Node<n.Note>[]): void {
//             if (this.env === 'node_for_max') {
//                 let notes_cached = [];
//                 notes_cached.push('notes');
//                 notes_cached.push(notes.length.toString());
//                 for (let note of notes) {
//                     notes_cached.push(note.model.note.pitch.toString());
//                     notes_cached.push(note.model.note.beat_start.toString());
//                     notes_cached.push(note.model.note.beats_duration.toString());
//                     notes_cached.push(note.model.note.velocity.toString());
//                     notes_cached.push(note.model.note.muted.toString());
//                 }
//                 notes_cached.push('done');
//             } else if (this.deferlow) {
//                 this.messenger.message([this.key_route, 'call', 'set_notes']);
//                 this.messenger.message([this.key_route, 'call', 'notes', notes.length]);
//                 for (let node of notes) {
//                     this.messenger.message([
//                         this.key_route,
//                         'call',
//                         'note',
//                         node.model.note.pitch,
//                         node.model.note.beat_start.toFixed(4),
//                         node.model.note.beats_duration.toFixed(4),
//                         node.model.note.velocity,
//                         node.model.note.muted
//                     ]);
//                 }
//                 this.messenger.message([this.key_route, 'call', 'done'])
//             } else {
//                 this.clip_live.call('set_notes');
//                 this.clip_live.call('notes', notes.length);
//                 for (let node of notes) {
//                     this.clip_live.call(
//                         "note",
//                         node.model.note.pitch,
//                         node.model.note.beat_start.toFixed(4),
//                         node.model.note.beats_duration.toFixed(4),
//                         node.model.note.velocity,
//                         node.model.note.muted
//                     );
//                 }
//                 this.clip_live.call("done")
//             }
//         }
//     }
// }
//# sourceMappingURL=clip.js.map