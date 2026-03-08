# ADR 001: Bit Project Description View

**Date**: 2026-03-08
**Status**: Decided
**Decision**: Option D — Gallery/Studio Mode Toggle (with enhancements)

## Context

When viewing an individual project at `/bit/:slug`, the animation runs fullscreen but there was no clean way to read the project description. The original implementation rendered a semi-transparent markdown overlay directly on top of the animation, which obscured the art and couldn't be dismissed.

We needed a solution that works for three audiences:
1. **Casual visitor** — stumbles onto the page, wants to understand what they're looking at
2. **The creator** — looking back at projects, wants quick context
3. **Gallery/exhibition** — physical show with computers running the pieces, needs a clean kiosk mode

## Options Explored

Four options were implemented on separate branches for side-by-side comparison.

### Option A: Info Button Toggle (`option-a-info-toggle`)

A circular ℹ️ button in the corner. Clicking it slides a panel in from the right with the markdown content. Click again to dismiss.

**Verdict**: Eliminated. Too generic — looks like any other website. Nothing memorable or distinctive about the interaction. Doesn't serve the exhibition use case.

### Option B: Scroll Below the Fold (`option-b-scroll-below`)

Animation fills the viewport. Scrolling down reveals the description below, with the animation staying fixed behind. A chevron hints at content below.

**Verdict**: Eliminated. The concept is natural and simple, but it conflicts with projects that use scroll for their own interaction (Photography uses horizontal scroll). Adopting this would constrain future projects from using scroll-based interactions, or require moving those projects out of the bits section.

### Option C: Side Panel / Bottom Sheet (`option-c-side-panel`)

Desktop: panel slides from the right (~35% width), animation shrinks to ~65%. Mobile: bottom sheet slides up. Both toggled via an "About" tab.

**Verdict**: Eliminated. Clean but the sliding transitions feel too polished for the site's brutalist aesthetic. The mobile bottom sheet clashes with the existing bottom navigation. Would require reworking the nav layout.

### Option D: Gallery/Studio Mode Toggle (`option-d-gallery-studio`) ✅

Two modes toggled by a button:
- **Gallery mode** (default): Animation fullscreen, minimal UI. Exhibition-ready.
- **Studio mode**: Animation shrinks to 60vh, description and metadata appear below.

**Verdict**: Selected. Best fit for all three audiences.

## Why Option D

1. **Gallery mode is exhibition mode.** For a physical show, set computers to gallery mode — the art runs with zero distractions. Auto-hiding the controls after inactivity makes it truly clean.

2. **Studio mode serves curiosity.** Visitors and the creator can toggle to see the description, the short QR code, and the story. It's opt-in.

3. **Fits the brutalist aesthetic.** Mode switch is a hard cut — no easing, no sliding. The animation snaps to 60vh, content appears instantly. Very web 1.0.

4. **No scroll conflicts.** Unlike Option B, scrolling is unambiguous. Projects that use scroll for their own interaction (Photography) are unaffected in gallery mode. In studio mode, the animation is contained in its box.

5. **Short code display closes the physical-digital loop.** A visitor at an exhibition sees "Code: D20F", scans the QR later, and revisits the piece online.

## Enhancements (to implement)

- **Auto-hide controls**: In gallery mode, hide the toggle button after 10s of no mouse activity. Show on mousemove.
- **Brutalist transitions**: Remove all CSS `ease` transitions. Hard cuts only.
- **Keyboard shortcut**: Press `i` or `Space` to toggle modes.

## Branches

All exploration branches are preserved for reference:
- `option-a-info-toggle`
- `option-b-scroll-below`
- `option-c-side-panel`
- `option-d-gallery-studio`
