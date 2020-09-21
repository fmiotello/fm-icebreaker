import {PARAM_CHANGE_TIME} from "./config.js";

class ReverbFx {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.fx = new Tone.Freeverb();
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

    setRoomSize(value) {
        if (value < 0 || value > 1) throw 'illegal room size argument';
        this.fx.roomSize.value = value;
    }

    setWet(value) {
        if (value < 0 || value > 1) throw 'illegal wet argument';
        this.fx.wet.value = value;
    }
}

export default ReverbFx;