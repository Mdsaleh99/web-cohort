## Zustand: Basics to Advanced (In-Depth Guide)

This guide covers Zustand from first principles to advanced usage, with practical examples tailored to patterns used in this project (async actions, returning values, and avoiding stale reads).

### What is Zustand?

Zustand is a small, fast, unopinionated state management library for React. It provides a single store (or multiple stores) created via a hook, with minimal boilerplate and great performance.

Key ideas:
- **Store**: a container for state, actions, and derived logic.
- **Selectors**: subscribe to only the slice of state you need.
- **Actions**: functions that update state, usually using `set` and `get`.

---

## Core API: create, set, get

### Creating a store

```jsx
import { create } from 'zustand'

// Minimal shape
export const useCounterStore = create((set, get) => ({
  count: 0,
  // Actions
  increment: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  // Using get to read current state inside an action
  incrementBy: (delta) => {
    const { count } = get()
    set({ count: count + delta })
  }
}))
```

Notes:
- `set` accepts either a partial object or a function `(state) => partial`.
- `get` returns the current store state synchronously.
- Actions can return values (e.g., return fetched data). This is often useful.

### Using the store in components

```jsx
import React from 'react'
import { useCounterStore } from './stores/useCounterStore'

export function Counter() {
  const count = useCounterStore(s => s.count)
  const increment = useCounterStore(s => s.increment)

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

Why selectors? They limit re-renders to only when the selected slice changes.

---



## set: How it works

`set` schedules a state update and notifies subscribers. It does not return the updated state. Because React re-render is async and batched, reading from the store immediately after calling an action in the same tick may still give you the old value.

Examples:

```jsx
// Object patch
set({ ready: true })

// Functional update (recommended when derived from previous state)
set(prev => ({ count: prev.count + 1 }))

// Replace entire state (careful!)
set(() => initialState, true) // second arg replaces instead of merges
```

---

## get: Synchronous read inside actions

Use `get()` inside actions to read the latest state without causing renders.

```jsx
const toggleTheme = () => {
  const isDark = get().isDark
  set({ isDark: !isDark })
}
```

Avoid using `get()` inside React components (use the hook with selectors instead), otherwise you lose automatic subscriptions.

---

## Returning values from actions (important pattern)

Even when you call `set`, you can (and often should) return the fetched/processed data from an action so that the caller can use it immediately. This helps avoid stale reads and race conditions.

```jsx
export const useCompanyStore = create((set, get) => ({
  companyData: null,
  companyMembers: [],

  getCompanyByUser: async () => {
    const data = await api.getCompanyByUser()
    set({ companyData: data })
    return data // allow caller to use fresh value immediately
  },

  getAllCompanyMembers: async (companyId) => {
    const list = await api.getMembers(companyId)
    set({ companyMembers: list })
    return list // caller can set local UI state without waiting for re-render
  },
}))
```

Usage in a component:

```jsx
const load = async () => {
  const company = await useCompanyStore.getState().getCompanyByUser()
  const members = await useCompanyStore.getState().getAllCompanyMembers(company.id)
  setLocalCompany(company)
  setLocalMembers(members)
}
```

This avoids reading the store immediately after an async action and getting stale data.

---

## Selectors and shallow comparison

```jsx
import { shallow } from 'zustand/shallow'

const [a, b] = useMyStore(s => [s.a, s.b], shallow)
```

Benefits:
- Subscribe to the smallest necessary slice to reduce renders
- Use `shallow` to prevent re-renders when array/object references are stable by value equality (per-key)

Pitfall:
- Without `shallow`, `useStore(s => ({ a: s.a, b: s.b }))` will re-render whenever the object reference changes.

---

## Subscribing outside React (low-level API)

```jsx
const unsubscribe = useCounterStore.subscribe(
  state => state.count,
  (count, prev) => {
    console.log('count changed', { prev, count })
  },
  { equalityFn: Object.is, fireImmediately: false }
)

