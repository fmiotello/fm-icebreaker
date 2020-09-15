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
The synth has _four default operators_ <img src="https://user-images.githubusercontent.com/57997005/91181243-fd9dcd80-e6e8-11ea-932f-4704ca88cd5d.jpg" alt="operator_A" width="23"/>  <img src="https://user-images.githubusercontent.com/57997005/91182726-d516d300-e6ea-11ea-99cf-3bd222320334.jpg" width="23"/>  <img src="https://user-images.githubusercontent.com/57997005/91182774-e52eb280-e6ea-11ea-8b01-62994754c548.jpg" alt="operator_C" width="23"/>  <img src="https://user-images.githubusercontent.com/57997005/91182760-e069fe80-e6ea-11ea-9cd0-26354f276780.jpg" alt="operator_D" width="23"/> , and _two output busses_  <img src="https://user-images.githubusercontent.com/57997005/91295067-c7b92180-e79a-11ea-8701-080a95665bf9.jpg" alt="output_x" width="18"/> &  <img src="https://user-images.githubusercontent.com/57997005/91295070-c8ea4e80-e79a-11ea-83d8-39013da6c53c.jpg" alt="output_y" width="18"/> that can be differently mixed to obtain the output. 

| ID | Val Min  | Val Max | Default | Function | MIDI |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **envAmtA**   | 0 | 5 | 0.4 | Change the amouny of operator A |  |
| **envDelayA**   | 0 | 2 | 0 | Change the delay of operator A |  |
| **envAttackA**    | 0.03 | 6 | 1 | Change the attack of operator A |  |
| **envDecayA**    | 0.03 | 6 | 1 | Change the decay of operator A |  |
| **envSustainA**    | 0 | 1 | 0.2 | Change the sustain of operator A |  |
| **envReleaseA**    | 0.03 | 6 | 0.6 | Change the release of operator A |  |
| **ratioA**    | 0.5 | 12 | 1 | Change the ratio of operator A |  |
| **envAmtB**   | 0 | 5 | 0.4 | Change the amount of operator B |  |
| **envDelayB**   | 0 | 2 | 0 | Change the delay of operator B  |  |
| **envAttackB**    | 0.03 | 6 | 1 | Change the attack of operator B |  |
| **envDecayB**    | 0.03 | 6 | 1 | Change the decay of operator B |  |
| **envSustainB**    | 0 | 1 | 0.2 | Change the sustain of operator B |  |
| **envReleaseB**    | 0.03 | 6 | 0.6 | Change the release of operator B |  |
| **ratioB**    | 0.5 | 12 | 1 | Change the ratio of operator B |  |
| **envAmtC**   | 0 | 5 | 0.4 | Change the amount of operator C |  |
| **envDelayC**   | 0 | 2 | 0 | Change the delay of operator C |  |
| **envAttackC**    | 0.03 | 6 | 1 | Change the attack of operator C |  |
| **envDecayC**    | 0.03 | 6 | 1 | Change the decay of operator C |  |
| **envSustainC**    | 0 | 1 | 0.2 | Change the sustain of operator C |  |
| **envReleaseC**    | 0.03 | 6 | 0.6 | Change the release of operator C |  |
| **ratioC**    | 0.5 | 12 | 1 | Change the ratio of operator C |  |
| **envAmtD**   | 0 | 5 | 0.4 | Change the amount of operator D |  |
| **envDelayD**   | 0 | 2 | 0 | Change the delay of operator D |  |
| **envAttackD**    | 0.03 | 6 | 1 | Change the attack of operator D |  |
| **envDecayD**    | 0.03 | 6 | 1 | Change the decay of operator D |  |
| **envSustainD**    | 0 | 1 | 0.2 | Change the sustain of operator D |  |
| **envReleaseD**    | 0.03 | 6 | 0.6 | Change the release of operator D |  |
| **ratioD**    | 0.5 | 12 | 1 | Change the ratio of operator D |  |
| **outGain**   | 0 | 0.16 | 0.16 | Change the gain of the output |  |
| **envAttackOut**   | 0.03 | 6 | 0.2 | Change the attack of the output  |  |
| **envDecayOut**    | 0.03 | 6 | 0.6 | Change the decay of the output |  |
| **envSustainOut**    | 0 | 1 | 0.8 | Change the sustain of the output |  |
| **envReleaseOut**    | 0.03 | 6 | 0.6 | Change the release of the output |  |


#### Algorithm presets
The way the operators are arranged is called the **algorithm** and it defines, together with the parameters' values, the type of sound generated.
There are eight algorithms available for this synth:

![Algorithms_new](https://user-images.githubusercontent.com/57997005/91165597-36ca4380-e6d1-11ea-8e99-bf1ce79b3cd6.jpeg)

#### Demo
Video demo



## Codice?
#### Schema a blocchi di come sono fatti gli operatori?

#### Installation
needed?




