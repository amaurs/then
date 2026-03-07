# Then App - TODO

## 🔥 High Priority

### PWA (Progressive Web App) Setup
- [ ] **Convert to PWA - Phase 1: Basic Setup** (Est: 30 min)
  - Create `public/manifest.json` with app metadata
  - Generate app icons (192x192, 512x512) from existing logo
  - Add manifest link and meta tags to index.html
  - Add Apple-specific meta tags for iOS
  - Test "Add to Home Screen" on iPhone
  - **Result**: App installs like native app, runs fullscreen
  
- [ ] **Convert to PWA - Phase 2: Service Worker** (Est: 1 hour)
  - Update existing `registerServiceWorker.js` for Vite
  - Implement basic caching strategy (cache-first for assets)
  - Add offline fallback page
  - Test offline functionality
  - **Result**: App works offline, faster loading
  
- [ ] **Convert to PWA - Phase 3: Camera Integration** (Est: 1 hour)
  - Add camera access for direct photo capture
  - Implement photo upload from camera
  - Add file picker for gallery photos
  - Test on iPhone Safari
  - **Result**: Take photo → upload immediately
  
- [ ] **Convert to PWA - Phase 4: Advanced Features** (Est: 2 hours)
  - Implement smart caching (photos, API responses)
  - Add background sync for uploads (when supported)
  - Add push notifications for shared albums (iOS 16.4+)
  - Optimize for iOS home screen experience
  - **Result**: Near-native app experience

**Why PWA?**
- ✅ Home screen icon (looks like native app)
- ✅ Fullscreen experience (no Safari UI)
- ✅ Camera access for photo upload
- ✅ Offline viewing of cached photos
- ✅ Fast loading with caching
- ✅ Works on both your iPhones
- ✅ No App Store approval needed
- ✅ One codebase for all platforms

**Installation on iPhone**:
1. Open then.gallery in Safari
2. Tap Share → "Add to Home Screen"
3. App appears on home screen
4. Opens fullscreen like native app!

### Performance Optimization
- [x] **Implement lazy loading for routes** (Est: 30 min, Impact: 60-70% bundle reduction)
  - Lazy loaded route components in index.tsx and bit components in Home.tsx
  - Added Suspense boundaries with loading states

- [ ] **Image optimization** (Est: 1 hour)
  - Convert large JPGs to WebP/AVIF
  - Move images to CDN or optimize with Vite plugins
  - Implement lazy loading for images below fold
  - Current: 300-500 KB per image

### Code Quality
- [x] **Consolidate file extensions** (Est: 30 min)
  - Renamed all `.jsx` files to `.tsx`
  - Updated all imports

- [x] **Remove CRA artifacts** (Est: 10 min)
  - Deleted `react-app-env.d.ts`
  - Removed `registerServiceWorker.js`, replaced with minimal inline registration

### Dependencies
- [x] **Audit and remove unused dependencies** (Est: 30 min)
  - Removed `react-redux` and `history`
  - Fixed stale imports

- [x] **Deduplicate utility code** (Est: 20 min)
  - Merged `util.js` and `tools.ts` into single `utils.ts`
  - Removed duplicate functions
  - Updated all imports

## 🎯 Medium Priority

### Calendar Component Improvements
- [x] **Add loading state to Calendar** (Est: 10 min)
  - Replaced `null` return with loading indicator
  
- [x] **Improve error handling in Calendar** (Est: 15 min)
  - Only redirect to login on 401 Unauthorized
  - Log other errors without redirecting
  
- [x] **Fix Calendar type safety** (Est: 10 min)
  - Changed `photos` from `any` to `Map<string, number>`
  
- [x] **Extract Calendar magic numbers to constants** (Est: 15 min)
  - Moved hardcoded values to named constants: `DAYS_IN_A_WEEK`, `OFFSET_WEEK`, `OFFSET_DAY`, `OFFSET_MONTH`, `CELL_SIZE`
  
