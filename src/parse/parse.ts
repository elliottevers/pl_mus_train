export namespace parse {
    export interface Parsable {
        choose(): boolean;
        // TODO: figure out how to annotate
        select_best_candidate();
    }
}