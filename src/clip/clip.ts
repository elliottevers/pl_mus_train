// autowatch = 1;

// var l = require('./logger.js');
// var n = require('./note.js');
// var tr = require('./tree.js');
// var cd = require('./clip_dao.js');

import {note} from "../note/note";
import TreeModel = require("tree-model");

export namespace clip {

    export class Clip {

        private clip_dao;

        private notes: TreeModel.Node<note.Note>[];

        constructor(clip_dao) {
            this.clip_dao = clip_dao;
        }

        get_num_measures(): number {
            return this.get_end_marker() / 4;
        }

        get_end_marker(): number {
            return this.clip_dao.get_end_marker();
        }

        // TODO: annotations
        load_notes(): void {
            this.notes = this.get_notes(
                0,
                0,
                this.get_end_marker(),
                128
            );
        }

        // TODO: annotations
        get_pitch_max(): number {
            let pitch_max = 0;

            for (let note in this.notes) {
                if (note.id.pitch > pitch_max) {
                    pitch_max = note.id.pitch;
                }
            }

            return pitch_max;
        }

        // TODO: annotations
        get_pitch_min(): number {
            let pitch_min = 128;

            for (let note in this.notes) {
                if (note.id.pitch < pitch_min) {
                    pitch_min = note.id.pitch;
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

        // TODO: return list of tree nodes
        get_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): TreeModel.Node<Node>[] {
            if (this.notes === null) {
                // let beat_start, pitch_midi_min, beat_end, pitch_midi_max;
                // beat_start = 0;
                // beat_end = this.get_end_marker();
                // pitch_midi_min = 0;
                // pitch_midi_max = 128;
                return Clip._parse_notes(
                    this._get_notes(
                        beat_start,
                        pitch_midi_min,
                        beat_end,
                        pitch_midi_max
                    )
                );
            } else {
                return this.notes;
            }
        }

        private _get_notes(beat_start: number, pitch_midi_min: number, beat_end: number, pitch_midi_max: number): string[] {
            return this.clip_dao.get_notes(
                beat_start,
                pitch_midi_min,
                beat_end,
                pitch_midi_max
            )
        }

        // TODO: return list of tree nodes
        private static _parse_notes(notes: string[]): TreeModel.Node<note.Note>[] {
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
                                id: new Note(
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
                if (note_former.data.beat_start < note_latter.data.beat_start)
                    return -1;
                if (note_former.data.beat_start > note_latter.data.beat_start)
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
}