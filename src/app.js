import FmVoice from "./FmVoice.js";

const audioContext = new AudioContext();
let fmVoice = undefined;
let playButton = document.getElementById('test-play-button');


// meglio implementare tutto con async/await
// https://tutorialzine.com/2017/07/javascript-async-await-explained#:~:text=Await%20%2D%20pauses%20the%20execution%20of%20async%20functions.&text=When%20placed%20in%20front%20of,be%20used%20inside%20async%20functions.
//
// document.onclick = function () {
//     audioContext.resume()
//         .then(() => {
//             document.onclick = undefined;
//         });
// }

document.onclick = async function () {
    await audioContext.resume();
    await audioContext.audioWorklet.addModule('src/FmProcessor.js');
    fmVoice = new FmVoice(audioContext);
    playButton.onclick = triggerNote;
    document.onclick = undefined;
}


let triggerNote = function () {

    fmVoice.noteOn(69, 100);

    // uncomment this for ratio fun
    //
    // setInterval(() => {
    //     let ratios = [0.5, 1, 1.2, 1.5, 2, 3, 4, 7];
    //     let randRatio = () => ratios[Math.floor(ratios.length * Math.random())];
    //     fmVoice.setRatio(0, randRatio());
    //     fmVoice.setRatio(1, randRatio());
    //     fmVoice.setRatio(2, randRatio());
    //     fmVoice.setRatio(3, randRatio());
    // }, 200);

    // let operator1 = new AudioWorkletNode(audioContext, 'fm-processor');
    // let operator2 = new AudioWorkletNode(audioContext, 'fm-processor');
    // let operator3 = new AudioWorkletNode(audioContext, 'fm-processor');
    //
    // let gain1 = new GainNode(audioContext);
    // let gain2 = new GainNode(audioContext);
    // let gain3 = new GainNode(audioContext);
    //
    // let buffer = new AudioBuffer(audioContext);
    //
    // let ratio1 = operator1.parameters.get('ratio');
    // let ratio2 = operator2.parameters.get('ratio');
    // let ratio3 = operator3.parameters.get('ratio');
    //
    // gain2.gain.value = 0;
    // gain3.gain.value = 0;
    // ratio1.value = 1
    // ratio2.value = 0.70;
    // ratio3.value = 7;
    //
    // operator2.connect(gain2).connect(operator1);
    // operator3.connect(gain3).connect(operator1);
    // operator1.connect(gain1).connect(buffer).connect(audioContext.destination);
    //
    // gain2.gain.linearRampToValueAtTime(3, audioContext.currentTime + 5);
    // gain3.gain.linearRampToValueAtTime(1, audioContext.currentTime + 10);

}