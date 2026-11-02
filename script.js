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

const aMinorChord = ["A3", "C4", "E4"];
const A = "A1";
const B = "E3";
const C = "A3";

const rythmPattern = [A, B, C, A, B, C, A, B, C, A, B, C, A, B, C, A, B, C]; // Can I do the repetition in another way.

// ---------- State ----------
// State variables are the parts of your program that change over time.

let volcircle;
let volcircleSize = 100;
let inside = false;
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let speeds = [];

let isSynthPlaying = false;
let octave = 5;

// ---------- Sound ----------
// Instruments plugged into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const synth1 = new Tone.Synth().toDestination();
const drums = new Tone.MembraneSynth().toDestination();

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds

  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total += speeds[i];
  }

  let averageSpeed = speeds.length > 0 ? total / speeds.length : 0;

  if (averageSpeed > 0.05) {
    volcircleSize += averageSpeed * 25;
  } else {
    volcircleSize -= 8;
  }

  volcircleSize = Math.max(60, Math.min(400, volcircleSize));
}

// ---------- Use ----------
// This is called every 100ms.

function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds

  if (volcircle && inside) {
    volcircle.setSize(volcircleSize);   // Volume based on size.

    let percentage = (volcircleSize - 60) / (400 - 60); // 400-60
    let volume = -30 + percentage * 30;

    synth.volume.rampTo(volume, 0.05);
  }
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
  }
}

function stopNote(event) {
  if (noteFor(event.key) !== "") {
    synth1.triggerRelease();
  }
}

// EFFECTS ....................

function startDetune(event) {
  console.log("pointer starts detune");
}

function playRythmPattern() {
  let now = Tone.now();
  for (let i = 0; i < rythmPattern.length; i++) {
    drums.triggerAttackRelease(rythmPattern[i], "8n", now + i * 0.4);
  }
}

function playAMinorChord() {
  synth.triggerAttackRelease(aMinorChord);
}

// POINTER ....................

function pointerEnter(event) {
  if (volcircle) {
    inside = true;

    if (!isSynthPlaying) {
      synth.volume.value = -30;
      synth.triggerAttack(aMinorChord);
      isSynthPlaying = true;
    }

    volcircle.setColour(600, 180, 50);

    // Calculates where the pointer is, and how fast it moves.
    lastX = event.clientX / window.innerWidth;
    lastY = event.clientY / window.innerHeight;
    lastTime = Date.now();
  }
}

function pointerLeave() {
  inside = false;

  if (isSynthPlaying) {
    synth.triggerRelease(aMinorChord);
    isSynthPlaying = false;
  }

  if (volcircle) {
    volcircle.setColour(600, 180, 70);
  }
}

function pointerMoveVolcircle(event) {
  if (!inside) {
    return; // only while on the shape
  }
  let normX = event.clientX / window.innerWidth;
  let normY = event.clientY / window.innerHeight;
  let now = Date.now();
  let distance = Math.hypot(normX - lastX, normY - lastY);
  let seconds = (now - lastTime) / 1000;
  if (seconds === 0) {
    return; // two events in the same millisecond: no time has passed, so no speed
  }
  let speed = distance / seconds; // screens per second
  lastX = normX; // saves current position
  lastY = normY;
  lastTime = now;

  speeds.push(speed);
  setTimeout(forgetOldest, 300);
  useAverage();
}

function pointerMoveSquare(event) {
  let normX = event.clientX / window.innerWidth;
  let normY = event.clientY / window.innerHeight;

  console.log(normX, normY);
  synth1.detune.value = -1200 + normX * 2400;
}

function forgetOldest() {
  speeds.shift();
  useAverage();
}

function useAverage() { // Avarage speed of array.
  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total = total + speeds[i];
  }
  let average = 0;
  if (speeds.length > 0) {
    average = total / speeds.length;
  }

  let volume = -30 + average * 10;
  if (volume > 0) {
    volume = 0;
  }

  synth.volume.value = volume;
}

function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  if (event === square) {
    startDetune();
  } else if (event === circle) {
    playRythmPattern();
  }
}

function pointerUp(event) {
  synth1.triggerRelease();
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  volcircle = createShape("volcircle");
  volcircle.setSize(100);
  volcircle.setColour(600, 180, 70);
  volcircle.setPosition(0.4, 0.15); // 400 300

  const square = createShape("square");
  square.setPosition(0.02, 0.55);
  square.setSize(200);
  square.setColour(600, 160, 20);
  square.setRoundedness(0.2);

  const circle = createShape("circle");
  circle.setPosition(0.02, 0.06);
  circle.setSize(200);
  circle.setColour(600, 110, 80);

  window.addEventListener("pointerup", pointerUp);
  document.addEventListener("keydown", startNote);
  document.addEventListener("keyup", stopNote);

  square.element.addEventListener("pointermove", pointerMoveSquare);
  square.element.addEventListener("pointerleave", pointerUp);
  square.element.addEventListener("pointerdown", startDetune);

  circle.element.addEventListener("pointerdown", playRythmPattern);

  volcircle.element.addEventListener("pointerenter", pointerEnter);
  volcircle.element.addEventListener("pointerleave", pointerLeave);
  volcircle.element.addEventListener("pointermove", pointerMoveVolcircle);
  volcircle.element.addEventListener("pointerdown", playAMinorChord);
}
setup(); // Always remember to call setup()!