// Later
unsubscribe()
```

This is useful for integration with non-React code or side effects.

---

## Middleware: persist, devtools, immer, subscribeWithSelector

```jsx
import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useCartStore = create(
  subscribeWithSelector(
    devtools(
      persist(
        immer((set, get) => ({
          items: [],
          addItem: (item) => set(state => { state.items.push(item) }), // immer
          clear: () => set({ items: [] })
        })),
        { name: 'cart' } // localStorage key
      ),
      { name: 'CartStore' }
    )
  )
)
```

Notes:
- `persist` stores state in `localStorage` (or custom storage). Be mindful of SSR and hydration.
- `devtools` integrates with Redux DevTools.
- `immer` allows mutating syntax while keeping immutability under the hood.
- `subscribeWithSelector` makes `.subscribe(selector, listener)` efficient.

---

## Async actions: patterns and pitfalls

Pattern with loading/error flags:

```jsx
export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const user = await api.getUser(id)
      set({ user })
      return user
    } catch (e) {
      set({ error: e })
      throw e
    } finally {
      set({ isLoading: false })
    }
  }
}))
```

Pitfalls:
- Reading `user` from the store immediately after `await fetchUser()` is fine, but reading it right after calling `fetchUser()` without `await` may be stale.
- Avoid mixing store state with local component state for the same data unless you have a reason (e.g., optimistic UI or snapshotting). If you do, prefer the pattern of returning values from actions and setting local state from those returned values.

---

## Patterns: Slices (modular stores)

```ts
// types.ts
export interface BearSlice { bears: number; addBear: () => void }
export interface FishSlice { fishes: number; addFish: () => void }
export type StoreState = BearSlice & FishSlice

// bearSlice.ts
export const createBearSlice = (set, get): BearSlice => ({
  bears: 0,
  addBear: () => set(s => ({ bears: s.bears + 1 }))
})

// fishSlice.ts
export const createFishSlice = (set, get): FishSlice => ({
  fishes: 0,
  addFish: () => set(s => ({ fishes: s.fishes + 1 }))
})

// store.ts
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'

export const useStore = create((set, get) => ({
  ...createBearSlice(set, get),
  ...createFishSlice(set, get),
}))
```

Benefits:
- Modularizes state by domain
- Easier testing and reuse

---

## SSR and hydration

- With `persist`, ensure the initial render does not assume persisted state synchronously; gate UI until hydration, or use `onRehydrateStorage`.
- For server-rendered pages, initialize stores per request to avoid cross-user leakage.

```jsx
// Example: gating UI until persist hydration
const hydrated = useCartStore(s => s._hasHydrated)
React.useEffect(() => {
  const unsub = useCartStore.persist.onFinishHydration(() => {
    useCartStore.setState({ _hasHydrated: true })
  })
  return unsub
}, [])
```

---

## Performance tips

- Use fine-grained selectors: `useStore(s => s.value)` instead of grabbing the whole state.
- Use `shallow` when selecting tuples/objects: `useStore(s => [s.a, s.b], shallow)`.
- Keep actions stable (defined once in the store), not re-created in components.
- Prefer functional `set` when updating based on previous state to avoid accidental stale closures.

---

## Testing stores

```ts
import { act } from '@testing-library/react'
import { useCounterStore } from './useCounterStore'

test('increments', () => {
  act(() => {
    useCounterStore.getState().increment()
  })
  expect(useCounterStore.getState().count).toBe(1)
})
```

For async actions, `await` them and assert on final state or returned values.

---

## Advanced utilities

- `useStore.getState()` — read the current state outside React.
- `useStore.setState(partial, replace?)` — imperative set outside actions.
- `useStore.subscribe(listener)` — subscribe to all changes.
- `useStore.subscribe(selector, listener)` — subscribe to a slice (with `subscribeWithSelector`).
- `useStore.destroy()` — cleanup memory (useful in tests or dynamic stores).

```jsx
// Imperative update outside React
useCartStore.setState({ items: [] })

// Read without subscribing
const { items } = useCartStore.getState()
```

---

## Common pitfalls and how to avoid them

- "I updated the store but my component still reads old data in the same function":
  - Return values from actions and use those directly, or `await` the action and then read from the store in a separate tick.
- "Too many re-renders":
  - Use selectors and `shallow`.
- "Persist + SSR mismatch":
  - Gate UI until hydration; separate server and client initialization.
- "Complex nested updates are noisy":
  - Use the `immer` middleware for ergonomic immutable updates.

---

## Putting it together (practical example)

```jsx
// store/useCompanyStore.js
import { create } from 'zustand'
import { companyService } from '@/services/company.service'

