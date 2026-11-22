# Backend Integration Boundary (`src/backend/`)

This directory is the **single integration boundary** between the InternsHub frontend and the future backend API.

> **Current Status:** All obsolete frontend API clients, base URLs, and endpoints have been removed. No backend server is connected yet, and no fake authentication or fake purchase flows are simulated.

## Folder Structure

```text
src/backend/
├── config/env.ts         # Reads VITE_API_BASE_URL and reports isBackendConfigured()
├── client/
│   ├── httpClient.ts     # Fetch-based HTTP client + request/response interceptor hooks
│   └── errors.ts         # BackendError, BackendNotConnectedError, getBackendErrorKey()
├── endpoints/index.ts    # Endpoint path registry (populated once backend contracts are finalized)
├── services/index.ts     # Shared backend service helpers (`notConnected()`)
├── types/common.ts       # Shared API envelope, pagination, and error payload types
├── adapters/index.ts     # DTO -> UI ViewModel adapter utilities
└── index.ts              # Public barrel export
```

## Integration Rules for Developers

1. **Never call `fetch()` directly inside components or pages.**
2. **Never invent endpoints or guess DTO schemas.** Wait for finalized contracts from the Backend Team.
3. Feature-specific service boundaries live inside `src/features/<feature>/services/` and call `httpRequest()` from `@/backend`.
4. Map backend DTOs into UI-friendly models using adapters so components remain decoupled from API field names.
5. See [`BACKEND_INTEGRATION_GUIDE.md`](../../BACKEND_INTEGRATION_GUIDE.md) for the complete step-by-step wiring guide.
