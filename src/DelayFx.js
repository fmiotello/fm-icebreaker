import {PARAM_CHANGE_TIME} from "./config.js";

class DelayFx {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.fx = new Tone.FeedbackDelay();
        this.fxGain = new GainNode(audioContext);
        Tone.connect(this.fx, this.fxGain);
    }

    setInputOutput(inputNode, outputNode) {
        Tone.connect(inputNode, this.fx);
        Tone.connect(this.fxGain, outputNode);
    }

    setGain(value) {
        if (value < 0) throw 'gain not valid';
        let now = this.audioContext.currentTime;
        this.fxGain.gain.setTargetAtTime(value, now, PARAM_CHANGE_TIME)
    }

    setDelayTime(time) {
        if (time < 0 || time > 1) throw 'negative delay time'; //max time is 1s
        this.fx.delayTime.value = time;
    }

    setFeedback(value) {
        if (value < 0 || value > 1) throw 'illegal feedback argument';
        this.fx.feedback.value = value;
    }

    setWet(value) {
        if (value < 0 || value > 1) throw 'illegal wet argument';
        this.fx.wet.value = value;
    }
}

export default DelayFx;