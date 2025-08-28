# Next.js: From Basics to Advanced (In-depth Guide)

## 1. Introduction to Next.js
Next.js is a **React framework** built by Vercel that enables developers to build **server-rendered React apps** with ease. It provides features like:
- Hybrid rendering (SSR, SSG, ISR, CSR)
- API routes (serverless functions)
- Image optimization
- Built-in routing system
- Performance optimizations out of the box

---

## 2. Getting Started

### Installation
```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

### Project Structure
```
my-app/
 ├── app/ or pages/
 ├── public/
 ├── styles/
 ├── next.config.js
 └── package.json
```

- `app/` → New **App Router** (Next.js 13+)
- `pages/` → Legacy routing system (still supported)
- `public/` → Static assets (images, fonts, etc.)
- `styles/` → Global & modular styles

---

## 3. Routing in Next.js

### 3.1 File-based Routing
- Each file in `pages/` or `app/` automatically becomes a route.

Example (`pages/index.js`):
```jsx
export default function Home() {
  return <h1>Hello Next.js</h1>;
}
```

### 3.2 Dynamic Routes
```jsx
// pages/blog/[id].js
import { useRouter } from "next/router";

export default function BlogPost() {
  const { query } = useRouter();
  return <h1>Post ID: {query.id}</h1>;
}
```

### 3.3 Nested Routes
- `pages/dashboard/settings.js` → `/dashboard/settings`

---

## 4. Rendering Methods

### 4.1 Server-Side Rendering (SSR)
```jsx
export async function getServerSideProps() {
  const data = await fetch("https://api.example.com/data").then(res => res.json());
  return { props: { data } };
}

export default function Page({ data }) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### 4.2 Static Site Generation (SSG)
```jsx
export async function getStaticProps() {
  return { props: { time: new Date().toISOString() } };
}
```

### 4.3 Incremental Static Regeneration (ISR)
```jsx
export async function getStaticProps() {
  const posts = await fetchPosts();
  return {
    props: { posts },
    revalidate: 60 // re-generate every 60 seconds
  };
}
```

### 4.4 Client-Side Rendering (CSR)
```jsx
import { useEffect, useState } from "react";

export default function CSR() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/hello").then(res => res.json()).then(setData);
  }, []);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

---

## 5. App Router (Next.js 13+)
- Uses `app/` directory
- Supports **React Server Components (RSC)**
- Enables **streaming, parallel routes, and layouts**

Example:
```jsx
// app/page.js
export default function Page() {
  return <h1>App Router Home</h1>;
}
```

### Layouts
```jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Server Components vs Client Components
- Default: **Server Component** (runs on server, no JS bundle)
- Add `"use client";` to mark as **Client Component**

---

## 6. API Routes
- Create serverless functions inside `pages/api` or `app/api`.

```jsx
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: "Hello API" });
}
```

---

## 7. Middleware & Edge Functions
- Middleware runs **before request is processed**.

```jsx
// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  if (!req.cookies.get("token")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
```

---

## 8. Styling Options
- **CSS Modules** → `Home.module.css`
- **Sass** → `.scss` files supported
- **Tailwind CSS** → `npx tailwindcss init -p`
- **Styled Components / Emotion** supported

---

## 9. Data Fetching Patterns

### getStaticPaths (for dynamic SSG)
```jsx
export async function getStaticPaths() {
  const posts = await fetchPosts();
  return {
    paths: posts.map(p => ({ params: { id: p.id.toString() } })),
    fallback: false
  };
}
```

### Fetching inside App Router
```jsx
// app/page.js
export default async function Page() {
  const res = await fetch("https://api.example.com/posts", { cache: "no-store" });
  const posts = await res.json();
  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
```

---

## 10. Advanced Features

### 10.1 Parallel & Intercepted Routes
```bash
app/
 ├── dashboard/
 │   ├── @analytics/page.js
 │   ├── @team/page.js
```

### 10.2 Streaming & Suspense
```jsx
// app/page.js
import { Suspense } from "react";
import Posts from "./Posts";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Posts />
    </Suspense>
  );
}
```

### 10.3 Server Actions (Next.js 13.4+)
```jsx
// app/page.js
"use server";

export async function addTodo(data) {
  // server-side logic
}
```

---

## 11. Performance & Optimization
- Automatic **code splitting**
- **Static optimization**
- **Image optimization** (`next/image`)
- **Font optimization**
- **Prefetching** links

---

## 12. Deployment

### On Vercel
```bash
vercel
```

### Custom Node.js server
```js
const { createServer } = require("http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(3000);
});
```

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

---

## 13. Best Practices
- Use `app/` router for new projects
- Use **ISR** for performance
- Avoid overusing `getServerSideProps`
- Use `next/image` for responsive images
- Secure API routes with middleware
- Keep components small & reusable

---

## 14. Summary
Next.js provides a **hybrid framework** for building modern apps with React. From simple static sites to advanced SSR apps, it offers:
- Flexible rendering methods
- Built-in API & middleware support
- Performance optimizations
- Smooth developer experience

Next.js is widely used in **production apps** (Netflix, Twitch, TikTok, etc.) and continues to evolve with React's latest features like Server Components and Streaming.

---
