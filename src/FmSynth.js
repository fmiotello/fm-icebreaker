import FmVoice from "./FmVoice.js";
import {PARAM_CHANGE_TIME} from "./config.js";

class FmSynth {
    constructor(audioContext, polyphony) {
        this.audioContext = audioContext;
        this.voices = [];
        this.currentVoiceIndex = 0;
        this.polyphony = polyphony || 16;
        this._midiEventQueue = [];
        this._midiUpdateRate = 100; // ms
        this._noteOnStack = [];
        this.outGain = new GainNode(audioContext);

        for (let i = 0; i < this.polyphony; i++) {
            this.voices.push(new FmVoice(audioContext));
        }
    }

    queueMidiEvent(midiEvent) {
        this._midiEventQueue.push(midiEvent);
    }

    processMidiEvent() {
        if (this._midiEventQueue.length === 0) return;

        let midiEvent = this._midiEventQueue.pop();
        let command = midiEvent.data[0] >> 4;
        let note = midiEvent.data[1];
        let velocity = midiEvent.data[2];

        console.log(note, velocity);

        if (command === 8 || (command === 9 && velocity === 0)) { // note off
            this.noteOff(note);
        } else if (command === 9) { // note on
            this.noteOn(note, velocity);
        }

    }

    async start() {
        let now = this.audioContext.currentTime;
        let promises = []
        this.voices.forEach(voice => promises.push(voice.start()));
        await Promise.all(promises);
        this.voices.forEach(voice => voice.connect(this.outGain));

        // handling midi
        setInterval(this.processMidiEvent.bind(this), this._midiUpdateRate);
    }

    setOutGain(value) {
        if (value < 0) throw 'gain not valid';
        let now = this.audioContext.currentTime;
        this.outGain.gain.setTargetAtTime(value, now, PARAM_CHANGE_TIME)
    }

    noteOn(note, velocity) {
        // if the note is already in the stack, do nothing
        let noteStack = this._noteOnStack.map(x => x.note);
        if (noteStack.includes(note)) return;

        // round robin policy for voice allocation
        let currentVoice = this.voices[this.currentVoiceIndex];
        this.currentVoiceIndex = (this.currentVoiceIndex + 1) % this.polyphony;

        currentVoice.noteOn(note, velocity);
        this._noteOnStack.push({
            note: note,
            voice: currentVoice,
        });
    }

    noteOff(note) {
        let noteStack = this._noteOnStack.map(x => x.note);
        if (!noteStack.includes(note)) return; // no note matching in the stack

        let targetIndex = noteStack.indexOf(note);
        let targetVoice = this._noteOnStack[targetIndex].voice;
        targetVoice.noteOff();
        this._noteOnStack.splice(targetIndex, 1); // removing the note from the stack
    }

    connect(node) {
        this.outGain.connect(node);
    }

    disconnect() {
        this.outGain.disconnect();
    }

    setModEnvAmount(opIndex, amount) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.setModEnvAmount(opIndex, amount));
    }

    setModDelay(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setDelay(time));
    }

    setModAttack(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setAttack(time));
    }

    setModDecay(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setDecay(time));
    }

    setModSustain(opIndex, value) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setSustain(value));
    }

    setModRelease(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
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
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.setRatio(opIndex, ratio));
    }

    setBusMix(value) {
        this.voices.forEach(voice => voice.setBusMix(value));
    }

    setGlide(value) {
        this.voices.forEach(voice => voice.setGlide(value));
    }


}

export default FmSynth;