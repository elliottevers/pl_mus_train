// let exporter = new io.Exporter(
//     filepath='slkdfjlsdkfjldkf'
// );
//
// exporter.setNotes(
//     notes=notes,
//     name_part='melody'
// );
//
// exporter.setNotes(
//     notes=notes,
//     name_part='chords'
// );
//
// exporter.setNotes(
//     notes=notes,
//     name_part='bass'
// );
//
// exporter.setTempo(
//     bpm=bpm
// );
//
// exporter.setLengthTrack(
//     beats=beats
// );



// import {note as n} from "../note/note";
// import TreeModel = require("tree-model");
// import {live} from "../live/live";
// import {message} from "../message/messenger";

import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import TreeModel = require("tree-model");

export namespace io {

    declare let Dict: any;

    export class Exporter {

        public filepath_export: string;

        private dict: any;

        private clips: object;

        private tempo: number;

        private length_beats: number;

        constructor(filepath_export, name_dict?:string) {
            this.filepath_export = filepath_export;
            this.dict = new Dict(name_dict);
        }

        public set_notes(id_clip: number, notes, name_part: string): void {
            let clip = {};
            clip['notes'] = notes;
            clip['part'] = name_part;
            this.clips[id_clip] = clip;
        }

        public unset_notes(id_clip: number, name_part: string): void {
            this.clips[id_clip] = null;
        }

        public set_tempo(bpm: number) {
            this.tempo = bpm;
        }

        public set_length(beats: number) {
            this.length_beats = beats;
        }

        public static get_messages(notes) {
            let messages = [];

            messages.push(
                ['notes', notes.length.toString()].join(' ')
            );

            for (let i_note in notes) {
                messages.push(notes[i_note].model.note.encode());
            }

            messages.push(
                ['notes', 'done'].join(' ')
            );

            return messages
        }

        public export_clips(partnames): void {
            for (let id_clip in this.clips) {
                let clip = this.clips[id_clip];
                let name_part = clip['part'];
                if (partnames.indexOf(name_part) !== -1) {
                    let key = [name_part, 'notes'].join('::');
                    this.dict.replace("melody::notes", "");
                    this.dict.set(key, ...Exporter.get_messages(clip['notes']));
                    // TODO: tempo
                    // TODO: length of song in beats
                }
            }
        }
    }

    export class Importer {

        public filepath_import: string;

        private dict: any;

        constructor(filepath_import, name_dict?:string) {
            this.filepath_import = filepath_import;
            this.dict = new Dict(name_dict);
        }

        public import() {
            this.dict.import_json(this.filepath_import);
        }

        public get_notes(name_part): TreeModel.Node<n.Note>[] {
            let key = [name_part, 'notes'].join('::');
            return c.Clip.parse_note_messages(
                this.dict.get(key)
            )
        }
    }
}