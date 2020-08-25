import {frequencyFromMidi, algorithms, PARAM_CHANGE_TIME} from "./config.js";
import Envelope from "./Envelope.js";

class FmVoice {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.operators = []; // FmProcessor + Gain
        this.operatorsEnv = [];
        this.operatorsEnvAmount = [0, 0, 0, 0];
        this.feedbackNodes = []; // DelayNode + Gain
        this.outputBusses = [new GainNode(audioContext), new GainNode(audioContext)]; // two mono busses
        this.outputGain = new GainNode(audioContext);
        this.maxOutputGain = 1;
        this.outEnv = new Envelope(audioContext, this.outputGain.gain);
        this.algorithm = undefined;
        this.lastNote = undefined;
        this._init();
    }

    /**
     * Loads the fm-processor, pushes 4 operators and 4 feedback networks.
     * @return {Promise<void>}
     * @private
     */
    async _init() {
        await this.audioContext.audioWorklet.addModule('src/FmProcessor.js');

        // FmProcessor + Gain -- (Operators)
        for (let i = 0; i < 4; i++) {
            let operator = new AudioWorkletNode(this.audioContext, 'fm-processor');
            let gain = new GainNode(this.audioContext);
            operator.connect(gain);
            this.operators.push({
                source: operator,
                gain: gain
            });

            // modulation envelope
            let modEnv = new Envelope(this.audioContext, gain.gain);
            this.operatorsEnv.push(modEnv);

        }

        // DelayNode + Gain  -- (Feedback)
        for (let i = 0; i < 4; i++) {
            let delay = new DelayNode(this.audioContext);
            let gain = new GainNode(this.audioContext);
            gain.gain.value = 0;
            delay.connect(gain);
            this.feedbackNodes.push({
                delay: delay,
                gain: gain
            });
        }

        // connecting the busses to the output
        this.outputGain.gain.value = 0
        this.outputBusses.forEach(bus => {
            bus.gain.value = 0.5;
            bus.connect(this.outputGain);
        });
        this.outputGain.connect(this.audioContext.destination);

        this.selectAlgorithm(0);
    }

    /**
     * Initialize the routing of the operators.
     * @private
     */
    _initRouting() {
        this.operators.forEach(node => {
            node.gain.disconnect();
        });
        this.feedbackNodes.forEach(node => {
            node.gain.disconnect();
        });
    }

    /**
     * Connects the operators depending on the chosen algorithm.
     *
     * @param index of the algorithm
     */
    selectAlgorithm(index) {
        if (index > algorithms.length || index < 0) {
            console.log('Error: undefined algorithm');
            return;
        }

        this._initRouting();
        this.algorithm = algorithms[index];

        // bus routing
        this.algorithm.output.forEach((routing, i) => {
            routing.forEach(function (outputIndex) {
                this.operators[i].source.connect(this.outputBusses[outputIndex]);
            }, this);
        });

        // modulator routing
        this.algorithm.modulations.forEach((modulations, i) => {
            modulations.forEach(modIndex => {
                if (i === modIndex) { // feedback
                    this.operators[i].source
                        .connect(this.feedbackNodes[i].delay);
                    this.feedbackNodes[i].gain.connect(this.operators[i].source);
                } else {
                    this.operators[i].gain.connect(this.operators[modIndex].source);
                }
            });
        });
    }

    /**
     * Changes the ratio of an operator.
     * @param opIndex
     * @param ratio
     */
    setRatio(opIndex, ratio) {
        let ratioParm = this.operators[opIndex].source.parameters.get('ratio');
        ratioParm.linearRampToValueAtTime(ratio,
            this.audioContext.currentTime + PARAM_CHANGE_TIME);
    }

    setModEnvAmount(opIndex, amount) {
        this.operatorsEnvAmount[opIndex] = amount;
    }

    setMaxGain(maxGain) {
        this.maxOutputGain = maxGain;
    }

    noteOn(note, velocity) {
        // setting the frequency TODO: implement glide
        this.lastNote = note;

        let freq = frequencyFromMidi(note);
        this.operators.forEach(op => {
            let f = op.source.parameters.get('frequency');
            f.linearRampToValueAtTime(freq,
                this.audioContext.currentTime + PARAM_CHANGE_TIME);
        });

        // triggering the envelopes
        this.outEnv.noteOn(this.maxOutputGain, velocity);
        for (let i = 1; i < 4; i++) { // the first operator's envelope isn't triggered
            this.operatorsEnv[i].noteOn(this.operatorsEnvAmount[i], 127);
        }
    }

    noteOff() {
        this.outEnv.noteOff();
        this.operatorsEnv.forEach(env => {
            env.noteOff();
        });
    }
}

export default FmVoice;