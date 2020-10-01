import FmVoice from "./FmVoice.js";
import {PARAM_CHANGE_TIME} from "./config.js";
import Midi from "./Midi.js";

/**
 * This class implements the polyphonic synth.
 */
class FmSynth {
    constructor(audioContext, polyphony) {
        this.audioContext = audioContext;
        this.voices = [];
        this.currentVoiceIndex = 0;
        this.polyphony = polyphony || 8;
        this._midiEventQueue = [];
        this._noteOnStack = [];
        this.outGain = new GainNode(audioContext);

        for (let i = 0; i < this.polyphony; i++) {
            this.voices.push(new FmVoice(audioContext));
        }
    }

    /**
     * Pushes a midi event in the midiEventQueue.
     *
     * @param midiEvent
     */
    queueMidiEvent(midiEvent) {
        this._midiEventQueue.push(midiEvent);
    }

    getNoteOnStack() {
        return this._noteOnStack;
    }

    /**
     * Extract the information from a midi event.
     */
    processMidiEvent() {
        if (this._midiEventQueue.length === 0) return;

        let midiEvent = this._midiEventQueue.shift();
        let command = midiEvent.data[0] >> 4;
        let note = midiEvent.data[1];
        let velocity = midiEvent.data[2];

        if (command === 8 || (command === 9 && velocity === 0)) { // note off
            this.noteOff(note);
        } else if (command === 9) { // note on
            this.noteOn(note, velocity);
        } else if (command === 14) {
                this.setPitchBend(((velocity * 128.0 + note)-8192)/8192.0);
        } else {
            console.log('midi message not supported');
        }

    }

    /**
     * Starts all the voices and connects them to the output node.
     *
     * @return {Promise}
     */
    async start() {
        let now = this.audioContext.currentTime;
        let promises = []
        this.voices.forEach(voice => promises.push(voice.start()));
        await Promise.all(promises);
        this.voices.forEach(voice => voice.connect(this.outGain));

        // handling midi
        setInterval(this.processMidiEvent.bind(this), Midi.updateRate);
    }


    /**
     * Sets the output gain.
     *
     * @param value
     */
    setOutGain(value) {
        if (value < 0) throw 'gain not valid';
        let now = this.audioContext.currentTime;
        this.outGain.gain.setTargetAtTime(value, now, PARAM_CHANGE_TIME);
    }

    /**
     * Finds a free voice, if there is any, and calls its noteOn function.
     *
     * @param note
     * @param velocity
     */
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

    /**
     * Calls the noteOff function of the voice which is playing a certain note.
     *
     * @param note
     */
    noteOff(note) {
        let noteStack = this._noteOnStack.map(x => x.note);
        if (!noteStack.includes(note)) return; // no note matching in the stack

        let targetIndex = noteStack.indexOf(note);
        let targetVoice = this._noteOnStack[targetIndex].voice;
        targetVoice.noteOff();
        this._noteOnStack.splice(targetIndex, 1); // removing the note from the stack
    }

    /**
     * Connects to a node.
     *
     * @param node
     */
    connect(node) {
        this.outGain.connect(node);
    }

    /**
     * Disconnects the synth.
     */
    disconnect() {
        this.outGain.disconnect();
    }

    /**
     * Sets the env amount of an operator.
     *
     * @param opIndex
     * @param amount
     */
    setModEnvAmount(opIndex, amount) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.setModEnvAmount(opIndex, amount));
    }

    /**
     * Sets the delay for the env of an operator.
     *
     * @param opIndex
     * @param time
     */
    setModDelay(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setDelay(time));
    }

    /**
     * Sets the attack for the env of an operator.
     *
     * @param opIndex
     * @param time
     */
    setModAttack(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setAttack(time));
    }

    /**
     * Sets the decay for the env of an operator.
     *
     * @param opIndex
     * @param time
     */
    setModDecay(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setDecay(time));
    }

    /**
     * Sets the sustain for the env of an operator.
     *
     * @param opIndex
     * @param value
     */
    setModSustain(opIndex, value) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setSustain(value));
    }

    /**
     * Sets the release for the env of an operator.
     *
     * @param opIndex
     * @param time
     */
    setModRelease(opIndex, time) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.operatorsEnv[opIndex].setRelease(time));
    }

    /**
     * Sets the output attack time.
     *
     * @parameter time
     */
    setAmpAttack(time) {
        this.voices.forEach(voice => voice.outEnv.setAttack(time));
    }

    /**
     * Sets the output decay time.
     *
     * @parameter time
     */
    setAmpDecay(time) {
        this.voices.forEach(voice => voice.outEnv.setDecay(time));
    }

    /**
     * Sets the output sustain level.
     *
     * @parameter value
     */
    setAmpSustain(value) {
        this.voices.forEach(voice => voice.outEnv.setSustain(value));
    }

    /**
     * Sets the output release time.
     *
     * @parameter time
     */
    setAmpRelease(time) {
        this.voices.forEach(voice => voice.outEnv.setRelease(time));
    }

    /**
     * Sets the ratio of an operator.
     *
     * @parameter opIndex
     * @parameter ratio
     */
    setRatio(opIndex, ratio) {
        if (opIndex < 0 || opIndex > 3) throw 'opIndex not valid';
        this.voices.forEach(voice => voice.setRatio(opIndex, ratio));
    }

    /**
     * Sets the output bus mix.
     *
     * @parameter time
     */
    setBusMix(value) {
        this.voices.forEach(voice => voice.setBusMix(value));
    }

    /**
     * Sets the glide time.
     *
     * @parameter time
     */
    setGlide(time) {
        this.voices.forEach(voice => voice.setGlide(time));
    }

    /**
     * Sets the detune.
     *
     * @param value
     */
    setDetune(value) {
        value = (value < 0)? 0 : value;

        for (let i = 0; i < 4; i++) {
            this.voices[i].setDetune(value);
        }
    }

    /**
     * Sets the pitch bend.
     *
     * @param value
     */
    setPitchBend(value) {
        this.voices.forEach(voice => voice.setPitchBend(value));
    }

    /**
     * Sets the algorithm.
     *
     * @param index
     */
    setAlgorithm(index) {
        if (index < 0) throw 'algorithm index not valid';
        this.voices.forEach(voice => voice.setAlgorithm(index));
    }

    setFeedback(value) {
        this.voices.forEach(voice => voice.setFeedback(value));
    }


}


export default FmSynth;