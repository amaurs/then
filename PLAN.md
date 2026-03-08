# Infinite Scroll Album View

(Implemented — see commits on `main`.)

---

# Bit Project Description View — Option Exploration

## Problem

When viewing an individual project at `/bit/:slug`, the project animation runs fullscreen but there is no clean way to read the project description. The current implementation renders a `<ReactMarkdown>` overlay with a semi-transparent white background (`z-index: 10`) directly on top of the animation. This obscures the art and there is no way to dismiss it.

## Goal

Implement four different approaches to displaying project descriptions alongside the running animation, each on its own git branch. This allows side-by-side comparison by switching branches and viewing the running dev server.

## Current Architecture

Understanding these files is critical for all options:

- `src/Home.tsx`:
  - `Container` component (line ~250): renders `<div className="Background">` (the animation) + `<Outlet />` (the page content) + `<Slider />`.
  - Individual bit routes (line ~545): nested under `/bit`, each renders `<ReactMarkdown className="Description">{markdownContent}</ReactMarkdown>` as the `<Outlet />`.
  - `markdownContent` state (line ~282): fetched from the markdown file associated with the current bit via `mapping[key].content`.
  - `setIndexBackground` is called when navigating to a bit (line ~327), which mounts the animation component in the `Container`'s background.
- `src/Home.css`:
  - `.Background`: `position: fixed; height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; overflow: hidden;`
  - `.Description`: `z-index: 10; padding: 0 5%; background-color: rgba(255, 255, 255, .7);` — this is the current overlay that needs to be replaced.
- `src/Menu.tsx`: links to `/bit${element}` where element is like `/nostalgia`.
- Markdown files: located at `src/bits/<project>/<Project>.md`, imported statically in `Home.tsx` and mapped by slug. Some have only a title, others have full descriptions.

## Local Testing

For all options, test locally by running the dev server:

```bash
npm run dev
```

Then navigate to:
- `http://localhost:5173/bits` — the menu (hover over items to preview backgrounds)
- `http://localhost:5173/bit/nostalgia` — an individual project (or any slug)
- `http://localhost:5173/D20F` — a short code redirect (should land on the project with description working)

To switch between options:
```bash
git checkout option-a-info-toggle
git checkout option-b-scroll-below
git checkout option-c-side-panel
git checkout option-d-gallery-studio
```

The dev server hot-reloads, so switching branches while it's running will update the view.

---

## Option A: Info Button Toggle

**Branch name**: `option-a-info-toggle`

**Setup**: Branch from `main` — `git checkout -b option-a-info-toggle main`

### Description

A small circular info button (ℹ️) fixed in the bottom-right corner of the viewport. Clicking it slides in a panel from the right side containing the markdown description. Clicking again (or clicking outside the panel) dismisses it. The project animation runs unobstructed by default.

### Implementation Steps

1. **Create `src/InfoPanel.tsx`** — a new component:
   - Props: `content: string` (markdown text), `isOpen: boolean`, `onClose: () => void`.
   - Renders a `<div className="InfoPanel">` that slides in from the right.
   - Inside, render `<ReactMarkdown>{content}</ReactMarkdown>`.
   - Include a close button (✕) at the top-right of the panel.
   - When `isOpen` is false, the panel is off-screen (`transform: translateX(100%)`).
   - When `isOpen` is true, the panel slides in (`transform: translateX(0)`) with a CSS transition.

2. **Create `src/InfoPanel.css`**:
   - `.InfoPanel`: `position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: rgba(0, 0, 0, 0.85); color: white; z-index: 200; padding: 40px 30px; overflow-y: auto; transform: translateX(100%); transition: transform 0.3s ease;`
   - `.InfoPanel.open`: `transform: translateX(0);`
   - `.InfoPanel-close`: positioned top-right, cursor pointer, no background/border, white color, font-size 24px.
   - `.InfoPanel p`: `font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;`
   - `.InfoButton`: `position: fixed; bottom: 30px; right: 30px; z-index: 150; width: 48px; height: 48px; border-radius: 50%; background: rgba(0, 0, 0, 0.6); color: white; border: 2px solid rgba(255, 255, 255, 0.3); cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s;`

