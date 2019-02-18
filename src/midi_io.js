"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var live_1 = require("./live/live");
var clip_1 = require("./clip/clip");
var logger_1 = require("./log/logger");
var Logger = logger_1.log.Logger;
var env = 'max';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// import tone = require("tone");
//
// import fs = require("fs");
// whatever.Midi
// import * as tonejs from "@tonejs/midi";
// import tonejs = require("@tonejs/midi");
// import * as app1 from "@tonejs/midi";
// import app2 = require("@tonejs/midi");
// import {App} from "@tonejs/midi";
// let test = async () => {
//     // load a midi file in the browser
//     const midi = await tone.Midi.fromUrl("path/to/midi.mid");
//     //the file name decoded from the first track
//     const name = midi.name;
//     //get the tracks
//     midi.tracks.forEach(track => {
//         //tracks have notes and controlChanges
//
//         //notes are an array
//         const notes = track.notes
//         notes.forEach(note => {
//             //note.midi, note.time, note.duration, note.name
//         })
//
//         //the control changes are an object
//         //the keys are the CC number
//         track.controlChanges[64]
//         //they are also aliased to the CC number's common name (if it has one)
//         track.controlChanges.sustain.forEach(cc => {
//             // cc.ticks, cc.value, cc.time
//         })
//
//         //the track also has a channel and instrument
//         //track.instrument.name
//     });
// };
//
// test();
// const midiData = fs.readFileSync('/Users/elliottevers/Downloads/test_midi_io.mid');
// const midi = new tone.Midi(midiData);
//
// let testing = 1;
// import { encode } from 'json-midi-encoder';
//
// import { parseArrayBuffer } from 'midi-json-parser';
//
//
// import * as fs from "fs";
// import * as filereader from "filereader";
// var filereader = require('filereader');
// fs.open('/open/some/file.txt', 'r', (err, fd) => {
//     if (err) throw err;
//     fs.close(fd, (err) => {
//         if (err) throw err;
//     });
// });
// let buffer = Buffer.from(arraybuffer);
// let arraybuffer = Uint8Array.from(buffer).buffer;
// let file_midi = fs.readFileSync('/Users/elliottevers/Downloads/test_midi_io.mid');
//
// let reader = new FileReader();
//
// let arraybuffer = Uint8Array.from(file_midi).buffer;
//
// parseArrayBuffer(arraybuffer)
//     .then((json) => {
//         console.log(json)
//     });
// let testing = 1;
// var FileReader = require('filereader');
//
// var file = new File('./files/my-file.txt')
// let fileReader = new FileReader();
//
// fileReader.setNodeChunkedEncoding(true || false);
// fileReader.readAsBinaryString(
//     new File('./files/my-file.txt')
// );
//
// // non-standard alias of `addEventListener` listening to non-standard `data` event
// fileReader.on('data', function (data) {
//     console.log("chunkSize:", data.length);
// });
//
// // `onload` as listener
// fileReader.addEventListener('load', function (ev) {
//     console.log("dataUrlSize:", ev.target.result.length);
// });
//
// // `onloadend` as property
// fileReader.onloadend(function () {
//     console.log("Success");
// });
// const reader = new FileReader();
//
// reader.re
//
// reader.readAsArrayBuffer()
//
// const array_buffer = reader.readAsArrayBuffer(file)
// let write = () => {
//     const json = {
//         division: 480,
//         format: 1,
//         tracks: [
//             [
//                 {
//                     delta: 0,
//                     trackName: 'example'
//                 },
//                 // ... there are probably more events ...
//                 {
//                     delta: 0,
//                     endOfTrack: true
//                 }
//             ]
//             // ... maybe there are more tracks ...
//         ]
//     };
//
//     // encode(json)
//     //     .then((midiFile) => {
//     //         // midiFile is an ArrayBuffer containing the binary data.
//     //     });
// };
//
// let read = () => {
//
//     // Let's assume there is an ArrayBuffer called arrayBuffer which contains the binary content of a
//     // MIDI file.
//
//         // parseArrayBuffer(arrayBuffer)
//         //     .then((json) => {
//         //         // json is the JSON representation of the MIDI file.
//         //     });
//
// };
// let filepath = '/Users/elliottevers/Downloads/from_live.json';
// function jsobj_to_dict(o) {
//     var d = new Dict('');
//
//     for (var keyIndex in o)	{
//         var value = o[keyIndex];
//
//         if (!(typeof value === "string" || typeof value === "number")) {
//             var isEmpty = true;
//             for (var anything in value) {
//                 isEmpty = false;
//                 break;
//             }
//
//             if (isEmpty) {
//                 value = new Dict('');
//             }
//             else {
//                 var isArray = true;
//                 for (var valueKeyIndex in value) {
//                     if (isNaN(parseInt(valueKeyIndex))) {
//                         isArray = false;
//                         break;
//                     }
//                 }
//
//                 if (!isArray) {
//                     value = jsobj_to_dict(value);
//                 }
//             }
//         }
//         d.set(keyIndex, value);
//     }
//     return d;
// }
var set_midi = function (filepath) {
    var dict_import = new Dict("dict_import");
    dict_import.import_json(filepath);
    var notes = dict_import.get('melody::notes');
    var live_api = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
    // for (let note of melody) {
    //     clip.set_notes([note])
    // }
    var logger = new Logger(env);
    logger.log(notes.toString());
    // clip.set_notes(melody)
    //
    // let notes = clip.get_notes(0, 0, 8, 128);
    //
    // for (let i_note in notes) {
    //     d.append(
    //         // i_note.toString(), notes[i_note].model.note.to_json()
    //         i_note.toString(), notes[i_note].model.note.to_array()
    //     )
    // }
    //
    // dict_import.import_json(filepath);
    //
    // let logger = new Logger(env);
    //
    // logger.log(notes.toString());
};
var export_midi = function (filepath) {
    var dict_export = new Dict("dict_export");
    // let dict_melody = new Dict("melody");
    var live_api;
    live_api = new live_1.live.LiveApiJs('live_set view highlighted_clip_slot clip');
    var clip = new clip_1.clip.Clip(new clip_1.clip.ClipDao(live_api, new messenger_1.message.Messenger(env, 0), false));
    var notes = clip.get_notes(0, 0, 8, 128);
    var name_part = 'melody';
    // dict_export.set(
    //     name_part, ['n']
    // );
    //
    // for (let i_note in notes) {
    //     dict_export.append(name_part, notes[i_note].model.note.encode());
    // }
    //
    // dict_export.append(
    //     name_part, [['notes', 'done'].join(' ')]
    // );
    var reps = [];
    // let test = ['1 2 3 4 5', '6 7 8 9 10 11'];
    dict_export.replace("melody::notes", "");
    // dict_export.set("melody::notes", ...test);
    // dict_export.set(
    //     name_part, ['n']
    // );
    //
    reps.push(['notes', notes.length.toString()].join(' '));
    for (var i_note in notes) {
        reps.push(notes[i_note].model.note.encode());
        // dict_export.append(name_part, notes[i_note].model.note.encode());
    }
    reps.push(['notes', 'done'].join(' '));
    //
    // dict_export.append(
    //     name_part, [['notes', 'done'].join(' ')]
    // );
    // let test = ['1 2 3 4 5', '6 7 8 9 10 11'];
    //
    // dict_export.replace("melody::notes", "");
    //
    // dict_export.set("melody::notes", ...test);
    // for (let i_note in notes_stub) {
    //     dict_melody.set(i_note, note_stub)
    // }
    //
    // dict_export.set(
    //     name_part, [jsobj_to_dict(dict_melody)]
    // );
    // let notes = {
    //     1: 'first note',
    //     2: 'second note',
    //     3: 'third note'
    // };
    //
    // dict_export.set(
    //     'melody', []
    // );
    //
    // dict_export.append(
    //     'melody', ['first']
    // );
    //
    // dict_export.set(
    //     'bass', []
    // );
    //
    // dict_export.setparse(
    //     'bass', [notes]
    // );
    dict_export.set.apply(dict_export, ["melody::notes"].concat(reps));
    dict_export.export_json(filepath);
    // dict_export.setparse()
    // let logger = new Logger(env);
    //
    // logger.log(notes.toString());
    var messenger = new Messenger(env, 0);
    messenger.message([filepath]);
};
// let live_api_user_input: LiveApiJs;
// live_api_user_input = new li.LiveApiJs(
//     "live_set tracks " + 17 + " clip_slots " + 0 + " clip"
// );
// let clip_user_input = new c.Clip(
//     new c.ClipDao(
//         live_api_user_input,
//         new m.Messenger(env, 0),
//         false
//     )
// );
// let reset = (index_track_user_input) => {
//     // clip_user_input.remove_notes(0, 0, 2, 128);
// };
//
// let set = () => {
//     // clip_summarization.set_notes(
//     //     clip_user_input.get_notes(0, 0, 2, 128)
//     // )
// };
//
// let get = () => {
//     // let notes = clip_user_input.get_notes(0, 0, 2, 128);
//     // for (let node of notes) {
//     //     post("beat_start");
//     //     post("\n");
//     //     post(node.model.note.beat_start);
//     //     post("\n");
//     //     post("pitch");
//     //     post("\n");
//     //     post(node.model.note.pitch);
//     //     post("\n");
//     // }
// };
// write();
// read();
if (typeof Global !== "undefined") {
    Global.midi_io = {};
    Global.midi_io.export_midi = export_midi;
    Global.midi_io.set_midi = set_midi;
    // Global.regex.conversion_filetype = conversion_filetype;
}
//# sourceMappingURL=midi_io.js.map