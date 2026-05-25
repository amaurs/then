# ADR 003: In-Browser MP4 Recorder for Bits

**Date**: 2026-05-25
**Status**: Accepted
**Branch**: `recorder` (PR #26)

## Context

The bits make good short-form content for Instagram (feed posts and Reels), but there was no path from "running animation in browser" to "MP4 file on phone, ready to post." Doing it the obvious way — recording the screen on a laptop, transferring to phone, posting — adds friction every time and discourages capturing anything.

The recorder needs to:

-   Output Instagram-ready H.264 MP4 (square 1080² or portrait 1080×1920).
-   Work on phone so recording and posting happen in one flow.
-   Not bloat the main app bundle or affect anonymous viewers.
-   Avoid the memory cost of storing hundreds of PNG frames.
-   Be the only user's tool — owner-gated.

## Options Explored

Four approaches were considered:

### Option A: MediaRecorder Alone

Capture the canvas via `captureStream()`, record with `MediaRecorder`, save the resulting blob.

-   Pros: Zero extra dependencies. Native browser API.
-   Cons: Most browsers emit WebM, not MP4. iOS Safari does emit MP4/H.264 but other platforms don't. Instagram requires MP4.

### Option B: PNG-per-Frame + Server Encode (the original instinct)

Capture each frame as a PNG, send to a backend that runs FFmpeg.

-   Pros: Maximum control, well-understood pipeline.
-   Cons: ~300MB of PNGs in memory for a 10s clip at 30fps, network upload, backend infra to maintain. Doesn't work on phone without a round-trip.

### Option C: Playwright + Node FFmpeg (local script)

Local Node script that drives Playwright to load the bit, records via Chrome's headless API, pipes to FFmpeg.

-   Pros: Highest quality, full control.
-   Cons: Requires a laptop and CLI. Defeats the "record on phone" goal entirely. Would still need to transfer files.

### Option D: MediaRecorder + In-Browser FFmpeg.wasm (selected)

`MediaRecorder` produces a WebM blob (~5–15MB for 10s), `@ffmpeg/ffmpeg` WASM transcodes to MP4 client-side. On iOS Safari, MediaRecorder already emits MP4/H.264, so FFmpeg is skipped entirely.

-   Pros: Works on phone. Small memory footprint. iOS gets a fast path. Bundle stays clean (FFmpeg loaded from CDN at use-time).
-   Cons: WASM transcode is slower than native (~real-time for `-preset fast`). FFmpeg first-load downloads ~30MB of WASM (cached after).

## Decision

**Option D selected.** Only path that satisfies the phone-first constraint without losing MP4 output.

## Key Sub-Decisions

### Auth: ride Poroto's existing `ProtectedRoute requiredRole="owner"`

The recorder lives at `/record` inside the Poroto subdomain, which already has `GoogleOAuthProvider`, `AuthProvider`, and `ProtectedRoute` configured. No new auth scaffolding.

### Intermediate canvas for letterboxing + WebGL safety

We don't `captureStream()` the bit's canvas directly. Instead, an intermediate 2D canvas at the chosen output dimensions runs a rAF loop that draws the bit canvas into it letterboxed (with theme background filling bars). Two benefits:

1. The bit's native aspect ratio is preserved without crop or stretch.
2. `drawImage(webglCanvas)` reads pixels synchronously each frame — robust against WebGL contexts that clear between rAF cycles.

We still added `preserveDrawingBuffer: true` to the WebGL bits (Penrose, Corrupted) — separate commits, since those are bit-level concerns, not recorder concerns.

### Single-threaded FFmpeg.wasm

Multi-threaded FFmpeg.wasm requires `SharedArrayBuffer`, which requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers. Adding those headers breaks third-party embeds (Google OAuth, Typekit, etc.) and forces a full audit. Single-threaded is slower but avoids the rabbit hole. For 5–30s clips the difference is acceptable.

### FFmpeg loaded from CDN, dynamically imported

`@ffmpeg/ffmpeg` is `import()`-ed inside the transcode function. The WASM core itself is fetched from `https://unpkg.com/@ffmpeg/core@0.12.10` at first use. Zero bytes in the main bundle, nothing downloaded for anonymous viewers, nothing downloaded for owner sessions that don't actually record.

### Bit interface extension via `extraProps`

Most bits accept `{ title, delay, style, width, height }`. The 8 color/animation bits (flood-fill, hilbert, morton, etc.) need `square`, `cube`, `res` for asset paths. Rather than force a uniform interface, the registry entry carries an optional `extraProps` object that the Recorder spreads at render time. Small escape hatch, no refactor.

### Backend-fed bits wrapped, not registered raw

`colors` and `traveling-salesman` need backend data (`/solve` endpoint). The registry can't ship a static prop value, so two thin wrappers in `recorder/backendBits.tsx` fetch the data on mount and pass it through. Bits are not modified.

### Progress bar uses Panama's style and direct DOM ref write

The bottom-of-screen progress bar copies Panama's `scrub`/`scrubFill` styling (3px, faint magenta track, magenta fill). Initial implementation used React state updated each rAF tick — visually it jumped because the rapid setState calls were batched and the DOM lagged. Solved by writing `el.style.width` directly via a ref, bypassing React in the hot path.

### Recording state on the button: disabled, not animated

We briefly tried a pulsing-disc animation on the record button during recording. Reverted to a simple disabled-state opacity dim — consistent with the rest of the chrome and with the project's "no smooth transitions" convention. The bottom progress bar carries all timing feedback.

## Consequences

-   A new owner-gated route at `poroto.<host>/record`.
-   New dependencies: `@ffmpeg/ffmpeg`, `@ffmpeg/util` (both small npm shims; the heavy WASM is CDN-loaded).
-   Two Three.js bits now create renderers with `preserveDrawingBuffer: true`. This has a minor performance cost — required for capture.
-   A new `src/recorder/` directory with the registry, the recording hook, and the backend-fed wrappers. Recorder UI is `src/Recorder.tsx` / `src/Recorder.css`.
-   The `RecordableBit` interface is the canonical list of "things we want to share on social." When new bits are added, they should be registered here (or explicitly excluded).

## Out of Scope (Future)

-   **Animation speed control.** Each bit owns its own timing primitives (rAF + setTimeout throttles, internal accumulators, Three.js clocks). Adding a uniform `speed` prop requires per-bit changes and was deferred — flagged for a follow-up.
-   **Audio capture.** Bits don't have audio yet.
-   **Custom durations beyond 5/10/15/30 seconds.**
-   **Stories/Reels-specific presets** beyond square and portrait.
