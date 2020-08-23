
export const PI2 = Math.PI*2;

export function frequencyFromMidi(midiNote) {
    return 440 * Math.pow(2,(midiNote-69)/12);
}

export const algorithms = [
    {output:[0], modulation:[[], [0], [0], [2]]}
];