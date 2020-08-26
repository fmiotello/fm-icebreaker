<<<<<<< HEAD
import {PARAM_CHANGE_TIME} from "./config.js";
import Adsr from "./fastidious-envelope-generator.js";

/**
 * Custom ADSR envelope implementation with initial delay.
 */

=======
import {PARAM_CHANGE_TIME, EPSILON} from "./config.js";

/**
 * ADSR envelope with initial delay.
 */
>>>>>>> parent of 2872a22... Envelope Fix
class Envelope {
    constructor(audioContext, parameter) {
        this.audioContext = audioContext;
        this.parameter = parameter;
        this.isLinear = true;
        this.time = [0, 0.05, 0.3, 1]; // delay - attack - decay - release
        this.sustain = 0.8;
        this.timeoutFunction = undefined;
        this.isRunning = false;
    }

    setParameter(parameter) {
        this.parameter = parameter;
    }

    setDelay(t) {
        if (t < 0) throw 'delay time not valid';
        this.time[0] = t;
    }

    setAttack(t) {
        if (t < PARAM_CHANGE_TIME) throw 'delay time not valid';
        this.time[1] = t;
    }

    setDecay(t) {
        if (t < PARAM_CHANGE_TIME) throw 'decay time not valid';
        this.time[2] = t;
    }

    setRelease(t) {
        if (t < PARAM_CHANGE_TIME) throw 'release time not valid';
        this.time[3] = t;
    }

    setSustain(value) {
        if (value < 0 || value > 1) throw 'sustain value not valid';
        this.sustain = value;
    }

    noteOn(maxGain, velocity) {
        let [delay, attack, decay, _] = this.time;
        let p = this.parameter; // just a shortcut
        let now = this.audioContext.currentTime;
        let amplitude = maxGain * velocity / 127;

        // set the envelope state to running
        this.isRunning = true;
        if (this.timeoutFunction) {
            clearTimeout(this.timeoutFunction);
            this.timeoutFunction = undefined;
        }

        p.cancelScheduledValues(now); // resets the envelope
        p.setTargetAtTime(0, now, PARAM_CHANGE_TIME);
        p.linearRampToValueAtTime(0, now + PARAM_CHANGE_TIME + delay);

        if (this.isLinear) {
            p.linearRampToValueAtTime(amplitude, now + delay + attack);
            p.linearRampToValueAtTime(amplitude * this.sustain, now + delay + attack + decay);
        } else { // exponential envelope
            p.exponentialRampToValueAtTime(amplitude, now + delay + attack);
            p.exponentialRampToValueAtTime(amplitude * this.sustain, now + delay + attack + decay);
        }

    }

    noteOff() {
        if (!this.isRunning) return;

        let release = this.time[3];
        let releaseMs = release*1000;
        let p = this.parameter;
        let now = this.audioContext.currentTime;

        // timeout function needed to know when the envelope is over
        this.timeoutFunction = setTimeout(()=>{
            this.isRunning = false;
        }, releaseMs);

        p.cancelScheduledValues(now); // resets the envelope
        if (this.isLinear) {
            p.linearRampToValueAtTime(0, now + release);
        } else {
            p.exponentialRampToValueAtTime(0, now + release);
        }
    }
}

export default Envelope;