import {segment} from "../segment/segment";
import {track} from "../track/track";
import {parsed} from "./parsed";
import {trainer} from "../train/trainer";
import {iterate} from "../train/iterate";
import {note} from "../note/note";
import {window as module_window} from "../render/window";
import TreeModel = require("tree-model");
import {trainable} from "./trainable";
import {parse as module_parse} from "../parse/parse";
import ParseTree = module_parse.ParseTree;
import StructParse = module_parse.StructParse;
import {message} from "../message/messenger";
import {log} from "../log/logger";
import {song} from "../song/song";

export namespace parse {
    import Parsed = parsed.Parsed;
    import StructTrain = trainer.StructTrain;
    import MatrixIterator = iterate.MatrixIterator;
    import Note = note.Note;
    import MatrixWindow = module_window.MatrixWindow;
    import Segment = segment.Segment;
    import PARSE = trainable.PARSE;
    import Messenger = message.Messenger;
    import Trainer = trainer.Trainer;
    import Track = track.Track;
    import Logger = log.Logger;
    import SESSION = trainer.SESSION;

    export class Parse extends Parsed {

        constructor() {
            super();
        }

        public get_name(): string {
            return PARSE
        }

        public get_view(): string {
            return SESSION
        }

        grow_layer(notes_user_input_renderable, notes_to_grow) {
            ParseTree.add_layer(
                notes_user_input_renderable,
                notes_to_grow,
                -1
            )
        }

        initialize_set(song: song.Song): void {

        }

        // TODO: we don't need the target track - we should 1) transfer all notes over to user input track and 2) mute the track
        initialize_tracks(
            segments: segment.Segment[],
            track_target: track.Track,
            track_user_input: track.Track,
            struct_train: StructTrain
        ) {
            // transfer notes from target track to user input track
            for (let i_segment in segments) {

                let clip_target = track_target.get_clip_at_index(Number(i_segment));

                let clip_user_input = track_user_input.get_clip_at_index(Number(i_segment));

                let notes = clip_target.get_notes(
                    clip_target.get_loop_bracket_lower(),
                    0,
                    clip_target.get_loop_bracket_upper(),
                    128
                );

                clip_user_input.remove_notes(
                    clip_target.get_loop_bracket_lower(),
                    0,
                    clip_target.get_loop_bracket_upper(),
                    128
                );

                clip_user_input.set_notes(
                    notes
                )
            }

            // mute target track
            track_target.mute()
        }

        // add the root up to which we're going to parse
        // add the segments as the layer below
        // add the leaf notes
        initialize_render(
            window: MatrixWindow,
            segments: Segment[],
            notes_target_track: TreeModel.Node<Note>[],
            struct_train: StructTrain
        ): MatrixWindow {
            // first layer
            window.add_note_to_clip_root(
                StructParse.create_root_from_segments(
                    segments
                )
            );

            // @ts-ignore
            let struct_parse = struct_train as StructParse;

            struct_parse.regions_renderable.push(
                [-1]
            );

            for (let i_segment in segments) {

                let segment = segments[Number(i_segment)];

                let note_segment = segment.get_note();

                let coord_current_virtual_second_layer = [0, Number(i_segment)];

                let notes_leaves = notes_target_track.filter(
                    node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                );

                let coord_current_virtual_leaves = [this.depth - 1, Number(i_segment)];

                // second layer
                window.add_notes_to_clip(
                    [note_segment],
                    this.coord_to_index_clip_render(
                        coord_current_virtual_second_layer
                    )
                );

                struct_parse.regions_renderable.push(
                    this.coord_to_index_struct_train(
                        coord_current_virtual_second_layer
                    )
                );

                // leaves
                window.add_notes_to_clip(
                    notes_leaves,
                    this.coord_to_index_clip_render(
                        coord_current_virtual_leaves
                    )
                )
            }

            return window
        }

        update_roots(coords_roots_previous: number[][], coords_notes_previous: number[][], coord_notes_current: number[]): number[][] {
            let coords_roots_new = [];

            // remove references to old leaves
            for (let coord_notes_previous of coords_notes_previous) {
                coords_roots_new = coords_roots_new.concat(
                    coords_roots_previous.filter((x) => {
                        return !(x[0] === coord_notes_previous[0] && x[1] === coord_notes_previous[1])
                    })
                );
            }

            // add references to new leaves
            coords_roots_new.push(
                coord_notes_current
            );

            return coords_roots_new
        }

        get_coords_notes_to_grow(coord_notes_input_current) {
            return MatrixIterator.get_coords_below([coord_notes_input_current[0], coord_notes_input_current[1]]);
        }

        // adding the leaf notes to the actual parse tree
        // DO NOT set the root or the segments as nodes immediately below that - do that at the end
        // set the leaf notes as the notes in the target track
        preprocess_struct_parse(struct_parse: StructParse, segments: Segment[], notes_target_track: TreeModel.Node<Note>[]) {
            // this is to set the leaves as the notes of the target clip

            for (let i_segment in segments) {
                let segment = segments[Number(i_segment)];

                let notes = notes_target_track.filter(
                    node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
                );

                let coord_parse_current_virtual_leaf = [this.depth - 1, Number(i_segment)];

                struct_parse.add(
                    notes,
                    coord_parse_current_virtual_leaf,
                    this,
                    true
                );
            }

            return struct_parse
        }

        finish_parse(struct_parse: StructParse, segments: Segment[]): void {

            let coords_to_grow = [];

            // make connections with segments
            for (let i_segment in segments) {
                coords_to_grow.push([0, Number(i_segment)]);
                let segment = segments[Number(i_segment)];
                struct_parse.add(
                    [segment.get_note()],
                    [0, Number(i_segment)],
                    this
                );
            }

            struct_parse.set_root(
                StructParse.create_root_from_segments(
                    segments
                )
            );

            for (let coord_to_grow of coords_to_grow) {

                let notes_to_grow = struct_parse.get_notes_at_coord(coord_to_grow);

                this.grow_layer(
                    [struct_parse.get_root()],
                    notes_to_grow
                );
            }

            struct_parse.coords_roots = this.update_roots(
                struct_parse.coords_roots,
                coords_to_grow,
                [-1]
            );
        }

        // segments layer and leaves layer don't count
        get_num_layers_input(): number {
            return this.depth - 2;
        }

        get_num_layers_clips_to_render(): number {
            return this.depth + 1;
        }

        handle_command(command: string, trainer: Trainer): void {
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

                    let notes_struct_below = this.coord_to_index_struct_train([coords_current[0] + 1, coords_current[1]]);

                    trainer.clip_user_input.set_notes(
                        struct_parse.get_notes_at_coord(notes_struct_below)
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
    }
}