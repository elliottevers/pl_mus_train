import {note, note as n} from "../music/note";
import TreeModel = require("tree-model");
import {live, live as li} from "../live/live";
import {utils} from "../utils/utils";
const _ = require('underscore');

export namespace clip {

    import iLiveApi = live.iLiveApi;

    export class Clip {

        public clip_dao: iClipDao;

        private notes: TreeModel.Node<n.Note>[];

        constructor(clip_dao) {
            this.clip_dao = clip_dao;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.clip_dao.setMode(deferlow, synchronous)
        }

        public get_playing_position() {
            return this.clip_dao.get_playing_position();
        }

        public set_endpoints_loop(beat_start, beat_end) {
            if (beat_start >= this.clip_dao.get_loop_bracket_upper()) {
                this.clip_dao.set_loop_bracket_upper(beat_end);
                this.clip_dao.set_loop_bracket_lower(beat_start);
            } else {
                this.clip_dao.set_loop_bracket_lower(beat_start);
                this.clip_dao.set_loop_bracket_upper(beat_end);
            }
        }

        public set_endpoint_markers(beat_start, beat_end) {
            if (beat_start >= this.clip_dao.get_end_marker()) {
                this.clip_dao.set_clip_endpoint_upper(beat_end);
                this.clip_dao.set_clip_endpoint_lower(beat_start);
            } else {
                this.clip_dao.set_clip_endpoint_lower(beat_start);
                this.clip_dao.set_clip_endpoint_upper(beat_end);
            }
        }

        get_path(): string {
            return this.clip_dao.liveApi.get_path();
        }

        get_id(): string {
            return this.clip_dao.liveApi.get_id();
        }

        get_num_measures(): number {
            return (this.get_end_marker() - this.get_start_marker()) / 4;
        }

        get_end_marker(): number {
            return this.clip_dao.get_end_marker();
        }

        get_start_marker(): number {
            return this.clip_dao.get_start_marker();
        }

        load_notes_within_loop_brackets(): void {
            this.notes = this.get_notes(
                this.get_loop_bracket_lower(),
                0,
                this.get_loop_bracket_upper(),
                128
            )
        }

        load_notes_within_markers(): void {
            this.notes = this.get_notes(
                this.get_start_marker(),
                0,
                this.get_end_marker(),
                128
            )
        }

        get_pitch_max(interval?): number {
            let pitch_max = 0;

            let interval_search = interval ? interval : [this.get_loop_bracket_lower(), this.get_loop_bracket_upper()];

            for (let node of this.get_notes(interval_search[0], 0, interval_search[1], 128)) {
                if (node.model.note.pitch > pitch_max) {
                    pitch_max = node.model.note.pitch;
                }
            }

            return pitch_max;
        }

        get_pitch_min(interval?): number {
            let pitch_min = 128;

            let interval_search = interval ? interval : [this.get_loop_bracket_lower(), this.get_loop_bracket_upper()];

            for (let node of this.get_notes(interval_search[0], 0, interval_search[1], 128)) {
                if (node.model.note.pitch < pitch_min) {
                    pitch_min = node.model.note.pitch;
                }
            }

            return pitch_min;
        }

        get_ambitus(interval?): number[] {
            return [this.get_pitch_min(interval), this.get_pitch_max(interval)];
        }

        cut_notes_at_boundaries(notes_boundaries: TreeModel.Node<n.Note>[]) {
            let notes_clip: TreeModel.Node<n.Note>[] = this.get_notes_within_loop_brackets();

            let splits = [];

            for (let note_clip of notes_clip) {

                let split = {
                    'note': note_clip,
                    'points': []
                };

                for (let note_boundary of notes_boundaries) {
                    if (note_clip.model.note.contains_beat(note_boundary.model.note.get_beat_end())) {
                        split['points'].push(note_boundary.model.note.get_beat_end())
                    }
                }

                if (split['points'].length > 0) {
                    splits.push(split)
                }
            }

            for (let split of splits) {

                let note_to_split = split['note'];

                let points = split['points'];

                let replacements = n.Note.split_note_at_points(
                    note_to_split,
                    points
                );

                this.setMode(true, false);

                this.set_notes(replacements);

                this.setMode(false, true);
            }
        }

        set_loop_bracket_lower(beat: number): void {
            this.clip_dao.set_loop_bracket_lower(beat);
        }

        set_loop_bracket_upper(beat: number): void {
            this.clip_dao.set_loop_bracket_upper(beat);
        }

        get_loop_bracket_lower(): number {
            return this.clip_dao.get_loop_bracket_lower()[0];
        }

        get_loop_bracket_upper(): number {
            return this.clip_dao.get_loop_bracket_upper()[0];
        }

        set_clip_endpoint_lower(beat: number): void {
            this.clip_dao.set_clip_endpoint_lower(beat);
        }

        set_clip_endpoint_upper(beat: number): void {
            this.clip_dao.set_clip_endpoint_upper(beat);
        }

        fire(): void {
            this.clip_dao.fire();
        }

        stop(): void {
            this.clip_dao.stop();
        }

        get_notes_within_markers(): TreeModel.Node<n.Note>[] {
            this.load_notes_within_markers();
            return this.notes;
        }

