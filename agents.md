# Agent instructions

## General

- Do not commit without my consent or explicit instruction.
- Use common sense: before making large architectural changes, describe your plan and wait for my response.

## Subpath-safe URLs

This app is deployed under a configurable base path (e.g. `/apps/planner-v2/`) via `VITE_BASE` / `import.meta.env.BASE_URL`. `BrowserRouter` in `frontend/src/App.jsx` uses that value as `basename`.

All in-app navigation and API calls must remain correct when the app is served from a prefix. A path like `/tickets/42` is **app-relative** (relative to the router basename), not host-root-absolute.

### In-app navigation

- Use React Router: `useNavigate`, `<Link>`, or `navigateWithParams` from `frontend/src/navigation.js`.
- Pass app-relative paths such as `/tickets/42`, `/calendar`, `/things/3`.
- **Do not** navigate in-app with `window.location.href`, `window.location.assign`, `location.replace`, or plain `<a href="/...">`. Those resolve from the host root, skip React Router, and ignore `basename` — e.g. clicking a calendar ticket can 404 because the browser requests `/tickets/42` instead of `/apps/planner-v2/tickets/42`.

### API requests

- Keep fetch paths in the `/api/...` form used elsewhere in the codebase.
- Resolve them with `withApiBase()` from `frontend/src/api/config.js` so production gets the correct API prefix (e.g. `/apps/planner-v2/api/...`).

### Exceptions

- Full external URLs (`https://...`) are fine and are not subject to this rule.