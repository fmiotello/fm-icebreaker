import {PI2} from "./config.js";
import LookupTable from "./LookupTable.js";

/***
 * A Worklet that implements an fm operator.
 */
class FmProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.phase = 0; // incremental phase
        this.lookupTable = new LookupTable();
        this._emptyModulationArray = [0]; // pre-allocated array for empty modulation
    }

    /**
     * Returns the frequency and ratio of an operator.
     *
     * @return {Array}
     *
     */
    static get parameterDescriptors() {
        return [
            {
                name: 'frequency',
                defaultValue: 440,
                max: Infinity,
                min: 20
            },

            {
                name: 'ratio',
                defaultValue: 1,
                max: 12,
                min: 0.1
            },
            {
                name: 'phaseRestart',
                defaultValue: 0,
                max: 1,
                min: 0
            }

        ]
    }

    /**
     * Processing function.
     *
     * @param inputs, the first mono input is the modulator
     * @param outputs
     * @param parameters
     * @return {boolean}
     */
    process(inputs, outputs, parameters) {

        const input = inputs[0][0];
        const output = outputs[0][0];
        const ratio = parameters.ratio;
        const freq = parameters.frequency;
        const phaseRestart = parameters.phaseRestart;
        const polyphonyChange = parameters.polyphonyChange;
        const nChannels = output.length;
        const modulator = input ? input : this._emptyModulationArray;

        // phase restart
        if (phaseRestart === 1) {
            this.phase = 0;
            parameters.phaseRestart = 0;
        }

        //polyphony change
        if (polyphonyChange) {
            return false;
        }

        if (nChannels > 0) {
            for (let i = 0; i < output.length; i++) {
                // output[i] = Math.sin(this.phase + modulator[i % modulator.length]);
                output[i] = this.lookupTable.getValue(this.phase + modulator[i % modulator.length]);

                // phase accumulation
                this.phase += freq[i % freq.length] * ratio[i % ratio.length] * PI2 / sampleRate;
                while (this.phase > PI2) this.phase -= PI2;
            }
        }

        return true;
    }
}

registerProcessor('fm-processor', FmProcessor);