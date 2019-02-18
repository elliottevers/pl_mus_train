import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {live} from "../live/live";
import {message} from "../message/messenger";

export namespace clip {

    import LiveApiJs = live.LiveApiJs;
    import Messenger = message.Messenger;

    export class Clip {

        private clip_dao;

        private notes: TreeModel.Node<n.Note>[];

        constructor(clip_dao) {
            this.clip_dao = clip_dao;
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

        // TODO: annotations
        load_notes_within_markers(): void {
            this.notes = this.get_notes(
                this.get_start_marker(),
                0,
                this.get_end_marker(),
                128
            )
        }

        // TODO: annotations
        get_pitch_max(): number {
            let pitch_max = 0;

            for (let node of this.get_notes_within_markers()) {
                if (node.model.note.pitch > pitch_max) {
                    pitch_max = node.model.note.pitch;
                }
            }

            return pitch_max;
        }

        // TODO: annotations
        get_pitch_min(): number {
            let pitch_min = 128;

            for (let node of this.get_notes_within_markers()) {
                if (node.model.note.pitch < pitch_min) {
                    pitch_min = node.model.note.pitch;
                }
            }

            return pitch_min;
        }

        get_ambitus(): number[] {
            return [this.get_pitch_min(), this.get_pitch_max()];
        }

        set_loop_bracket_lower(beat: number): void {
            this.clip_dao.set_loop_bracket_lower(beat);
        }

        set_loop_bracket_upper(beat: number): void {
            this.clip_dao.set_loop_bracket_upper(beat);
        }

        get_loop_bracket_lower(): number {
            return this.clip_dao.get_loop_bracket_lower();
        }

        get_loop_bracket_upper(): number {
            return this.clip_dao.get_loop_bracket_upper();
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
            if (!this.notes) {
                this.load_notes_within_markers()
            }
            return this.notes;
        }

        public get_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): TreeModel.Node<n.Note>[] {
            return Clip._parse_notes(
                this._get_notes(
                    beat_start,
                    pitch_midi_min,
                    beat_end,
                    pitch_midi_max
                )
            );
        }

        public set_notes(notes: TreeModel.Node<n.Note>[]): void {
            this.clip_dao.set_notes(notes);
        }

        // TODO: *actually* make private
        public _get_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): string[] {
            return this.clip_dao.get_notes(
                beat_start,
                pitch_midi_min,
                beat_end,
                pitch_midi_max
            )
        }

        public remove_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): void {
            this.clip_dao.remove_notes(
                beat_start,
                pitch_midi_min,
                beat_end,
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

        // TODO: return list of tree nodes
        private static _parse_notes(notes: string[]): TreeModel.Node<n.Note>[] {
            let data: any = [];
            let notes_parsed = [];

            let pitch;
            let beat_start;
            let beats_duration;
            let velocity;
            let b_muted;

            let index_num_expected_notes = null;

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

                if (i === index_num_expected_notes) {
                    data = [];
                    continue;
                }

                data.push(notes[i]);

                if (data.length === 5) {

                    pitch = data[0];
                    beat_start = data[1];
                    beats_duration = data[2];
                    velocity = data[3];
                    b_muted = data[4];

                    let tree: TreeModel = new TreeModel();

                    notes_parsed.push(
                        tree.parse(
                            {
                                id: -1, // TODO: hashing scheme for clip id and beat start
                                note: new n.Note(
                                    pitch,
                                    beat_start,
                                    beats_duration,
                                    velocity,
                                    b_muted
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

            // TODO: fail gracefully
            // if (notes_parsed.length !== num_expected_notes) {
            //     throw "notes retrieved from clip less than expected"
            // }

            // l.log(notes_parsed);
            return notes_parsed;
        }
    }

    export class ClipDao {

        private clip_live;
        private messenger: Messenger;
        private deferlow: boolean;

        // how to implement LiveAPI - get, set, call

        constructor(clip_live: live.iLiveApiJs, messenger, deferlow: boolean) {
            // let path = "live_set tracks " + index_track + " clip_slots " + index_clip_slot + " clip";
            // this.clip_live = new LiveAPI(null, path);
            this.clip_live = clip_live;
            this.messenger = messenger;
            this.deferlow = deferlow;
        }

        // TODO: check if these actually return arrays
        get_end_marker(): number {
            return this.clip_live.get('end_marker')[0];
        }

        // TODO: check if these actually return arrays
        get_start_marker(): number {
            return this.clip_live.get('start_marker')[0];
        }

        set_loop_bracket_lower(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["set", "loop_start", beat])
            } else {
                this.clip_live.set('loop_start', beat);
            }
        }

        set_loop_bracket_upper(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["set", "loop_end", beat])
            } else {
                this.clip_live.set('loop_end', beat);
            }
        }

        get_loop_bracket_lower(): number {
            // if (this.deferlow) {
            //     this.messenger.message(["set", "loop_start", beat])
            // } else {
            return this.clip_live.get('loop_start');
            // }
        }

        get_loop_bracket_upper(): number {
            // if (this.deferlow) {
            //     this.messenger.message(["set", "loop_end", beat])
            // } else {
            return this.clip_live.get('loop_end');
            // }
        }

        set_clip_endpoint_lower(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["set", "start_marker", beat])
            } else {
                this.clip_live.set('start_marker', beat);
            }
        }

        set_clip_endpoint_upper(beat: number) {
            if (this.deferlow) {
                this.messenger.message(["set", "end_marker", beat])
            } else {
                this.clip_live.set('end_marker', beat);
            }
        }

        fire(): void {
            if (this.deferlow) {
                this.messenger.message(["call", "fire"])
            } else {
                this.clip_live.call('fire');
            }
        };

        stop(): void {
            if (this.deferlow) {
                this.messenger.message(["call", "stop"])
            } else {
                this.clip_live.call('stop');
            }
        };

        get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): string[] {
            // if (this.deferlow) {
            //
            // } else {
                return this.clip_live.call(
                    'get_notes',
                    beat_start,
                    pitch_midi_min,
                    beat_end,
                    pitch_midi_max
                );
            // }
        };

        remove_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): void {
            if (this.deferlow) {
                this.messenger.message(["call", "remove_notes", beat_start, pitch_midi_min, beat_end, pitch_midi_max])
            } else {
                this.clip_live.call(
                    'remove_notes',
                    beat_start,
                    pitch_midi_min,
                    beat_end,
                    pitch_midi_max
                );
            }
        };

        set_notes(notes: TreeModel.Node<n.Note>[]): void {
            if (this.deferlow) {
                this.messenger.message(['call', 'set_notes']);
                this.messenger.message(['call', 'notes', notes.length]);
                for (let node of notes) {
                    this.messenger.message([
                        'call',
                        'note',
                        node.model.note.pitch,
                        node.model.note.beat_start.toFixed(4),
                        node.model.note.beats_duration.toFixed(4),
                        node.model.note.velocity,
                        node.model.note.muted
                    ]);
                }
                this.messenger.message(['call', 'done'])
            } else {
                this.clip_live.call('set_notes');
                this.clip_live.call('notes', notes.length);
                for (let node of notes) {
                    this.clip_live.call(
                        "note",
                        node.model.note.pitch,
                        node.model.note.beat_start.toFixed(4),
                        node.model.note.beats_duration.toFixed(4),
                        node.model.note.velocity,
                        node.model.note.muted
                    );
                }
                this.clip_live.call("done")
            }
        }
    }
}