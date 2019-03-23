"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("../history/history");
var iterate_1 = require("./iterate");
var track_1 = require("../track/track");
// import {get_notes_on_track} from "../scripts/segmenter";
var _ = require('underscore');
var l = require('lodash');
var trainer;
(function (trainer) {
    var HistoryUserInput = history_1.history.HistoryUserInput;
    var IteratorTrainFactory = iterate_1.iterate.IteratorTrainFactory;
    var FactoryMatrixObjectives = iterate_1.iterate.FactoryMatrixObjectives;
    // import Algorithm = algorithm.Algorithm;
    var Trainer = /** @class */ (function () {
        function Trainer(window, user_input_handler, algorithm, clip_user_input, clip_user_input_synchronous, track_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_user_input_synchronous = clip_user_input_synchronous;
            // this.notes_target = notes_target;
            this.track_target = track_target;
            this.song = song;
            this.segments = segments;
            this.messenger = messenger;
            this.notes_target = track_1.track.get_notes_on_track(track_target.get_path());
            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(this.trainable, this.segments);
            this.history_user_input = new HistoryUserInput(FactoryMatrixObjectives.create_matrix_objectives(this.trainable, this.segments));
            this.window.initialize_clips(this.trainable, this.segments);
            this.window.set_length_beats(this.segments[this.segments.length - 1].beat_end);
            this.trainable.initialize();
            this.matrix_targets = this.trainable.create_matrix_targets();
            this.struct_parse = this.trainable.create_struct_parse();
        }
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            this.window.render(this.iterator_matrix_train, this.target_current, this.trainable, this.struct_parse);
        };
        Trainer.prototype.unpause = function () {
            this.trainable.unpause();
        };
        Trainer.prototype.pause = function () {
            this.trainable.pause();
        };
        Trainer.prototype.init = function (virtual) {
        };
        Trainer.prototype.advance_segment = function (first_time) {
            var obj_next_coord = this.iterator_matrix_train.next();
            if (obj_next_coord.done) {
                this.trainable.terminate(this.song, this.clip_user_input);
                return;
            }
            var coord = obj_next_coord.value;
            this.segment_current = this.segments[coord[1]];
        };
        Trainer.prototype.advance_subtarget = function () {
            var have_not_begun = (!this.iterator_matrix_train.b_started);
            if (have_not_begun) {
                this.iterator_matrix_train.next();
                this.iterator_target_current = this.matrix_targets[0][0];
                this.iterator_target_current.next();
                this.target_current = this.iterator_target_current.current();
                this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                this.iterator_subtarget_current.next();
                this.subtarget_current = this.iterator_subtarget_current.current();
                return;
            }
            var obj_next_subtarget = this.iterator_subtarget_current.next();
            if (obj_next_subtarget.done) {
                var obj_next_target = this.iterator_target_current.next();
                if (obj_next_target.done) {
                    var obj_next_coord = this.iterator_matrix_train.next();
                    if (obj_next_coord.done) {
                        this.trainable.terminate();
                        return;
                    }
                    var coord_next = obj_next_coord.value;
                    this.iterator_target_current = this.matrix_targets[coord_next[0]][coord_next[1]];
                    var obj_next_target_twice_nested = this.iterator_target_current.next();
                    this.target_current = obj_next_target_twice_nested.value;
                    var obj_next_subtarget_twice_nested = this.target_current.iterator_subtarget.next();
                    this.subtarget_current = obj_next_subtarget_twice_nested.value;
                    this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                    this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];
                    return;
                }
                this.target_current = obj_next_target.value;
                var obj_next_subtarget_once_nested = this.target_current.iterator_subtarget.next();
                this.subtarget_current = obj_next_subtarget_once_nested.value;
                this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                return;
            }
            this.subtarget_current = obj_next_subtarget.value;
        };
        Trainer.prototype.accept_input = function (notes_input_user) {
            this.counter_user_input++;
            if (this.counter_user_input >= this.limit_user_input) {
                this.limit_input_reached = true;
            }
            if (this.limit_input_reached) {
                // completely ignore
                return;
            }
            if (this.trainable.warrants_advance(notes_input_user, this.subtarget_current)) {
                var input_postprocessed = this.trainable.postprocess_user_input(notes_input_user, this.subtarget_current);
                this.history_user_input.concat(input_postprocessed, this.iterator_matrix_train.get_coord_current());
                this.window.add_notes_to_clip(input_postprocessed, this.iterator_matrix_train.get_coord_current(), this.trainable);
                if (this.trainable.b_parsed) {
                    this.advance_segment();
                }
                else if (this.trainable.b_targeted) {
                    this.advance_subtarget();
                }
                else {
                    throw 'cannot determine how to advance';
                }
                this.algorithm.advance();
                this.render_window();
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map