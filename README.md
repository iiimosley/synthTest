[![Synth ULX](https://raw.githubusercontent.com/iiimosley/synthULX/master/images/synthULX-alpha.png "SynthULX domain")](https://synthulx.firebaseapp.com/)

*SynthULX* is a web application designed for users of any musical background to overview basic concepts & functionalities of musical synthesis.

*SynthULX* provides a musical synthesizer that emulates modern synthesizer interfaces & is playable via QWERTY keyboard. Registered users can save, load, edit/overwrite, & delete patches that hold user-specified parameters for the synthesizer (full CRUD methodology). Synthesizer Components include:
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
  
###### * ADSR: Attack, Decay, Sustain, Release


*SynthULX* also provides a **SynthBuilder** feature. The **SynthBuilder** walks users through a step-by-step tutorial explaining each synthesizer component's functionality (with responsive visual diagrams to each component) and allows users to adjust parameters to their desired value. Once the tutorial is complete, the **SynthBuilder** loads the user-defined parameters to the web application synthesizer for key-event utilization.


## Technologies Utilized:
- [Tone.Js](https://tonejs.github.io/):   Web-Audio API framework
- [jQuery 3.2.1](https://jquery.com/):   Javascript Framework
- [Firebase 4.9.1](https://firebase.google.com/):   User Authentication, Database Storage/XHRs, Site Deployment 
- [Sass 3.5.4](http://sass-lang.com/):   CSS Compiling, Animations/Transitions, General Awesomeness 
- [Handlebars.Js 4.0.11](http://handlebarsjs.com/):   HTML Semantic Templating
- **HTML5 Canvas API**:  Input Responsive Diagrams



