import {PARAM_CHANGE_TIME} from "./config.js";

/**
 * ADSR envelope with initial delay.
 */
class Envelope {
    constructor(audioContext, parameter) {
        this.audioContext = audioContext;
        this.parameter = parameter;
        this.isLinear = true;
        this.time = [0, 0.4, 0.3, 0.6]; // delay - attack - decay - release
        this.sustain = 0.8;
    }

    setParameter(parameter) {
        this.parameter = parameter;
    }

    noteOn(maxGain, velocity) {
        let [delay, attack, decay, release] = this.time;
        let p = this.parameter; // just a shortcut
        let now = this.audioContext.currentTime;
        let amplitude = maxGain * velocity / 127;

        p.cancelScheduledValues(now); // resets the envelope
        p.setValueAtTime(0, now + PARAM_CHANGE_TIME);
        p.setValueAtTime(0, now + delay);

        if (this.isLinear) {
            p.linearRampToValueAtTime(amplitude, now + delay + attack);
            p.linearRampToValueAtTime(amplitude * this.sustain, now + delay + attack + decay);
        } else { // exponential envelope
            p.exponentialRampToValueAtTime(amplitude, now + delay + attack);
            p.exponentialRampToValueAtTime(amplitude * this.sustain, now + delay + attack + decay);
        }

    }

    noteOff() {
        let release = this.time[3];
        let p = this.parameter;
        let now = this.audioContext.currentTime;

        p.cancelScheduledValues(now); // resets the envelope
        if (this.isLinear) {
            p.linearRampToValueAtTime(0, now + release);
        } else {
            p.exponentialRampToValueAtTime(0, now + release);
        }
    }
}

export default Envelope;