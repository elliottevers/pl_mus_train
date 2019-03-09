import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {target} from "../target/target";
const _ = require('underscore');

export namespace harmony {
    import Target = target.Target;

    export class Harmony {
        public static group(notes: TreeModel.Node<n.Note>[]): TreeModel.Node<n.Note>[][] {
        //     groups_notes = []
        //     unique_onsets_beats = []
        //
        //     def get_beat_start(note):
        //     return note.beat_start
        //
        //     for beat_start, group_note in groupby(notes_live, get_beat_start):
        //     groups_notes.append(list(group_note))
        //     unique_onsets_beats.append(beat_start)
        //
        //     chords = []
        //
        //     for group in groups_notes:
        //
        //     chord = music21.chord.Chord([
        //         music21.note.Note(
        //             pitch=music21.pitch.Pitch(
        //                 midi=note_live.pitch
        //             )
        //         ).name for
        //         note_live
        //         in group
        // ])
        //
        // # TODO: this makes the assumption that all notes in the group have the same offsets and duration
        //
        //     chord.offset = group[-1].beat_start
        //     chord.duration = music21.duration.Duration(group[-1].beats_duration)
        //     chords.append(chord)
        //
        //     return chords
            return
        }

        public static monophonify(notes: TreeModel.Node<n.Note>[]): TypeTarget {
            function compare(note_former,note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }

            notes.sort(compare);

            let length_beats = notes[notes.length - 1].model.note.get_beat_end() - notes[0].model.note.beat_start;

            let duration_monophonic = length_beats/notes.length;

            let beat_current = notes[0].model.note.beat_start;

            let notes_monophonic: TreeModel.Node<n.Note>[] = [];

            let tree: TreeModel = new TreeModel();

            for (let note of notes) {
                notes_monophonic.push(
                    tree.parse(
                        {
                            id: -1, // TODO: hashing scheme for clip id and beat start
                            note: new n.Note(
                                note.model.note.pitch,
                                beat_current,
                                duration_monophonic,
                                note.model.note.velocity,
                                note.model.note.muted
                            ),
                            children: [

                            ]
                        }
                    )
                );
                beat_current = beat_current + duration_monophonic
            }

            return notes_monophonic;
        }
    }
}
