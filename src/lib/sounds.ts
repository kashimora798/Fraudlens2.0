"use client";

/**
 * Sound effects for immersive simulation
 * Uses Web Audio API for lightweight, no-dependency audio
 */

const AUDIO_CTX: { ctx: AudioContext | null } = { ctx: null };

function getCtx(): AudioContext {
  if (!AUDIO_CTX.ctx) {
    AUDIO_CTX.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return AUDIO_CTX.ctx;
}

function createOscillator(
  type: OscillatorType = "sine",
  frequency: number,
  duration: number,
  gain: number = 0.1,
): void {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = frequency;
  gainNode.gain.value = gain;
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/**
 * WhatsApp message received tone (two beeps)
 */
export function playMessageReceived(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  
  // First beep (high)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.type = "sine";
  osc1.frequency.value = 1800;
  gain1.gain.value = 0.08;
  osc1.start();
  
  // Second beep (lower)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = "sine";
  osc2.frequency.value = 1200;
  gain2.gain.value = 0.08;
  
  const now = ctx.currentTime;
  osc1.stop(now + 0.08);
  gain1.gain.setValueAtTime(0.08, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc2.start(now + 0.1);
  osc2.stop(now + 0.18);
  gain2.gain.setValueAtTime(0.08, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
}

/**
 * WhatsApp message sent tone (single beep)
 */
export function playMessageSent(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = 1000;
  gain.gain.value = 0.06;
  const now = ctx.currentTime;
  osc.start(now);
  osc.stop(now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
}

/**
 * iPhone ringtone (Marimba-like)
 */
export function playRingtone(): { stop: () => void } {
  if (typeof window === "undefined") return { stop: () => {} };
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  const notes = [
    { freq: 1318.51, time: 0 },   // E6
    { freq: 1567.98, time: 0.15 }, // G6
    { freq: 1975.53, time: 0.3 },  // B6
    { freq: 2637.02, time: 0.45 }, // E7
    { freq: 1318.51, time: 0.6 },   // E6
    { freq: 1567.98, time: 0.75 }, // G6
    { freq: 1975.53, time: 0.9 },  // B6
    { freq: 2637.02, time: 1.05 }, // E7
  ];
  
  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  
  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = n.freq;
    gain.gain.value = 0.05;
    osc.start(now + n.time);
    osc.stop(now + n.time + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + 0.12);
    oscillators.push(osc);
    gains.push(gain);
  });
  
  // Repeat the pattern
  const interval = setInterval(() => {
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = n.freq;
      gain.gain.value = 0.05;
      const loopStart = now + (Date.now() - (now * 1000)) / 1000;
      osc.start(loopStart + n.time);
      osc.stop(loopStart + n.time + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, loopStart + n.time + 0.12);
      oscillators.push(osc);
      gains.push(gain);
    });
  }, 1200);
  
  return {
    stop: () => {
      clearInterval(interval);
      oscillators.forEach((o) => {
        try { o.stop(); o.disconnect(); } catch {}
      });
      gains.forEach((g) => {
        try { g.disconnect(); } catch {}
      });
    }
  };
}

/**
 * Call connected beep
 */
export function playCallConnected(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = 440;
  gain.gain.value = 0.08;
  osc.start(now);
  osc.stop(now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
}

/**
 * Call ended tone
 */
export function playCallEnded(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Descending tone
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = 600;
  gain.gain.value = 0.06;
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
  osc.start(now);
  osc.stop(now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
}

/**
 * Scam caught victory sound
 */
export function playVictory(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Ascending victory arpeggio
  const notes = [440, 550, 660, 880]; // A4, C#5, E5, A5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
  });
}

/**
 * Scam failed / got caught sound
 */
export function playFail(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Descending sad sound
  const notes = [440, 330, 220, 110]; // A4, E4, A3, A2
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.04;
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
  });
}

/**
 * XP gained sound
 */
export function playXPEarned(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Sparkle sound (multiple high frequencies)
  [2000, 2500, 3000, 3500].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.03;
    osc.start(now + i * 0.03);
    osc.stop(now + i * 0.03 + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.15);
  });
}

/**
 * Instagram notification sound
 */
export function playIGNotification(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Instagram "like" sound - metallic ping
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = 3500;
  gain.gain.value = 0.05;
  osc.start(now);
  osc.stop(now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  // Add a bit of noise for metallic feel
  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }
  noise.buffer = noiseBuffer;
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseGain.gain.value = 0.01;
  noise.start(now);
  noise.stop(now + 0.08);
}

/**
 * SMS notification sound
 */
export function playSMSNotification(): void {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  
  // Classic SMS beep-beep
  [1000, 1500].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.08);
  });
}

/**
 * Stop all sounds
 */
export function stopAllSounds(): void {
  if (AUDIO_CTX.ctx) {
    try {
      AUDIO_CTX.ctx.close();
      AUDIO_CTX.ctx = null;
    } catch {}
  }
}