export const useCompanyStore = create((set, get) => ({
  companyData: null,
  companyMembers: [],
  isGetCompany: false,
  isGetCompanyMembers: false,
  companyError: null,

  getCompanyByUser: async () => {
    set({ isGetCompany: true, companyError: null })
    try {
      const data = await companyService.getCompanyByUser()
      set({ companyData: data })
      return data
    } catch (e) {
      set({ companyError: e, companyData: null })
      throw e
    } finally {
      set({ isGetCompany: false })
    }
  },

  getAllCompanyMembers: async (companyId) => {
    set({ isGetCompanyMembers: true, companyError: null })
    try {
      const list = await companyService.getAllCompanyMembers(companyId)
      set({ companyMembers: list })
      return list
    } catch (e) {
      set({ companyError: e })
      throw e
    } finally {
      set({ isGetCompanyMembers: false })
    }
  },
}))

// component usage
const load = async () => {
  const company = await useCompanyStore.getState().getCompanyByUser()
  const members = await useCompanyStore.getState().getAllCompanyMembers(company.id)
  setCompany(company)
  setMembers(members)
}
```

This pattern ensures your UI can immediately render the fetched data and avoids stale reads right after async actions complete.

---

## Simple explanation: set, get, and returned values

Think: the store is a box.
- **set**: put new stuff in the box. Components re-render soon.
- **get**: peek inside the box right now (use this inside actions).

Minimal example:
```jsx
import { create } from 'zustand'

export const useCounter = create((set, get) => ({
  count: 0,
  increment: () => set(s => ({ count: s.count + 1 })),
  incrementBy: (n) => {
    const current = get().count
    set({ count: current + n })
  },
  // Return a value so callers can use it immediately
  saveAndReturnNewCount: () => {
    set(s => ({ count: s.count + 1 }))
    return get().count
  },
}))
```

Why return values from actions?
- `set(...)` updates the store for future renders, but your current function might still read the old value if you check it immediately.
- Returning the fresh value gives the caller the exact result now, avoiding stale reads or race conditions.

Bad (can read old value in the same tick):
```jsx
useCounter.getState().increment()
const now = useCounter.getState().count // might still be the old number
```

Good (return from the action):
```jsx
const now = useCounter.getState().saveAndReturnNewCount() // fresh number
```

---

## Simple explanation specific to companyMembers

In this project we have:
```jsx
// inside useCompanyStore
getAllCompanyMembers: async (companyId) => {
  const list = await companyService.getAllCompanyMembers(companyId)
  set({ companyMembers: list })
  return list // important
}
```

Why do we `return list` even though we already `set({ companyMembers: list })`?
- When the page loads (especially after a hard refresh), timing can cause the component to read `companyMembers` before React finishes re-rendering.
- If the action returns the fresh `list`, the component can use it immediately without waiting for the re-render cycle.

Page usage:
```jsx
const load = async () => {
  const company = await useCompanyStore.getState().getCompanyByUser()
  const list = await useCompanyStore.getState().getAllCompanyMembers(company.id)
  setCompany(company)      // use fresh value now
  setMembers(list)         // use fresh list now
  // The store is also updated so other components see the data on their next render
}
```

In short:
- `set` updates the global state for everyone.
- `return list` gives the caller (your page) the fresh data right now, so it can render immediately and avoid stale reads.

---

### Further reading

- [Zustand Docs](`https://docs.pmnd.rs/zustand/getting-started/introduction`)
- [React State Updates](`https://react.dev/learn/queueing-a-series-of-state-updates`)
- [Thinking in React](`https://react.dev/learn/thinking-in-react`)
- [Render and Commit](`https://react.dev/learn/render-and-commit`)
- [Queuing State Updates](`https://react.dev/learn/queueing-a-series-of-state-updates`)
- [Middleware](`https://docs.pmnd.rs/zustand/integrations/persisting-store-data`)
- [Patterns and recipes](`https://docs.pmnd.rs/zustand/guides/typescript`)



