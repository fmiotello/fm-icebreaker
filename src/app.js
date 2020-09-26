import {FILE_FORMAT, PARAM_CHANGE_TIME} from "./config.js";
import FmSynth from "./FmSynth.js";
import FmVoice from "./FmVoice.js";
import Midi from "./Midi.js";
import Spectrogram from "./Spectrogram.js";

// Core Components
const audioContext = new AudioContext();
let fmSynth = undefined;
let midi = undefined;
let featureAnalyzer = undefined;

// Utilities
let polyphony = 4;
let componentList = []; // store the references of the html tags, that contain useful data for the synth
let octaveIndex = 0;
let maxOctave = 2;
let minOctave = -2;
const OUT_INDEX = 4; // used for referencing the out-env on the closures
const featureUpdateRate = 0.5; // in seconds
const fftSize = 2048;

// Visualizers
let featureVisualizer = undefined;
let featureVisualizerContext = document.getElementById('featureCanvas').getContext("2d");
let spectrogramVisualizer = undefined;
let spectrogramVisualizerContext = document.getElementById('spectrogramCanvas').getContext("2d");
let algorithmImg = document.getElementById('algorithmImg');
let imgPath = 'img/';

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

// Other Things
let glideTimeSlider = document.getElementById('glideTime');
let detuneSlider = document.getElementById('detune');
let midiInputSelect = document.getElementById('midiInput');
let savePresetLink = document.getElementById('savePreset');
let presetInputText = document.getElementById('presetInputText');
let loadPreset = document.getElementById('loadPreset');
let algorithmButtonUp = document.getElementById('algorithmButtonUp');
let algorithmButtonDown = document.getElementById('algorithmButtonDown');
let algorithmSelect = document.getElementById('algorithmSelect');

//Effect bus
let delayTimeSlider = document.getElementById('delayTime');
let delayFeedbackSlider = document.getElementById('delayFeedback');
let delayGainSlider = document.getElementById('delayGain');
let reverbSizeSlider = document.getElementById('reverbSize');
let reverbGainSlider = document.getElementById('reverbGain');
let delayFx = undefined;
let reverbFx = undefined;
let delayFxGain = new GainNode(audioContext);
let reverbFxGain = new GainNode(audioContext);

// keyboard mapping to play the synth without a midi keyboard
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
    {key: 75, note: 72}, // C
    {key: 79, note: 73}, // C#
    {key: 76, note: 74}, // D
];

let allowedKeys = key2notes.map(obj => obj.key);
let notes = key2notes.map(obj => obj.note);

/**
 * Main function, executed after the user clicked the screen.
 *
 * @returns {Promise<void>}
 */
document.onclick = async function () {
    await audioContext.resume();
    await audioContext.audioWorklet.addModule('src/FmProcessor.js');
    Tone.start();
    Tone.setContext(audioContext);
    delayFx = new Tone.FeedbackDelay();
    reverbFx = new Tone.Freeverb();
    fmSynth = new FmSynth(audioContext, polyphony);
    featureAnalyzer = Meyda.createMeydaAnalyzer({
        "audioContext": audioContext,
        "source": fmSynth.outGain,
        "bufferSize": fftSize,
        "featureExtractors": ["perceptualSharpness", "spectralFlatness", "rms"],
    });
    featureAnalyzer.start();
    setupFeatureVisualizer();
    connectAll();
    await fmSynth.start();
    midi = new Midi(fmSynth, midiInputSelect);
    await midi.start();
    spectrogramVisualizerContext = new Spectrogram(spectrogramVisualizerContext, audioContext, fmSynth.outGain, fftSize);
    fillComponentList();
    bindEventsToGui();
    initParametersFromGui();

    document.onclick = undefined;
}

