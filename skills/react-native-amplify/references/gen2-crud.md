# Gen 2 CRUD Patterns

## Client Setup

Import the generated `Schema` type for full type safety — no custom query strings needed.

```typescript
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>({ authMode: 'userPool' });
```

## CRUD Operations

### List

```typescript
const { data: items, errors } = await client.models.Item.list();
```

### List with Filter

```typescript
const { data: items } = await client.models.Item.list({
    filter: { name: { contains: 'search' } }
});
```

### Get by ID

```typescript
const { data: item } = await client.models.Item.get({ id: itemId });
```

### Create

```typescript
const { data: newItem } = await client.models.Item.create({
    name: 'New Item',
    description: 'Details',
});
```

### Update

```typescript
await client.models.Item.update({
    id: item.id,
    name: 'Updated Name',
});
```

### Delete

```typescript
await client.models.Item.delete({ id: item.id });
```

### Delete Error Handling

Amplify sometimes throws even on successful deletions. Handle gracefully:

```typescript
try {
    await client.models.Item.delete({ id });
    removeFromLocalState(id);
} catch (e: any) {
    if (e?.data?.deleteItem) {
        // Deletion succeeded despite error
        removeFromLocalState(id);
    } else {
        throw e;
    }
}
```

## Pagination

```typescript
let allItems: Schema['Item']['type'][] = [];
let nextToken: string | null | undefined = undefined;

do {
    const { data, nextToken: token } = await client.models.Item.list({
        limit: 100,
        nextToken,
    });
    allItems = [...allItems, ...data];
    nextToken = token;
} while (nextToken);
```

## Viewers Pattern (Shared Access)

```typescript
// Grant read access to another user
const updated = [...new Set([...(item.viewers ?? []), targetUserId])];
await client.models.Item.update({ id: item.id, viewers: updated });

// Revoke access
const filtered = (item.viewers ?? []).filter(id => id !== targetUserId);
await client.models.Item.update({ id: item.id, viewers: filtered });
```

## Foreign Key (Relations)

```typescript
// Create child linked to parent
const { data: child } = await client.models.Item.create({
    name: 'Child Item',
    userId: parentUser.id,
});
```
