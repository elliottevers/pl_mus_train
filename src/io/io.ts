import {message} from "../message/messenger";
import {live} from "../live/live";

export namespace io {

    import Env = live.Env;
    let dir_projects = '/Users/elliottevers/Documents/git-repos.nosync/tk_music_projects/';

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
            let messenger = new Messenger(Env.MAX, 0);
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
}