let setupFeatureVisualizer = function () {
    featureVisualizer = new Chart(featureVisualizerContext, {
        type: 'radar',
        // The data for our dataset
        data: {
            labels: ["INARMONICITY", "RICHNESS", 'NOISINESS'],
            datasets: [{
                backgroundColor: 'rgba(255,99,132,0)',
                borderColor: 'rgb(251,70,85)',
                data: [0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false,
            },
            scale: {
                ticks: {
                    display: false,
                    maxTicksLimit: 2,
                    min: 0,
                    max: 1,
                },
                gridLines: {
                    color: 'rgb(172,49,61)',
                },
                pointLabels: {
                    fontColor: 'rgb(251,70,85)',
                },
            }
        }
    });
}

/**
 * Does all the audio routing.
 */
let connectAll = function () {
    fmSynth.connect(audioContext.destination);
    Tone.connect(fmSynth.outGain, delayFx);
    Tone.connect(fmSynth.outGain, reverbFx);
    Tone.connect(delayFx, delayFxGain);
    Tone.connect(reverbFx, reverbFxGain);
    Tone.connect(delayFxGain, audioContext.destination);
    Tone.connect(reverbFxGain, audioContext.destination);
}

/**
 * Event binding for the html elements.
 */
let bindEventsToGui = function () {
    document.onkeydown = noteOn;
    document.onkeyup = noteOff;

    setInterval(displayFeatures, featureUpdateRate * 1000);

    envAmtBSlider.onchange = envAmtClosure(1);
    envDelayBSlider.onchange = envDelayClosure(1);
    envAttackBSlider.onchange = envAttackClosure(1);
    envDecayBSlider.onchange = envDecayClosure(1);
    envSustainBSlider.onchange = envSustainClosure(1);
    envReleaseBSlider.onchange = envReleaseClosure(1);
    ratioBSlider.onchange = ratioClosure(1);

    envAmtBSlider.oninput = displayValue;
    envDelayBSlider.oninput = displayValue;
    envAttackBSlider.oninput = displayValue;
    envDecayBSlider.oninput = displayValue;
    envSustainBSlider.oninput = displayValue;
    envReleaseBSlider.oninput = displayValue;
    ratioBSlider.oninput = displayValue;

    envAmtCSlider.onchange = envAmtClosure(2);
    envDelayCSlider.onchange = envDelayClosure(2);
    envAttackCSlider.onchange = envAttackClosure(2);
    envDecayCSlider.onchange = envDecayClosure(2);
    envSustainCSlider.onchange = envSustainClosure(2);
    envReleaseCSlider.onchange = envReleaseClosure(2);
    ratioCSlider.onchange = ratioClosure(2);

    envAmtCSlider.oninput = displayValue;
    envDelayCSlider.oninput = displayValue;
    envAttackCSlider.oninput = displayValue;
    envDecayCSlider.oninput = displayValue;
    envSustainCSlider.oninput = displayValue;
    envReleaseCSlider.oninput = displayValue;
    ratioCSlider.oninput = displayValue;

    envAmtDSlider.onchange = envAmtClosure(3);
    envDelayDSlider.onchange = envDelayClosure(3);
    envAttackDSlider.onchange = envAttackClosure(3);
    envDecayDSlider.onchange = envDecayClosure(3);
    envSustainDSlider.onchange = envSustainClosure(3);
    envReleaseDSlider.onchange = envReleaseClosure(3);
    ratioDSlider.onchange = ratioClosure(3);

    envAmtDSlider.oninput = displayValue;
    envDelayDSlider.oninput = displayValue;
    envAttackDSlider.oninput = displayValue;
    envDecayDSlider.oninput = displayValue;
    envSustainDSlider.oninput = displayValue;
    envReleaseDSlider.oninput = displayValue;
    ratioDSlider.oninput = displayValue;

    ratioASlider.onchange = ratioClosure(0);
    envAttackOutSlider.onchange = envAttackClosure(4);
    envDecayOutSlider.onchange = envDecayClosure(4);
    envSustainOutSlider.onchange = envSustainClosure(4);
    envReleaseOutSlider.onchange = envReleaseClosure(4);
    detuneSlider.onchange = detuneSliderOnChange;
    busMixSlider.onchange = busMixSliderOnChange;

    ratioASlider.oninput = displayValue;
    envAttackOutSlider.oninput = displayValue;
    envDecayOutSlider.oninput = displayValue;
    envSustainOutSlider.oninput = displayValue;
    envReleaseOutSlider.oninput = displayValue;
    detuneSlider.oninput = displayValue;
    busMixSlider.oninput = displayValue;


    glideTimeSlider.onchange = glideTimeSliderOnChange;
    outGainSlider.onchange = outGainOnChange;
    delayTimeSlider.onchange = delayTimeSliderOnChange;
    delayFeedbackSlider.onchange = delayFeedbackSliderOnChange;
    delayGainSlider.onchange = delayGainSliderOnChange;
    reverbSizeSlider.onchange = reverbSizeSliderOnChange;
    reverbGainSlider.onchange = reverbGainSliderOnChange;


    glideTimeSlider.oninput = displayValue;
    outGainSlider.oninput = displayValue;
    delayTimeSlider.oninput = displayValue;
    delayFeedbackSlider.oninput = displayValue;
    delayGainSlider.oninput = displayValue;
    reverbSizeSlider.oninput = displayValue;
    reverbGainSlider.oninput = displayValue;

    presetInputText.onchange = presetInputTextOnChange;
    loadPreset.onchange = loadPresetOnChange;

    algorithmSelect.onchange = algorithmSelectOnChange;
    algorithmButtonUp.onclick = algorithmButtonUpOnClick;
    algorithmButtonDown.onclick = algorithmButtonDownOnClick;
}

/**
 * Pushes all the html of interest inside the componentList.
 * ComponentList is used for preset saving/loading, and to update
 * the model after view modifications.
 */
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

        delayTimeSlider,
        delayFeedbackSlider,
        delayGainSlider,
        reverbSizeSlider,
        reverbGainSlider,

        busMixSlider,
        glideTimeSlider,
        midiInputSelect, // onchange handled inside Midi class
        detuneSlider,
        algorithmSelect,

        presetInputText,
    );
}

