/***
 * A Worklet that implements a simple adder that sums together mono inputs
 * and scales the output gain,
 * depending on the number of inputs.
 */
class AdderProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.nextFreeInput
    }

    static get parameterDescriptors() {
        return [
            {
                name: 'gain',
                defaultValue: 1,
                max: 100,
                min: 0
            }
        ]
    }

    /**
     * Processing function.
     *
     * @param inputs, the inputs to sum together
     * @param outputs
     * @param parameters
     * @return {boolean}
     */
    process(inputs, outputs, parameters) {

        const output = outputs[0][0];
        const gain = parameters.gain;

        // summing every mono input channel
        inputs.forEach(x => {
            for (let i = 0; i < output.length; i++) {
                output[i] += x[0][i];
            }
        });

        // gain scaling
        for (let i = 0; i < output.length; i++) {
            output[i] *= gain[i % gain.length] / (inputs.length || 1);
        }

        return true;
    }
}

registerProcessor('adder-processor', AdderProcessor);