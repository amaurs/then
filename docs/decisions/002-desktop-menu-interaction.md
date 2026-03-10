# ADR 002: Desktop Menu Interaction Model

**Date**: 2026-03-09
**Status**: Accepted
**Branch**: `desktop-menu-b-scroll` (merged to `main`)

## Context

After implementing the mobile-first bits menu with scroll-based preview (CSS Scroll Snap, opacity dimming, scale pop), the desktop menu still used the original hover-based interaction — a plain text list where hovering changed the background but applied no visual treatment to the menu items themselves.

Two approaches were explored to bring the mobile visual language to desktop:

### Option A: Hover-Based Selection (`desktop-menu-a-hover`)

- CSS-only change on top of existing hover handlers
- Items dim to 0.2 opacity, hovered item scales up and goes full opacity
- Background changes on hover (existing behavior)
- Familiar desktop interaction pattern

### Option B: Scroll-Based Selection (`desktop-menu-b-scroll`)

- Removes `isCoarse` gating entirely — same scroll-snap interaction on all devices
- First item centered on load, scroll to browse, snap to center
- Background updates based on scroll position
- Hover handlers removed
- Unified codebase for mobile and desktop

## Decision

**Option B selected.** The scroll-based interaction provides full consistency across devices and produces a more distinctive, unconventional experience that fits the site's aesthetic. The dense, overlapping text with the focused item punching through creates a visual texture that works better than the conventional hover approach.

## Consequences

- Hover no longer changes the active menu item on desktop
- `isCursorOnMenu` state removed from Home.tsx
- `useIsCoarse` hook removed — no longer needed
- Single code path for both mobile and desktop in Menu.tsx
- Font size differs by viewport: 90px desktop, 42px mobile (via media queries)
- Scale differs by viewport: 1.4× desktop, 1.25× mobile
