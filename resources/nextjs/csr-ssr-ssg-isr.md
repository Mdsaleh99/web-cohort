# Complete Guide to Rendering Patterns in Next.js

Let me explain these fundamental web rendering concepts from basic to advanced, with practical Next.js examples.

## 1. CSR (Client-Side Rendering)

### Basic Concept
The browser receives a minimal HTML shell and JavaScript does all the rendering on the client side.

**Flow:**
1. Server sends basic HTML + JavaScript bundle
2. Browser downloads JavaScript
3. JavaScript executes and renders content
4. User sees the page

**Pros:**
- Rich interactivity
- Reduced server load
- Fast navigation after initial load

**Cons:**
- Slow initial load (large JS bundle)
- Poor SEO (search engines see empty HTML)
- Blank screen while JS loads
- Not ideal for low-powered devices

### 🧩 Example 1: Fetch-based CSR
```tsx
// app/client/page.tsx
'use client'
import { useState, useEffect } from 'react'

export default function ClientPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-8">Loading posts...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Client-Side Rendered Posts</h1>
      <ul className="space-y-3">
        {posts.map(post => (
          <li key={post.id} className="border p-4 rounded">
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```
### 🧩 Example 2: Non-Fetch CSR (Local Computation)
```tsx
// app/client-counter/page.tsx
'use client'
import { useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Client-Side Counter</h1>
      <p>Rendered only in browser. View page source — it’s empty!</p>
      <div className="mt-4 flex items-center gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setCount(count + 1)}
        >
          +
        </button>
        <span className="text-xl">{count}</span>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={() => setCount(count - 1)}
        >
          -
        </button>
      </div>
    </div>
  )
}
```

## 2. SSR (Server-Side Rendering)

### Basic Concept
HTML is generated on the server for **each request**. Fresh data every time.

**Flow:**
1. User requests page
2. Server fetches data and renders HTML
3. Server sends complete HTML to browser
4. Browser displays content immediately
5. JavaScript "hydrates" to make it interactive

**Pros:**
- Great SEO (complete HTML sent to crawlers)
- Fast First Contentful Paint (FCP)
- Always fresh data
- Works without JavaScript

**Cons:**
- Slower Time to First Byte (TTFB)
- Server load increases with traffic
- Full page reload for navigation (without client-side routing)

### 🧩 Example 1: Fetch-based SSR
```tsx
// app/server/page.tsx
export const dynamic = 'force-dynamic' // ensures SSR per request

async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    cache: 'no-store'
  })
  return res.json()
}

export default async function ServerPage() {
  const users = await getData()
  const time = new Date().toLocaleTimeString()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Server-Side Rendered Page</h1>
      <p>Rendered on: {time}</p>
      <ul className="mt-4 space-y-2">
        {users.map((user: any) => (
          <li key={user.id} className="border p-3 rounded">
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

```

### 🧩 Example 2: Non-Fetch SSR (Dynamic Computation)
```tsx
// app/server-random/page.tsx
export const dynamic = 'force-dynamic'

export default async function RandomNumberPage() {
  const randomNumber = Math.floor(Math.random() * 1000)
  const serverTime = new Date().toLocaleString()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Server-Side Random Number</h1>
      <p>Generated on the server at: {serverTime}</p>
      <p className="mt-2 text-lg font-semibold text-blue-600">
        Random Number: {randomNumber}
      </p>
    </div>
  )
}
```

## 3. SSG (Static Site Generation)

### Basic Concept
HTML is generated at **build time**. Same HTML served to all users until next build.

**Flow:**
1. During build: Server fetches data and generates HTML pages
2. HTML files are saved to disk
3. User requests page → Server sends pre-built HTML instantly
4. JavaScript hydrates for interactivity

**Pros:**
- **Blazing fast** (HTML is pre-generated)
- Minimal server load (just serving static files)
- Great SEO
- Can be cached on CDN globally
- Best performance

**Cons:**
- Data can be stale (only updated on rebuild)
- Long build times for many pages
- Not suitable for frequently changing data
- Need to rebuild and redeploy for updates

### 🧩 Example 1: Fetch-based SSG
```tsx
// app/static/page.tsx

async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'force-cache' // Default for SSG
  })
  const data = await res.json()
  return data.slice(0, 5)
}

export default async function StaticPage() {
  const posts = await getPosts()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Static Site Generated Posts</h1>
      <p className="text-gray-600 mb-4">
        These posts were generated at build time.
      </p>
      <ul className="space-y-3">
        {posts.map((post: any) => (
          <li key={post.id} className="border p-3 rounded">
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
```
### 🧩 Example 2: Non-Fetch SSG (Static Computation)
```tsx
// app/static-facts/page.tsx

const facts = [
  'Next.js uses React under the hood.',
  'Static pages are deployed on CDN.',
  'No server is needed for rendering.',
]

export default function StaticFactsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Static Facts Page</h1>
      <ul className="list-disc ml-5 space-y-2">
        {facts.map((fact, i) => (
          <li key={i}>{fact}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-green-600">
        Generated at build time. Content won’t change until redeploy.
      </p>
    </div>
  )
}
```

