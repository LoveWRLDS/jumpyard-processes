# Gen 2 Schema Patterns

## File Location

`amplify/data/resource.ts`

## Basic Template

```typescript
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
    User: a.model({
        email: a.string(),
        name: a.string(),
        avatarKey: a.string(),
        items: a.hasMany('Item', 'userId'),
    }).authorization(allow => [
        allow.owner(),
        allow.authenticated().to(['read']),
    ]),

    Item: a.model({
        name: a.string().required(),
        description: a.string(),
        imageKey: a.string(),
        viewers: a.string().array(),
        userId: a.id(),
        user: a.belongsTo('User', 'userId'),
    }).authorization(allow => [
        allow.owner(),
    ]),
});

export type Schema = typeof schema;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
    },
});
```

## Auth Rules

```typescript
// Owner only (private data)
.authorization(allow => [allow.owner()])

// Owner + authenticated read (profile-like)
.authorization(allow => [
    allow.owner(),
    allow.authenticated().to(['read']),
])

// Public read, owner write
.authorization(allow => [
    allow.guest().to(['read']),
    allow.owner(),
])
```

## Field Types

```typescript
a.string()          // String
a.string().required()
a.string().array()  // [String] — for viewers lists
a.integer()
a.float()
a.boolean()
a.id()              // ID (use for FK fields)
a.datetime()        // ISO datetime
a.enum(['A', 'B'])  // Enum
```

## Relations

```typescript
// One-to-many
Parent: a.model({
    children: a.hasMany('Child', 'parentId'),
})

Child: a.model({
    parentId: a.id(),
    parent: a.belongsTo('Parent', 'parentId'),
})
```

## Backend Entry Point

`amplify/backend.ts`:

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({ auth, data });
```
