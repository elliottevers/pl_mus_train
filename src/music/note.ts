import TreeModel = require("tree-model");
const _ = require('underscore');

export namespace note {

    interface Parsable {
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

        public static get_overlap_beats(
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
                // return 0;
                return d - a;
            } else if (!former_starts_before_latter && former_ends_before_latter) {
                return b - a;
            }

            throw 'beats overlap cannot be determined'
        }

        public static split_note_at_points(note_to_split: TreeModel.Node<Note>, points: number[]): TreeModel.Node<Note>[] {

            if (points.length === 0) {
                return [note_to_split]
            }

            let segments = [];

            let beat_last = note_to_split.model.note.beat_start;

            for (let point of _.sortBy(points, (i) => {return i})) {
                let tree: TreeModel = new TreeModel();

                segments.push(
                    tree.parse(
                        {
                            id: -1, // TODO: hashing scheme for clip id and beat start
                            note: new Note(
                                note_to_split.model.note.pitch,
                                beat_last,
                                point - beat_last,
                                note_to_split.model.note.velocity,
                                note_to_split.model.note.muted
                            ),
                            children: [

                            ]
                        }
                    )
                );

                beat_last = point
            }

            let tree: TreeModel = new TreeModel();

            segments.push(
                tree.parse(
                    {
                        id: -1, // TODO: hashing scheme for clip id and beat start
                        note: new Note(
                            note_to_split.model.note.pitch,
                            beat_last,
                            note_to_split.model.note.get_beat_end() - beat_last,
                            note_to_split.model.note.velocity,
                            note_to_split.model.note.muted
                        ),
                        children: [

                        ]
                    }
                )
            );

            return segments
        }

        public contains_beat(beat: number): boolean {
            return this.beat_start < beat && this.get_beat_end() > beat
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
}