import {clip} from "../clip/clip";
import {note, note as n} from "../music/note";
import TreeModel = require("tree-model");
import {scene} from "../scene/scene";
import {cue_point} from "../cue_point/cue_point";

export namespace segment {

    import Clip = clip.Clip;
    import Note = note.Note;
    import LiveClipVirtual = clip.LiveClipVirtual;
    import Scene = scene.Scene;
    import CuePoint = cue_point.CuePoint;

    export class Segment {

        beat_start: number;
        beat_end: number;
        scene: Scene;
        cue_point: CuePoint;
        clip: Clip; // used as storage with an interface similar to Live
        clip_user_input: Clip;

        constructor(note: TreeModel.Node<n.Note>) {
            this.beat_start = note.model.note.beat_start;
            this.beat_end = note.model.note.get_beat_end();
            let clip_dao_virtual = new LiveClipVirtual([note]);
            this.clip = new Clip(clip_dao_virtual);
        }

        public static from_notes(notes: TreeModel.Node<Note>[]): Segment[] {
            let segments = [];
            for (let note of notes) {
                let segment = new Segment(note);
                segment.beat_start = note.model.note.beat_start;
                segment.beat_end = note.model.note.get_beat_end();
                segments.push(
                    segment
                )
            }
            return segments
        }

        public set_clip_user_input(clip: Clip) {
            this.clip_user_input = clip;
        }

        public set_cue_point(cue_point: CuePoint) {
            this.cue_point = cue_point;
        }

        public get_note(): TreeModel.Node<n.Note> {
            return this.clip.get_notes(
                this.beat_start,
                0,
                this.beat_end,
                128
            )[0]
        }

        public get_notes(): TreeModel.Node<n.Note>[] {
            return this.clip.get_notes(
                this.beat_start,
                0,
                this.beat_end,
                128
            )
        }

        public get_endpoints_loop() {
            return [this.beat_start, this.beat_end]
        }

        public set_endpoints_loop(beat_start, beat_end) {
            this.clip.set_loop_bracket_upper(beat_end);
            this.clip.set_loop_bracket_lower(beat_start);
        }

        public set_scene(scene: Scene) {
            this.scene = scene;
        }
    }
}