const audioContext = new AudioContext();
let playButton = document.getElementById('test-play-button');

document.onclick = function () {
    audioContext.resume()
        .then(() => {
            document.onclick = undefined;
        });
}


playButton.onclick = function () {
    audioContext.audioWorklet.addModule('src/worklets/FmProcessor.js')
        .then(() => {
                let operator1 = new AudioWorkletNode(audioContext, 'fm-processor');
                let operator2 = new AudioWorkletNode(audioContext, 'fm-processor');
                let gain2 = new GainNode(audioContext);
                const freq1 = operator1.parameters.get('frequency');
                const freq2 = operator2.parameters.get('frequency');

                //freq2.linearRampToValueAtTime(880, 10);
                gain2.gain.value = 0;
                gain2.gain.linearRampToValueAtTime(0.8, 10);

                operator2.connect(gain2).connect(operator1)
                    .connect(audioContext.destination);

            },
            (ev) => {
                console.log(ev);
            });
}