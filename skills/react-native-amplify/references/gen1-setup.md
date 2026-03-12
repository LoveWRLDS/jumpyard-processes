# Gen 1 Setup (Legacy)

Use this only when the project already has `aws-exports.js` / was initialized with Amplify Gen 1 CLI.

## Prerequisites

- `npm install -g @aws-amplify/cli` (v12+)
- `amplify configure` already run (IAM user created)

## Step 1: Initialize

```bash
cd YourProject
amplify init
```

Prompts:
- App type: `javascript`, Framework: `react-native`
- Source: `src`, Distribution: `build`

## Step 2: Add Auth

```bash
amplify add auth
```

- Default configuration → Email sign-in
- Required attributes: `email`, `name`
- MFA: OFF

## Step 3: Add API

```bash
amplify add api
```

- GraphQL
- Auth: API Key (default) + Cognito User Pool (additional)
- Edit schema now

See [gen1-schema.md](gen1-schema.md) for schema patterns.

## Step 4: Add Storage

```bash
amplify add storage
```

- Content (images, audio, video)
- Auth users: read/write

## Step 5: Push

```bash
amplify push
```

Generates `src/aws-exports.js` and `src/graphql/` auto-generated queries.

## Step 6: Install Dependencies

```bash
npm install aws-amplify @aws-amplify/react-native @react-native-async-storage/async-storage react-native-get-random-values
cd ios && pod install && cd ..
```

## Step 7: Configure in App

In `index.js` (before `AppRegistry`):

```javascript
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/aws-exports';

Amplify.configure(amplifyconfig);
```

## Step 8: Data CRUD

See [gen1-crud.md](gen1-crud.md) for custom query patterns.

**Critical:** Never use auto-generated queries with nested relations — always write custom flattened queries to avoid `@auth` errors.

## Gen 1 Gotchas

1. **`@auth` errors on nested queries** — Always use custom flattened queries
2. **`amplify push` fails** — Run `amplify status` first, then `amplify push --force` if needed
3. **S3 access levels** — Use `'guest'` for content shared between users
