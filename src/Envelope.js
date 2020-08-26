import {PARAM_CHANGE_TIME} from "./config.js";
import Adsr from "./fastidious-envelope-generator.js";

/**
 * Custom ADSR envelope implementation with initial delay.
 */

class Envelope {
    constructor(audioContext, parameter) {
        this.adsr = new Adsr(audioContext, parameter);
        this.delay = 0;
        this.timeoutFunction = undefined;
        this.adsr.mode = 'ADSR';
    }

    setDelay(t) {
        if (t < 0) throw 'delay time not valid';
        this.delay = t;
    }

    setAttack(t) {
        if (t < PARAM_CHANGE_TIME) throw 'delay time not valid';
        this.adsr.attackTime = t;
    }

    setDecay(t) {
        if (t < PARAM_CHANGE_TIME) throw 'decay time not valid';
        this.adsr.decayTime = t;
    }

    setRelease(t) {
        if (t < PARAM_CHANGE_TIME) throw 'release time not valid';
        this.adsr.releaseTime = t;
    }

    setSustain(value) {
        if (value < 0 || value > 1) throw 'sustain value not valid';
        this.adsr.sustainLevel = value;
    }

    isRunning() {
        return this.timeoutFunction !== undefined;
    }

    noteOn(maxGain, velocity) {
        let amplitude = maxGain * velocity / 127;
        let adsr = this.adsr;
        adsr.attackLevel = amplitude;


        // if the envelope was already running, the timeoutFunction
        // should be stopped
        if (this.isRunning()) clearTimeout(this.timeoutFunction);

        // starting a new timer for the delay
        this.timeoutFunction = setTimeout(() => {
            this.adsr.gate(true);
        }, this.delay * 1000);

        // timeout at the end of the envelope
        let totalTime = this.delay + adsr.attackTime + adsr.decayTime + adsr.releaseTime;
        setTimeout(() => {
            this.timeoutFunction = undefined;
        }, totalTime * 1000);

    }

    noteOff() {
        this.adsr.gate(false);
    }
}

export default Envelope;