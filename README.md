[![Synth ULX](https://raw.githubusercontent.com/iiimosley/synthULX/master/images/synthULX-alpha.png "open Synth ULX")](https://synthulx.firebaseapp.com/)

*SynthULX* is a web application designed for users of any musical background to overview basic concepts & functionalities of musical synthesis.

*SynthULX* provides a musical synthesizer that emulates modern synthesizer interfaces & is playable via QWERTY keyboard. Synthesizer Components/Features include:
  - Single Oscillator Selection:
    - Sine
    - Triangle
    - Square
    - Sawtooth
  - Amplitude Envelope Generator (full ADSR*)
  - Low Pass Filter
    - Filter Cutoff Frequency
    - Resonance
  - Filter Envelope Generator (full ADSR*)
  - 6-note polyphony (up to 6 notes simultaneously)
  - 18-note keyboard: 
    - initial settings from C4-F5 (all keys assigned to a specified keydown/up event)
    - transposable by +/-2 octaves
  
###### * ADSR: Attack, Decay, Sustain, Release

![Synth ULX Main](https://raw.githubusercontent.com/iiimosley/synthULX/master/images/synthULX-main.png "Synth ULX Main Page")

## Authenticated User Features

Registered users can save, load, edit/overwrite, & delete patches that hold user-specified parameters for the synthesizer.

![Synth ULX Patches](https://raw.githubusercontent.com/iiimosley/synthULX/master/images/synthULX-patches.png "Synth ULX patch menu")

## Integrative Learning

*SynthULX* also provides a **SynthBuilder** feature. The **SynthBuilder** walks users through a step-by-step tutorial explaining each synthesizer component's functionality (with responsive visual diagrams to each component) and allows users to adjust parameters to their desired value. Once the tutorial is complete, the **SynthBuilder** loads the user-defined parameters to the web application synthesizer for QWERTY keyboard performance.

![Synth ULX SynthBuilder](https://raw.githubusercontent.com/iiimosley/synthULX/master/images/synthULX-builder.png "Synth ULX Synth Builder")

## Technologies Utilized:
- [Tone.Js](https://tonejs.github.io/):   Web-Audio API framework
- [jQuery 3.2.1](https://jquery.com/):   Javascript Framework
- [Firebase 4.9.1](https://firebase.google.com/):   User Authentication, Database Storage/XHRs, Site Deployment 
- [Sass 3.5.4](http://sass-lang.com/):   CSS Compiling, Animations/Transitions, General Awesomeness 
- [Handlebars.Js 4.0.11](http://handlebarsjs.com/):   HTML Semantic Templating
- **HTML5 Canvas API**:  Input Responsive Diagrams

### Run Locally:
If `http-server` is not installed globaly, [please install](https://www.npmjs.com/package/http-server)

Then, in your terminal, run the following commands:
```
$ git clone https://github.com/iiimosley/synthULX.git && cd $_
$ npm install
$ http-server
$ grunt
```

You will need to create your own [Firebase](https://firebase.google.com/) project and set your credentials by... 

Creating this javascript file:
```
$ touch javascripts/config/fb-creds.js
```
Paste the following into the file with your Firebase credentials
(found on the Project Overview page of your Firebase Project):
```javascript
'use strict';

module.exports = {
    apiKey: "//your api key//",
    authDomain: "//your domain name//"
};
```

Direct your browser to <http://localhost:8080> to view project.
Refresh page whenever changes have been made.
