import TreeModel = require("tree-model");
import p = require("../parse/parse");
import Note = note.Note;

export namespace note {

    interface Parsable {
        // get_overlap_beats(
        //     beat_start_former: number,
        //     beat_end_former: number,
        //     beat_start_latter: number,
        //     beat_end_latter: number
        // )
        get_best_candidate(
            list_candidate_note: TreeModel.Node<Note>[]
        )
    }

    export class Note implements Parsable {

        public pitch: number;
        public beat_start: number;
        public beats_duration: number;
        public velocity: number;
        public muted: number;
        public _b_has_chosen: boolean;

        constructor(
            pitch: number,
            beat_start: number,
            beats_duration: number,
            velocity: number,
            muted: number
        ) {
            this.pitch = Number(pitch);
            this.beat_start = Number(beat_start);
            this.beats_duration = Number(beats_duration);
            this.velocity = Number(velocity);
            this.muted = Number(muted);
            this._b_has_chosen = false;
        }

        static get_overlap_beats(
            beat_start_former: number,
            beat_end_former: number,
            beat_start_latter: number,
            beat_end_latter: number
        ) {
            let a = beat_start_former, b = beat_end_former, c = beat_start_latter, d = beat_end_latter;
            let former_starts_before_latter = (a <= c);
            let former_ends_before_latter = (b <= d);

            // TODO: check logic
            if (former_starts_before_latter && former_ends_before_latter) {
                return b - c;
            } else if (former_starts_before_latter && !former_ends_before_latter) {
                return a - c;
            } else if (!former_starts_before_latter && !former_ends_before_latter) {
                return 0;
            } else if (!former_starts_before_latter && former_ends_before_latter) {
                return b - a;
            }

            throw 'case not considered'

        }

        encode(): string {
            return this.to_array().join(' ')
        }

        public static from_note_renderable(note: TreeModel.Node<NoteRenderable>): TreeModel.Node<Note> {
            let tree: TreeModel = new TreeModel();

            return tree.parse(
                {
                    id: -1, // TODO: hashing scheme for clip id and beat start
                    note: new Note(
                        note.model.note.pitch,
                        note.model.note.beat_start,
                        note.model.note.beats_duration,
                        note.model.note.velocity,
                        note.model.note.muted
                    ),
                    children: [

                    ]
                }
            )
        }

        to_array():Array<number> {
            return [this.pitch, this.beat_start, this.beats_duration, this.velocity, this.muted]
        }

        get_beat_end():number {
            return this.beat_start + this.beats_duration;
        }

        get_interval_beats():number[] {
            return [this.beat_start, this.get_beat_end()];
        }

        // TODO: add type of argument and return value
        get_best_candidate(list_candidate_note: TreeModel.Node<Note>[])  {
            let beats_overlap, beats_max_overlap, list_candidate_note_max_overlap;

            list_candidate_note_max_overlap = [];
            beats_max_overlap = 0;

            for (let candidate_note of list_candidate_note) {
                beats_overlap = Note.get_overlap_beats(
                    this.beat_start,
                    this.beat_start + this.beats_duration,
                    candidate_note.model.note.beat_start,
                    candidate_note.model.note.beat_start + candidate_note.model.note.beats_duration
                );
                if (beats_overlap > beats_max_overlap) {
                    beats_max_overlap = beats_overlap;
                    list_candidate_note_max_overlap = [];
                }
                if (beats_overlap === beats_max_overlap) {
                    list_candidate_note_max_overlap.push(candidate_note);
                }
            }

            function compare(note_former: TreeModel.Node<Note>, note_latter: TreeModel.Node<Note>) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }

            list_candidate_note_max_overlap.sort(compare);

            return list_candidate_note_max_overlap[0];
        }

        choose(): boolean {
            if (!this._b_has_chosen) {
                // tree.children[0].appendChild(left_left).appendChild(left_right);
                // note_parent.addChild(this);
                this._b_has_chosen = true;
                return true;
            } else {
                return false;
            }
        }
    }

    export class NoteRenderable extends Note {

        coordinates_matrix: number[];

        constructor(
            pitch: number,
            beat_start: number,
            beats_duration: number,
            velocity: number,
            muted: number,
            coordinates_matrix: number[]
        ) {
            super(
                pitch,
                beat_start,
                beats_duration,
                velocity,
                muted
            );

            this.coordinates_matrix = coordinates_matrix;
        }

        public get_coordinates_matrix(): number[] {
            return this.coordinates_matrix;
        }

        public static from_note(note, coord): TreeModel.Node<NoteRenderable> {
            let tree: TreeModel = new TreeModel();

            return tree.parse(
                {
                    id: -1, // TODO: hashing scheme for clip id and beat start
                    note: new NoteRenderable(
                        note.model.note.pitch,
                        note.model.note.beat_start,
                        note.model.note.beats_duration,
                        note.model.note.velocity,
                        note.model.note.muted,
                        coord
                    ),
                    children: [

                    ]
                }
            )
        }
    }

    export class NoteIterator {

        private notes: TreeModel.Node<Note>[];
        public direction_forward: boolean;
        private i: number;

        constructor(notes: TreeModel.Node<Note>[], direction_forward: boolean) {
                this.notes = notes;
                this.direction_forward = direction_forward;
                this.i = -1;
        }

        // TODO: type declarations
        public next() {
            let value_increment = (this.direction_forward) ? 1 : -1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'note iterator < 0'
            }

            if (this.i < this.notes.length) {
                return {
                    value: this.notes[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.notes[this.i];
            } else {
                return null;
            }
        }
    }
}