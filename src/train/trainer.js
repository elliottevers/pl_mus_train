"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("../history/history");
var iterate_1 = require("./iterate");
var logger_1 = require("../log/logger");
var trainer;
(function (trainer) {
    var HistoryUserInput = history_1.history.HistoryUserInput;
    var IteratorTrainFactory = iterate_1.iterate.IteratorTrainFactory;
    var FactoryMatrixObjectives = iterate_1.iterate.FactoryMatrixObjectives;
    var Logger = logger_1.log.Logger;
    var Trainer = /** @class */ (function () {
        function Trainer(window, user_input_handler, trainable, track_target, track_user_input, song, segments, messenger, virtualized) {
            this.virtualized = false;
            this.window = window;
            this.trainable = trainable;
            this.track_target = track_target;
            this.track_user_input = track_user_input;
            this.song = song;
            this.user_input_handler = user_input_handler;
            this.segments = segments;
            this.messenger = messenger;
            this.virtualized = virtualized;
            var logger = new Logger('max');
            logger.log(JSON.stringify(this.segments));
            this.notes_target_track = track_target.get_notes();
            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(this.trainable, this.segments);
            this.history_user_input = new HistoryUserInput(FactoryMatrixObjectives.create_matrix_objectives(this.trainable, this.segments));
            this.window.initialize_clips(this.trainable, this.segments);
            this.window.set_length_beats(this.segments[this.segments.length - 1].beat_end);
            this.window = this.trainable.initialize_render(this.window, this.segments, this.notes_target_track);
            this.history_user_input = this.trainable.preprocess_history_user_input(this.history_user_input, this.segments);
            this.struct_train = this.trainable.create_struct_train(this.window, this.segments, this.track_target, this.user_input_handler, this.struct_train);
            this.struct_train = this.trainable.preprocess_struct_train(this.struct_train, this.segments, this.notes_target_track);
            this.trainable.initialize_tracks(this.segments, this.track_target, this.track_user_input, this.struct_train);
        }
        Trainer.prototype.clear_window = function () {
            if (!this.virtualized) {
                this.window.clear();
            }
        };
        Trainer.prototype.render_window = function () {
            if (!this.virtualized) {
                this.window.render(this.iterator_matrix_train, this.trainable, this.struct_train, this.segment_current);
            }
        };
        Trainer.prototype.unpause = function () {
            if (!this.virtualized) {
                this.trainable.unpause(this.song, this.segment_current.scene);
            }
        };
        Trainer.prototype.pause = function () {
            if (!this.virtualized) {
                this.trainable.pause(this.song, this.segment_current.scene);
            }
        };
        Trainer.prototype.advance = function () {
            if (this.trainable.b_parsed) {
                this.advance_segment();
            }
            else if (this.trainable.b_targeted) {
                this.advance_subtarget();
            }
            else {
                throw 'cannot determine how to advance';
            }
        };
        Trainer.prototype.commence = function () {
            this.advance();
        };
        Trainer.prototype.shut_down = function () {
            if (!this.virtualized) {
                this.trainable.terminate(this.struct_train, this.segments);
                this.trainable.pause(this.song, this.segment_current.scene);
            }
        };
        Trainer.prototype.advance_segment = function () {
            var obj_next_coord = this.iterator_matrix_train.next();
            if (obj_next_coord.done) {
                this.shut_down();
                return;
            }
            this.next_segment();
        };
        Trainer.prototype.advance_subtarget = function () {
            var logger = new Logger('max');
            var matrix_targets = this.struct_train;
            var have_not_begun = (!this.iterator_matrix_train.b_started);
            if (have_not_begun) {
                this.iterator_matrix_train.next();
                this.iterator_target_current = matrix_targets[0][0];
                this.iterator_target_current.next();
                this.target_current = this.iterator_target_current.current();
                this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                this.iterator_subtarget_current.next();
                this.subtarget_current = this.iterator_subtarget_current.current();
                logger.log(JSON.stringify(this.subtarget_current));
                this.next_segment();
                // this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current);
                return;
            }
            var obj_next_subtarget = this.iterator_subtarget_current.next();
            if (obj_next_subtarget.done) {
                var obj_next_target = this.iterator_target_current.next();
                if (obj_next_target.done) {
                    var obj_next_coord = this.iterator_matrix_train.next();
                    if (obj_next_coord.done) {
                        this.shut_down();
                        return;
                    }
                    var coord_next = obj_next_coord.value;
                    this.iterator_target_current = matrix_targets[coord_next[0]][coord_next[1]];
                    var obj_next_target_twice_nested = this.iterator_target_current.next();
                    this.target_current = obj_next_target_twice_nested.value;
                    var obj_next_subtarget_twice_nested = this.target_current.iterator_subtarget.next();
                    this.subtarget_current = obj_next_subtarget_twice_nested.value;
                    this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                    logger.log(JSON.stringify(this.subtarget_current));
                    this.next_segment();
                    // this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current);
                    return;
                }
                this.target_current = obj_next_target.value;
                var obj_next_subtarget_once_nested = this.target_current.iterator_subtarget.next();
                this.subtarget_current = obj_next_subtarget_once_nested.value;
                logger.log(JSON.stringify(this.subtarget_current));
                this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                this.stream_bounds();
                return;
            }
            this.subtarget_current = obj_next_subtarget.value;
            this.stream_bounds();
        };
        Trainer.prototype.stream_bounds = function () {
            if (!this.virtualized) {
                this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current, this.segments);
            }
        };
        Trainer.prototype.advance_scene = function () {
            if (!this.virtualized) {
                this.trainable.advance_scene(this.segment_current.scene, this.song);
                this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current, this.segments);
            }
        };
        Trainer.prototype.next_segment = function () {
            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];
            this.segment_current.scene.set_path_deferlow('scene');
            this.clip_user_input = this.segment_current.clip_user_input;
            this.clip_user_input.set_path_deferlow('clip_user_input');
            this.advance_scene();
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
                this.history_user_input = this.trainable.update_history_user_input(input_postprocessed, this.history_user_input, this.iterator_matrix_train);
                this.struct_train = this.trainable.update_struct(input_postprocessed, this.struct_train, this.trainable, this.iterator_matrix_train);
                this.window.add_notes_to_clip(input_postprocessed, this.iterator_matrix_train.get_coord_current(), this.trainable);
                this.advance();
                this.render_window();
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map