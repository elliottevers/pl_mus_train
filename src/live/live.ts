import TreeModel = require("tree-model");
import {note as n} from "../note/note"

declare let LiveAPI: any;

export namespace live {

    export interface iLiveApiJs {
        get(property: string): any;
        set(property: string, value: any): void;
        call(func: string): void;
    }

    export interface ClipLive {

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
    }

    export class LiveApiJs implements iLiveApiJs {
        private live_api: any;

        constructor(path: string) {
            this.live_api = new LiveAPI(null, path);
        }

        get(property: string): any {
            return this.live_api.get(property)
        }

        set(property: string, value: any): void {
            this.live_api.set(property, value)
        }

        call(func: string, ...args: any[]): any {
            return this.live_api.call(func, ...args);
        }
    }

    export class LiveClipVirtual implements ClipLive {

        notes: TreeModel.Node<n.Note>[];

        constructor(notes: TreeModel.Node<n.Note>[]) {
            this.notes = notes;
        }

        get_end_marker(): number {
            return this.notes[this.notes.length - 1].model.note.get_beat_end()
        }

        get_start_marker(): number {
            return this.notes[0].model.note.beat_start;
        }

        set_loop_bracket_lower(beat: number): void {
            return
        }

        set_loop_bracket_upper(beat: number): void {
            return
        }

        set_clip_endpoint_lower(beat: number): void {
            return
        }

        set_clip_endpoint_upper(beat: number): void {
            return
        }

        fire(): void {
            return
        }

        stop(): void {
            return
        }

        get_notes(beat_start, pitch_midi_min, beat_end, pitch_midi_max): string[] {
            let prefix, notes, suffix;
            prefix = ["notes", this.notes.length.toString()];
            notes = [];
            for (let node of this.notes) {
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
            return
        }
    }

}