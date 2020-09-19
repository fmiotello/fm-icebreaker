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

    /**
     * Sets the delay before the attack.
     *
     * @param t seconds
     */
    setDelay(t) {
        if (t < 0) throw 'delay time not valid';
        this.delay = t;
    }

    /**
     * Sets the attack time.
     *
     * @param t seconds
     */
    setAttack(t) {
        if (t < PARAM_CHANGE_TIME) {
            this.adsr.attackTime = PARAM_CHANGE_TIME;
        } else {
            this.adsr.attackTime = t;
        }
    }

    /**
     * Sets the decay time.
     *
     * @param t seconds
     */
    setDecay(t) {
        if (t < PARAM_CHANGE_TIME) throw 'decay time not valid';
        this.adsr.decayTime = t;
    }

    /**
     * Sets the release time.
     *
     * @param t seconds
     */
    setRelease(t) {
        if (t < PARAM_CHANGE_TIME) throw 'release time not valid';
        this.adsr.releaseTime = t;
    }

    /**
     * Sets the sustain level.
     *
     * @param value
     */
    setSustain(value) {
        if (value < 0 || value > 1) throw 'sustain value not valid';
        this.adsr.sustainLevel = value;
    }

    /**
     * Checks whether the envelope is running.
     *
     */
    isRunning() {
        return this.timeoutFunction !== undefined;
    }

    /**
     * Starts the envelope.
     *
     * @param maxGain
     * @param velocity
     */
    noteOn(maxGain, velocity) {
        let amplitude = maxGain * velocity / 127;
        let adsr = this.adsr;
        adsr.attackLevel = amplitude;


        // if the envelope was already running, the timeoutFunction
        // should be stopped
        if (this.isRunning()) clearTimeout(this.timeoutFunction);

        if (this.delay !== 0) {
            // starting a new timer for the delay
            this.timeoutFunction = setTimeout(() => {
                this.adsr.gate(true);
            }, this.delay * 1000);

            // timeout at the end of the envelope
            let totalTime = this.delay + adsr.attackTime + adsr.decayTime + adsr.releaseTime;
            setTimeout(() => {
                this.timeoutFunction = undefined;
            }, totalTime * 1000);
        } else {
            // without the delay we just use the adsr envelope
            this.adsr.gate(true);
        }
    }

    /**
     * Stops the envelope.
     *
     */
    noteOff() {
        if (this.timeoutFunction) clearTimeout(this.timeoutFunction);
        this.adsr.gate(false);
    }
}

export default Envelope;