/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4"; // the note played when the pointer goes down
const aMinorChord = ["A3", "C4", "E4"];
const A = "A1";
const B = "E3";
const C = "A3";

const rythmPattern = [A, B, C, A, B, C, A, B, C, A, B, C]; // Can I do the repetition in another way.
// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
const shape = createShape("shape");
shape.setPosition(0.5, 0.5); // This should maybe be in Setup

const circle = createShape("cicle");
circle.setPosition(0.3, 0.3);

let octave = 4;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

const synth1 = new Tone.Synth().toDestination(); //This is going to be changed to flute

const drums = new Tone.MembraneSynth().toDestination();
// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.

// KEYBOARD ---------------

function noteFor(key) {
  //Rename to keydown?
  if (key === "q") {
    return "A" + octave;
  } else if (key === "w") {
    return "B" + octave;
  } else if (key === "e") {
    return "C" + octave;
  } else if (key === "r") {
    return "D" + octave;
  } else if (key === "t") {
    return "E" + octave;
  } else if (key === "y") {
    return "F" + octave;
  } else if (key === "u") {
    return "G" + octave;
  } else if (key === "i") {
    playAMinorChord(); //Why does it double play? How do I change that?
  }
  return "";
}

function startNote(event) {
  Tone.start();
  if (event.repeat) {
    return;
  }

  const note = noteFor(event.key);

  if (note !== "") {
    synth1.triggerAttack(note);
  } else if (note !== "") {
    //Test för chord
    synth.triggerAttack(note);
  }
}

function playAMinorChord() {
  synth.triggerAttackRelease(aMinorChord); //måste få den att stoppa
}

function pointerEnter(event) {
  if(event.target === shape) {
    startDetune();
  } else if(event.target === circle) {
    playRythmPattern();
  }
}
 /*function pointerEnter(event) {
  //pointerenter är = shape? Let currentshape..
  // inside = true;
  /*if (pointerEnter === shape) {
    startDetune();
  }


  /*else if (createShape = false) {
    return;
  }
 } */

/*function pointerleave(event) {
  inside = false;
  synth.triggerRelease();
} */

function startDetune(key) {
  pointerMove /*= key === "z" */ && pointerEnter; //z is still not working but detune kinda do.
  /* if(pointerDown && shape) {     //Look in physical notes 26-10, page 10.
    startNote();
    console.log(normX, normY);
    synth1.detune.value = -1200 + normX * 2400;
  } else

  if(!(pointerDown && shape)) {
    return;  //return false?
  } */
}


function stopNote(event) {
  //Doubble check the logic of this one.
  if (noteFor(event.key) !== "") {
    synth1.triggerRelease();
    synth.triggerRelease();
  }
}

function pointerMove(event) {
  //if (pointerEnter && shape) {norm ect ect} This is basically useless..
  let normX = event.clientX / window.innerWidth;
  let normY = event.clientY / window.innerHeight;

  console.log(normX, normY);
  synth1.detune.value = -1200 + normX * 2400; //-1200 + normX * 2400;

  /* if(pointerDown && shape) {
    startNote();
    console.log(normX, normY);
    synth1.detune.value = -1200 + normX * 2400;
  } else

  if(!(pointerDown && shape)) {
    return;  //return false?
  } */
}

// Take in this function again it is Davids.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttackRelease(note, "8n"); // play the note for an eighth note
}

function pointerUp(event) {
  synth1.triggerRelease();
}

function playRythmPattern() {
  let now = Tone.now();
  for (let i = 0; i < rythmPattern.length; i++) {
    drums.triggerAttackRelease(rythmPattern[i], "8n", now + i * 0.4);
  }
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  /*const example = createShape("example");
  example.setPosition(0.5, 0.5); */

  // Put your event listener code here
  // window.addEventListener("pointerdown", pointerDown);  // commented out to try the shape.e.
  shape.element.addEventListener("pointermove", pointerMove); //This was window before.
  //window.addEventListener("pointerup", pointerUp)
  document.addEventListener("keydown", startNote); //Shape?
  document.addEventListener("keyup", stopNote);
  // document.addEventListener("keydown", startDetune);

  shape.element.addEventListener("pointerdown", pointerDown);
  shape.element.addEventListener("pointerup", pointerUp);
  shape.element.addEventListener("pointerenter", pointerEnter);
  shape.element.addEventListener("pointerleave", pointerUp);

  
  circle.element.addEventListener("pointerdown", pointerDown);
  circle.element.addEventListener("pointerup", pointerUp);
  circle.element.addEventListener("pointerenter", pointerEnter);
  circle.element.addEventListener("pointerleave", pointerUp);

  //Test
 circle.element.addEventListener("pointerdown", playRythmPattern);
 shape.element.addEventListener("pointerenter", startDetune);

  // shape.element.addEventListener("pointerleave", pointerleave);
}

setup(); // Always remember to call setup()!