- [x] **Refactor Calendar color logic** (Est: 10 min)
  - Replaced nested ternaries in `getColor()` with `HEAT_MAP_COLORS` array lookup
  
- [ ] **Add Calendar accessibility** (Est: 30 min)
  - Add ARIA labels to canvas
  - Implement keyboard navigation
  - Add screen reader support for dates
  
- [ ] **Optimize Calendar rendering** (Est: 20 min)
  - Memoize calendar painting logic
  - Use React.memo for _Calendar component
  - Prevent unnecessary repaints

### Architecture
- [ ] **Evaluate SSR migration** (Est: Research phase)
  - Document current subdomain routing requirements
  - Evaluate Next.js vs Remix vs Vite SSR
  - Create migration plan
  - Consider impact on deployment pipeline

- [ ] **API client consolidation** (Est: 1 hour)
  - Centralize API calls (currently scattered)
  - Add error handling
  - Add loading states
  - Consider React Query or SWR

### Developer Experience
- [x] **Add ESLint configuration** (Est: 30 min)
  - Installed eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin, eslint-plugin-react, eslint-plugin-react-hooks
  - Created `.eslintrc.json` with TypeScript + React rules
  - Added `lint` script to package.json

- [ ] **Set up Git hooks** (Est: 15 min)
  - Install: `husky`, `lint-staged`
  - Configure pre-commit: format + lint
  - Configure pre-push: type check
  - Prevent broken code from being committed

- [ ] **Add VS Code workspace settings** (Est: 10 min)
  - Create `.vscode/settings.json` (format on save, auto-fix)
  - Create `.vscode/extensions.json` (recommended extensions)
  - Share consistent editor config across team

- [x] **Fix TypeScript type errors** (Est: 20 min)
  - Created `vite-env.d.ts` for image imports
  - Added type declarations for assets (jpg, png, woff, woff2)

- [ ] **Improve build output** (Est: 15 min)
  - Configure Vite to show bundle analysis
  - Add build size warnings
  - Document build process

## 📝 Low Priority

### Documentation
- [ ] **Document environment variables** (Est: 15 min)
  - List all required VITE_* variables
  - Document what each does
  - Add .env.example file

- [ ] **Component documentation** (Est: Ongoing)
  - Add JSDoc comments to complex components
  - Document props with TypeScript interfaces
  - Add usage examples

### Testing
- [ ] **Set up Vitest properly** (Est: 1 hour)
  - Configure test environment
  - Add basic component tests
  - Set up CI testing

## 💡 UX Ideas - Main App & Bits Menu

### Idea 9: Mobile-First Bits Menu with Scroll-Based Preview
**Problem**: Hover interaction doesn't work on mobile - menu is unusable  
**Solution**: Scroll-based preview for mobile devices
- Vertical scrollable list of project names
- As user scrolls, detect which name is closest to center of screen
- Load that project in background (same as hover on desktop)
- Smooth transitions between projects as you scroll
- Snap to center (optional) for better control
- Keep hover interaction for desktop
**Current**: Desktop hover works great, mobile broken  
**New**: Scroll through list → preview updates → tap to open full project  
**Impact**: Makes the unique preview interaction work on mobile  
**Effort**: 2-3 hours  
**Priority**: High - Critical for mobile experience

**Technical Approach**:
```javascript
// Intersection Observer or scroll event
// Calculate distance of each menu item from viewport center
// Load project with minimum distance
// Debounce for performance
```

**Design Considerations**:
- Large touch targets (min 44px height)
- Clear visual indicator of "active" item (centered)
- Smooth background transitions
- Consider snap scrolling for precision
- Test on actual mobile devices

### Idea 10: Enhance Bits Menu with Visual Cues
**Problem**: 27 text-only items hard to scan, no visual differentiation  
**Solution**: Add visual hierarchy and cues
- Small icon or color dot next to each project name
- Category headers (Algorithms, Art, Photography, Games)
- Collapsible sections for categories
- Search/filter functionality
- Keep hover preview interaction!
**Impact**: Easier to find specific projects  
**Effort**: 2 hours  
**Priority**: Medium