        get_notes_within_loop_brackets(): TreeModel.Node<n.Note>[] {
            this.load_notes_within_loop_brackets();
            return this.notes;
        }

        public get_notes(beat_start: number, pitch_midi_min: number, beat_duration: number, pitch_midi_max: number): TreeModel.Node<n.Note>[] {
            return Clip.parse_notes(
                this._get_notes(
                    beat_start,
                    pitch_midi_min,
                    beat_duration,
                    pitch_midi_max
                )
            );
        }

        public set_notes(notes: TreeModel.Node<n.Note>[]): void {
            this.clip_dao.set_notes(notes);
        }

        private _get_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): string[] {
            return this.clip_dao.get_notes(
                beat_start,
                pitch_midi_min,
                beat_end,
                pitch_midi_max
            )
        }

        public remove_notes(beat_start: number, pitch_midi_min: number, beat_duration: number, pitch_midi_max: number): void {
            let epsilon = 1/(48 * 2);
            this.clip_dao.remove_notes(
                beat_start - epsilon,
                pitch_midi_min,
                beat_duration,
                pitch_midi_max
            )
        }

        public static parse_note_messages(messages: string[]) {

            let notes: TreeModel.Node<n.Note>[] = [];

            for (let i_mess in messages) {
                if (i_mess == String(0)) {
                    continue
                }

                if (i_mess == String(messages.length - 1)) {
                    continue
                }

                let tree: TreeModel = new TreeModel();

                let splitted = messages[i_mess].split(' ');

                notes.push(
                    tree.parse(
                        {
                            id: -1, // TODO: hashing scheme for clip id and beat start
                            note: new n.Note(
                                Number(splitted[0]),
                                Number(splitted[1]),
                                Number(splitted[2]),
                                Number(splitted[3]),
                                Number(splitted[4])
                            ),
                            children: [

                            ]
                        }
                    )
                )
            }

            return notes
        }

