"use client";

/**
 * A tiny singleton UI-sound engine. Short Web-Audio blips for hover / click /
 * select / success / error. Any event handler can call `sfx.play("click")`
 * without wiring an AudioContext through props. Silent until `setEnabled(true)`
 * (driven by the radio power button — sound is off by default).
 */

type SfxName = "hover" | "click" | "select" | "success" | "error" | "toggle";

const RECIPES: Record<SfxName, { freq: number; type: OscillatorType; dur: number; gain: number; slideTo?: number }> = {
  hover: { freq: 880, type: "sine", dur: 0.05, gain: 0.05 },
  click: { freq: 520, type: "square", dur: 0.06, gain: 0.06, slideTo: 360 },
  select: { freq: 660, type: "triangle", dur: 0.08, gain: 0.07, slideTo: 990 },
  success: { freq: 523, type: "sine", dur: 0.18, gain: 0.08, slideTo: 1046 },
  error: { freq: 200, type: "sawtooth", dur: 0.16, gain: 0.07, slideTo: 120 },
  toggle: { freq: 440, type: "square", dur: 0.05, gain: 0.05, slideTo: 620 },
};

class Sfx {
  private ctx: AudioContext | null = null;
  private enabled = false;

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on && !this.ctx && typeof window !== "undefined") {
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
  }

  play(name: SfxName) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const r = RECIPES[name];
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = r.type;
    osc.frequency.setValueAtTime(r.freq, t);
    if (r.slideTo) osc.frequency.exponentialRampToValueAtTime(r.slideTo, t + r.dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(r.gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + r.dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + r.dur + 0.02);
  }
}

export const sfx = new Sfx();
