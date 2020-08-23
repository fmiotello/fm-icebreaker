
/**
 * ADSR envelope with initial delay.
 */
class Envelope {
    constructor(audioContext, parameter) {
        this.audioContext = audioContext;
        this.parameter = parameter;
        this.isLinear = true;
        this.time = [0, 0.1, 0.3, 0.6]; // delay - attack - decay - release
        this.maxGain = 1;
        this.sustain = 0.8;
        this.isRunning = false;
    }

    setParameter(parameter) {
        this.parameter = parameter;
    }

    setMaxGain(maxGain) {
        this.maxGain = maxGain;
    }

    trigger(maxGain) {
        let [delay, attack, decay, release] = this.time;
        let p = this.parameter; // just a shortcut

        p.value = 0;
        p.setValueAtTime(0, this.audioContext.currentTime + delay);

        if (this.isLinear) {
            p.linearRampToValueAtTime(maxGain, this.audioContext.currentTime + delay + attack);
            p.linearRampToValueAtTime(maxGain*this.sustain,
                this.audioContext.currentTime + delay + attack + decay);
            p.linearRampToValueAtTime(0,
                this.audioContext.currentTime + delay + attack + decay + release);
        }
    }
}

export default Envelope;