---

Here are the **key takeaways** from "This ONE LINE will save your NextJS (SSG) app from disaster😱? Explained in Hindi | Day 25/100":

- **Problem with Next.js SSG on Dynamic Routes:**  
  When using Static Site Generation (SSG) for dynamic pages in Next.js, by default, *dynamic segments not explicitly returned by `generateStaticParams` are generated on-demand* (creating HTML files and related cache/data files). This can make your app vulnerable to **storage exhaustion or DDoS**: Any user (or bot) can keep requesting random URLs (e.g., `/post/1000000`) and Next.js will keep generating new files—filling up server storage and consuming compute unnecessarily.

- **The “ONE LINE” Fix:**  
  You must explicitly set a param in your dynamic route segment config:
  ```js
  export const dynamicParams = false;
  ```
  When you set `dynamicParams: false`, only the IDs (segments) defined via `generateStaticParams` will generate static pages; *all other requests will get a 404 and will not trigger file creation*. This protects your server.

- **Why this is missed:**  
  - The Next.js documentation **doesn't highlight this issue clearly**.
  - Most tutorials and videos ignore the dynamicParams behavior, leaving many production apps vulnerable.

- **Impact:**  
  - Without this config, your build generates unnecessary files for every unknown ID hit in production.
  - **Big applications** can suffer severe server resource waste, especially if attacked or crawled by bots.

- **Solution Steps:**  
  - In your dynamic route file (e.g., `[id]/page.js`), add:
    ```js
    export const dynamicParams = false;
    ```
  - This ensures the 404 page is delivered for unknown params, without generating files.

- **Related Concepts:**  
  - Review differences between CSR, SSR, SSG and why SSG fits when data is mostly static (like blog articles).
  - Understand how `generateStaticParams` works for setting valid dynamic pages at build time.

**TL;DR:**  
In Next.js SSG for dynamic routes, always set `dynamicParams: false` so your app is not vulnerable to unwanted static file generation attacks. This simple line secures your project and saves resources.[1]

[1](https://www.youtube.com/watch?v=38trHYZtDmw)

---

## 🧩 Understanding `generateStaticParams` in SSG

`generateStaticParams` is **only needed** when you have **dynamic routes** (like `[id]`, `[slug]`, etc.) and you want to **pre-render multiple static pages** at build time.

For **non-dynamic pages** (like `/ssg-posts` or `/ssg-facts`), you **don’t need** it — the page itself is automatically **statically generated** at build time.

Let’s go through this step by step 👇

---

### ✅ Case 1: **Static Page (No Dynamic Params)**

No need for `generateStaticParams`.

```tsx
// app/ssg-posts/page.tsx

async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'force-cache',
  })
  return res.json()
}

export default async function SSGPostsPage() {
  const posts = await getPosts()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Static Site Generated Posts</h1>
      <p className="text-gray-600 mb-4">
        Generated at build time (single static page).
      </p>
      <ul className="space-y-3">
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id} className="border p-3 rounded">
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

👉 **Explanation:**
This page has no dynamic parameters — so it’s automatically **SSG** at build time.
No `generateStaticParams()` needed.

---

### ✅ Case 2: **Dynamic Static Page (With `generateStaticParams`)**

If you have a route like `/ssg-posts/[id]`, you need to **generate static paths** for each `id` at build time.

```tsx
// app/ssg-posts/[id]/page.tsx

export async function generateStaticParams() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()

  // Tell Next.js which paths to pre-render
  return posts.slice(0, 5).map((post: any) => ({
    id: post.id.toString(),
  }))
}

async function getPost(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    cache: 'force-cache',
  })
  return res.json()
}

export default async function SSGPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700">{post.body}</p>
      <p className="mt-4 text-sm text-green-600">
        Generated statically at build time (Post ID: {params.id})
      </p>
    </div>
  )
}
```

👉 **Explanation:**

* `generateStaticParams()` runs **at build time**.
* It tells Next.js:

  > “Please generate `/ssg-posts/1`, `/ssg-posts/2`, `/ssg-posts/3`, ... at build time.”
* Each page’s data (`getPost`) is fetched **once during the build**.

---

### 🧠 When to Use `generateStaticParams`

| Scenario                      | Example                         | Use `generateStaticParams`?     |
| ----------------------------- | ------------------------------- | ------------------------------- |
| Static page                   | `/about`, `/pricing`            | ❌ No                            |
| Dynamic static pages          | `/blog/[slug]`, `/product/[id]` | ✅ Yes                           |
| Server-rendered dynamic pages | `/profile/[id]` (SSR)           | ❌ No                            |
| ISR dynamic pages             | `/news/[slug]` with revalidate  | ✅ Yes (optional + `revalidate`) |

---

### ⚙️ Combined Example with ISR + Dynamic Route

```tsx
// app/isr-posts/[id]/page.tsx

