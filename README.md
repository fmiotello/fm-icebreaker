# FM Icebreaker
###### A polyphonic FM synth web application inspired by Elektron Digitone and Yamaha DX7

<p align="center">
  <img src="https://user-images.githubusercontent.com/17434626/94362856-69939d00-00be-11eb-921b-901e2dbe6b2d.png" width="85%"//>
</p>

#### Demo
Video demo

## What is FM Synthesis
*Frequency Modulation Synthesis* (or *FM Synthesis*) is a form of non linear sound synthesis which encompasses an entire family of techniques in which the instantaneous frequency of a carrier signal is itself a modulating signal that varies at audio rate. 
This type of synthesis can be used to obtain an extremely wide range of different sounds with a small number of parameters, since the non-linearity allows to largely enrich the input signal's spectrum.

For the implementation of this synth the FM is intended in terms of *Phase Modulation Synthesis* in which the modulated singnal is not the frequency, but the phase. *Phase Modulation* and *Frequency Modulation* are similar, but in Phase Modulation the frequency of the carrier signal is not increased.
Both carrier and modulator are called operators and there can be more than two of them.

The expression of a modulated signal is :

<a href="https://www.codecogs.com/eqnedit.php?latex=e&space;=&space;A&space;sin&space;(\alpha&space;t&space;&plus;&space;I&space;\sin{\beta&space;t})" target="_blank"><img src="https://latex.codecogs.com/gif.latex?e&space;=&space;A&space;sin&space;(\alpha&space;t&space;&plus;&space;I&space;\sin{\beta&space;t})" title="e = A sin (\alpha t + I \sin{\beta t})" /></a>

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

It is possible to control the synth using a Midi keyboard connected to your computer. You can expand the sound control capabilities using the *pitch-wheel*.

In addition to this it's also possible to control the synth by using the computer's keyboard which is mapped in the following way:
<p align="center">
  <img src="https://user-images.githubusercontent.com/57997005/94257744-17bb0d80-ff2c-11ea-8c27-f224885c5dc8.png" width="90%"//>
</p>



### Operators B/C/D

<p>
  <img src="https://user-images.githubusercontent.com/17434626/94364357-efb4e100-00c8-11eb-922d-8f1ded9e656c.png" width="35%"//>
</p>

Operators are the core of an FM synth. An envelope can be connected to each operator in order to modify the modulation index *I* and thus alter the spectrum.
Their parameters can be changed from this module:

* AMT: Changes the modulation amount of the operator
* DLY: Changes the delay of moudlation envelope of the operator
* ATK: Changes the attack of the modulation envelope of the operator
* DEC: Changes the decay of the modulation envelope of the operator
* SUS: Changes the sustain of the modulation envelope of the operator
* REL: Changes the release of the modulation envelope of the operator
* RTO: Changes the ratio of the frequency of the operator with respect to the fundamental

### Operator A - Outenv

<p>
  <img src="https://user-images.githubusercontent.com/17434626/94364364-fe02fd00-00c8-11eb-8f21-d9c90f57e47f.png" width="35%"//>
</p>

* RTO: Changes the ratio of the frequency of the operator A with respect to the fundamental
* ATK: Changes the attack of the output envelope
* DEC: Changes the decay of the output envelope
* SUS: Changes the sustain of the output envelope
* REL: Changes the release of the output envelope
* DET: Changes the frequency deviation of all the operators
* MIX: Changes the crossfade mix between channels X and Y

### Global - FX

<p>
  <img src="https://user-images.githubusercontent.com/17434626/94364372-0d824600-00c9-11eb-8c0d-463d8cfd1ac6.png" width="35%"//>
</p>

It's possible to change some global parameters and add *reverb* and *delay* to the obtained sound:
* GLD: Changes the glide time
* TIM: Changes the delay time
* FBK: Changes the delay feedback
* DLY: Changes the delay send
* SIZ: Changes the reverb size
* REV: Changes the reverb send
* VOL: Changes the output volume

### Config

<p>
  <img src="https://user-images.githubusercontent.com/17434626/94364379-196e0800-00c9-11eb-8995-57815d78dd42.png" width="35%"//>
</p>

The synth allows you to save the sound you have achieved as a preset and reload it whenever you want:
1) To save the preset click on *save preset* after having specified its name: this locally downloads a file with the values of the parameters
2) To load one of your presets click on *load preset* and choose between the ones you saved locally

From the drop down menu of this module you can choose among the conneced Midi devices to control the synth.

### Algorithms
<p>
  <img src="https://user-images.githubusercontent.com/17434626/94364426-5df9a380-00c9-11eb-862d-fd21ee6e0dcc.png" width="35%"//>
</p>

