import {segment} from "../segment/segment";
import {track} from "../track/track";
import {parsed} from "./parsed";
import {trainer} from "../train/trainer";
import {iterate} from "../train/iterate";
import {note} from "../music/note";
import {trainable} from "./trainable";
import {parse} from "../parse/parse";
import {window} from "../render/window";
import TreeModel = require("tree-model");
import {song} from "../song/song";
import {live} from "../live/live";
import {message} from "../message/messenger";

export namespace derive {
    import Parsed = parsed.Parsed;
    import StructTrain = trainer.StructTrain;
    import MatrixIterator = iterate.MatrixIterator;
    import Note = note.Note;
    import DERIVE = trainable.DERIVE;
    import ParseForest = parse.ParseForest;
    import MatrixParseForest = parse.MatrixParseForest;
    import Segment = segment.Segment;
    import MatrixWindow = window.MatrixWindow;
    import SESSION = trainer.SESSION;
    import FORWARDS = iterate.FORWARDS;
    import Env = live.Env;
    import Messenger = message.Messenger;

    export class Derive extends Parsed {

        constructor(env: Env) {
            super(env);
        }

        public get_name(): string {
            return DERIVE
        }

        public get_view(): string {
            return SESSION
        }

        get_coords_notes_to_grow(coords_note_input_current) {
            return MatrixIterator.get_coords_above([coords_note_input_current[0], coords_note_input_current[1]])
        }

        grow_layer(notes_user_input_renderable, notes_to_grow) {
            ParseForest.add_layer(
                notes_to_grow,
                notes_user_input_renderable,
                -1
            )
        }

        initialize_set(song: song.Song): void {

        }

        initialize_tracks(
            segments: segment.Segment[],
            track_target: track.Track,
            track_user_input: track.Track,
            struct_train: StructTrain
        ) {
            track_target.setMode(true, false);

            track_target.mute();

            track_target.setMode(false, true);
        }

        preprocess_matrix_parse_forest(matrix_parse_forest: MatrixParseForest, segments: Segment[]): MatrixParseForest {
            // add the root to the tree immediately
            matrix_parse_forest.set_root(
                ParseForest.create_root_from_segments(
                    segments
                )
            );

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let note = segment.get_note();

                let coord_current_virtual = [0, Number(i_segment)];

                matrix_parse_forest.add(
                    [note],
                    coord_current_virtual,
                    this
                );
            }

            return matrix_parse_forest
        }

        initialize_render(
            window: MatrixWindow,
            segments: Segment[],
            notes_target_track: TreeModel.Node<Note>[],
            struct_train: StructTrain,
            messengerRender: Messenger
        ): MatrixWindow {
            messengerRender.message(['pensize', 3, 3]);

            // first layer (root)
            window.add_note_to_clip_root(
                MatrixParseForest.create_root_from_segments(
                    segments
                )
            );

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let note_segment = segment.get_note();

                let coord_current_virtual_second_layer = [0, Number(i_segment)];

                // second layer
                window.add_notes_to_clip(
                    [note_segment],
                    this.coord_to_index_clip_render(
                        coord_current_virtual_second_layer
                    )
                )
            }

            return window
        }

        finish_parse(matrix_parse_forest: MatrixParseForest, segments: Segment[]): void {
            return
        }

        update_roots(coords_roots_previous: number[][], coords_notes_previous: number[][], coord_notes_current: number[]) {
            return coords_roots_previous
        }

        // the layer of segments don't count
        get_num_layers_input(): number {
            return this.depth - 1;
        }

        get_num_layers_clips_to_render(): number {
            return this.depth + 1;
        }

        handle_command(command: string, trainer: trainer.Trainer): void {
            switch(command) {
                case 'confirm': {
                    let notes = trainer.clip_user_input.get_notes(
                        trainer.segment_current.beat_start,
                        0,
                        trainer.segment_current.beat_end - trainer.segment_current.beat_start,
                        128
                    );

                    trainer.accept_input(notes);

                    break;
                }
                case 'reset': {
                    let coords_current = trainer.iterator_matrix_train.get_coord_current();

                    let matrix_parse_forest = trainer.struct_train as MatrixParseForest;

                    let notes_struct_above = this.coord_to_index_struct_train([coords_current[0] - 1, coords_current[1]]);

                    trainer.clip_user_input.setMode(true, false);

                    trainer.clip_user_input.set_notes(
                        matrix_parse_forest.get_notes_at_coord(notes_struct_above)
                    );

                    trainer.clip_user_input.setMode(false, true);

                    break;
                }
                case 'erase': {
                    let epsilon = .5;

                    trainer.clip_user_input.setMode(true, false);

                    trainer.clip_user_input.remove_notes(
                        trainer.segment_current.beat_start - epsilon,
                        0,
                        trainer.segment_current.beat_end - trainer.segment_current.beat_start + epsilon,
                        128
                    );

                    trainer.clip_user_input.setMode(false, true);

                    break;
                }
                default: {
                    throw ['command', command, 'not recognized'].join(' ')
                }
            }
        }

        handle_midi(pitch: number, velocity: number, trainer: trainer.Trainer): void {
            throw ['algorithm of name', this.get_name(), 'does not support direct midi input']
        }

        get_iterator_train(segments: segment.Segment[]): MatrixIterator {
            return new MatrixIterator(
                this.get_num_layers_input(),
                segments.length,
                true,
                this.get_direction() === FORWARDS,
                1,
                this.depth
            );
        }

        suppress(messenger: Messenger): void {
            // TODO: put in 'initialize_render', make configurable
            messenger.message(['switch_suppress', 1], true);
            messenger.message(['gate_suppress', 1], true);
        }
    }
}