3. **Modify `src/Home.tsx`**:
   - Add `const [infoOpen, setInfoOpen] = useState(false)` state.
   - Replace the `<ReactMarkdown className="Description">` element in the `/bit` child routes with `null` (or an empty fragment).
   - Inside the `/bit` parent route's `Container`, after `<Outlet />`, render:
     - `<button className="InfoButton" onClick={() => setInfoOpen(!infoOpen)}>ℹ️</button>` — only when `markdownContent` is non-empty.
     - `<InfoPanel content={markdownContent} isOpen={infoOpen} onClose={() => setInfoOpen(false)} />`
   - Reset `infoOpen` to `false` when the route changes (in the existing `useEffect` that watches `location`).

4. **Remove or keep `.Description` CSS** — it's no longer used in this option, but leaving it won't hurt.

### Success Criteria

1. Navigate to `http://localhost:5173/bit/nostalgia`.
2. The animation runs fullscreen with NO text overlay visible.
3. A circular ℹ️ button is visible in the bottom-right corner.
4. Click the ℹ️ button → a panel slides in from the right containing the project title and description.
5. The animation is still visible and running behind/beside the panel.
6. Click the ✕ button or click outside the panel → the panel slides out.
7. Navigate to `http://localhost:5173/bit/mandelbrot` → the panel is closed, the ℹ️ button is present, clicking it shows Mandelbrot's description.
8. Navigate to a project with only a title in its markdown (e.g., Nostalgia which has just `# Nostalgia`) → the panel shows just the title, no broken layout.
9. The ℹ️ button does NOT appear on the `/bits` menu page or the `/` home page.

**Agent verification (Chrome DevTools MCP)**:
- Navigate to `http://localhost:5173/bit/nostalgia`.
- Assert `document.querySelector('.Description')` is `null` (old overlay removed).
- Assert `document.querySelector('.InfoButton')` exists and is visible.
- Execute `document.querySelector('.InfoButton').click()`.
- Wait 500ms for animation.
- Assert `document.querySelector('.InfoPanel.open')` exists.
- Assert `document.querySelector('.InfoPanel').textContent` contains "Nostalgia".
- Execute `document.querySelector('.InfoPanel-close').click()`.
- Wait 500ms.
- Assert `document.querySelector('.InfoPanel.open')` is `null`.

---

## Option B: Scroll Below the Fold

**Branch name**: `option-b-scroll-below`

**Setup**: Branch from `main` — `git checkout -b option-b-scroll-below main`

### Description

The project animation fills the entire viewport (100vh) and stays fixed. Below the fold, the markdown description is rendered in a readable section. The user scrolls down to read, and the animation remains visible behind/above as they scroll. A subtle scroll indicator (↓ or chevron) hints that content exists below.

### Implementation Steps

1. **Modify the `/bit` route element in `src/Home.tsx`**:
   - Replace the `<ReactMarkdown className="Description">` with a new wrapper structure:
     ```tsx
     <div className="BitView">
       <div className="BitView-spacer" />
       <div className="BitView-content">
         <ReactMarkdown>{markdownContent}</ReactMarkdown>
       </div>
     </div>
     ```
   - Add a scroll indicator element inside `BitView-spacer`: a small downward chevron/arrow at the bottom center, only visible when `markdownContent` has more than just a title (check `markdownContent.split('\n').length > 2` or similar).

2. **Create styles in `src/Home.css`** (or a new `BitView.css`):
   - `.BitView`: `min-height: 200vh; position: relative;`
   - `.BitView-spacer`: `height: 100vh; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 30px;`
   - `.BitView-scroll-hint`: `color: white; font-size: 32px; opacity: 0.6; animation: bounce 2s infinite;` with a `@keyframes bounce` that moves it up and down slightly.
   - `.BitView-content`: `position: relative; background: rgba(0, 0, 0, 0.85); color: white; padding: 60px 10% 80px; min-height: 50vh;`
   - `.BitView-content p`: `font-family: Arial, sans-serif; font-size: 18px; line-height: 1.8; max-width: 700px; margin: 0 auto;`
   - `.BitView-content h1`: `font-size: 48px; margin-bottom: 20px; text-align: center;`

3. **Remove the `.Description` styles** from `Home.css` (no longer needed).

4. **The `.Background` stays as-is** — `position: fixed` means the animation stays in place while the content scrolls over it.

### Success Criteria

