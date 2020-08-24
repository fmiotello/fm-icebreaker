# FM Synth
###### A MIDI FM synth web application inspired by Elektron Digitone and Yamaha DX7
Da mettere screenshot

## What is FM Synthesis
**Frequency modulation synthesis** (or **FM synthesis**) is a form of non linear sound synthesis technique whereby the frequency of a waveform, the _carrier_, is varied according to a modulating wave, the _modulator_, such that the rate at which the carrier varies is the frequency of the modulating wave. Both carrier and modulator are called _operators_ and there can be more than two of them.
This type of synthesis can be used to obtain an extremely wide range of different sounds with a small number of parameters, since the non-linearity allows to largely enrich the input signal's spectrum.

The parameters of a frequency modulated signals are:

- _c = carrier frequency_
- _m = modulating frequency_
- _d = peak deviation_
- _I = d/m, modulating index_
- _c/m = ratio between carrier and modulating frequency_

The _modulating index_ quantifies the amount of spectral enrichment obtained by a modulator on another operator, i.e. the number of sides frequencies added to its spectrum. If _I = 0_ the modulator doesn't affect the modulated spectrum; the higher _I_, the higher number of side frequencies introduced.

The _ratios_ between operators, instead, define the reciprocal positions of the harmonics of the generated sound with respect to the carrier: if they are all integer numbers then it will be harmonic, while, if at least one of them is non integer, the result will be an inharmonic sound.

The generated sound is affected as well by _the envelope_ of each modulator, which doesn't modify it's amplitude, but only it's timbre and spectral bandwidth; the overall amplitude depends on the carrier's one.

## Usage
#### Controls
The synth has four default operators A, B, C & D (da mettere come img), and two output busses X & Y that can be differently mixed to obtain the output. 

#### Algorithm presets
The way the operators are arranged is called the _algorithm_ and it defines, together with the parameters' values, the type of sound generated.
There are eight algorithms available for this synth:

Da mettere immagine algoritmi

#### Demo
Video demo



## Codice?
#### Schema a blocchi di come sono fatti gli operatori?

#### Installation
needed?