/**
 * Uses the componentList to update the model.
 */
let initParametersFromGui = function () {
    let changeEvent = new Event('change');
    componentList.forEach(component => {
        component.dispatchEvent(changeEvent);
    });
}

/**
 * builds a JSON object from the model.
 * @returns {string}
 */
let jsonFromParameters = function () {
    let parameterObj = {};
    componentList.forEach(component => {
        parameterObj[component.id] = component.value;
    });

    return JSON.stringify(parameterObj);
}

/**
 * Generated the url used to dowload the preset.
 *
 * @param presetName
 * @returns {string}
 */
let generatePresetUrl = function (presetName) {
    let blob = new Blob(
        [jsonFromParameters()],
        {
            type: "application/json",
            name: presetName
        });
    return URL.createObjectURL(blob);
}

/**
 * This is the noteOn function used for the computer keyboard.
 * @param ev
 */
let noteOn = function (ev) {
    if (presetInputText !== document.activeElement) {
        if (allowedKeys.includes(ev.keyCode)) { // A-L
            let noteIndex = allowedKeys.indexOf(ev.keyCode);
            fmSynth.noteOn(notes[noteIndex] + 12 * octaveIndex, 100);
        } else if (ev.keyCode === 88) { // X: octave up
            octaveIndex < maxOctave ? octaveIndex++ : octaveIndex = maxOctave;
        } else if (ev.keyCode === 90) { // Z: octave down
            octaveIndex > minOctave ? octaveIndex-- : octaveIndex = minOctave;
        }
    }
}

/**
 * This is the noteOff function used for the computer keyboard.
 * @param ev
 */
let noteOff = function (ev) {
    if (presetInputText !== document.activeElement) {
        if (allowedKeys.includes(ev.keyCode)) { // A-K
            let noteIndex = allowedKeys.indexOf(ev.keyCode);
            fmSynth.noteOff(notes[noteIndex] + 12 * octaveIndex);
        }
    }
}

/**
 * Renders the full name and the value of a parameter,
 * when the user moves a slider.
 *
 * @param ev
 */
