"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_tree_1 = require("../scripts/parse_tree");
var algorithm_1 = require("./algorithm");
var history_1 = require("../history/history");
var trainer;
(function (trainer) {
    var Targetable = algorithm_1.train.algorithm.Targetable;
    var HistoryUserInput = history_1.history.HistoryUserInput;
    var Trainer = /** @class */ (function () {
        // window is either tree or list
        // mode is either harmonic or melodic
        // algorithm is either detect, predict, parse, or derive
        // history
        function Trainer(window, mode, algorithm, clip_user_input) {
            this.window = window;
            if (mode === modes.HARMONY) {
            }
            this.algorithm = algorithm;
            this.history_user_input = new HistoryUserInput(mode);
            this.clip_user_input = clip_user_input;
        }
        Trainer.prototype.set_loop = function () {
            var interval = this.segment_current.get_endpoints_loop();
            this.clip_user_input.set_endpoints_loop(interval[0], interval[1]);
        };
        Trainer.prototype.resume = function () {
            // set segment current
            // set target current
            // set subtarget current
            this.algorithm.post_init();
        };
        Trainer.prototype.pause = function () {
            this.algorithm.pre_terminate();
        };
        Trainer.prototype.init = function () {
            this.advance_segment();
            this.algorithm.post_init();
        };
        Trainer.prototype.advance_segment = function () {
            this.segment_current = this.segment_iterator.next();
            this.target_current = this.target_iterator.next();
            this.subtarget_current = this.subtarget_current.next();
            if (done) {
                this.algorithm.pre_terminate();
            }
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
            this.counter_user_input++;
            if (this.counter_user_input >= this.limit_user_input) {
                this.limit_input_reached = true;
            }
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
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
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
//# sourceMappingURL=trainer.js.map