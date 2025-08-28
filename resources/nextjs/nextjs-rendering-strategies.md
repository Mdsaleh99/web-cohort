# Next.js Rendering Strategies (In-Depth)

Next.js provides multiple rendering strategies to balance performance, SEO, and developer experience. Let’s dive into each approach with detailed explanations, pros & cons, and use cases.

---

## 1. Server-Side Rendering (SSR)

### 🔹 What is SSR?
- Pages are rendered on **every request** at the server.  
- HTML is generated dynamically using data from APIs or databases.  
- Great for **SEO** and **personalized content**.

### 🔹 How it works:
- Next.js calls `getServerSideProps()` **on each request**.  
- Data is fetched on the server → page is pre-rendered → sent as HTML to client.

### 🔹 Example:
```js
export async function getServerSideProps(context) {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return { props: { data } };
}

function Page({ data }) {
  return <div>{data.message}</div>;
}
export default Page;
```

### ✅ Pros:
- Always fresh data  
- Great for SEO  
- Access to request-specific data (cookies, headers, auth)

### ❌ Cons:
- Slower than static methods (page generated per request)  
- Server cost increases with traffic

---

## 2. Static Site Generation (SSG)

### 🔹 What is SSG?
- Pages are **pre-rendered at build time**.  
- HTML files are generated once and reused on every request.  
- Best for **blogs, marketing pages, documentation**.

### 🔹 How it works:
- Next.js runs `getStaticProps()` at build time.  
- The page is generated as static HTML + JSON.  
- At runtime, it’s instantly served from CDN.

### 🔹 Example:
```js
export async function getStaticProps() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return { props: { posts } };
}

function Blog({ posts }) {
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
export default Blog;
```

### ✅ Pros:
- Very fast (CDN served)  
- Cost-efficient (no server needed per request)  
- SEO friendly

### ❌ Cons:
- Data is **stale until rebuild**  
- Not suitable for rapidly changing content

---

## 3. Incremental Static Regeneration (ISR)

### 🔹 What is ISR?
- A hybrid between **SSG & SSR**.  
- Allows static pages to be **updated in the background** after a given interval without a full rebuild.

### 🔹 How it works:
- Uses `revalidate` in `getStaticProps`.  
- Next.js serves cached static HTML until revalidation occurs.  
- After revalidation, a new version is built.

### 🔹 Example:
```js
export async function getStaticProps() {
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();

  return {
    props: { products },
    revalidate: 60, // Regenerate every 60 seconds
  };
}
```

### ✅ Pros:
- Fast like SSG  
- Keeps content fresh automatically  
- Efficient for large sites (no need to rebuild everything)

### ❌ Cons:
- Data may be stale for a short period  
- Slightly more complex than SSG

---

## 4. Client-Side Rendering (CSR)

### 🔹 What is CSR?
- Page is first loaded with a **basic HTML shell**, and then React fetches data **after hydration** on the client side.  
- Used when SEO is not critical but **user interactivity** is important.

### 🔹 How it works:
- `useEffect()` or SWR/React Query fetches data **in the browser**.  
- Initially shows loading UI → then hydrated with data.

### 🔹 Example:
```js
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <p>Loading...</p>;
  return <h1>Hello {user.name}</h1>;
}
export default Profile;
```

### ✅ Pros:
- Lightweight server load  
- Great for dashboards, user-specific pages  
- Flexible

### ❌ Cons:
- Slower initial load  
- Poor SEO (unless combined with SSR/SSG)

---

## 5. API Routes in Next.js

### 🔹 What are API Routes?
- Next.js lets you build **backend endpoints** inside your frontend app.  
- Located in `/pages/api/*`.  
- Runs only on server (Node.js runtime).  
- Useful for form handling, auth, webhooks, custom APIs.

### 🔹 Example:
**File:** `/pages/api/hello.js`
```js
export default function handler(req, res) {
  res.status(200).json({ message: "Hello from API Route!" });
}
```

Call it from frontend:
```js
fetch("/api/hello")
  .then(res => res.json())
  .then(data => console.log(data.message));
```

### ✅ Pros:
- No need for separate backend  
- Serverless functions by default  
- Secure (not exposed to client)

### ❌ Cons:
- Limited for heavy workloads  
- Cold starts possible in serverless environments

---

## 🔥 Comparison Table

| Method | When Rendered | Freshness | SEO | Performance | Use Cases |
|--------|--------------|-----------|-----|-------------|-----------|
| **SSR** | On each request | Always fresh | ✅ | Slower | Personalized pages, dashboards |
| **SSG** | At build time | Stale until rebuild | ✅ | Very fast | Blogs, docs, landing pages |
| **ISR** | At build + revalidate interval | Fresh after interval | ✅ | Fast + scalable | E-commerce, news |
| **CSR** | On client after hydration | Always fresh (client fetch) | ❌ (not SEO) | Slower first load | Dashboards, user profiles |
| **API Routes** | Server (Node.js) | N/A | N/A | Depends | Forms, webhooks, auth |

---

## 🚀 Best Practices

1. Use **SSG** for static content (docs, blogs).  
2. Use **ISR** for large, frequently updated sites (e-commerce, news).  
3. Use **SSR** for request-based personalization (auth dashboards).  
4. Use **CSR** for client-only dynamic apps (internal tools).  
5. Use **API Routes** for backend logic without deploying a separate server.

