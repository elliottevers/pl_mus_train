"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("../history/history");
var trainer;
(function (trainer) {
    var HistoryUserInput = history_1.history.HistoryUserInput;
    var Trainer = /** @class */ (function () {
        // window is either tree or list
        // mode is either harmonic or melodic
        // algorithm is either detect, predict, parse, or derive
        // history
        function Trainer(window, user_input_handler, algorithm, clip_user_input, clip_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_target = clip_target;
            this.song = song;
            this.segments = segments;
            this.messenger = messenger;
            this.struct = new StructFactory.get_struct(user_input_handler.mode);
            this.history_user_input = new HistoryUserInput(user_input_handler.mode);
            if (this.algorithm.b_targetable()) {
                this.create_targets();
            }
        }
        // now we can assume we have a list instead of a matrix
        Trainer.prototype.create_targets = function () {
            this.clip_target.load_notes_within_markers();
            // let segment_targetable: SegmentTargetable;
            var list_segments_targetable = [];
            for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                var segment = _a[_i];
                // need SegmentTargetable -> TargetIterator
                list_segments_targetable.push(this.algorithm.determine_targets(this.clip_target.get_notes(segment.beat_start, 0, segment.beat_end, 128)));
            }
            this.target_iterator;
            // this.segment_iterator
            this.subtarget_iterator;
        };
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            this.window.render();
        };
        Trainer.prototype.reset_user_input = function () {
            if ([algorithms.DETECT, algorithms.PREDICT].includes(this.algorithm.name)) {
                this.clip_user_input.set_notes(this.struct.get_notes(
                // TODO: pass requisite information
                ));
            }
            else {
                return;
            }
        };
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
        // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user
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
                return;
            }
            var targetable = true; // this.algorithm instanceof Targetable;
            if (!targetable) {
                this.advance_segment();
            }
            if (input_user === this.subtarget_current) {
                this.history_user_input.add_subtarget(input_user);
                this.advance_subtarget();
                this.set_loop();
                // TODO: make sure for detection/prediction we're making "input_user" exactly the same as the "target note", if we're restoring sessions from user input
                // this.window.add(input_user);
                this.struct.add(input_user);
                this.window.render(this.struct);
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map