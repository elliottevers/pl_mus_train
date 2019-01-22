export declare namespace preprocess {
    class PredictionPreprocessor {
        mode: string;
        predictions: number[];
        limit: number;
        counter: number;
        constructor(mode: string);
        accept(prediction: number): void;
        reset(): void;
        get_prediction(): number[];
        get_state_primed(): boolean;
    }
}
