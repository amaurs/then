# Infinite Scroll Album View

## Problem

When viewing photos for a specific day (`/calendar/:year/:month/:day`), the only way to navigate to another day is to go back to the calendar grid and click a different square. This breaks the browsing flow.

## Goal

Replace the single-day Album view with an infinite scroll experience. Scrolling past the last photo of a day loads the next day with content; scrolling above the first photo loads the previous day. A date divider separates days. The URL updates as the user scrolls between days.

## Current State

- `Album.tsx` fetches photos from `GET /calendars/amaurs/:year-:month-:day` and renders them in a single column.
- The response shape is `{ photos: string[] }`.
- Route: `/calendar/:year/:month/:day`.
- `Calendar.tsx` fetches `GET /calendar/amaurs` which returns `{ start, photos: [date, count][] }` — a `Map<string, number>` of every date with photos. This map is already loaded before the user navigates to a day.

## Key Insight: No Backend Changes Needed

The calendar `photos` map already contains all dates with content. By sorting its keys, we get an ordered list of dates and can compute next/previous adjacency entirely on the frontend. The existing per-day endpoint (`GET /calendars/amaurs/:date`) fetches the actual photo URLs.

## Implementation

### 1. Pass the Dates List to Album

- In `Calendar.tsx` (or at the router level), derive a sorted array of date strings from the `photos` map keys.
- Pass this list to `Album` via route state, context, or a shared parent.
- `Album` uses this list to know which dates are adjacent without any new API calls.

### 2. Infinite Scroll Album

Refactor `Album.tsx`:

- Maintain an ordered list of day sections: `{ date: string, photos: string[] }[]`.
- Initialize with the current day's data (existing fetch).
- Detect scroll position:
  - Near bottom → fetch next day with content, append to list.
  - Near top → fetch previous day with content, prepend to list (preserve scroll position).
- Render a date divider (`<h2>` with formatted date) between each day's photos.
- Use `IntersectionObserver` on the date dividers to update the URL via `window.history.replaceState` as the user scrolls past day boundaries.
- Add loading indicators at top/bottom while fetching.
- Stop fetching when the API returns no more days in that direction.

### 3. URL Updates

- Use `replaceState` (not `pushState`) so the back button returns to the calendar, not to every intermediate day.
- URL format stays `/calendar/:year/:month/:day`, updating to reflect whichever day divider is currently in view.

## Success Criteria & Test Plan

Each test case is designed to be verifiable using the Chrome DevTools MCP server (`browser-inspector` agent), which can:
- Navigate to URLs in Chrome.
- Execute JavaScript to scroll the page, read DOM elements, and check `window.location`.
- Inspect DOM structure and content.
- Take screenshots for visual verification.

### Test 1: Initial Load Matches Current Behavior

1. Navigate to `/calendar/:year/:month/:day` for a known date with photos.
2. Verify the date heading is visible in the DOM.
3. Verify the correct number of `<img>` elements are rendered.
4. Verify the URL matches the navigated date.

**Agent verification**: Execute JS to assert `document.querySelectorAll('img').length` matches expected count and `location.pathname` matches the date.

### Test 2: Scroll Down Loads Next Day

1. Navigate to a day that has a next day with content.
2. Scroll to the bottom of the page (`window.scrollTo(0, document.body.scrollHeight)`).
3. Wait for new content to load (poll DOM for a second date divider).
4. Verify a new date divider element appears below the original photos.
5. Verify new `<img>` elements are rendered after the divider.

**Agent verification**: Execute JS to scroll, wait, then assert `document.querySelectorAll('[data-date-divider]').length >= 2`.

### Test 3: Scroll Up Loads Previous Day

1. Navigate to a day that has a previous day with content.
2. Scroll to the top of the page.
3. Wait for new content to load.
4. Verify a new date divider appears above the original content.
5. Verify the scroll position is preserved (user doesn't jump).

**Agent verification**: Record `window.scrollY` before prepend, scroll to top, wait for new divider, then assert `window.scrollY > 0` (scroll was adjusted to keep content in place).

### Test 4: URL Updates on Scroll

1. Load a day, scroll down until the next day's divider is in view.
2. Verify `window.location.pathname` has updated to the new day's date.
3. Scroll back up past the original day's divider.
4. Verify the URL reverts to the original date.

**Agent verification**: Execute JS to scroll, use `IntersectionObserver` or poll `location.pathname` and assert it changes to the expected date string.

### Test 5: Back Button Returns to Calendar

1. Navigate from `/calendar` to `/calendar/2025/01/15` by clicking a square.
2. Scroll through multiple days (triggering URL `replaceState` updates).
3. Press back (or `history.back()`).
4. Verify the URL is `/calendar` (not an intermediate day).

**Agent verification**: Execute `history.back()`, wait, then assert `location.pathname === '/calendar'`.

### Test 6: End of Content

1. Navigate to the earliest known day with photos.
2. Scroll to the top.
3. Verify no loading spinner persists and no additional content is prepended.
4. Similarly, navigate to the latest day and scroll to the bottom.

**Agent verification**: Scroll to boundary, wait 2 seconds, assert no new `[data-date-divider]` elements appeared.

### Test 7: Date Divider Visual Separation

1. Load a day and scroll to load an adjacent day.
2. Verify the date divider is visible and contains the correctly formatted date string.

**Agent verification**: Query `[data-date-divider]` elements, assert `textContent` matches expected date format (e.g., "Friday, Jan 16, 2025").
