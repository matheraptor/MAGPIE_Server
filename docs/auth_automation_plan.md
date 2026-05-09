# Automated Auth & Session Management Plan

## Goal

Implement a seamless authentication system where users log in once and the system handles token lifecycle (issuance, expiration, and renewal) automatically without interrupting the user experience.

## Phase 1: Session Architecture (The "Silent Refresh" Model)

- **Dual-Token System**:
  - **Access Token**: Short-lived (e.g., 15m), used for API/Socket authorization.
  - **Refresh Token**: Long-lived (e.g., 7d), stored in an `httpOnly` secure cookie.
  - **Refresh Flow**:
  - Client detects `jwt expired` error.
  - Client calls `/refresh` endpoint.
  - Server validates Refresh Token and issues a new Access Token.
    - Client updates socket connection and resumes.

## Phase 2: Implementation Steps

1. **Auth Core Update (`core/auth.js`)**:
    - Implement `signRefreshToken` and `verifyRefreshToken`.
    - Configure separate expiration times for both token types.
2. **Server Endpoints (`SERVER.js`)**:
    - Implement `/login` to issue both tokens.
    - Implement `/refresh` to rotate access tokens.
3. **Socket Middleware Integration**:
    - Update middleware to handle expiration gracefully.
    - Emit a specific `AUTH_EXPIRED` event to trigger client-side refresh.
4. **Client-Side Logic**:
    - Implement an interceptor to catch 401/Expired errors.
    - Automate the call to `/refresh` and socket reconnection.

## Phase 3: Validation

- Test token expiration trigger.
- Verify "silent" renewal without user prompt.
- Ensure session termination on logout (invalidating refresh token).
