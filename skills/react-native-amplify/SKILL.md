---
name: react-native-amplify
description: "Set up AWS Amplify in a React Native CLI app with Cognito auth, AppSync/GraphQL API, and S3 storage. Defaults to Gen 2 (TypeScript schema, ampx sandbox, amplify_outputs.json). Falls back to Gen 1 only for existing projects already using aws-exports.js. Use when creating or adding AWS backend to a React Native app, setting up user authentication with email/password, creating a GraphQL data model, or integrating S3 file uploads."
---

# React Native + AWS Amplify

## Determine Generation

**Gen 2 (default — use for all new projects):**
- TypeScript schema, `npx ampx sandbox`, `amplify_outputs.json`

**Gen 1 (legacy fallback — only if project already has `aws-exports.js`):**
- See [references/gen1-setup.md](references/gen1-setup.md) for full Gen 1 workflow.

---

## Gen 2 Setup (Default)

### Prerequisites

- AWS account with CLI access
- React Native CLI project (not Expo)

### Step 1: Initialize

```bash
npm create amplify@latest
# or in existing project:
npx ampx init
```

### Step 2: Define Schema

Edit `amplify/data/resource.ts`. See [references/gen2-schema.md](references/gen2-schema.md) for schema patterns and auth rules.

### Step 3: Configure Auth

Edit `amplify/auth/resource.ts`:

```typescript
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
    loginWith: { email: true },
});
```

### Step 4: Run Sandbox (Dev)

```bash
npx ampx sandbox
```

This generates `amplify_outputs.json` in the project root (auto-updated on schema changes).

For production: `npx ampx pipeline-deploy` (via CI/CD).

### Step 5: Install Dependencies

```bash
npm install aws-amplify @aws-amplify/react-native @react-native-async-storage/async-storage react-native-get-random-values
```

For iOS: `cd ios && pod install && cd ..`

### Step 6: Configure in App

In `index.js` (before `AppRegistry`):

```javascript
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';

Amplify.configure(outputs);
```

### Step 7: Auth

Auth client code is identical to Gen 1. See [references/auth-patterns.md](references/auth-patterns.md).

### Step 8: Data CRUD

Gen 2 uses a typed client — no custom queries needed. See [references/gen2-crud.md](references/gen2-crud.md).

### Step 9: Storage

```typescript
import { uploadData, getUrl } from 'aws-amplify/storage';
```

See [references/storage-patterns.md](references/storage-patterns.md).

## AppContext Pattern

Centralize all Amplify logic in a React Context. See `assets/AppContext.tsx` for a template.

The `AppContext.tsx` template works for both Gen 1 and Gen 2 — auth and storage imports are identical. Replace the commented-out data operations with Gen 2 typed client calls (see [references/gen2-crud.md](references/gen2-crud.md)).

## Common Gotchas

**Gen 2:**
1. **`amplify_outputs.json` not committed** — Safe to commit, it contains only endpoint config (no secrets)
2. **Sandbox must be running during dev** — `npx ampx sandbox` must stay active for data operations to work
3. **Schema changes require sandbox restart** — Or wait for auto-reload (~5s)

**Shared (Gen 1 & Gen 2):**
4. **`signIn` when already signed in** — Catch `'already a signed in user'` error, call `signOut()` first, then retry
5. **Missing `react-native-get-random-values`** — Required by Amplify, import at top of entry file
6. **`Hub.listen` cleanup** — Always return the unsubscribe function in `useEffect` cleanup
7. **Android: missing `<uses-permission>`** — Ensure `INTERNET` permission in `AndroidManifest.xml`