### Idea 11: Improve Home Page Context
**Problem**: Auto-rotating backgrounds with no context - mysterious  
**Solution**: Add minimal context without losing aesthetic
- Show current project name (small, bottom corner)
- Subtitle: "Creative coding experiments" or similar
- Pause/play button for rotation
- "Explore" button → /bits
- Keep the mystery but add discoverability
**Impact**: Visitors understand what they're looking at  
**Effort**: 1 hour  
**Priority**: Medium

### Idea 12: Add Project Descriptions
**Problem**: No context until you click into project  
**Solution**: Enhance individual project pages
- Title + one-line description at top
- Show markdown content (already exists!)
- "Back to Bits" navigation
- Next/Previous project links
- Share button with direct URL
**Impact**: Better understanding of each project  
**Effort**: 30 min per project (or create template)  
**Priority**: Low - Nice to have

### Idea 13: Admin-Only Video Recording for Portfolio Content
**Problem**: Need video clips of projects for portfolio/social media  
**Solution**: Admin-only recording feature using FFmpeg.wasm (desktop only)
- Add "Record" button (visible only when logged in as admin)
- Capture canvas frames for 10 seconds (or custom duration)
- Use FFmpeg.wasm to encode to MP4 in browser
- Download video file directly
- Use recordings as:
  - Project thumbnails/previews
  - Social media content
  - Portfolio reel clips
  - Gallery view animations
**Tech Stack**:
- `@ffmpeg/ffmpeg` - FFmpeg compiled to WebAssembly
- Manual frame capture from canvas → FFmpeg encoding
- Admin authentication (already have login system)
**Use Cases**:
- Generate preview videos for all 27 projects
- Create portfolio reel
- Share on social media
- Animated thumbnails for gallery view
**Impact**: Creates shareable content, improves portfolio presentation  
**Effort**: 2-3 hours (admin-only, desktop-only simplifies implementation)  
**Priority**: Medium - Content creation tool

**Simplified Implementation** (Admin Desktop Only):
```javascript
// Only show if user.isAdmin
<button onClick={recordVideo}>Record 10s</button>

// Capture at 30 FPS for 10 seconds = 300 frames
// Encode with FFmpeg.wasm
// Download MP4
```

**Benefits of Admin-Only**:
- No mobile optimization needed
- Can use full FFmpeg.wasm (30MB is fine)
- Higher quality settings (desktop has more power)
- Simpler UI (just a button)
- One-time content generation, not user-facing feature

## 💡 UX Ideas - Calendar & Album

### Idea 1: Infinite Scroll in Album View
**Problem**: Must return to calendar to navigate between dates - very tedious  
**Solution**: Add prev/next navigation directly in Album view
- Swipe left/right (mobile) or arrow keys (desktop) to move between days
- Infinite scroll through time without leaving album view
- Show floating date indicator as you navigate
- Preload adjacent days for smooth transitions
**Impact**: Eliminates the back-and-forth navigation flow  
**Effort**: 1-2 hours  
**Priority**: High - Biggest UX improvement

### Idea 2: Fix Mobile Experience
**Problem**: Calendar is completely broken/unusable on mobile  
**Solution**: Mobile-first responsive redesign
- Touch-friendly hit targets (larger squares or switch to list view on mobile)
- Pinch to zoom on calendar grid
- Swipe gestures for navigation
- Responsive layout that adapts to small screens
- Test on actual mobile devices
**Impact**: Makes app usable for 50% of potential usage  
**Effort**: 1-2 hours  
**Priority**: Critical

### Idea 3: Add Month Labels to Calendar
**Problem**: Only year labels - hard to find specific dates  
**Solution**: Add month indicators to calendar grid
- Show month names/abbreviations on calendar
- Visual separators between months
- Highlight current month
- Make months clickable to jump to that section
**Impact**: Better orientation and date finding  
**Effort**: 30 minutes  
**Priority**: Medium - Quick win

