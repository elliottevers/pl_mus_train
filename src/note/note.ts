export namespace note {

    export class Note  {

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
            this.pitch = pitch;
            this.beat_start = beat_start;
            this.beats_duration = beats_duration;
            this.velocity = velocity;
            this.muted = muted;
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

        get_interval_beats():number[] {
            return [this.beat_start, this.beat_start + this.beats_duration];
        }

        // TODO: add type of argument and return value
        get_best_candidate(list_candidate_note)  {
            let beats_overlap, beats_max_overlap, list_candidate_note_max_overlap;

            list_candidate_note_max_overlap = [];
            beats_max_overlap = 0;

            for (let candidate_note of list_candidate_note) {
                beats_overlap = Note.get_overlap_beats(
                    this.beat_start,
                    this.beat_start + this.beats_duration,
                    candidate_note.data.beat_start,
                    candidate_note.data.beat_start + candidate_note.data.beats_duration
                );
                if (beats_overlap > beats_max_overlap) {
                    beats_max_overlap = beats_overlap;
                    list_candidate_note_max_overlap = [];
                }
                if (beats_overlap === beats_max_overlap) {
                    list_candidate_note_max_overlap.push(candidate_note);
                }
            }

            function compare(note_former,note_latter) {
                if (note_former.data.beat_start < note_latter.data.beat_start)
                    return -1;
                if (note_former.data.beat_start > note_latter.data.beat_start)
                    return 1;
                return 0;
            }

            list_candidate_note_max_overlap.sort(compare);

            return list_candidate_note_max_overlap[0];
        }

        choose(): boolean {
            if (this._b_has_chosen) {
                // tree.children[0].appendChild(left_left).appendChild(left_right);
                // note_parent.appendChild(this);
                this._b_has_chosen = true;
                return true;
            } else {
                return false;
            }
        }
    }
}