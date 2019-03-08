import {clip} from "../clip/clip";
import {note, note as n} from "../note/note";
import TreeModel = require("tree-model");
import {live} from "../live/live";

export namespace segment {

    import Clip = clip.Clip;
    import Note = note.Note;
    import LiveClipVirtual = live.LiveClipVirtual;

    export class Segment {

        beat_start: number;
        beat_end: number;
        clip: Clip;

        constructor(note: TreeModel.Node<n.Note>) {
            this.beat_start = note.model.note.beat_start;
            this.beat_end = note.model.note.get_beat_end();
            let clip_dao_virtual = new LiveClipVirtual([note]);
            this.clip = new Clip(clip_dao_virtual);
        }

        public get_note(): TreeModel.Node<n.Note> {
            return this.clip.get_notes(
                this.beat_start,
                0,
                this.beat_end,
                128
            )[0]
        }

        // public get_notes(): TreeModel.Node<n.Note>[] {
        //     return this.clip.get_notes(
        //         this.beat_start,
        //         0,
        //         this.beat_end,
        //         128
        //     )
        // }

        public get_endpoints_loop() {
            return [this.beat_start, this.beat_end]
        }

        public set_endpoints_loop(beat_start, beat_end) {
            this.clip.set_loop_bracket_upper(beat_end);
            this.clip.set_loop_bracket_lower(beat_start);
        }

        // public get_beat_lower() {
        //     return this.clip.get_loop_bracket_lower()
        // }
        //
        // public get_beat_upper() {
        //     return this.clip.get_loop_bracket_upper()
        // }
    }

    export class SegmentIterator {
        private segments: Segment[];
        public direction_forward: boolean;
        private i: number;

        constructor(segments: Segment[], direction_forward: boolean) {
            this.segments = segments;
            this.direction_forward = direction_forward;
            this.i = -1;
        }

        // TODO: type declarations
        public next() {
            let value_increment = (this.direction_forward) ? 1 : -1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'segment iterator < 0'
            }

            if (this.i < this.segments.length) {
                return {
                    value: this.segments[this.i],
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
                return this.segments[this.i];
            } else {
                return null;
            }
        }

        public reset() {
            this.i = -1;
        }

        public get_index_current() {
            return this.i;
        }
    }
}