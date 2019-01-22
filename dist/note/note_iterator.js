"use strict";
// autowatch = 1;
//
// var l = require('./logger.js');
//
// function NoteIterator(notes, direction_forward) {
//     this.notes = notes;
//     this.direction_forward = direction_forward;
//     this.i = -1;
// }
//
// NoteIterator.prototype.next = function () {
//     var value_increment = (this.direction_forward) ? 1 : -1;
//
//     this.i += value_increment;
//
//     if (this.i < 0) {
//         throw 'note iterator < 0'
//     }
//
//     if (this.i < this.notes.length) {
//         return {
//             value: this.notes[this.i],
//             done: false
//         }
//     } else {
//         return {
//             value: null,
//             done: true
//         }
//     }
//
// };
//
// NoteIterator.prototype.current = function() {
//     if (this.i > -1) {
//         return this.notes[this.i];
//     } else {
//         return null;
//     }
// };
//
// exports.NoteIterator = NoteIterator;
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=note_iterator.js.map