export const revalidate = 60 // Regenerate every 60s

export async function generateStaticParams() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()

  return posts.slice(0, 5).map((post: any) => ({
    id: post.id.toString(),
  }))
}

async function getPost(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: { revalidate: 60 },
  })
  return res.json()
}

export default async function ISRPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  const time = new Date().toLocaleTimeString()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p>{post.body}</p>
      <p className="text-purple-600 mt-4">
        Generated at: {time} (Regenerates every 60s)
      </p>
    </div>
  )
}
```

✅ This page:

* Generates 5 posts statically (`generateStaticParams`)
* Regenerates each every 60 seconds (`revalidate`)
* Combines **SSG + ISR**

---

### 🔍 Summary — Function Naming in SSG/ISR

| Purpose               | Function                               | When it Runs | Needed For             |
| --------------------- | -------------------------------------- | ------------ | ---------------------- |
| Fetch static data     | `fetch(..., { cache: 'force-cache' })` | Build time   | All SSG pages          |
| Define dynamic routes | `generateStaticParams()`               | Build time   | Dynamic SSG/ISR routes |
| Enable regeneration   | `export const revalidate = N`          | Runtime      | ISR pages              |

---

### 💡 Final Tip:

If your page file is **static (no params)** —
✅ **No `generateStaticParams()` required**

If your page is **dynamic ([id], [slug]) and statically generated** —
🧩 **Use `generateStaticParams()`**

If it’s **dynamic and server-rendered** (SSR) —
⚙️ **Use `dynamic = 'force-dynamic'` or `cache: 'no-store'` instead**

---


## 4. ISR (Incremental Static Regeneration)

### Basic Concept
The **best of both worlds**: Static generation + periodic updates without full rebuilds.

**Flow:**
1. Initial build: Generate static HTML
2. User requests page → Serve cached HTML (fast!)
3. After revalidation time: Next request triggers background regeneration
4. New HTML is generated and cached
5. Subsequent users get the updated version

**Pros:**
- Fast like SSG (serves cached HTML)
- Data stays relatively fresh
- No full site rebuild needed
- Scales well (static + on-demand updates)
- Handles traffic spikes well

**Cons:**
- First user after revalidation gets stale data
- Not truly real-time
- More complex caching strategy
- Can have inconsistent data across pages

### 🧩 Example 1: Fetch-based ISR
```tsx
// app/isr/page.tsx

export const revalidate = 30 // Rebuild page every 30s

async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/comments', {
    next: { revalidate: 30 }
  })
  return res.json()
}

export default async function ISRPage() {
  const data = await getData()
  const now = new Date().toLocaleTimeString()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ISR Comments</h1>
      <p>Regenerates every 30 seconds.</p>
      <p className="text-purple-600 font-semibold mt-2">
        Generated at: {now}
      </p>
      <ul className="mt-4 space-y-2">
        {data.slice(0, 3).map((comment: any) => (
          <li key={comment.id} className="border p-3 rounded">
            {comment.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

```

### 🧩 Example 2: Non-Fetch ISR (Dynamic Static Computation)
```tsx
// app/isr-random/page.tsx

export const revalidate = 15 // Every 15 seconds

export default function ISRRandomPage() {
  const random = Math.floor(Math.random() * 1000)
  const now = new Date().toLocaleTimeString()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ISR Random Number</h1>
      <p>Generated at: {now}</p>
      <p className="text-purple-600 font-semibold text-lg mt-2">
        Number: {random}
      </p>
      <p className="text-gray-500 mt-4 text-sm">
        Refresh within 15s → same number. After 15s → new one!
      </p>
    </div>
  )
}
```

---

## Decision Tree

```
Need SEO?
├─ No → CSR (dashboards, admin panels)
└─ Yes
   ├─ Data changes every second? → SSR (live feeds, user profiles)
   ├─ Data changes daily/hourly? → ISR (e-commerce, news)
   └─ Data rarely changes? → SSG (blogs, docs, marketing)
```

## Key Syntax

```typescript
// CSR
'use client'
useEffect(() => fetch(...))

// SSR
fetch(url, { cache: 'no-store' })

// SSG
fetch(url) // default
// or
fetch(url, { cache: 'force-cache' })

// ISR
fetch(url, { next: { revalidate: 60 } })
// or
export const revalidate = 60
```

## Quick Tips

**CSR:** Use for interactivity, not content  
**SSR:** Expensive, use only when necessary  
**SSG:** Default choice for static content  
**ISR:** Best of both worlds for most sites