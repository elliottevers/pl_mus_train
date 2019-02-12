"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
var messenger;
var conversion_filetype = function (filename_to_convert, destination_filetype) {
    var base = filename_to_convert.substr(0, filename_to_convert.lastIndexOf('.')) || filename_to_convert;
    var filename_destination = [base, '.', destination_filetype].join('');
    messenger = new Messenger(env, 0);
    messenger.message([filename_destination]);
};
var test = function () {
    var file_to_convert = '/Users/elliottevers/Documents/DocumentsSymlinked/git-repos.nosync/audio/youtube/tswift_teardrops.webm';
    var destination_filetype = 'mp3';
    var base = file_to_convert.substr(0, file_to_convert.lastIndexOf('.')) || file_to_convert;
    var filename_destination = [base, '.', destination_filetype].join('');
    var testing = 1;
};
// test();
if (typeof Global !== "undefined") {
    Global.regex = {};
    Global.regex.test = test;
    Global.regex.conversion_filetype = conversion_filetype;
}
//# sourceMappingURL=regex.js.map