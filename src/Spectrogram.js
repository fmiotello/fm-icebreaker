/**
 * Implements a spectrogram visualizer.
 */
class Spectrogram {
    constructor(canvasCtx, audioCtx, node, fftSize, updateRate = 0.1) {
        this.canvasCtx = canvasCtx;
        this.audioCtx = audioCtx;
        this.node = node;
        this.fftSize = fftSize;
        this.updateRate = updateRate; // in seconds
        this.visualizer = undefined;
        this.analyzer = new AnalyserNode(this.audioCtx);
        this.analyzer.fftSize = this.fftSize;
        this.analyzer.smoothingTimeConstant = 0.02;
        this.analyzerDataArray = new Uint8Array(this.analyzer.frequencyBinCount);
        this.visualizerData = [];

        this.start();
    }

    /**
     * Initialize the spectrogram.
     */
    start() {

        // initialize the data structures containing
        // the visualizer data
        let bins = [];
        for (let i = 0; i < this.fftSize / 2; i++) {
            bins.push(i.toString());
            this.visualizerData.push({
                x: this.fftSize / i + 1,
                y: 0
            });
        }

        // connects the analyzed node to the analyzer
        this.node.connect(this.analyzer);

        // GUI component
        this.visualizer = new Chart(this.canvasCtx, {
            type: 'line',
            // The data for our dataset
            data: {
                labels: bins,
                datasets: [{
                    backgroundColor: 'rgba(255,99,132,0)',
                    borderColor: 'rgb(251,70,85)',
                    borderWidth: 1,
                    data: this.visualizerData
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
                ticks: {
                    display: false,
                    min: 0,
                    max: this.analyzerDataArray.length,
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                gridLines: {
                    color: 'rgb(172,49,61)',
                },
                pointLabels: {
                    fontColor: 'rgba(251,70,85, 0 )',
                },
                scales: {
                    xAxes: [{
                        type: 'logarithmic',
                        display: false
                    }],
                    yAxes: [{
                        display: false,
                        ticks: {
                            max: 255,
                            min: -40,
                        }
                    }],
                },
            }
        });

        // calling the update function periodically
        setInterval(this.update.bind(this), this.updateRate * 1000);
    }

    /**
     * Updates the GUI using the analyzer data.
     */
    update() {
        let visualizerData = this.visualizer.data.datasets[0];
        this.analyzer.getByteFrequencyData(this.analyzerDataArray);

        for (let i = 5; i < this.fftSize / 2; i++) {
            visualizerData.data[i].y = this.analyzerDataArray[i];
        }

        this.visualizer.update();
    }
}

export default Spectrogram;