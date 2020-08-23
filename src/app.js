const audioContext = new AudioContext();
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
    document.onclick = undefined;
}


playButton.onclick = async function () {
    await audioContext.audioWorklet.addModule('src/worklets/FmProcessor.js');

    let operator1 = new AudioWorkletNode(audioContext, 'fm-processor');
    let operator2 = new AudioWorkletNode(audioContext, 'fm-processor');
    let operator3 = new AudioWorkletNode(audioContext, 'fm-processor');

    let gain1 = new GainNode(audioContext);
    let gain2 = new GainNode(audioContext);
    let gain3 = new GainNode(audioContext);

    let ratio1 = operator1.parameters.get('ratio');
    let ratio2 = operator2.parameters.get('ratio');
    let ratio3 = operator3.parameters.get('ratio');

    gain2.gain.value = 0;
    gain3.gain.value = 0;
    ratio1.value = 1
    ratio2.value = 0.75;
    ratio3.value = 7;

    operator2.connect(gain2).connect(operator1);
    operator3.connect(gain3).connect(operator1);
    operator1.connect(audioContext.destination);

    gain2.gain.linearRampToValueAtTime(2, audioContext.currentTime + 5);
    gain3.gain.linearRampToValueAtTime(2, audioContext.currentTime + 10);

}