let displayValue = function (ev) {
    let inputBlock = ev.target.closest(".input-block");
    let nameLabel = inputBlock.querySelector(".block-label-detail-name");
    let valueLabel = inputBlock.querySelector(".block-label-detail-value");
    let inputBlockLabelsArray = inputBlock.querySelectorAll(".input-block-labels");
    inputBlockLabelsArray[0].style.display = "flex";
    inputBlockLabelsArray[1].style.display = "none";
    let value = ev.target.value;
    let formattedValue = parseFloat(value);
    let name = ev.target.getAttribute("data-fullname");
    valueLabel.innerHTML = formattedValue.toFixed(2);
    nameLabel.innerHTML = name;
}

/**
 * Complementary function of displayValue, executed when the user ends
 * the modifications.
 *
 * @param ev
 */
let hideValue = function (ev) {
    let inputBlock = ev.target.closest(".input-block");
    let inputBlockLabelsArray = inputBlock.querySelectorAll(".input-block-labels");
    inputBlockLabelsArray[0].style.display = "none";
    inputBlockLabelsArray[1].style.display = "flex";
}

/**
 * Closure for the env amount callbacks.
 *
 * @param envIndex
 * @returns {function(*=): void}
 */
let envAmtClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        fmSynth.setModEnvAmount(envIndex, value);
        hideValue(ev);
    }
}

/**
 * Closure for the env delay  callbacks.
 *
 * @param opIndex
 * @returns {function(*=): void}
 */
let envDelayClosure = function (opIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        fmSynth.setModDelay(opIndex, value);
        hideValue(ev);
    }
}


/**
 * Closure for the env attack callbacks.
 *
 * @param envIndex
 * @returns {function(*=): void}
 */
let envAttackClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpAttack(value);
        } else {
            fmSynth.setModAttack(envIndex, value);
        }
        hideValue(ev);
    }
}

/**
 * Closure for the env decay callbacks.
 *
 * @param envIndex
 * @returns {function(*=): void}
 */
let envDecayClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpDecay(value);
        } else {
            fmSynth.setModDecay(envIndex, value);
        }
        hideValue(ev);
    }
}

/**
 * Closure for the env sustain callbacks.
 *
 * @param envIndex
 * @returns {function(*=): void}
 */
let envSustainClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpSustain(value);
        } else {
            fmSynth.setModSustain(envIndex, value);
        }
        hideValue(ev);
    }
}

/**
 * Closure for the env release callbacks.
 *
 * @param envIndex
 * @returns {function(*=): void}
 */
let envReleaseClosure = function (envIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        if (envIndex === OUT_INDEX) {
            fmSynth.setAmpRelease(value);
        } else {
            fmSynth.setModRelease(envIndex, value);
        }
        hideValue(ev);
    }
}

/**
 * Closure for the ratio callbacks.
 *
 * @param opIndex
 * @returns {function(*=): void}
 */
let ratioClosure = function (opIndex) {
    return function (ev) {
        let value = parseFloat(ev.target.value);
        fmSynth.setRatio(opIndex, value);
        hideValue(ev);
    }
}

/**
 * Callback for out gain.
 *
 * @param ev
 */
let outGainOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    fmSynth.setOutGain(value);
    hideValue(ev);
}

/**
 * Callback for bus mix.
 * @param ev
 */
let busMixSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    fmSynth.setBusMix(value);
    hideValue(ev);
}

/**
 * Callback for glide time.
 *
 * @param ev
 */
let glideTimeSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    fmSynth.setGlide(value);
    hideValue(ev);
}

/**
 * Callback for detune.
 *
 * @param ev
 */
let detuneSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    fmSynth.setDetune(value);
    hideValue(ev);
}

/**
 * Callback for delay time.
 *
 * @param ev
 */
let delayTimeSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    delayFx.delayTime.rampTo(value, PARAM_CHANGE_TIME);
    hideValue(ev);
}

/**
 *  Callback for delay feedback.
 * @param ev
 */
let delayFeedbackSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    delayFx.feedback.rampTo(value, PARAM_CHANGE_TIME);
    hideValue(ev);
}

/**
 * Callback for delay send.
 *
 * @param ev
 */
let delayGainSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    delayFxGain.gain.setValueAtTime(value, audioContext.currentTime);
    hideValue(ev);
}

