import {segment} from "../segment/segment";
import {track} from "../track/track";
import {parsed} from "./parsed";
import {trainer} from "../train/trainer";
import {iterate} from "../train/iterate";
import {note} from "../note/note";
import {trainable} from "./trainable";
import {parse} from "../parse/parse";
import {window} from "../render/window";
import TreeModel = require("tree-model");
import {song} from "../song/song";

export namespace derive {
    import Parsed = parsed.Parsed;
    import StructTrain = trainer.StructTrain;
    import MatrixIterator = iterate.MatrixIterator;
    import Note = note.Note;
    import DERIVE = trainable.DERIVE;
    import ParseTree = parse.ParseTree;
    import StructParse = parse.StructParse;
    import Segment = segment.Segment;
    import MatrixWindow = window.MatrixWindow;
    import SESSION = trainer.SESSION;
    import FORWARDS = iterate.FORWARDS;

    export class Derive extends Parsed {

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
            ParseTree.add_layer(
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
            track_target.mute();
        }

        preprocess_struct_parse(struct_parse: StructParse, segments: Segment[]): StructParse {
            // add the root to the tree immediately
            struct_parse.set_root(
                ParseTree.create_root_from_segments(
                    segments
                )
            );

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let note = segment.get_note();

                let coord_current_virtual = [0, Number(i_segment)];

                struct_parse.add(
                    [note],
                    coord_current_virtual,
                    this
                );
            }

            return struct_parse
        }

        initialize_render(
            window: MatrixWindow,
            segments: Segment[],
            notes_target_track: TreeModel.Node<Note>[],
            struct_train: StructTrain
        ): MatrixWindow {
            // first layer (root)
            window.add_note_to_clip_root(
                StructParse.create_root_from_segments(
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

        finish_parse(struct_parse: StructParse, segments: Segment[]): void {
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

                    let struct_parse = trainer.struct_train as StructParse;

                    let notes_struct_above = this.coord_to_index_struct_train([coords_current[0] - 1, coords_current[1]]);

                    trainer.clip_user_input.set_notes(
                        struct_parse.get_notes_at_coord(notes_struct_above)
                    );


                    break;
                }
                case 'erase': {
                    trainer.clip_user_input.remove_notes(
                        trainer.segment_current.beat_start,
                        0,
                        trainer.segment_current.beat_end - trainer.segment_current.beat_start,
                        128
                    );
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
    }
}