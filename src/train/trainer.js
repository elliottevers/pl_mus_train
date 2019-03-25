"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("../history/history");
var iterate_1 = require("./iterate");
// import {get_notes_on_track} from "../scripts/segmenter";
var _ = require('underscore');
var l = require('lodash');
var trainer;
(function (trainer) {
    var HistoryUserInput = history_1.history.HistoryUserInput;
    var IteratorTrainFactory = iterate_1.iterate.IteratorTrainFactory;
    var FactoryMatrixObjectives = iterate_1.iterate.FactoryMatrixObjectives;
    var Trainer = /** @class */ (function () {
        function Trainer(window, user_input_handler, trainable, track_target, track_user_input, song, segments, messenger) {
            this.window = window;
            this.trainable = trainable;
            this.track_target = track_target;
            this.track_user_input = track_user_input;
            this.song = song;
            this.user_input_handler = user_input_handler;
            this.segments = segments;
            // TODO: pull notes from clip user input track and transform into segments
            // this.segments = Segment.from_notes(
            //     this.track_user_input.get_notes()
            // );
            //
            // // assign scenes to segments
            // for (let segment of this.segments) {
            //     segment.set_scene(
            //         new Scene(
            //             new SceneDao(
            //
            //             )
            //         )
            //     )
            // }
            // this.segments = segments;
            this.messenger = messenger;
            // this.notes_target_track = track.get_notes_on_track(
            //     track_target.get_path()
            // );
            this.notes_target_track = track_target.get_notes();
            this.iterator_matrix_train = IteratorTrainFactory.get_iterator_train(this.trainable, this.segments);
            this.history_user_input = new HistoryUserInput(FactoryMatrixObjectives.create_matrix_objectives(this.trainable, this.segments));
            this.window.initialize_clips(this.trainable, this.segments);
            this.window.set_length_beats(this.segments[this.segments.length - 1].beat_end);
            this.trainable.initialize(this.window, this.segments, this.notes_target_track, this.user_input_handler);
            // TODO: figure out getting notes from the target track
            this.matrix_targets = this.trainable.create_matrix_targets(this.user_input_handler, this.segments, this.notes_target_track);
            this.struct_parse = this.trainable.create_struct_parse(this.segments);
            this.trainable.initialize_tracks(this.segments, this.track_target, this.track_user_input, this.matrix_targets);
        }
        Trainer.prototype.clear_window = function () {
            this.window.clear();
        };
        Trainer.prototype.render_window = function () {
            this.window.render(this.iterator_matrix_train, this.trainable, this.target_current, this.struct_parse);
        };
        Trainer.prototype.unpause = function () {
            this.trainable.unpause(this.song, this.segment_current.scene);
        };
        Trainer.prototype.pause = function () {
            this.trainable.pause(this.song, this.segment_current.scene);
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
        Trainer.prototype.advance_segment = function () {
            var obj_next_coord = this.iterator_matrix_train.next();
            if (obj_next_coord.done) {
                this.trainable.terminate(this.struct_parse, this.segments);
                this.trainable.pause(this.song, this.segment_current.scene);
                return;
            }
            this.next_segment();
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
                this.next_segment();
                return;
            }
            var obj_next_subtarget = this.iterator_subtarget_current.next();
            if (obj_next_subtarget.done) {
                var obj_next_target = this.iterator_target_current.next();
                if (obj_next_target.done) {
                    var obj_next_coord = this.iterator_matrix_train.next();
                    if (obj_next_coord.done) {
                        this.trainable.terminate(this.struct_parse, this.segments);
                        this.trainable.pause(this.song, this.segment_current.scene);
                        return;
                    }
                    var coord_next = obj_next_coord.value;
                    this.iterator_target_current = this.matrix_targets[coord_next[0]][coord_next[1]];
                    var obj_next_target_twice_nested = this.iterator_target_current.next();
                    this.target_current = obj_next_target_twice_nested.value;
                    var obj_next_subtarget_twice_nested = this.target_current.iterator_subtarget.next();
                    this.subtarget_current = obj_next_subtarget_twice_nested.value;
                    this.iterator_subtarget_current = this.target_current.iterator_subtarget;
                    this.next_segment();
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
        Trainer.prototype.next_segment = function () {
            this.segment_current = this.segments[this.iterator_matrix_train.get_coord_current()[1]];
            this.segment_current.scene.fire(true);
            this.clip_user_input_sync = this.segment_current.clip_user_input_sync;
            this.clip_user_input_async = this.segment_current.clip_user_input_async;
            this.trainable.stream_bounds(this.messenger, this.subtarget_current, this.segment_current);
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
                this.advance();
                this.render_window();
            }
        };
        return Trainer;
    }());
    trainer.Trainer = Trainer;
})(trainer = exports.trainer || (exports.trainer = {}));
//# sourceMappingURL=trainer.js.map