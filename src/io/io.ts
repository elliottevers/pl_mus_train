import {clip as c} from "../clip/clip";
import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {message} from "../message/messenger";

export namespace io {

    let dir_projects = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/tk_music_projects/';

    export let file_json_comm = dir_projects + 'json_live.json';

    import Messenger = message.Messenger;
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
            this.clips = {};
        }

        public set_notes(name_part: string, notes): void {
            this.clips[name_part] = notes;
        }

        public unset_notes(name_part: string): void {
            this.clips[name_part] = null;
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
            let messenger = new Messenger('max', 0);
            for (let name_part in this.clips) {
                let notes = this.clips[name_part];
                if (partnames.indexOf(name_part) !== -1) {
                    let key = [name_part, 'notes'].join('::');
                    this.dict.replace(key, "");
                    this.dict.set(key, ...Exporter.get_messages(notes));
                }
            }
            this.dict.replace('tempo', this.tempo);
            this.dict.replace('length_beats', this.length_beats);
            this.dict.export_json(this.filepath_export);
            messenger.message(['python'])
        }
    }

    export class Importer {

        public filepath_import: string;

        private dict: any;

        private name_dict: string;

        constructor(filepath_import, name_dict?:string) {
            this.filepath_import = filepath_import;
            this.name_dict = name_dict;
            this.dict = new Dict(name_dict);
        }

        public static import(name_part) {
            let dict = new Dict();

            dict.import_json(file_json_comm);

            return c.Clip.parse_note_messages(
                dict.get([name_part, 'notes'].join('::'))
            );
        }

        public import() {
            this.dict.import_json(this.filepath_import);
        }

        public get_notes(name_part): TreeModel.Node<n.Note>[] {
            let key = [this.name_dict, name_part, 'notes'].join('::');
            return c.Clip.parse_note_messages(
                this.dict.get(key)
            )
        }
    }
}