# PLAN: Enhance Option D — Gallery/Studio Mode

**Decision**: See `docs/decisions/001-bit-description-view.md`
**Base branch**: `option-d-gallery-studio`

## Enhancements to Implement

### 1. Remove CSS Transitions (Brutalist Hard Cuts)

Remove all `transition` and `ease` properties from `BitView.css` and `Home.css` related to the mode toggle. The switch between gallery and studio should be instant — no animation.

**Files**: `src/BitView.css`, `src/Home.css`

**Success criteria**:
- Navigate to `http://localhost:5173/bit/mandelbrot`.
- Click "Studio" → the layout changes instantly, no sliding or easing.
- Click "Gallery" → snaps back instantly.
- Verify no `transition` properties exist on `.Background` or `.StudioView` related to the mode switch.

### 2. Auto-Hide Controls in Gallery Mode

In gallery mode, the "Studio" toggle button should disappear after 10 seconds of no mouse activity. Any `mousemove` event resets the timer and shows the button.

**Files**: `src/BitView.tsx`, `src/BitView.css`

**Implementation**:
- Add a `visible` state, default `true`.
- On mount (gallery mode only), start a 10s timeout that sets `visible = false`.
- On `mousemove` (window-level listener), set `visible = true` and reset the timeout.
- Apply an `.ModeToggle.hidden` class that sets `opacity: 0; pointer-events: none;` (instant, no transition).
- Clean up listeners and timeout on unmount.
- In studio mode, the button is always visible (no auto-hide).

**Success criteria**:
- Navigate to `http://localhost:5173/bit/mandelbrot` (gallery mode).
- The "Studio" button is visible.
- Don't move the mouse for 10 seconds → the button disappears.
- Move the mouse → the button reappears instantly.
- Click "Studio" to enter studio mode → the "Gallery" button stays visible permanently (no auto-hide).
- Click "Gallery" → auto-hide behavior resumes.

**Agent verification (Chrome DevTools MCP)**:
- Navigate to `http://localhost:5173/bit/mandelbrot`.
- Assert `document.querySelector('.ModeToggle')` is visible.
- Wait 11 seconds without triggering mousemove.
- Assert `document.querySelector('.ModeToggle.hidden')` exists.
- Dispatch a mousemove event: `document.dispatchEvent(new MouseEvent('mousemove'))`.
- Assert `document.querySelector('.ModeToggle.hidden')` is `null` (visible again).

### 3. Keyboard Shortcut

Press `i` to toggle between gallery and studio modes.

**Files**: `src/BitView.tsx` (or `src/Home.tsx` where the mode state lives)

**Implementation**:
- Add a `keydown` listener for the `i` key.
- Call the same `onToggle` callback.
- Clean up on unmount.

**Success criteria**:
- Navigate to `http://localhost:5173/bit/mandelbrot`.
- Press `i` → switches to studio mode.
- Press `i` again → switches back to gallery mode.
- Verify this does not interfere with the existing Konami code listener.

**Agent verification (Chrome DevTools MCP)**:
- Navigate to `http://localhost:5173/bit/mandelbrot`.
- Assert studio content is not visible.
- Execute `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }))`.
- Assert `document.querySelector('.StudioView-content')` exists.
- Execute `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }))`.
- Assert `document.querySelector('.StudioView-content')` is `null`.

## Execution

1. Checkout `option-d-gallery-studio`.
2. Implement enhancements 1, 2, 3 sequentially.
3. Commit each enhancement separately.
4. Merge `option-d-gallery-studio` into `main`.

## Local Testing

```bash
git checkout option-d-gallery-studio
npm run dev
```

Then visit `http://localhost:5173/bit/mandelbrot` (or any project slug).
