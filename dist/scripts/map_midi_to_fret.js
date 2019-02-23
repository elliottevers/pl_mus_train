"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("../message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger;
// let conversion_filetype = (filename_to_convert, destination_filetype) => {
//     var base = filename_to_convert.substr(0, filename_to_convert.lastIndexOf('.')) || filename_to_convert;
//     let filename_destination = [base, '.', destination_filetype].join('');
//     messenger = new Messenger(env, 0);
//     messenger.message([filename_destination]);
// };
var test = function () {
    // let file_to_convert = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/audio/youtube/tswift_teardrops.webm';
    // let destination_filetype = 'mp3';
    // var base = file_to_convert.substr(0, file_to_convert.lastIndexOf('.')) || file_to_convert;
    // let filename_destination = [base, '.', destination_filetype].join('');
    // let testing = 1;
};
var midi = function (pitch_midi) {
    messenger = new Messenger(env, 0);
    if (pitch_midi == 69) {
        messenger.message([2, 5, 1]);
    }
    else {
        messenger.message([2, 5, 0]);
    }
};
if (typeof Global !== "undefined") {
    Global.map_midi_to_fret = {};
    Global.map_midi_to_fret.midi = midi;
}
//# sourceMappingURL=map_midi_to_fret.js.map