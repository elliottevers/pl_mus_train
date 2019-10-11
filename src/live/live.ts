import TreeModel = require("tree-model");
import {note as n} from "../note/note"
import {clip as module_clip} from "../clip/clip";

let node = require("deasync");
node.loop = node.runLoopOnce;


// declare let LiveAPI: any;

export namespace live {

    import Clip = module_clip.Clip;

    export interface iLiveApiJs {
        get(property: string): any;
        set(property: string, value: any): void;
        call(func: string): void;
        get_id(): any;
        get_path(): any;
        get_children(): any;
    }

    export class LiveApiMaxSynchronous implements iLiveApiJs {

        private idLive: string;  // either path or id
        private maxApi: any;
        private type_id: string;

        constructor(idLive, maxApi, type_id) {
            this.idLive = idLive;
            this.maxApi = maxApi;
            this.type_id = type_id;
        }

        public get(property) {

            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));

            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'get', property);

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }

        public set(property, value) {
            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'set', property, value);
        }

        public call(...args) {
            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'call', ...args);
        }

        public get_id() {
            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getid');

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }

        public get_path() {
            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getpath');

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }

        public get_children() {
            // @ts-ignore
            global.liveApiMaxSynchronousLocked = true;

            this.maxApi.outlet('LiveApiMaxSynchronous', this.type_id, ...this.idLive.split(' '));
            this.maxApi.outlet('LiveApiMaxSynchronous', 'command', 'getchildren');

            // @ts-ignore
            while (global.liveApiMaxSynchronousLocked)
                node.loop();

            // @ts-ignore
            return global.liveApiMaxSynchronousResult
        }
    }

    export class LiveApiJs implements iLiveApiJs {
        public object: any;

        // TODO: do dependency injection that's actually good
        constructor(path: string, env?: string, type_id?: string) {
            if (env == 'node') {
                const max_api = require('max-api');
                this.object = new LiveApiMaxSynchronous(path, max_api, type_id);
            } else {
                // @ts-ignore
                this.object = new LiveAPI(null, path);
            }
        }

        get(property: string): any {
            return this.object.get(property);
        }

        set(property: string, value: any): void {
            this.object.set(property, value)
        }

        call(func: string, ...args: any[]): any {
            return this.object.call(func, ...args);
        }

        get_id(): any {
            return this.object.id;
        }

        get_path(): string {
            return this.object.path;
        }

        get_children(): any {
            return this.object.children;
        }
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

    // simulate dao
    export class LiveClipVirtual implements ClipLive {

        beat_start: number;
        beat_end: number;

        notes: TreeModel.Node<n.Note>[];

        constructor(notes: TreeModel.Node<n.Note>[]) {
            this.notes = notes;
        }

        append(note) {
            let test = this.notes;
            test.push(note);
            this.notes = test;
        }

        get_ambitus(): number[] {
            return []
        }

        load_notes_within_loop_brackets(): void {
            this.notes = Clip._parse_notes(
                this.get_notes(
                    this.get_loop_bracket_lower()[0],
                    0,
                    this.get_loop_bracket_upper()[0],
                    128
                )
            )
        }

        get_notes_within_loop_brackets(use_cache?: boolean): TreeModel.Node<n.Note>[] {
            if (!this.notes || !use_cache) {
                this.load_notes_within_loop_brackets();
            }
            return this.notes;
        }

        get_pitch_max(): number {
            let pitch_max = 0;

            for (let node of this.get_notes_within_loop_brackets()) {
                if (node.model.note.pitch > pitch_max) {
                    pitch_max = node.model.note.pitch;
                }
            }

            return pitch_max;
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
            return
        }

        set_path_deferlow(key_route_override: string, path_live: string): void {
            return
        }

        get_path() {
            return ''
        }
    }

}