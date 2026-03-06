# Plan: Code Quality

## ✅ Done

- [x] **Remove CRA artifacts** — Deleted `react-app-env.d.ts`
- [x] **Fix TypeScript type errors** — Added `src/vite-env.d.ts` with Vite client ref and module declarations for `.jpg`, `.png`, `.woff`, `.woff2`
- [x] **Refactor Calendar color logic** — Replaced nested ternaries in `getColor()` with `HEAT_MAP_COLORS` array lookup
- [x] **Extract Calendar magic numbers to constants** — `DAYS_IN_A_WEEK`, `OFFSET_WEEK`, `OFFSET_DAY`, `OFFSET_MONTH`, `CELL_SIZE`
- [x] **Add loading state to Calendar** — Replaced `null` return with `<div className="Calendar-loading">Loading...</div>`
- [x] **Improve error handling in Calendar** — Only redirect to `/login` on 401, log other errors

## 📋 Next: Code Quality

> **IMPORTANT:** Complete each task one at a time. After each task, verify the app still renders correctly:
> 1. Confirm the Vite dev server at `http://localhost:5173/` is running. If it crashed, restart with `npm start`.
> 2. **You MUST delegate to the `browser-inspector` agent** to verify rendering. Do NOT use `curl` or `fetch` — those only check the static HTML shell and cannot confirm the React app actually rendered. The `browser-inspector` agent uses Chrome DevTools MCP to execute JavaScript in a real browser and can confirm the `#root` div has content and check for console errors.
> 3. If Chrome isn't available on port 9222, launch it first:
>    ```
>    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-profile --no-first-run http://localhost:5173/
>    ```
> 4. Only proceed to the next task once the `browser-inspector` agent confirms rendering is working.
> 5. When committing, only `git add` the files you intentionally changed. Do not add debugging scripts, screenshots, or temporary files. Review `git status` before every commit.

### 1. Consolidate file extensions (Est: 30 min)
- Decide on `.tsx` for all files (type safety)
- Rename `.jsx` files to `.tsx`: `index.jsx`, `Scaffold.jsx`, `Home.jsx`, `Hooks.jsx`, `ThemeContext.jsx`, `Board.jsx`, `Menu.jsx`, `Slider.jsx`, `NotFound.jsx`, `ProtectedRoute.jsx`, `Presentation.jsx`, `Loader.js`, `GoogleAnalytics.jsx`, `util.js`
- Update all imports accordingly

### 2. Deduplicate utility code (Est: 20 min)
- Merge `util.js` and `tools.ts` into a single `utils.ts`
- Remove duplicate functions
- Update all imports

### 3. Fix Calendar type safety (Est: 10 min)
- Change `photos` from `any` to `Map<string, number>` in `Calendar` component state

### 4. Audit and remove unused dependencies (Est: 30 min)
- Check if `@tensorflow-models/blazeface` and `@tensorflow/tfjs` are actually used
- Check if `react-redux` is used (app uses React context)
- Check if `history` is used (react-router-dom v6 has its own)
- Check if `react-beautiful-dnd` is used
- Remove unused packages, run `npm prune`

### 5. Remove remaining CRA artifacts (Est: 5 min)
- Evaluate if `registerServiceWorker.js` is still needed or should be replaced with a Vite PWA plugin