### Idea 4: Timeline Feed View (Alternative Mode)
**Problem**: Grid view not intuitive for chronological browsing  
**Solution**: Add second view mode - scrollable timeline
- Toggle between "Grid View" and "Timeline View"
- Timeline shows: Date + thumbnail(s) + photo count
- Infinite scroll through all dates
- Click any item to open full album
- Better for "browsing memories randomly"
**Impact**: Provides intuitive alternative to grid  
**Effort**: 2-3 hours  
**Priority**: Medium - Nice to have

### Idea 5: Thumbnail Previews on Hover
**Problem**: No visual feedback about what photos exist on a date  
**Solution**: Show thumbnail preview on hover (desktop)
- Hover over calendar square → small thumbnail appears
- Show first photo of that day
- Include photo count badge
- Smooth fade-in animation
**Impact**: Visual confirmation before clicking  
**Effort**: 1 hour  
**Priority**: Low - Polish

### Idea 6: Multi-Media Content Support
**Problem**: Future expansion beyond photos (blog entries, video, audio)  
**Solution**: Support multiple content types in calendar
- Icons for different types: 📷 photo, 📝 note, 🎥 video, 🎵 audio
- Mixed content days show multiple indicators
- Filter by content type
- Update API to support different media types
- Digital scrapbook for your daughter
**Impact**: Transforms from photo calendar to full memory system  
**Effort**: 4-6 hours (backend + frontend)  
**Priority**: Future - Requires planning

### Idea 7: Improved Visual Cues
**Problem**: Calendar is hard to understand even for creator  
**Solution**: Better visual hierarchy and indicators
- Clearer color gradient (with legend)
- Larger squares with better spacing
- Show actual photo count on hover (not just color)
- Add mini calendar widget for quick date jumping
- Improve typography and labels
**Impact**: More intuitive interface  
**Effort**: 1-2 hours  
**Priority**: Medium

### Idea 8: Mobile Photo Upload
**Problem**: Must sync local device with S3 manually - tedious workflow  
**Solution**: Direct upload from phone browser
- Add "Upload Photos" button in Album view
- Native file picker for selecting photos from phone
- Direct upload to S3 (presigned URLs or API endpoint)
- Show upload progress
- Auto-refresh calendar after upload
- Optional: Batch upload multiple photos
- Optional: Camera integration (take photo → upload immediately)
**Current Workflow**: Camera → Computer → S3 sync → View  
**New Workflow**: Camera → Phone browser → Upload → View  
**Impact**: Makes it practical to upload photos on-the-go  
**Effort**: 2-3 hours (backend API + frontend UI)  
**Priority**: High - Major workflow improvement

**Technical Considerations**:
- Need backend endpoint for presigned S3 URLs or direct upload
- Handle image compression/resizing on upload
- EXIF data extraction for date/location
- Authentication required (already have login)
- Consider PWA for better mobile experience

## 🚀 Future Considerations

- [ ] **MCP Browser Server Integration** (Est: 2-3 hours)
  - Research and select MCP browser server (@modelcontextprotocol/server-playwright recommended)
  - Install and configure MCP server
  - Set up Kiro CLI to use browser MCP server
  - Enable AI agent capabilities:
    - Navigate to localhost dev server
    - Take screenshots of routes/components
    - Interact with UI (click, type, scroll)
    - Verify visual changes in real-time
    - Debug layout/styling issues
  - Document setup and usage workflow
  - **Impact**: Enables tight feedback loop for UI development with AI assistance

- [ ] Migrate to React 19 (when dependencies support it)
- [ ] Consider moving to Tailwind CSS (currently using CSS modules)
- [ ] Evaluate state management (currently using React context)
- [ ] Add error boundary components
- [ ] Implement analytics properly (React GA4 is installed)

## 📊 Current Metrics

- **Bundle Size**: 2.78 MB (565 KB gzipped)
- **Component Count**: 51 files
- **Dependencies**: 20 production, 8 dev
- **Build Time**: ~4 seconds

## 🎯 Target Metrics

- **Bundle Size**: < 500 KB initial (< 150 KB gzipped)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
