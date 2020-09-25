# FM Icebreaker
###### A polyphonic FM synth web application inspired by Elektron Digitone and Yamaha DX7

FOTO DEL SYNTH

#### Demo
Video demo

## What is FM Synthesis
*Frequency modulation synthesis* (or *FM synthesis*) is a form of non linear sound synthesis technique whereby the frequency of a waveform, the carrier, is varied according to a modulating wave, the modulator, such that the rate at which the carrier varies is the frequency of the modulating wave. Both carrier and modulator are called operators and there can be more than two of them.
This type of synthesis can be used to obtain an extremely wide range of different sounds with a small number of parameters, since the non-linearity allows to largely enrich the input signal's spectrum.

The parameters of a frequency modulated signals are:

- *c* = carrier frequency
- *m* = modulating frequency
- *d* = peak deviation
- *I* = *d/m*, modulating index
- *c/m* = ratio between carrier and modulating frequency

The modulating index quantifies the amount of spectral enrichment obtained by a modulator on another operator, *i.e.* the number of sides frequencies added to its spectrum. If *I = 0* the modulator doesn't affect the modulated spectrum: the higher *I*, the higher number of side frequencies introduced.

The ratios between operators, instead, define the reciprocal positions of the harmonics of the generated sound with respect to the carrier: if they are all integer numbers then it will be harmonic, while, if at least one of them is non integer, the result will be an inharmonic sound.

The generated sound is affected as well by the envelope of each modulator, which doesn't modify it's amplitude, but only it's timbre and spectral bandwidth: the overall amplitude depends on the carrier's one.

## Usage

The synth has four default operators <img src="https://user-images.githubusercontent.com/57997005/91181243-fd9dcd80-e6e8-11ea-932f-4704ca88cd5d.jpg" alt="operator_A" width="23"/>  <img src="https://user-images.githubusercontent.com/57997005/91182726-d516d300-e6ea-11ea-99cf-3bd222320334.jpg" width="23"/>  <img src="https://user-images.githubusercontent.com/57997005/91182774-e52eb280-e6ea-11ea-8b01-62994754c548.jpg" alt="operator_C" width="23"/>  <img src="https://user-images.githubusercontent.com/57997005/91182760-e069fe80-e6ea-11ea-9cd0-26354f276780.jpg" alt="operator_D" width="23"/> , and two output busses  <img src="https://user-images.githubusercontent.com/57997005/91295067-c7b92180-e79a-11ea-8701-080a95665bf9.jpg" alt="output_x" width="18"/> &  <img src="https://user-images.githubusercontent.com/57997005/91295070-c8ea4e80-e79a-11ea-83d8-39013da6c53c.jpg" alt="output_y" width="18"/> that can be differently mixed with a crossfade to obtain the output.

### Keyboard

It is possible to control the synth using a Midi keyboard connected to your computer. You can expand the sound control capabilities using *aftertouch* and *pitch-wheel*.

In addition to this it's also possible to control the synth by using the computer's keyboard which is mapped in the following way:
<p align="center">
  <img src="https://user-images.githubusercontent.com/57997005/94257744-17bb0d80-ff2c-11ea-8c27-f224885c5dc8.png" width="90%"//>
</p>

### Operators
IMMAGINE SINGOLO OPERATORE

Operators are the core of an FM synth, their parameters can be changed from this module:
* AMT: Changes the amount of the operator
* DLY: Changes the delay of envelope of the operator
* ATK: Changes the attack of the envelope of the operator
* DEC: Changes the decay of the envelope of the operator
* SUS: Changes the sustain of the envelope of the operator
* REL: Changes the release of the envelope of the operator
* RTO: Changes the ratio of the frequency of the operator

### Output Envelope
IMMAGINE OUTENV

* RTO: Changes the ratio of the frequency of the operator A
* ATK: Changes the attack of the output envelope
* DEC: Changes the decay of the output envelope
* SUS: Changes the sustain of the output envelope
* REL: Changes the release of the output envelope
* DET: Changes the detune amount
* MIX: Changes the crossfade mix between channels X and Y

### Global Effects
IMMAGINE GLOBAL FX

It's possible to add *reverb* and *delay* to the obtained sound and to change their parameters:
* GLD: Changes the glide time
* TIM: Changes the delay time
* FBK: Changes the delay feedback
* DLY: Changes the delay send
* SIZ: Changes the reverb size
* REV: Changes the reverb send
* VOL: Changes the output volume

### Algorithms
IMMAGINE SEZIONE ALGORITMI

The way the operators are arranged is called the *algorithm* and it defines, together with the parameters' values, the type of sound generated.
There are eight algorithms available for this synth:

