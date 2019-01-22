"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preprocess;
(function (preprocess) {
    var PredictionPreprocessor = /** @class */ (function () {
        function PredictionPreprocessor(mode) {
            this.mode = mode;
            this.predictions = [];
            this.counter = 0;
            if (mode === 'monophonic_guitar') {
                this.limit = 1;
            }
        }
        PredictionPreprocessor.prototype.accept = function (prediction) {
            if (this.mode === 'monophonic_guitar' && (this.counter < this.limit)) {
                this.predictions.push(prediction);
                this.counter += 1;
            }
        };
        PredictionPreprocessor.prototype.reset = function () {
            this.predictions = [];
            this.counter = 0;
        };
        ;
        PredictionPreprocessor.prototype.get_prediction = function () {
            return this.predictions;
        };
        ;
        PredictionPreprocessor.prototype.get_state_primed = function () {
            if (this.mode === 'monophonic_guitar') {
                return this.counter === this.limit;
            }
        };
        return PredictionPreprocessor;
    }());
    preprocess.PredictionPreprocessor = PredictionPreprocessor;
})(preprocess = exports.preprocess || (exports.preprocess = {}));
//# sourceMappingURL=prediction_preprocessor.js.map