1. Navigate to `http://localhost:5173/bit/mandelbrot`.
2. The animation fills the entire viewport. No text is visible on the initial view.
3. A subtle scroll indicator (↓ chevron) is visible at the bottom center of the viewport.
4. Scroll down → the description section scrolls up over the animation, which stays fixed behind it.
5. The description has a dark semi-opaque background so text is readable.
6. The markdown content (title + description) renders correctly.
7. Scroll back up → the animation is fully visible again.
8. Navigate to `http://localhost:5173/bit/nostalgia` (title only) → the spacer and a minimal content section are present, no broken layout. The scroll hint may be hidden since there's minimal content.
9. The `/bits` menu page and `/` home page are unaffected.

**Agent verification (Chrome DevTools MCP)**:
- Navigate to `http://localhost:5173/bit/mandelbrot`.
- Assert `document.querySelector('.Description')` is `null` (old overlay removed).
- Assert `document.querySelector('.BitView-spacer')` exists.
- Assert `document.querySelector('.BitView-content')` exists.
- Assert the initial `window.scrollY === 0`.
- Execute `window.scrollTo(0, window.innerHeight)`.
- Wait 500ms.
- Assert `document.querySelector('.BitView-content').getBoundingClientRect().top < window.innerHeight` (content is now visible).
- Assert `document.querySelector('.BitView-content').textContent` contains "Mandelbrot".
- Assert the `.Background` element is still in the DOM and visible (`document.querySelector('.Background').offsetHeight > 0`).

---

## Option C: Side Panel (Desktop) / Bottom Sheet (Mobile)

**Branch name**: `option-c-side-panel`

**Setup**: Branch from `main` — `git checkout -b option-c-side-panel main`

### Description

On desktop (viewport width ≥ 768px), a panel slides in from the right occupying ~35% of the viewport width. The animation resizes to fill the remaining ~65%. On mobile (< 768px), a bottom sheet slides up covering ~50% of the viewport. Both start collapsed with a visible tab/handle to expand. The panel can be toggled open/closed.

### Implementation Steps

1. **Create `src/DescriptionPanel.tsx`**:
   - Props: `content: string`.
   - Internal state: `isOpen: boolean`, default `false`.
   - Renders:
     - A toggle tab/handle: on desktop, a vertical tab on the left edge of the panel labeled "About" (rotated text); on mobile, a horizontal bar at the top of the sheet.
     - The panel body with `<ReactMarkdown>{content}</ReactMarkdown>`.
   - Use a CSS class toggle (`.DescriptionPanel.open`) to control visibility.

2. **Create `src/DescriptionPanel.css`**:
   - Desktop (default):
     - `.DescriptionPanel`: `position: fixed; top: 0; right: 0; width: 35vw; height: 100vh; background: rgba(0, 0, 0, 0.9); color: white; z-index: 200; transform: translateX(100%); transition: transform 0.3s ease; overflow-y: auto; padding: 40px 30px;`
     - `.DescriptionPanel.open`: `transform: translateX(0);`
     - `.DescriptionPanel-tab`: `position: absolute; left: -40px; top: 50%; transform: translateY(-50%) rotate(-90deg); background: rgba(0, 0, 0, 0.7); color: white; padding: 8px 20px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.2); font-size: 14px; white-space: nowrap;`
   - Mobile (`@media (max-width: 767px)`):
     - `.DescriptionPanel`: override to `width: 100vw; height: 55vh; top: auto; bottom: 0; right: 0; transform: translateY(100%);`
     - `.DescriptionPanel.open`: `transform: translateY(0);`
     - `.DescriptionPanel-tab`: override to `left: 50%; top: -36px; transform: translateX(-50%) rotate(0); width: 60px; height: 36px; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: center;` — render a drag handle bar (a small horizontal line) instead of text.
   - `.DescriptionPanel p`: `font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;`

3. **Modify `src/Home.tsx`**:
   - Replace the `<ReactMarkdown className="Description">` in the `/bit` child routes with `<DescriptionPanel content={markdownContent} />`.
   - The `Container` component and `.Background` remain unchanged.

4. **Modify `src/Home.css`**:
   - When the panel is open on desktop, the `.Background` should shrink. Add a CSS custom property or a class:
     - `.Background.with-panel`: `width: 65vw;` (instead of 100vw).
   - This requires passing the panel open state up to `Container`. Add an `isPanelOpen` state in `Home`, pass it to `Container`, and conditionally apply the class.
   - On mobile, the `.Background` stays full width (the sheet overlays from below).