![Algorithms_new](https://user-images.githubusercontent.com/57997005/91165597-36ca4380-e6d1-11ea-8e99-bf1ce79b3cd6.jpeg)

### Config
IMMAGINE MODULO PRESETS

The synth allows you to save the sound you have achieved as a preset and reload it whenever you want:
1) To save the preset click on *save preset* after having specified its name: this downloads a file with the values of the parameters
2) To load one of your presets click on *load preset* and choose between the ones you saved

You can select from the drop down menu on this module one of the connected Midi devices to control the synth.


### Sound Features
IMMAGINE MODULO FEATURES

From the graph above it's possible to see in real time what are the features of the sound obtained from the FM synthesis. In this way it is possible to understand how to tune the parameters in order to achieve a specific sound quality.
The feature descriptors are four:

* Sharpness
* Harmonicity
* Percussivity
* Spectral Richness

Machine learning and feature extraction are involved in this task: [Meyda](https://meyda.js.org/) was used for this purpose.

### Spectrogram
IMMAGINE MODULO SPETTRO

Together with the features of the obtained sound, it's possible to visualize a real time spectrum as well. This is a further hint on how to tune the fm parameters longing for a certain sound.

## Architecture
The synth has 5 voices 


<p align="center">
  <img src="https://user-images.githubusercontent.com/57997005/93921057-52485e80-fd10-11ea-9b0a-afe248b4c8ad.png" width="90%"//>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/57997005/93921052-51173180-fd10-11ea-9ff9-eb3ed1ad3bd5.png" width="90%"//>
</p>





| ID | Val Min  | Val Max | Default | Function |
| :--- | :--- | :--- | :--- | :--- | 
| *envAmtA*   | 0 | 5 | 0.4 | Change the amouny of operator A |
| *envDelayA*   | 0 | 1.5 | 0 | Change the delay of operator A |
| *envAttackA*    | 0.03 | 0.8 | 1 | Change the attack of operator A |
| *envDecayA*    | 0.03 | 1 | 1 | Change the decay of operator A |
| *envSustainA*    | 0 | 1 | 0.2 | Change the sustain of operator A |
| *envReleaseA*    | 0.03 | 1.3 | 0.6 | Change the release of operator A |
| *ratioA*    | 0.5 | 12 | 1 | Change the ratio of operator A |
| *envAmtB*   | 0 | 5 | 0.4 | Change the amount of operator B |
| *envDelayB*   | 0 | 1.5 | 0 | Change the delay of operator B  |
| *envAttackB*    | 0.03 | 0.8 | 1 | Change the attack of operator B |
| *envDecayB*    | 0.03 | 1 | 1 | Change the decay of operator B |
| *envSustainB*    | 0 | 1 | 0.2 | Change the sustain of operator B |
| *envReleaseB*    | 0.03 | 1.3 | 0.6 | Change the release of operator B |
| *ratioB*    | 0.5 | 12 | 1 | Change the ratio of operator B |
| *envAmtC*   | 0 | 5 | 0.4 | Change the amount of operator C |
| *envDelayC*   | 0 | 1.5 | 0 | Change the delay of operator C |
| *envAttackC*    | 0.03 | 0.8 | 1 | Change the attack of operator C |
| *envDecayC*    | 0.03 | 1 | 1 | Change the decay of operator C |
| *envSustainC*    | 0 | 1 | 0.2 | Change the sustain of operator C |
| *envReleaseC*    | 0.03 | 1.3 | 0.6 | Change the release of operator C |
| *ratioC*    | 0.5 | 12 | 1 | Change the ratio of operator C |
| *envAmtD*   | 0 | 5 | 0.4 | Change the amount of operator D |
| *envDelayD*   | 0 | 1.5 | 0 | Change the delay of operator D |
| *envAttackD*    | 0.03 | 0.8 | 1 | Change the attack of operator D |
| *envDecayD*    | 0.03 | 1 | 1 | Change the decay of operator D |
| *envSustainD*    | 0 | 1 | 0.2 | Change the sustain of operator D |
| *envReleaseD*    | 0.03 | 1.3 | 0.6 | Change the release of operator D |
| *ratioD*    | 0.5 | 12 | 1 | Change the ratio of operator D |
| *outGain*   | 0 | 0.16 | 0.16 | Change the gain of the output |
| *envAttackOut*   | 0 | 0.8 | 0.01 | Change the attack of the output  |
| *envDecayOut*    | 0.03 | 1 | 0.6 | Change the decay of the output |
| *envSustainOut*    | 0 | 1 | 0.8 | Change the sustain of the output |
| *envReleaseOut*    | 0.03 | 1.3 | 0.1 | Change the release of the output |
