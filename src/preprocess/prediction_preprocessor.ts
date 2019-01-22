export namespace preprocess {
    export class PredictionPreprocessor {

        // TODO: type alias
        mode: string;
        predictions: number[];
        limit: number;
        counter: number;

        constructor(mode: string) {
            this.mode = mode;
            this.predictions = [];
            this.counter = 0;
            if (mode === 'monophonic_guitar') {
                this.limit = 1;
            }
        }

        public accept(prediction: number): void {
            if (this.mode === 'monophonic_guitar' && (this.counter < this.limit)) {
                this.predictions.push(prediction);
                this.counter += 1;
            }
        }

        public reset(): void {
            this.predictions = [];
            this.counter = 0;
        };

        get_prediction(): number[] {
            return this.predictions;
        };

        get_state_primed(): boolean {
            if (this.mode === 'monophonic_guitar') {
                return this.counter === this.limit;
            }
        }
    }
}