import FmVoice from "./FmVoice.js";
import {PARAM_CHANGE_TIME} from "./config.js";

class FmSynth {
    constructor(audioContext, VoiceClass, polyphony) {
        this.audioContext = audioContext;
        this.voices = [];
        this.polyphony = polyphony || 16;
        this.midiEventQueue = [];
        this.noteOnStack = [];
        this.outGain = new GainNode(audioContext);

        for (let i = 0; i < this.polyphony; i++) {
            this.voices.push(new VoiceClass(audioContext));
        }
    }

    queueMidiEvent(midiEvent) {
        this.midiEventQueue.push(midiEvent);
    }

    processMidiEvent(midiEvent) {
        // TODO: read midi events
    }

    async start() {
        let now = this.audioContext.currentTime;
        let promises = []
        this.voices.forEach(voice => promises.push(voice.start()));
        await Promise.all(promises);
        this.voices.forEach(voice => voice.connect(this.outGain));
        // this.outGain.gain.setTargetAtTime(1/this.polyphony, now, PARAM_CHANGE_TIME);
    }

    setOutGain(value) {
        if (value < 0) throw 'gain not valid';
        let now = this.audioContext.currentTime;
        this.outGain.gain.setTargetAtTime(value, now, PARAM_CHANGE_TIME)
    }

    noteOn(note, velocity) {
        // if the note is already in the stack, do nothing
        let noteStack = this.noteOnStack.map(x => x.note);
        if (noteStack.includes(note)) return; // TODO: trigger a note off, it's better

        // finds the first free voice, if there's any
        let freeVoices = this.voices.filter(v => !v.isRunning());
        let currentVoice = undefined;
        if (freeVoices.length > 0) {
            currentVoice = freeVoices[0];
        } else {
            // TODO: voice steeling
        }

        currentVoice.noteOn(note, velocity);
        this.noteOnStack.push({
            note: note,
            voice: currentVoice,
        });
    }

    noteOff(note) {
        let noteStack = this.noteOnStack.map(x => x.note);
        if (!noteStack.includes(note)) return; // no note matching in the stack

        let targetIndex = noteStack.indexOf(note);
        let targetVoice = this.noteOnStack[targetIndex].voice;
        targetVoice.noteOff();
        this.noteOnStack.splice(targetIndex, 1); // removing the note from the stack
    }

    connect(node) {
        this.outGain.connect(node);
    }

    disconnect() {
        this.outGain.disconnect();
    }

    // TODO: check opIndex range

    setModEnvAmount(opIndex, amount) {
        this.voices.forEach(voice => voice.setModEnvAmount(opIndex, amount));
    }

    setModDelay(opIndex, time) {
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setDelay(time));
    }

    setModAttack(opIndex, time) {
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setAttack(time));
    }

    setModDecay(opIndex, time) {
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setDecay(time));
    }

    setModSustain(opIndex, value) {
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setSustain(value));
    }

    setModRelease(opIndex, time) {
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setRelease(time));
    }

    setAmpAttack(time) {
        this.voices.forEach(voice => voice.outEnv.setAttack(time));
    }

    setAmpDecay(time) {
        this.voices.forEach(voice => voice.outEnv.setDecay(time));
    }

    setAmpSustain(value) {
        this.voices.forEach(voice => voice.outEnv.setSustain(value));
    }

    setAmpRelease(time) {
        this.voices.forEach(voice => voice.outEnv.setRelease(time));
    }

    setRatio(opIndex, ratio) {
        this.voices.forEach(voice => voice.setRatio(opIndex, ratio));
    }

    setBusMix(value) {
        this.voices.forEach(voice => voice.setBusMix(value));
    }


}

export default FmSynth;