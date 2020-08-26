import {PARAM_CHANGE_TIME} from "./config.js";
import FmSynth from "./FmSynth.js";
import FmVoice from "./FmVoice.js";
import LookupTable from "./LookupTable.js";

// Core Components
const audioContext = new AudioContext();
let fmSynth = undefined;

// Operator A
let ratioASlider = document.getElementById('ratioA');

// Operator B
let envAmtBSlider = document.getElementById('envAmtB');
let envDelayBSlider = document.getElementById('envDelayB');
let envAttackBSlider = document.getElementById('envAttackB');
let envDecayBSlider = document.getElementById('envDecayB');
let envSustainBSlider = document.getElementById('envSustainB');
let envReleaseBSlider = document.getElementById('envReleaseB');
let ratioBSlider = document.getElementById('ratioB');

// Operator C
let envAmtCSlider = document.getElementById('envAmtC');
let envDelayCSlider = document.getElementById('envDelayC');
let envAttackCSlider = document.getElementById('envAttackC');
let envDecayCSlider = document.getElementById('envDecayC');
let envSustainCSlider = document.getElementById('envSustainC');
let envReleaseCSlider = document.getElementById('envReleaseC');
let ratioCSlider = document.getElementById('ratioC');

// Operator D
let envAmtDSlider = document.getElementById('envAmtD');
let envDelayDSlider = document.getElementById('envDelayD');
let envAttackDSlider = document.getElementById('envAttackD');
let envDecayDSlider = document.getElementById('envDecayD');
let envSustainDSlider = document.getElementById('envSustainD');
let envReleaseDSlider = document.getElementById('envReleaseD');
let ratioDSlider = document.getElementById('ratioD');

// Out
let outGainSlider = document.getElementById('outGain');
let envAttackOutSlider = document.getElementById('envAttackOut');
let envDecayOutSlider = document.getElementById('envDecayOut');
let envSustainOutSlider = document.getElementById('envSustainOut');
let envReleaseOutSlider = document.getElementById('envReleaseOut');
let busMixSlider = document.getElementById('busMix');

// Utilities
let componentList = [];
const OUT_INDEX = 4;

let key2notes = [
    {key: 65, note: 60}, // C
    {key: 87, note: 61}, // C#
    {key: 83, note: 62}, // D
    {key: 69, note: 63}, // D#
    {key: 68, note: 64}, // E
    {key: 70, note: 65}, // F
    {key: 84, note: 66}, // F#
    {key: 71, note: 67}, // G
    {key: 89, note: 68}, // G#
    {key: 72, note: 69}, // A
    {key: 85, note: 70}, // A#
    {key: 74, note: 71}, // B
    {key: 75, note: 72}  // C
];

document.onclick = async function () {
    await audioContext.resume();
    await audioContext.audioWorklet.addModule('src/FmProcessor.js');
    fmSynth = new FmSynth(audioContext, FmVoice, 3);
    fmSynth.connect(audioContext.destination);
    await fmSynth.start();
    fillComponentList();
    bindEventsToGui();
    initParametersFromGui();
    document.onclick = undefined;
}

let bindEventsToGui = function () {
    document.onkeydown = noteOn;
    document.onkeyup = noteOff;

    ratioASlider.onchange = ratioClosure(0);

    envAmtBSlider.onchange = envAmtClosure(1);
    envDelayBSlider.onchange = envDelayClosure(1);
    envAttackBSlider.onchange = envAttackClosure(1);
    envDecayBSlider.onchange = envDecayClosure(1);
    envSustainBSlider.onchange = envSustainClosure(1);
    envReleaseBSlider.onchange = envReleaseClosure(1);
    ratioBSlider.onchange = ratioClosure(1);

    envAmtCSlider.onchange = envAmtClosure(2);
    envDelayCSlider.onchange = envDelayClosure(2);
    envAttackCSlider.onchange = envAttackClosure(2);
    envDecayCSlider.onchange = envDecayClosure(2);
    envSustainCSlider.onchange = envSustainClosure(2);
    envReleaseCSlider.onchange = envReleaseClosure(2);
    ratioCSlider.onchange = ratioClosure(2);

    envAmtDSlider.onchange = envAmtClosure(3);
    envDelayDSlider.onchange = envDelayClosure(3);
    envAttackDSlider.onchange = envAttackClosure(3);
    envDecayDSlider.onchange = envDecayClosure(3);
    envSustainDSlider.onchange = envSustainClosure(3);
    envReleaseDSlider.onchange = envReleaseClosure(3);
    ratioDSlider.onchange = ratioClosure(3);

    outGainSlider.onchange = outGainOnChange;
    envAttackOutSlider.onchange = envAttackClosure(4);
    envDecayOutSlider.onchange = envDecayClosure(4);
    envSustainOutSlider.onchange = envSustainClosure(4);
    envReleaseOutSlider.onchange = envReleaseClosure(4);
    busMixSlider.onchange = busMixSliderOnChange;
}

let fillComponentList = function () {
    componentList.push(
        ratioASlider,

        envAmtBSlider,
        envDelayBSlider,
        envAttackBSlider,
        envDecayBSlider,
        envSustainBSlider,
        envReleaseBSlider,
        ratioBSlider,

        envAmtCSlider,
        envDelayCSlider,
        envAttackCSlider,
        envDecayCSlider,
        envSustainCSlider,
        envReleaseCSlider,
        ratioCSlider,

        envAmtDSlider,
        envDelayDSlider,
        envAttackDSlider,
        envDecayDSlider,
        envSustainDSlider,
        envReleaseDSlider,
        ratioDSlider,

        outGainSlider,
        envAttackOutSlider,
        envDecayOutSlider,
        envSustainOutSlider,
        envReleaseOutSlider,
        busMixSlider,
    );
}

let initParametersFromGui = function () {
    let changeEvent = new Event('change');
    componentList.forEach(component => {
        component.dispatchEvent(changeEvent);
    });
}

let noteOn = function (ev) {
    let allowedKeys = key2notes.map(obj => obj.key);
    let notes = key2notes.map(obj => obj.note);
    if (allowedKeys.includes(ev.keyCode)) { // A-K
        let noteIndex = allowedKeys.indexOf(ev.keyCode);
        fmSynth.noteOn(notes[noteIndex], 100);
    }
}

let noteOff = function (ev) {
    let allowedKeys = key2notes.map(obj => obj.key);
    let notes = key2notes.map(obj => obj.note);
    if (allowedKeys.includes(ev.keyCode)) { // A-K
        let noteIndex = allowedKeys.indexOf(ev.keyCode);
        fmSynth.noteOff(notes[noteIndex]);
    }
}


let envAmtClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        fmSynth.setModEnvAmount(envIndex, value);
    }
}

let envDelayClosure = function (opIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        fmSynth.setModDelay(opIndex, value);
    }
}

let envAttackClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpAttack(value);
        } else {
            fmSynth.setModAttack(envIndex, value);
        }
    }
}

let envDecayClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpDecay(value);
        } else {
            fmSynth.setModDecay(envIndex, value);
        }
    }
}

let envSustainClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpSustain(value);
        } else {
            fmSynth.setModSustain(envIndex, value);
        }
    }
}

let envReleaseClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpRelease(value);
        } else {
            fmSynth.setModRelease(envIndex, value);
        }
    }
}

let ratioClosure = function (opIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        fmSynth.setRatio(opIndex, value);
    }
}

let outGainOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    fmSynth.setOutGain(value);
}

let busMixSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    fmSynth.setBusMix(value);
}
