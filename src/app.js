import FmVoice from "./FmVoice.js";

const audioContext = new AudioContext();
let fmVoice = undefined;

// Env B
let envAmtBSlider = document.getElementById('envAmtB');
let envDelayBSlider = document.getElementById('envDelayB');
let envAttackBSlider = document.getElementById('envAttackB');
let envDecayBSlider = document.getElementById('envDecayB');
let envSustainBSlider = document.getElementById('envSustainB');
let envReleaseBSlider = document.getElementById('envReleaseB');

// Env C
let envAmtCSlider = document.getElementById('envAmtC');
let envDelayCSlider = document.getElementById('envDelayC');
let envAttackCSlider = document.getElementById('envAttackC');
let envDecayCSlider = document.getElementById('envDecayC');
let envSustainCSlider = document.getElementById('envSustainC');
let envReleaseCSlider = document.getElementById('envReleaseC');

// Env D
let envAmtDSlider = document.getElementById('envAmtD');
let envDelayDSlider = document.getElementById('envDelayD');
let envAttackDSlider = document.getElementById('envAttackD');
let envDecayDSlider = document.getElementById('envDecayD');
let envSustainDSlider = document.getElementById('envSustainD');
let envReleaseDSlider = document.getElementById('envReleaseD');

// Env Out
let envAmtOutSlider = document.getElementById('envAmtOut');
let envDelayOutSlider = document.getElementById('envDelayOut');
let envAttackOutSlider = document.getElementById('envAttackOut');
let envDecayOutSlider = document.getElementById('envDecayOut');
let envSustainOutSlider = document.getElementById('envSustainOut');
let envReleaseOutSlider = document.getElementById('envReleaseOut');


let key2notes = [
    {key: 65, note: 60},
    {key: 83, note: 62},
    {key: 68, note: 64},
    {key: 70, note: 65},
    {key: 71, note: 67},
    {key: 72, note: 69},
    {key: 74, note: 71},
    {key: 75, note: 72}
];

document.onclick = async function () {
    await audioContext.resume();
    await audioContext.audioWorklet.addModule('src/FmProcessor.js');
    fmVoice = new FmVoice(audioContext);
    bindEventsToGui();
    document.onclick = undefined;
}

let bindEventsToGui = function () {
    document.onkeydown = noteOn; // TODO: implement a boolean flag
    document.onkeyup = noteOff;
    envAmtBSlider.onchange = envAmtClosure(1);
    envAmtCSlider.onchange = envAmtClosure(2);
    envAmtDSlider.onchange = envAmtClosure(3);
}

let noteOff = function (ev) {
    fmVoice.noteOff();
}

let noteOn = function (ev) {
    let allowedKeys = key2notes.map(obj => obj.key);
    let notes = key2notes.map(obj => obj.note);
    if (allowedKeys.includes(ev.keyCode)) { // asdfghjk
        let noteIndex = allowedKeys.indexOf(ev.keyCode);
        fmVoice.noteOn(notes[noteIndex], 100);
    }

}

let envAmtClosure = function (opIndex) {
    return function (ev) {
        fmVoice.setModEnvAmount(opIndex, ev.target.value);
    }
}


// setInterval(() => {
//     let ratios = [0.5, 1, 1.2, 1.5, 2, 3, 4, 7];
//     let randRatio = () => ratios[Math.floor(ratios.length * Math.random())];
//     fmVoice.setRatio(0, randRatio());
//     fmVoice.setRatio(1, randRatio());
//     fmVoice.setRatio(2, randRatio());
//     fmVoice.setRatio(3, randRatio());
// }, 80);