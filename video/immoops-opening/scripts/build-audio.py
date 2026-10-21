"""Synthesizes the ImmoOps opening soundtrack (original, license-free) to assets/soundtrack.wav.

100 BPM, one bar = 2.4 s. Scene cuts in index.html sit on bar lines:
  S1 0.0  S2 4.8  S3 9.6 (logo impact)  S4 14.4  S5 24.0  S6 28.8  S7 33.6  end 38.4
Run: python scripts/build-audio.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 38.4
N = int(SR * DUR)
BEAT = 0.6
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def buf():
    return np.zeros((2, N))


def place(dst, sig, t0, gain=1.0, pan=0.0):
    """Mix mono or stereo `sig` into dst at time t0 (s)."""
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.vstack([sig * l * 1.414, sig * r * 1.414])
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    if i0 < 0:
        sig = sig[:, -i0:]
        i0 = 0
    n = min(sig.shape[1], N - i0)
    dst[:, i0:i0 + n] += sig[:, :n] * gain


def fft_filter(x, lo=None, hi=None):
    """Zero-phase brickwall-ish band filter with soft edges (mono)."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    m = np.ones_like(f)
    if hi:
        m *= 1 / (1 + (f / hi) ** 4)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * m, n)


def env_adsr(n, a, r, sus=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    rel_start = n / SR - r
    e *= np.where(t > rel_start, np.clip(1 - (t - rel_start) / r, 0, 1), 1.0)
    return e * sus


# ---------------------------------------------------------------- chords
D, F, A, C, E, G, Bb = 62, 65, 69, 60, 64, 67, 58
CHORDS = [  # (start, end, notes, brightness Hz)
    (0.0, 4.8, [50, 57, 64, 65], 900),            # Dm(add9), night
    (4.8, 9.6, [46, 53, 57, 62], 1200),           # Bbmaj7
    (9.6, 14.4, [41, 48, 57, 60, 67, 72], 3200),  # Fadd9 — reveal lift
    (14.4, 16.8, [50, 57, 60, 64, 65], 2600),     # Dm9
    (16.8, 19.2, [46, 53, 57, 62, 64], 2600),     # Bbmaj7(9)
    (19.2, 21.6, [41, 48, 57, 60, 67], 2800),     # Fadd9
    (21.6, 24.0, [48, 55, 64, 67, 69], 2800),     # C6
    (24.0, 26.4, [50, 57, 60, 64, 65], 3000),     # Dm9
    (26.4, 28.8, [46, 53, 57, 62, 64], 3000),     # Bbmaj9
    (28.8, 31.2, [41, 48, 57, 60, 67], 3200),     # Fadd9
    (31.2, 33.6, [48, 55, 64, 67, 74], 3200),     # C add9
    (33.6, 36.0, [46, 53, 57, 62, 69], 3000),     # Bbmaj9
    (36.0, 38.4, [41, 48, 57, 60, 67, 72], 2600), # F — home
]


def pad_note(f, dur, bright):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros((2, n))
    for vi, (cents, pan) in enumerate([(-7, -0.6), (0, 0.0), (7, 0.6)]):
        fv = f * 2 ** (cents / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        s = np.zeros(n)
        k = 1
        while k * fv < min(bright * 2.5, 9000) and k <= 18:
            w = (1 / k) / (1 + (k * fv / bright) ** 2)
            s += w * np.sin(2 * np.pi * k * fv * t + ph * k)
            k += 1
        lfo = 1 + 0.12 * np.sin(2 * np.pi * (0.18 + vi * 0.05) * t + vi)
        s *= lfo
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        out[0] += s * l
        out[1] += s * r
    return out


pad = buf()
bass = buf()
for (t0, t1, notes, bright) in CHORDS:
    rel = 1.4 if t1 < DUR else 0.01
    dur = (t1 - t0) + rel
    if t1 >= DUR:
        dur = DUR - t0
    e = env_adsr(int(dur * SR), 0.5 if t0 > 0 else 1.6, 1.6 if t1 < DUR else 2.0)
    for m in notes:
        g = 0.055 if m >= 55 else 0.07
        place(pad, pad_note(hz(m), dur, bright) * e, t0, g)
    if t0 >= 9.6:
        root = min(notes) - 12 if min(notes) > 45 else min(notes)
        n = int(dur * SR)
        tt = np.arange(n) / SR
        b = np.sin(2 * np.pi * hz(root) * tt) + 0.25 * np.sin(4 * np.pi * hz(root) * tt)
        place(bass, b * env_adsr(n, 0.08, 0.9), t0, 0.16)

# ---------------------------------------------------------------- drums
def kick():
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    click = fft_filter(rng.standard_normal(n), lo=2000, hi=7000) * np.exp(-t * 300) * 0.25
    return s + click


def hat():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return fft_filter(rng.standard_normal(n), lo=7000, hi=14000) * np.exp(-t * 45)


def clap():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    nz = fft_filter(rng.standard_normal(n), lo=900, hi=5000)
    e = np.exp(-t * 18) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 22) * (t > 0.012)
    return nz * e


drums = buf()
kicks = []
K, H, CL = kick(), hat(), clap()
t = 14.4
while t < 33.6 - 1e-6:
    kicks.append(t)
    place(drums, K, t, 0.55)
    t += 1.2  # half-time feel: beats 1 & 3
t = 19.2 + 0.3
while t < 33.6 - 1e-6:
    place(drums, H, t, 0.10, pan=0.35 if int(t / 0.3) % 2 else -0.35)
    t += 0.6
t = 24.0 + 0.6
while t < 33.6 - 1e-6:
    place(drums, CL, t, 0.11)
    t += 1.2
# small fill into the CTA
for i, tt in enumerate([32.4, 32.7, 33.0, 33.15, 33.3, 33.45]):
    place(drums, H, tt, 0.07 + i * 0.015)

# sidechain envelope from kicks
duck = np.ones(N)
for k in kicks:
    i0 = int(k * SR)
    n = min(int(0.6 * SR), N - i0)
    tt = np.arange(n) / SR
    duck[i0:i0 + n] = np.minimum(duck[i0:i0 + n], 1 - 0.38 * np.exp(-tt / 0.16))

# ---------------------------------------------------------------- arp
def pluck(f, dur=0.9, dec=5.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t) * np.exp(-t * 6) + 0.18 * np.sin(6 * np.pi * f * t) * np.exp(-t * 10)
    return s * np.minimum(1, t / 0.004) * np.exp(-t * dec)


arp = buf()
PATTERN = [0, 2, 1, 3, 2, 4, 3, 1]
for (t0, t1, notes, _) in CHORDS:
    if t0 < 9.6 or t0 >= 36.0:
        continue
    tones = sorted(set([m + 12 for m in notes if m >= 55] + [m + 24 for m in notes if m < 55]))
    step = 0.3
    i = 0
    tt = t0 + (0.6 if t0 == 9.6 else 0.0)  # let the impact breathe
    while tt < t1 - 1e-6:
        m = tones[PATTERN[i % len(PATTERN)] % len(tones)]
        vel = 0.9 if i % 2 == 0 else 0.6
        place(arp, pluck(hz(m)), tt, 0.055 * vel, pan=-0.25 if i % 2 else 0.25)
        i += 1
        tt += step
# ping-pong delay (dotted eighth)
d = int(0.45 * SR)
for rep in range(1, 4):
    g = 0.38 ** rep
    sh = np.zeros_like(arp)
    sh[:, d * rep:] = arp[:, :-d * rep] * g
    if rep % 2:
        sh = sh[::-1]
    arp = arp + sh

# ---------------------------------------------------------------- FX & UI
fx = buf()


def blip(f0, f1, dur=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * np.minimum(1, t / 0.05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26) * np.minimum(1, t / 0.002)


def chime(notes, gap=0.07):
    out = np.zeros(int((0.9 + gap * len(notes)) * SR))
    for i, m in enumerate(notes):
        p = pluck(hz(m), 0.9, 6.5)
        i0 = int(i * gap * SR)
        out[i0:i0 + len(p)] += p
    return out


def whoosh(dur=0.9, peak=0.6, lo=300, hi=6000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    # sweep: blend from low band to high band around the peak
    a = fft_filter(nz, lo=lo, hi=lo * 4)
    b = fft_filter(nz, lo=hi / 4, hi=hi)
    x = np.clip(t / dur, 0, 1)
    s = a * (1 - x) + b * x
    e = np.exp(-((t - peak * dur) ** 2) / (2 * (0.16 * dur) ** 2))
    return s * e


# S1 — ringtone (two soft marimba-ish dyads per ring), then the missed-call drop
for r0 in (1.7, 2.35):
    for j, m in enumerate([76, 83, 76, 83]):
        place(fx, pluck(hz(m), 0.5, 14), r0 + j * 0.085, 0.07, pan=0.1)
place(fx, chime([69, 65, 62], 0.12), 3.05, 0.09)

# S1→S2, S3→S4, S4→S5, S5→S6, S6→S7 transitions
for tc in (4.75, 14.15, 23.75, 28.55, 33.35):
    place(fx, whoosh(0.9, 0.62, lo=250, hi=4200), tc - 0.55, 0.09)

# riser into the reveal (8.0 → 9.45), then the impact on the streak
n = int(1.45 * SR)
tt = np.arange(n) / SR
nz = rng.standard_normal(n)
rise = np.zeros(n)
for seg in range(10):  # stepwise brightening noise
    a0, a1 = seg * n // 10, (seg + 1) * n // 10
    rise[a0:a1] = fft_filter(nz[a0:a1], lo=200 + seg * 300, hi=1200 + seg * 900)
sweep_f = 110 * 2 ** (tt / 1.45 * 2)
tone = np.sin(2 * np.pi * np.cumsum(sweep_f) / SR) * 0.4
place(fx, (rise + tone) * (tt / 1.45) ** 2.2, 8.0, 0.32)

n = int(3.0 * SR)
tt = np.arange(n) / SR
sub = np.sin(2 * np.pi * np.cumsum(58 * np.exp(-tt * 0.6) + 30) / SR) * np.exp(-tt * 1.4)
crack = fft_filter(rng.standard_normal(n), lo=150, hi=5000) * np.exp(-tt * 9)
impact = sub * 0.9 + crack * 0.35
place(fx, impact, 9.45, 0.55)
place(fx, chime([72, 79, 84, 88], 0.05), 9.5, 0.06)

# S4 — chat
for tb in (15.6, 17.9):
    place(fx, blip(1100, 1500), tb, 0.08, pan=0.3)          # visitor
for tb in (16.9, 19.05):
    place(fx, blip(700, 1050), tb, 0.09, pan=0.2)            # agent
for tb in (16.25, 18.45):
    for j in range(3):
        place(fx, blip(1800, 1800, 0.05), tb + j * 0.14, 0.02, pan=0.2)  # typing ticks
place(fx, chime([72, 76, 79, 84], 0.06), 20.25, 0.08)        # lead qualified
for j in range(3):
    place(fx, blip(2000, 2600, 0.08), 20.9 + j * 0.18, 0.045, pan=0.3)  # row ticks
place(fx, chime([79, 84], 0.09), 21.6, 0.075)                 # visit booked
for j in range(4):
    place(fx, blip(900 + j * 150, 1300 + j * 150, 0.1), 22.05 + j * 0.3, 0.035, pan=-0.3)  # chips

# S5 — card cascade ticks, S6 — node pops
for j in range(6):
    place(fx, blip(1300, 1700, 0.07), 24.6 + j * 0.1, 0.03, pan=-0.4 + j * 0.16)
for j in range(4):
    place(fx, chime([74 + [0, 3, 5, 7][j]], 0), 29.45 + j * 0.5, 0.045)

# S7 — logo shimmer + button
place(fx, chime([77, 81, 84, 89], 0.05), 33.8, 0.06)
place(fx, blip(600, 900, 0.2), 35.0, 0.08)
place(fx, whoosh(0.7, 0.5, lo=1500, hi=7000), 35.7, 0.035)

# ---------------------------------------------------------------- reverb
def reverb(x, seconds=2.6, decay=0.55):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = fft_filter(rng.standard_normal(n), lo=120, hi=6500) * np.exp(-t / decay)
        ir[: int(0.012 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        L = 1 << int(np.ceil(np.log2(N + n)))
        y = np.fft.irfft(np.fft.rfft(x[ch], L) * np.fft.rfft(ir, L), L)[:N]
        out[ch] = y
    return out


# night section sits back; the band arrives with the logo
section = np.interp(t_all, [0, 8.0, 9.6, DUR], [0.5, 0.6, 1.0, 1.0])
pad *= duck * section
arp *= duck
send = pad * 0.45 + arp * 0.55 + fx * 0.35
wet = reverb(send)
mix = pad + bass * duck + arp + drums + fx + wet * 0.55

# master fades: gentle start, hard silence at end of film
fade_in = np.minimum(1, t_all / 0.8)
fade_out = np.clip((DUR - t_all) / 1.6, 0, 1) ** 1.5
mix *= fade_in * fade_out

# glue: soft clip, then normalize to -1 dBFS
mix /= np.max(np.abs(mix))
mix = np.tanh(mix * 1.15) / np.tanh(1.15) * 0.89

out = Path(__file__).resolve().parent.parent / 'assets' / 'soundtrack.wav'
pcm = (np.clip(mix.T, -1, 1) * 32767).astype('<i2')
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out, f'{DUR}s')
