
export const PI2 = Math.PI*2;

export const EPSILON = 1e-6;

// Minimum tempo in seconds, used to update a parameter
export const PARAM_CHANGE_TIME = 0.003;

// File suffix used for the presets
export const FILE_FORMAT = "sasp";

// Data structure used to represent the algorithms.
export const algorithms = [
    {output:[[0], [], [1], []], modulations:[[], [0, 1], [0], [2]]},
    {output:[[0], [], [1], []], modulations:[[], [0], [], [2, 3]]},
    {output:[[0], [], [0], [1]], modulations:[[], [0, 1, 2, 3], [], []]},
    {output:[[0], [1], [], []], modulations:[[], [0], [1], [2, 3]]},
    {output:[[0], [1], [], []], modulations:[[], [0], [1, 2], [1, 2]]},
    {output:[[0], [], [1], []], modulations:[[], [0, 1, 2], [], [0, 2]]},
    {output:[[0], [0], [1], [1]], modulations:[[], [0, 1], [], [2]]},
    {output:[[0], [], [1], [0]], modulations:[[], [0], [2], []]},
];

/**
 * Computes a frequency of a given midi note.
 *
 * @param midiNote
 * @return {number}
 *
 */
export function frequencyFromMidi(midiNote) {
    return 440 * Math.pow(2,(midiNote-69)/12);
}


