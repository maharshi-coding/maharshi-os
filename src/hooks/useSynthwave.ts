"use client";

import { useEffect, useRef } from "react";

/**
 * useSynthwave — a self-contained synthwave generator built on the Web Audio
 * API. No audio files: bass, arpeggio, pad and a soft drum groove are all
 * synthesised in the browser (zero licensing, works offline). A looping
 * i–VI–III–VII progression in A minor gives the classic Vice City drive feel.
 *
 * The AudioContext is created lazily on the first `enabled` gesture, so it
 * never violates browser autoplay policies.
 */

// MIDI note → frequency.
const f = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// Four-bar progression (root MIDI) with a chord shape each: Am, F, C, G.
const PROG = [
  { root: 57, chord: [57, 60, 64] }, // Am
  { root: 53, chord: [53, 57, 60] }, // F
  { root: 60, chord: [60, 64, 67] }, // C
  { root: 55, chord: [55, 59, 62] }, // G
];

interface SynthEngine {
  analyser: AnalyserNode;
  stop: () => void;
  setBpm: (bpm: number) => void;
}

export function useSynthwave(enabled: boolean, bpm: number) {
  const engineRef = useRef<SynthEngine | null>(null);
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  // Expose a light "levels" reader for the radio waveform.
  const barsRef = useRef<(count: number) => number[]>(() => []);

  useEffect(() => {
    if (!enabled) return;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.2);

    const comp = ctx.createDynamicsCompressor();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    master.connect(comp);
    comp.connect(analyser);
    analyser.connect(ctx.destination);

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    barsRef.current = (count: number) => {
      analyser.getByteFrequencyData(freqData);
      const out: number[] = [];
      const stepSize = Math.max(1, Math.floor(freqData.length / count));
      for (let i = 0; i < count; i++) {
        out.push((freqData[i * stepSize] ?? 0) / 255);
      }
      return out;
    };

    // ── Voice helpers ──────────────────────────────────────────────
    const note = (
      freq: number,
      start: number,
      dur: number,
      type: OscillatorType,
      gain: number,
      cutoff = 4000
    ) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = cutoff;
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(gain, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(filt);
      filt.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    };

    const pad = (freqs: number[], start: number, dur: number) => {
      freqs.forEach((fr) => {
        [fr, fr * 1.005].forEach((d) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.value = d;
          g.gain.setValueAtTime(0.0001, start);
          g.gain.exponentialRampToValueAtTime(0.06, start + 0.6);
          g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
          const filt = ctx.createBiquadFilter();
          filt.type = "lowpass";
          filt.frequency.value = 1400;
          osc.connect(filt);
          filt.connect(g);
          g.connect(master);
          osc.start(start);
          osc.stop(start + dur + 0.1);
        });
      });
    };

    const kick = (start: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(140, start);
      osc.frequency.exponentialRampToValueAtTime(45, start + 0.12);
      g.gain.setValueAtTime(0.7, start);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      osc.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(start + 0.24);
    };

    const hat = (start: number) => {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filt = ctx.createBiquadFilter();
      filt.type = "highpass";
      filt.frequency.value = 7000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.12, start);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.04);
      src.connect(filt);
      filt.connect(g);
      g.connect(master);
      src.start(start);
      src.stop(start + 0.05);
    };

    // ── Scheduler ──────────────────────────────────────────────────
    let step = 0; // 16th steps within a bar (0–15)
    let bar = 0;
    let nextTime = ctx.currentTime + 0.1;

    const scheduleStep = (s: number, b: number, t: number) => {
      const spb = 60 / bpmRef.current; // seconds per beat
      const sixteenth = spb / 4;
      const cell = PROG[b % PROG.length];

      // Bass on beats.
      if (s % 4 === 0) note(f(cell.root - 12), t, sixteenth * 3.6, "sawtooth", 0.28, 900);
      // Pad at bar start.
      if (s === 0) pad(cell.chord.map((n) => f(n)), t, spb * 3.6);
      // Arpeggio on 8ths.
      if (s % 2 === 0) {
        const arpNote = cell.chord[(s / 2) % cell.chord.length] + 12;
        note(f(arpNote), t, sixteenth * 1.6, "triangle", 0.14, 3200);
      }
      // Drums.
      if (s === 0 || s === 8) kick(t);
      if (s % 2 === 0) hat(t);
    };

    const loop = () => {
      if (stopped) return;
      const ahead = ctx.currentTime + 0.15;
      while (nextTime < ahead) {
        scheduleStep(step, bar, nextTime);
        const sixteenth = 60 / bpmRef.current / 4;
        nextTime += sixteenth;
        step += 1;
        if (step >= 16) {
          step = 0;
          bar += 1;
        }
      }
      timer = setTimeout(loop, 25);
    };

    const start = async () => {
      try {
        await ctx.resume();
      } catch {}
      loop();
    };
    start();

    engineRef.current = {
      analyser,
      setBpm: (b) => (bpmRef.current = b),
      stop: () => {},
    };

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      try {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      } catch {}
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 600);
      engineRef.current = null;
      barsRef.current = () => [];
    };
  }, [enabled]);

  return barsRef;
}
