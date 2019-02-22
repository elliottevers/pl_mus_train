import {message} from "../message/messenger";
import Messenger = message.Messenger;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let messenger: Messenger;

// let conversion_filetype = (filename_to_convert, destination_filetype) => {
//     var base = filename_to_convert.substr(0, filename_to_convert.lastIndexOf('.')) || filename_to_convert;
//     let filename_destination = [base, '.', destination_filetype].join('');
//     messenger = new Messenger(env, 0);
//     messenger.message([filename_destination]);
// };

let test = () => {
    // let file_to_convert = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/audio/youtube/tswift_teardrops.webm';
    // let destination_filetype = 'mp3';
    // var base = file_to_convert.substr(0, file_to_convert.lastIndexOf('.')) || file_to_convert;
    // let filename_destination = [base, '.', destination_filetype].join('');
    // let testing = 1;


};

let midi = (pitch_midi) => {
    messenger = new Messenger(env, 0);
    if (pitch_midi == 69) {
        messenger.message([1, 5])
    } else {
        messenger.message([1, 0])
    }
};

// test();

if (typeof Global !== "undefined") {
    Global.map_midi_to_fret = {};
    Global.map_midi_to_fret.midi = midi;
    // Global.regex.conversion_filetype = conversion_filetype;
}
