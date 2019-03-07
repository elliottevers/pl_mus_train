"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_tree_1 = require("../scripts/parse_tree");
var train;
(function (train) {
    var Trainer = /** @class */ (function () {
        function Trainer(window, mode) {
            this.window = window;
            if (mode === modes.HARMONY) {
            }
        }
        Trainer.prototype.advance_segment = function () {
            this.segment_current = this.segment_iterator.next();
        };
        Trainer.prototype.advance_target = function () {
            this.target_current = this.target_iterator.next();
        };
        Trainer.prototype.advance_subtarget = function () {
            var val = this.subtarget_iterator.next();
            if (val.done) {
                this.advance_target();
            }
            else {
                this.subtarget_current = val.value;
            }
        };
        Trainer.prototype.accept_input = function (input_user) {
            if (this.limit_input_reached) {
                // completely ignore
            }
            var targetable = this.algorithm instanceof Targetable;
            if (!targetable) {
                this.advance_segment();
                // return this.segment_iterator.next()
            }
            if (input_user === this.subtarget_current) {
                this.advance_subtarget();
            }
        };
        Trainer.prototype.accept = function (notes) {
            // elaborate, summarize, detect, predict
            this.window.insert(notes);
            parse_tree_1.parse_matrix.set_notes(tree_depth_iterator.get_index_current(), segment_iterator.get_index_current(), notes);
            this.window.render();
            if (segment_next.done) {
                this.stop();
                return;
            }
            this.segment_current = val_segment_next;
            var interval = this.segment_current.get_endpoints_loop();
            this.clip_user_input.set_endpoints_loop(interval[0], interval[1]);
        };
        Trainer.prototype.render = function () {
            // this.window
            // get messages regions
            // get messages
        };
        Trainer.prototype.clear_render = function () {
            // this.window.clear()
        };
        Trainer.prototype.init = function () {
            // this.iterator.next()
            // this.clip_user_input.fire()
        };
        Trainer.prototype.stop = function () {
        };
        return Trainer;
    }());
    train.Trainer = Trainer;
})(train = exports.train || (exports.train = {}));
notes_segments = [note1, note2];
trainer.set_segments(notes_segments);
trainer.init(); // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user
trainer.accept(note_1);
trainer.accept(note_2);
trainer.accept(note_3);
trainer.clear_render();
var freezer = new TrainFreezer('node');
freezer.freeze(trainer, '/path/to/file');
var thawer = new TrainThawer('node');
var train_thawed = thawer.thaw('/path/to/file');
train_thawed.render();
//# sourceMappingURL=train.js.map