### Success Criteria

1. Navigate to `http://localhost:5173/bit/nostalgia` on a desktop-width browser.
2. The animation fills the full viewport. No description text is visible.
3. A vertical "About" tab is visible on the right edge of the screen.
4. Click the tab → a panel slides in from the right (~35% width).
5. The animation area shrinks to ~65% width to accommodate the panel (no overlap).
6. The panel contains the markdown content.
7. Click the tab again → the panel slides out, animation returns to full width.
8. Resize the browser to mobile width (< 768px):
   - The tab becomes a horizontal handle at the bottom of the screen.
   - Tapping it slides a bottom sheet up (~55% height).
   - The animation stays full width behind the sheet.
9. Navigate between different projects → the panel closes, content updates.
10. The `/bits` menu page and `/` home page are unaffected.

**Agent verification (Chrome DevTools MCP)**:
- Navigate to `http://localhost:5173/bit/nostalgia`.
- Assert `document.querySelector('.DescriptionPanel')` exists.
- Assert `document.querySelector('.DescriptionPanel.open')` is `null` (starts closed).
- Assert `document.querySelector('.DescriptionPanel-tab')` exists and is visible.
- Execute `document.querySelector('.DescriptionPanel-tab').click()`.
- Wait 500ms.
- Assert `document.querySelector('.DescriptionPanel.open')` exists.
- Assert `document.querySelector('.DescriptionPanel').textContent` contains "Nostalgia".
- Check `.Background` width: `document.querySelector('.Background').offsetWidth < window.innerWidth` (shrunk for panel).
- Execute `document.querySelector('.DescriptionPanel-tab').click()`.
- Wait 500ms.
- Assert `document.querySelector('.DescriptionPanel.open')` is `null`.
- Assert `document.querySelector('.Background').offsetWidth === window.innerWidth` (full width restored).

---

## Option D: Gallery Mode / Studio Mode Toggle

**Branch name**: `option-d-gallery-studio`

**Setup**: Branch from `main` — `git checkout -b option-d-gallery-studio main`

### Description

Two viewing modes toggled by a button in the top-right corner:

- **Gallery mode** (default): The animation runs fullscreen. No text, no UI except a small mode toggle button and the existing navigation. Clean, immersive, exhibition-ready.
- **Studio mode**: The animation shrinks to ~60% of the viewport height and is positioned at the top. Below it, a content area shows: the project title, the full markdown description, and metadata (the short code for the project if available). The background changes to a solid dark color to frame the piece like a gallery wall.

### Implementation Steps

1. **Create `src/BitView.tsx`**:
   - Props: `content: string`, `title: string` (extracted from the slug), `shortCode: string | null`.
   - Internal state: `mode: 'gallery' | 'studio'`, default `'gallery'`.
   - Gallery mode renders:
     - A small toggle button top-right: an icon or text like "Studio" with a subtle style.
     - Nothing else (the animation fills the viewport via `.Background`).
   - Studio mode renders:
     - The same toggle button, now labeled "Gallery".
     - A wrapper div `.StudioView` that restructures the layout:
       - The animation area is constrained (via a class on `.Background`).
       - Below it, a `.StudioView-content` section with:
         - `<h1>` with the project title (capitalized, large).
         - `<ReactMarkdown>` with the description.
         - If `shortCode` is provided, a small section showing "Code: {shortCode}" (for reference).

2. **Create `src/BitView.css`**:
   - `.ModeToggle`: `position: fixed; top: 20px; right: 20px; z-index: 200; background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 16px; cursor: pointer; font-size: 14px; font-family: Arial, sans-serif; transition: opacity 0.3s; border-radius: 4px;`
   - `.ModeToggle:hover`: `background: rgba(0, 0, 0, 0.8);`
   - `.StudioView`: `min-height: 100vh;`
   - `.StudioView .Background` (or via a class): needs to change from `position: fixed; height: 100vh` to `position: relative; height: 60vh;` — this is the key layout shift. Since `.Background` is in `Container` (parent), the mode state needs to be communicated up. Use a context, a callback prop, or lift state to `Home`.
   - `.StudioView-content`: `background: #111; color: white; padding: 60px 10%; min-height: 40vh;`
   - `.StudioView-content h1`: `font-size: 48px; margin-bottom: 10px;`
   - `.StudioView-content p`: `font-family: Arial, sans-serif; font-size: 18px; line-height: 1.8; max-width: 700px;`
   - `.StudioView-meta`: `margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2); font-size: 14px; color: rgba(255, 255, 255, 0.5);`

