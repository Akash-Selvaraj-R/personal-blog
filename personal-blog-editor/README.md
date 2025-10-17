## Personal Blog Editor (Frontend)

A modern React + Vite frontend for creating, storing, editing, and deleting blog posts with authentication, bin (trash), real-time sync, offline support, and a markdown editor.

### Tech Stack
- React 19 + TypeScript + Vite
- React Router for routing
- Tailwind CSS for styling (dark/light mode)
- Axios for API calls
- React Markdown (GFM) with sanitization for secure preview
- Socket.io client for real-time updates
- React Toastify for notifications
- DnD Kit for drag & drop reordering
- Day.js for dates

### Requirements
- Node.js 18+ (works with 22 as well)

### Setup
```bash
npm install
npm run dev
```

Open the dev server URL printed in the terminal.

### Build
```bash
npm run build
npm run preview
```

### Connecting to a Backend
This app expects a REST backend under `/api`:
- POST `/api/login` { emailOrUsername, password } -> { user, token }
- POST `/api/register` { email, username, password } -> { user, token }
- POST `/api/logout`
- GET `/api/me` -> current user
- GET `/api/posts` query: search, sortBy, sortDir, page, pageSize, includeDeleted
- POST `/api/posts` -> create
- GET `/api/posts/:id`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id` -> soft delete (move to bin)
- POST `/api/posts/:id/restore`
- POST `/api/posts/bin/empty`
- POST `/api/posts/reorder` { order: [{ id, order }] }

The Socket.io server should emit `posts:changed` to notify clients to refresh post lists.

Configure different API base URLs by updating `src/services/api.ts`.

### Features Implemented
- Login/Register with form validation and redirects
- Protected routes and logout
- Dashboard with search, sort, pagination-ready data model
- Markdown editor with image paste hook, auto-save every 30s, fullscreen, secure preview
- Bin page with restore and empty bin
- Drag-and-drop post reordering
- Realtime refresh via Socket.io
- Offline-ready service worker scaffold
- Clipboard button for copying links
- Theme toggle persisted in localStorage
- Basic profile modal & stats sidebar

### Accessibility and Performance
- Keyboard-friendly controls with ARIA labels
- Code splitting with React.lazy and Suspense
- Debounced searches, memoized lists, and lightweight markdown rendering

### Linting
```bash
npm run lint
```
ESLint + TypeScript rules configured (see `eslint.config.js`).

### Future Enhancements
- Image upload integration in `EditorArea` via `onUploadImage`
- Pagination UI when posts > 50
- Share post links, per-post permissions
