class Midi {
    constructor(synth, midiSelect) {
        this.synth = synth;
        this.midiSelect = midiSelect;
        this.midiAccess = undefined;
        this.midiIn = undefined;
        midiSelect.onchange = this.midiSelectOnChange.bind(this);
        midiSelect.options.length = 0; // resets the select
    }

    async start() {
        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            let inputs = this.midiAccess.inputs.values();
            for (let i of inputs) {
               this.midiSelect.appendChild(
                   new Option(i.name || i.manufacturer, i.id)
               );
            }
        } catch (err) {
            console.log(err);
        }
    }

    midiSelectOnChange(ev) {
        let index = ev.target.selectedIndex;
        let option = this.midiSelect[index];
        if (!option) return;

        // unlinks the previous input
        if (this.midiIn) this.midiIn.onmidimessage = undefined;

        let id = option.value;
        this.midiIn = this.midiAccess.inputs.get(id);
        this.midiIn.onmidimessage = this.midiMessageReceived.bind(this);
    }

    midiMessageReceived(midi) {
        this.synth.queueMidiEvent(midi);
    }
}

Midi.updateRate = 30; // ms TODO: test for the opt value

export default Midi;