3. **Modify `src/Home.tsx`**:
   - Add `const [viewMode, setViewMode] = useState<'gallery' | 'studio'>('gallery')` state.
   - Pass `viewMode` to `Container` so it can conditionally apply a class to `.Background`:
     - Gallery: existing styles (fixed, fullscreen).
     - Studio: `position: relative; height: 60vh;` (the animation becomes an inline element).
   - Replace the `<ReactMarkdown className="Description">` in `/bit` child routes with `<BitView content={markdownContent} title={slug} shortCode={matchingCode} mode={viewMode} onToggle={() => setViewMode(m => m === 'gallery' ? 'studio' : 'gallery')} />`.
   - To find the `shortCode`, look up the current slug in `props.masterData.codes` to find the matching code.
   - Reset `viewMode` to `'gallery'` when navigating between projects (in the `location` useEffect).

4. **Modify `src/Home.css`**:
   - Add `.Background.studio`: `position: relative; height: 60vh; width: 100%;` (overrides the fixed positioning).
   - The transition between modes can be animated with `transition: height 0.3s ease;` on `.Background`.

### Success Criteria

1. Navigate to `http://localhost:5173/bit/mandelbrot`.
2. **Gallery mode (default)**:
   - The animation fills the entire viewport.
   - No description text is visible.
   - A small "Studio" button is visible in the top-right corner.
   - The experience is clean and immersive.
3. Click "Studio" →
   - The animation shrinks to ~60% viewport height at the top of the page.
   - Below it, a dark content section appears with:
     - The project title ("Mandelbrot").
     - The markdown description text.
     - The short code ("D20F") displayed as metadata.
   - The button now reads "Gallery".
4. Click "Gallery" → returns to fullscreen animation, description disappears.
5. Navigate to `http://localhost:5173/bit/nostalgia` → mode resets to Gallery, clicking Studio shows Nostalgia's content.
6. Navigate to a project without a short code → the metadata section is absent, no errors.
7. The `/bits` menu page and `/` home page are unaffected — no mode toggle button visible.

**Agent verification (Chrome DevTools MCP)**:
- Navigate to `http://localhost:5173/bit/mandelbrot`.
- Assert `document.querySelector('.Description')` is `null` (old overlay removed).
- Assert `document.querySelector('.ModeToggle')` exists with text "Studio".
- Assert `document.querySelector('.StudioView-content')` is `null` (gallery mode, no content section).
- Assert `document.querySelector('.Background').style.position` is `'fixed'` or computed position is fixed.
- Execute `document.querySelector('.ModeToggle').click()`.
- Wait 500ms.
- Assert `document.querySelector('.ModeToggle').textContent` contains "Gallery".
- Assert `document.querySelector('.StudioView-content')` exists.
- Assert `document.querySelector('.StudioView-content').textContent` contains "Mandelbrot".
- Assert `document.querySelector('.StudioView-content').textContent` contains "D20F".
- Assert `document.querySelector('.Background').offsetHeight < window.innerHeight` (shrunk to ~60%).
- Execute `document.querySelector('.ModeToggle').click()`.
- Wait 500ms.
- Assert `document.querySelector('.StudioView-content')` is `null` (back to gallery).
- Assert `document.querySelector('.Background').offsetHeight === window.innerHeight` (full viewport).

---

## Execution Order

Implement sequentially. After each option:
1. Verify all success criteria.
2. Commit all changes on the option branch.
3. Switch back to `main` before starting the next option.

```bash
# Option A
git checkout -b option-a-info-toggle main
# ... implement and commit ...

# Option B
git checkout -b option-b-scroll-below main
# ... implement and commit ...

# Option C
git checkout -b option-c-side-panel main
# ... implement and commit ...

# Option D
git checkout -b option-d-gallery-studio main
# ... implement and commit ...
```

To compare options, switch branches while the dev server is running:
```bash
npm run dev
# In another terminal:
git checkout option-a-info-toggle   # view Option A
git checkout option-b-scroll-below  # view Option B
git checkout option-c-side-panel    # view Option C
git checkout option-d-gallery-studio # view Option D
```