The way the operators are arranged is called the *algorithm* and it defines, together with the parameters' values, the type of sound generated.
There are eight algorithms available for this synth:

![Algorithms_new](https://user-images.githubusercontent.com/57997005/91165597-36ca4380-e6d1-11ea-8e99-bf1ce79b3cd6.jpeg)

The solid lines represent the modulations between the operators (feedback is allowed too), while the dotted ones represent the output signal path.

### Sound Features
<p>
  <img src="https://user-images.githubusercontent.com/17434626/94364402-37d40380-00c9-11eb-9a26-8b75befefc66.png" width="35%"//>
</p>

From the graph above it's possible to see in real time what are the attributes of the sound obtained from the FM synthesis. In this way it is possible to understand how to tune the parameters in order to achieve a specific sound quality.
FM synthesis in fact is as powerful as difficult to master: being able to obtain a very high variety of sounds with such a low number of parameters, it is often hard to predict the output's timbre. This module of the synth is ment to simplify this process.

To achive this goal audio features analysis is involved: an audio feature is a measurement of a particular characteristic of an audio signal, and it gives insight into what the signal contains. Audio features can be measured by running an algorithm on an audio signal that will return a number, or a set of numbers that quantify the characteristic that the specific algorithm is intended to measure.

Before exctracting the features, the audio needs to be windowed and divided into frames of the same lenght using a *hanning* window. Then a 512 samples long FFT is performed for each frame and the descriptors are extracted through a specific algorithm.
The feature descriptors are three:
 (dire se sono time o frequency domain feature)
 
**Noisiness** <br>

**Harmonicity** (Frequency domain feature) <br>
It is the description
The descriptor used to get this audio feature is the *Harmonic Spectral Deviation* which computes the
deviation of the amplitude harmonic peaks from a global spectral envelope.

<p align="center">
<a href="https://www.codecogs.com/eqnedit.php?latex=HDEV&space;=&space;\frac{1}{H}&space;\sum_h(a(h)-SE(h))" target="_blank"><img src="https://latex.codecogs.com/gif.latex?HDEV&space;=&space;\frac{1}{H}&space;\sum_h(a(h)-SE(h))" title="HDEV = \frac{1}{H} \sum_h(a(h)-SE(h))" /></a>
 </p>

* *H* is the total number of considered harmonics
* *a(h)* is the amplitude of the *h*<sup>*th*</sup> harmonic
* *SE(h)* is the amplitude of the spectral envelope evaluated at the frequency *f(h)*

**Spectral Richness** (Frequency domain feature) <br>
The descriptor used to get this audio feature is the *Perceptual Spread* which computes the spread of some specific loudness coefficients over the bark scale.



[Meyda](https://meyda.js.org/), which implements a selection of standardized audio features, was used for this purpose.

### Spectrogram
<p>
  <img src="https://user-images.githubusercontent.com/17434626/94364409-4ae6d380-00c9-11eb-8f21-81c5f78c3bd6.png" width="35%"//>
</p>

Together with the features of the obtained sound, it's possible to visualize a real time spectrum as well. This is a further hint on how to tune the FM parameters longing for a certain sound.
It is obtained by performing a 512 samples long FFT over the frames exctracted using an *hanning* window.

## Architecture

The structure of the synth can be described by the following block diagram:

<p align="center">
  <img src="https://user-images.githubusercontent.com/57997005/94343748-a3ab6300-001a-11eb-9397-099439993367.png" width="80%"//>
</p>

The audio engine is made of the operators arranged accordingly to the chosen algorithm. Then they are summed and their amplitude is controlled by a single output envelope. At this point the signal is forked to two effect busses (*delay* and *reverb*) which are finally summed to the main one to obtain the output.

The audio engine has a polyphony of 5 voices, each one of them has a particular structure based on the chosen algorithm. The following one refers to the first algorithm: 
  
<p align="center">
  <img src="https://user-images.githubusercontent.com/57997005/94344025-9c855480-001c-11eb-8344-f24b27c34ed5.png" width="80%"//>
</p>

## Implementation details

This application was developed using Javscript: Web Audio APIs and Web Midi APIs are at its core. For the sake of efficiency it was decided not to use the standard *AudioNode* class to implement the operators, since this would have resulted in an unefficient computation. We instead built a custom module using the provided *AudioWorklet* interface. In particular an operator is built using an *AudioWorkletNode* and all the processing is carried out by the *AudioWorkletProcessor*. This solution allows the script to be exectuted in a separate audio thread to provide very low latency audio processing. Moreover, to reduce the latency and the complexity even lower, the *sin* function computation, used to produce the audio signals, was implemented using a lookup table.

parte envelope

parte organizzazione codice (matt?)

## Parameters Range

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
