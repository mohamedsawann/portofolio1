let audioContext: AudioContext | null = null;
let muted = false;

const MUTE_STORAGE_KEY = "psp-ui-sounds-muted";

/** Call once on startup — restores mute from localStorage. */
export function initSoundPreference() {
  if (typeof window === "undefined") return;
  try {
    muted = localStorage.getItem(MUTE_STORAGE_KEY) === "1";
  } catch {
    muted = false;
  }
}

export function isSoundMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
}

export function persistSoundMuted(next: boolean) {
  setMuted(next);
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, next ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function ensureContext() {
  if (muted) return null;
  if (audioContext) return audioContext;

  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  audioContext = new Ctx();
  return audioContext;
}

function now() {
  return audioContext?.currentTime ?? 0;
}

type BeepOptions = {
  frequency?: number;
  durationMs?: number;
  type?: OscillatorType;
  volume?: number; // 0..1
  detune?: number;
};

function playBeep(opts: BeepOptions) {
  if (muted) return;
  const ctx = ensureContext();
  if (!ctx) return;

  // Some browsers require resume() after a user gesture.
  void ctx.resume?.();

  const o = ctx.createOscillator();
  const g = ctx.createGain();

  const frequency = opts.frequency ?? 880;
  const durationMs = opts.durationMs ?? 45;
  const volume = opts.volume ?? 0.06;
  const type = opts.type ?? "square";
  const detune = opts.detune ?? 0;

  o.type = type;
  o.frequency.setValueAtTime(frequency, now());
  if (detune) o.detune.setValueAtTime(detune, now());

  const start = now();
  const end = start + durationMs / 1000;

  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, end);

  o.connect(g);
  g.connect(ctx.destination);

  o.start(start);
  o.stop(end + 0.02);
}

export function playDpadTick() {
  playBeep({ frequency: 520, durationMs: 32, type: "square", volume: 0.045 });
}

export function playConfirm() {
  playBeep({ frequency: 880, durationMs: 55, type: "triangle", volume: 0.055 });
}

export function playBack() {
  // Slightly lower + shorter like a cancel.
  playBeep({ frequency: 440, durationMs: 45, type: "square", volume: 0.045 });
}

export function playPowerOn() {
  playBeep({ frequency: 392, durationMs: 60, type: "triangle", volume: 0.05 });
  // Small second ping using a detuned third for “boot” feel.
  window.setTimeout(() => {
    playBeep({ frequency: 523, durationMs: 45, type: "triangle", volume: 0.045 });
  }, 70);
}

export function playPowerOff() {
  playBeep({ frequency: 523, durationMs: 60, type: "triangle", volume: 0.05 });
  window.setTimeout(() => {
    playBeep({ frequency: 261.6, durationMs: 55, type: "triangle", volume: 0.04 });
  }, 70);
}

export function playSkip() {
  playBeep({ frequency: 660, durationMs: 35, type: "square", volume: 0.045 });
}