/**
 * Callback for reverb size.
 *
 * @param ev
 */
let reverbSizeSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    reverbFx.roomSize.rampTo(value, PARAM_CHANGE_TIME);
    hideValue(ev);
}

/**
 * Callback for reverb send.
 *
 * @param ev
 */
let reverbGainSliderOnChange = function (ev) {
    let value = parseFloat(ev.target.value);
    reverbFxGain.gain.setValueAtTime(value, audioContext.currentTime);
    hideValue(ev);
}

/**
 * Callback for the preset name's input field.
 * @param ev
 */
let presetInputTextOnChange = function (ev) {
    let presetName = presetInputText.value;
    savePresetLink.href = generatePresetUrl(presetName + "." + FILE_FORMAT);
    savePresetLink.download = presetName + "." + FILE_FORMAT;
}

/**
 * Callback for load preset button.
 * @param ev
 * @returns {Promise<void>}
 */
let loadPresetOnChange = async function (ev) {
    try {
        let preset = loadPreset.files[0];
        let content = await readFileAsync(preset);
        updateSettingsFromPreset(JSON.parse(content));
    } catch (error) {
        console.log("error on file loading");
    }
}

/**
 * Reads a text file with a FileReader.
 *
 * @param file
 * @returns {Promise<unknown>}
 */
function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    })
}

/**
 * Updates the view and the model from a preset.
 *
 * @param preset
 */
let updateSettingsFromPreset = function (preset) {
    componentList.forEach(component => {
        component.value = preset[component.id];
    });
    initParametersFromGui();
}

/**
 * Callback for algorithm select.
 *
 * @param ev
 */
let algorithmSelectOnChange = function (ev) {
    let value = parseInt(ev.target.value);
    fmSynth.setAlgorithm(value - 1);
    algorithmImg.src= imgPath + "algorithm" + value + ".png";
}

/**
 * Callback for algorithm up button.
 *
 * @param ev
 */
let algorithmButtonUpOnClick = function (ev) {
    let value = parseInt(algorithmSelect.value);
    if (value >= 8) return;
    value += 1;
    algorithmSelect.value = value.toString();
    algorithmSelect.dispatchEvent(new Event('change'));
}

/**
 * Callback for algorithm down button.
 *
 * @param ev
 */

let algorithmButtonDownOnClick = function (ev) {
    let value = parseInt(algorithmSelect.value);
    if (value <= 1) return;
    value -= 1;
    algorithmSelect.value = value.toString();
    algorithmSelect.dispatchEvent(new Event('change'));
}

let displayFeatures = function () {
    let features = featureAnalyzer.get();
    let featuresValues = Object.values(features);

    // resets the values to zero with no notes
    if (featuresValues[2] < 0.01) return;


    // inharmonicity calculation
    let inharmonicity = parseFloat(detuneSlider.value);
    let ratios = [];
    ratios.push(parseFloat(ratioASlider.value));
    ratios.push(parseFloat(ratioBSlider.value));
    ratios.push(parseFloat(ratioCSlider.value));
    ratios.push(parseFloat(ratioDSlider.value));
    let envAmts = [];
    envAmts.push(1);
    envAmts.push(parseFloat(envAmtBSlider.value) / 5);
    envAmts.push(parseFloat(envAmtCSlider.value) / 5);
    envAmts.push(parseFloat(envAmtDSlider.value) / 5);

    ratios.forEach((r,i) => {
        let addDissonance = 0;
        if (r % 1 !== 0) inharmonicity += 0.1 * envAmts[i];
    });
    inharmonicity /= 0.6;

    // noisiness
    let noisiness = featuresValues[1] * 3;
    noisiness = (noisiness > 1)? 1 : noisiness;

    // richness
    let richness = featuresValues[0];

    featureVisualizer.data.datasets[0].data[1] = richness;
    featureVisualizer.data.datasets[0].data[2] = noisiness;
    featureVisualizer.data.datasets[0].data[0] = inharmonicity;

    // TODO: remove console log
    // console.log(features);
    // console.log(richness, noisiness, inharmonicity);

    featureVisualizer.update();
}