        public static parse_notes(notes: string[]): TreeModel.Node<n.Note>[] {
            let data: any = [];
            let notes_parsed = [];

            for (var i = 0; i < notes.length; i++) {

                if (notes[i] === 'done') {
                    continue;
                }

                if (notes[i] === 'note') {
                    data = [];
                    continue;
                }

                if (notes[i] === 'notes') {
                    data = [];
                    continue;
                }

                data.push(notes[i]);

                if (data.length === 5) {
                    notes_parsed.push(
                        new TreeModel().parse(
                            {
                                id: -1, // TODO: hashing scheme for clip id and beat start
                                note: new n.Note(
                                    data[0],
                                    data[1],
                                    data[2],
                                    data[3],
                                    data[4]
                                ),
                                children: [

                                ]
                            }
                        )
                    );
                }
            }

            function compare(note_former,note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }

            notes_parsed.sort(compare);

            return notes_parsed;
        }
    }

    export interface iClipDao {

        get_end_marker(): number

        get_start_marker(): number

        set_loop_bracket_lower(beat: number): void

        set_loop_bracket_upper(beat: number): void

        set_clip_endpoint_lower(beat: number): void

        set_clip_endpoint_upper(beat: number): void

        fire(): void

        stop(): void

        get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): string[]

        remove_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): void

        set_notes(notes: TreeModel.Node<note.Note>[]): void;

        get_playing_position(): any;

        get_loop_bracket_upper(): any;

        get_loop_bracket_lower(): any;

        append(note: TreeModel.Node<note.Note>): void;

        liveApi: any

        setMode(deferlow: boolean, synchronous: boolean): void
    }

    // simulate dao
    export class LiveClipVirtual implements iClipDao {

        liveApi = Error('not implemented');

        beat_start: number;
        beat_end: number;
        notes: TreeModel.Node<n.Note>[];

        constructor(notes: TreeModel.Node<n.Note>[]) {
            this.notes = notes;
        }

        append(note) {
            this.notes.push(note);
        }

        get_ambitus(): number[] {
            return [this.get_pitch_min(), this.get_pitch_max()]
        }

        load_notes_within_loop_brackets(): void {
            this.notes = Clip.parse_notes(
                this.get_notes(
                    this.get_loop_bracket_lower()[0],
                    0,
                    this.get_loop_bracket_upper()[0],
                    128
                )
            )
        }

        get_notes_within_loop_brackets(): TreeModel.Node<n.Note>[] {
            return this.notes;
        }

        get_pitch_min(): number {
            return _.min(
                this.get_notes_within_loop_brackets(),
                node => node.model.note.pitch
            )
        }

        get_pitch_max(): number {
            return _.max(
                this.get_notes_within_loop_brackets(),
                node => node.model.note.pitch
            )
        }

        get_end_marker(): number {
            return this.beat_end
        }

        get_start_marker(): number {
            return this.beat_start
        }

        get_loop_bracket_upper(): number[] {
            return [this.beat_end]
        }

        get_loop_bracket_lower(): number[] {
            return [this.beat_start]
        }

        set_loop_bracket_lower(beat: number): void {
            throw 'not implemented'
        }

        set_loop_bracket_upper(beat: number): void {
            throw 'not implemented'
        }

        set_clip_endpoint_lower(beat: number): void {
            throw 'not implemented'
        }

        set_clip_endpoint_upper(beat: number): void {
            throw 'not implemented'
        }

        fire(): void {
            throw 'not implemented'
        }

        stop(): void {
            throw 'not implemented'
        }

        set_notes(notes: TreeModel.Node<n.Note>[]): void {
            for (let note of notes) {
                this.notes.push(note)
            }
        }

        get_notes(beat_start, pitch_midi_min, beats_duration, pitch_midi_max): string[] {
            let prefix, notes, suffix;
            prefix = ["notes", this.notes.length.toString()];
            notes = [];
            for (let node of this.notes.filter(node => beat_start <= node.model.note.beat_start && node.model.note.beat_start < beat_start + beats_duration)) {
                notes.push("note");
                notes.push(node.model.note.pitch.toString());
                notes.push(node.model.note.beat_start.toString());
                notes.push(node.model.note.beats_duration.toString());
                notes.push(node.model.note.velocity.toString());
                notes.push(node.model.note.muted.toString());
            }
            suffix = ["done"];
            return prefix.concat(notes).concat(suffix)
        }

        remove_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): void {
            throw 'not implemented'
        }

        get_playing_position(): any {
            throw 'not implemented'
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            throw 'not implemented'
        }

        get_id(): any {
            throw 'not implemented'
        }

        get_path(): any {
            throw 'not implemented'
        }
    }

    export class ClipDao implements iClipDao {

        public liveApi: iLiveApi;
        private deferlow: boolean = false;
        private synchronous: boolean = true;

        private notes_cached: string[];
        beat_end: number;
        beat_start: number;

        constructor(liveApi: li.iLiveApi) {
            this.liveApi = liveApi;
        }

        withMode(deferlow: boolean, synchronous: boolean): this {
            this.setMode(deferlow, synchronous);
            return this
        }

        setMode(deferlow: boolean, synchronous: boolean): void {
            this.deferlow = deferlow;
            this.synchronous = synchronous;
        }

        get_playing_position(): number {
            return Number(this.liveApi.get('playing_position', this.deferlow, this.synchronous))
        }

        get_end_marker(): number {
            return this.liveApi.get('end_marker', this.deferlow, this.synchronous)[0];
        }

        get_start_marker(): number {
            return this.liveApi.get('start_marker', this.deferlow, this.synchronous)[0];
        }

        get_path(): string {
            return utils.cleanse_path(this.liveApi.get_path(this.deferlow, this.synchronous));
        }

        get_id() {
            return this.liveApi.get_id(this.deferlow, this.synchronous)
        }

        set_loop_bracket_lower(beat: number) {
            this.liveApi.set('loop_start', beat, this.deferlow, this.synchronous);
        }

        set_loop_bracket_upper(beat: number) {
            this.liveApi.set('loop_end', beat, this.deferlow, this.synchronous);
        }

        get_loop_bracket_lower(): number {
            return this.liveApi.get('loop_start', this.deferlow, this.synchronous);
        }

        get_loop_bracket_upper(): number {
            return this.liveApi.get('loop_end', this.deferlow, this.synchronous);
        }

        set_clip_endpoint_lower(beat: number) {
            this.liveApi.set('start_marker', beat, this.deferlow, this.synchronous);
        }

        set_clip_endpoint_upper(beat: number) {
            this.liveApi.set('end_marker', beat, this.deferlow, this.synchronous);
        }

        fire(): void {
            this.liveApi.call(['fire'], this.deferlow, this.synchronous);
        };

        stop(): void {
            this.liveApi.call(['stop'], this.deferlow, this.synchronous);
        };

        get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): string[] {
            if (this.liveApi.constructor.name == 'LiveApiNode') {
                // @ts-ignore
                global.liveApi.dynamicResponse = true;
            }
            return this.liveApi.call(
                [
                    'get_notes',
                    beat_start,
                    pitch_midi_min,
                    beat_end,
                    pitch_midi_max
                ],
                this.deferlow,
                this.synchronous
            );
        };

        remove_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): void {
            this.liveApi.call(
                [
                    'remove_notes',
                    beat_start,
                    pitch_midi_min,
                    beat_end,
                    pitch_midi_max
                ],
                this.deferlow,
                this.synchronous
            );
        };

        set_notes(notes: TreeModel.Node<n.Note>[]): void {
            this.liveApi.call(['set_notes'], this.deferlow, this.synchronous);
            this.liveApi.call(['notes', String(notes.length)], this.deferlow, this.synchronous);
            for (let node of notes) {
                this.liveApi.call(
                    [
                        'note',
                        node.model.note.pitch,
                        node.model.note.beat_start.toFixed(4),
                        node.model.note.beats_duration.toFixed(4),
                        node.model.note.velocity,
                        node.model.note.muted
                    ],
                    this.deferlow,
                    this.synchronous
                );
            }
            this.liveApi.call(['done'], this.deferlow, this.synchronous);
        }

        append(note: TreeModel.Node<note.Note>): void {
            throw 'not implemented'
        }
    }
}