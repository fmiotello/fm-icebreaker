import {frequencyFromMidi, algorithms} from "./config.js";

class FmVoice {
    constructor(audioContext) {
        this.operators = [];
        this.algorithm = undefined;
        this.audioContext = audioContext;
        this._loadOperators()
            .then(this.selectAlgorithm(0));
    }

    /**
     * Loads the fm-processor and pushes 4 operators for the voice.
     * @return {Promise<void>}
     * @private
     */
    async _loadOperators() {
        await this.audioContext.audioWorklet.addModule('fm-processor');
        for (let i = 0; i < 4; i++) {
            let operator = new AudioWorkletNode(this.audioContext, 'fm-processor');
            this.operators.push(operator);
        }
    }

    /**
     * Initialize the routing of the operators.
     * @private
     */
    _initOperators() {

    }

    selectAlgorithm(index) {
        if (index > algorithms.length) {
            console.log('Error: undefined algorithm');
            return;
        }

        this._initOperators();
    }
}