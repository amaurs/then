### Then

Bacon & Easter Eggs

🥓

A personal creative portfolio — algorithmic and artistic _bits_ running as fullscreen animations, alongside a blog, calendar, and other subdomains. Single React/TypeScript/Vite codebase, multi-subdomain routing.

---

### Architecture

**Entry point**: `src/index.tsx` inspects `window.location.host` and renders a different root component per subdomain (`blog.`, `calendar.`, `into.`, `machine.`, etc.). The main app falls through to `Scaffold`.

**`Scaffold.tsx`** — wraps `Home` with the `ThemeContext` (light / dark / konami) and fetches all backend data on mount: bolero phrase, TSP solution, photography images, QR short-codes, and the backend-driven bit definitions.

**`Home.tsx`** — owns routing. Builds a `mapping` of `{ '/slug': { component, content } }` from two sources:

-   **`buildStaticMapping`** — self-contained bits hard-coded here, each pointing to its own `.tsx` component and `.md` description.
-   **Backend-driven bits** — slugs returned by `GET /colors` are wired up dynamically to the generic `Animation` component. These bits only have a `.md` file in `src/bits/`; all rendering logic lives in `Animation.tsx`.

The mapping is consumed by three things: the background carousel on the home screen, the `/bits` menu, and the individual `/bit/:slug` routes.

**`src/bits/`** — one folder per bit, named in lowercase, no separators.

---

### Bits

Each bit lives in `src/bits/<name>/` and follows one of two shapes:

**Self-contained** — has its own rendering logic:

```
src/bits/<name>/
  <Name>.tsx   ← React component
  <Name>.css   ← styles
  <Name>.md    ← description shown in studio mode
```

**Backend-driven** — resolved at runtime via the `/colors` API; only the description is stored here:

```
src/bits/<name>/
  <Name>.md    ← description shown in studio mode
```

Every bit component receives the same base props:

```ts
interface Props {
    title: string
    delay: number // ms before the animation starts (presentation countdown)
    style: CSS.Properties
    width: number
    height: number
}
```

While `presenting`, render `<Loader title={props.title} />`. Once the timeout fires, render the actual animation.

---

### Adding a self-contained bit

1. **Create the folder** `src/bits/<name>/` with `<Name>.tsx`, `<Name>.css`, and `<Name>.md`.

2. **Implement the component** — follow the `Props` interface above. Use `useTimeout` from `Hooks.tsx` to handle the `delay`. Access the current theme via `useContext(ThemeContext)`. Clean up `requestAnimationFrame` / `setTimeout` handles in the `useEffect` return.

3. **Lazy-import it** in `Home.tsx`:

    ```ts
    const MyBit = lazy(() => import('./bits/<name>/<Name>'))
    ```

4. **Import the markdown** in `Home.tsx`:

    ```ts
    import myBit from './bits/<name>/<Name>.md'
    ```

5. **Register it** in `buildStaticMapping` inside `Home.tsx`:

    ```ts
    '/<slug>': {
        content: myBit,
        component: <MyBit title="<slug>" style={{}} delay={presentationTime} width={width} height={height} />,
    },
    ```

The bit will automatically appear in the `/bits` menu and get a route at `/bit/<slug>`.

---

### Local Development

Copy the env vars and fill in the values:

```
VITE_API_HOST=          # backend API base URL
VITE_GA_ID=             # Google Analytics measurement ID (optional)
VITE_GOOGLE_CLIENT_ID=  # Google OAuth client ID (needed for blog/machine auth)
```

Add the following to `/etc/hosts` to enable subdomain routing locally:

```
127.0.0.1 blog.localhost calendar.localhost into.localhost poroto.localhost machine.localhost
```

Run the dev server:

```
npm start
```

Subdomains are accessible at:

-   `http://localhost:5173` — main app (bits, blog, home)
-   `http://blog.localhost:5173` — blog + calendar
-   `http://calendar.localhost:5173` — calendar
-   `http://into.localhost:5173` — about
-   `http://poroto.localhost:5173` — poroto (requires owner auth): names, flyer
-   `http://machine.localhost:5173` — machine (requires owner auth)

---

### Decisions

Significant design decisions are recorded in `docs/decisions/`. Add a new ADR there when a non-obvious architectural choice is made.

---

### Commits

Single-line, emoji-prefixed. The emoji should reflect the nature of the change — no strict taxonomy, but keep it honest and thematic.

```
✨ New feature or noticeable improvement
🎨 Visual or style change
🐛 Bug fix
🔧 Tooling, config, or wiring
🧹 Cleanup or refactor
📝 Docs or copy change
⚡ Performance change
🔐 Auth or security change
📱 Mobile or PWA change
🔄 Sync, update, or refresh
```
