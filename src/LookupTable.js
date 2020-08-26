import {PI2} from "./config.js";

class LookupTable {
    constructor(resolution, func) {
        this.func = func || Math.sin;
        this.resolution = resolution || 2048;
        this.values = new Array(this.resolution);

        // filling the LUT
        let angleDelta = PI2 / (this.resolution - 1);
        for (let i = 0; i < this.resolution; i++) {
            this.values[i] = this.func(i * angleDelta);
        }
    }

    getValue(phase) {
        // phase wrapping
        if (phase < 0) phase += PI2;
        while (phase > PI2) phase -= PI2;

        // linear interpolation
        let fractionalIndex = (phase / PI2) * (this.resolution - 1);
        let decimalPart = fractionalIndex % 1;
        let currentIndex = ~~(fractionalIndex); // equivalent to Math.floor
        let nextIndex = (currentIndex + 1) % this.resolution;
        return (1-decimalPart) * this.values[currentIndex] + decimalPart * this.values[nextIndex];
    }
}

export default LookupTable;