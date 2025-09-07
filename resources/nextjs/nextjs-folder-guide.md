# 📂 Next.js Folder & File Naming Conventions

A quick guide to understand special folders and file names in Next.js App Router.

---

## 1. **`page.js` / `page.tsx`**
- Represents a **page** in your app.
- Every folder with a `page.js` file becomes a **route**.

✅ Example:  
```
app/
 └── about/
      └── page.js
```
➡️ URL: `/about`  

---

## 2. **Dynamic Routes → `[id]`**
- Square brackets `[]` define **dynamic segments** in routes.  
- Useful for user profiles, blog posts, etc.

✅ Example:  
```
app/
 └── blog/
      └── [id]/
           └── page.js
```
➡️ `/blog/1` → Renders post with id = 1  
➡️ `/blog/abc` → Renders post with id = abc  

📌 Inside the page:
```tsx
import { useParams } from "next/navigation";

export default function BlogPost() {
  const { id } = useParams(); 
  return <h1>Blog post: {id}</h1>;
}
```

---

## 3. **Catch-All Routes → `[...slug]`**
- Matches **any number of segments**.  
- Good for docs, breadcrumbs, etc.

✅ Example:  
```
app/
 └── docs/
      └── [...slug]/
           └── page.js
```
➡️ `/docs/nextjs/routing` → `{ slug: ["nextjs", "routing"] }`

---

## 4. **Optional Catch-All → `[[...slug]]`**
- Same as above, but also works if **no segment** is provided.

✅ Example:
```
app/
 └── shop/
      └── [[...slug]]/
           └── page.js
```
➡️ `/shop` → slug = `undefined`  
➡️ `/shop/shoes/nike` → slug = `["shoes", "nike"]`

---

## 5. **`route.js` / `route.ts`**
- Used for **API routes** inside the `app` directory.
- Handles GET, POST, etc.

✅ Example:
```
app/
 └── api/
      └── users/
           └── route.js
```

➡️ Access at `/api/users`  

Inside `route.js`:
```tsx
export async function GET() {
  return Response.json({ message: "Hello API" });
}

export async function POST(req) {
  const data = await req.json();
  return Response.json({ received: data });
}
```

---

## 6. **Layout → `layout.js`**
- Defines **UI shared across pages** in a folder.  
- Example: navbars, sidebars, footers.

✅ Example:
```
app/
 └── dashboard/
      ├── layout.js
      ├── page.js
      └── settings/
           └── page.js
```
➡️ `layout.js` wraps both `dashboard/page.js` and `dashboard/settings/page.js`.

---

## 7. **`loading.js`**
- Used for **loading UI** (like a spinner) while the page fetches data.

✅ Example:
```
app/
 └── dashboard/
      ├── page.js
      └── loading.js
```

---

## 8. **`error.js`**
- Custom UI for errors in that route.

✅ Example:
```
app/
 └── blog/
      ├── page.js
      └── error.js
```

---

## 9. **Route Groups → `(auth)`**
- Folders in **parentheses** don’t affect the URL.  
- Useful for grouping routes without changing paths.

✅ Example:
```
app/
 ├── (auth)/
 │     ├── login/
 │     │     └── page.js
 │     └── register/
 │           └── page.js
 └── dashboard/
      └── page.js
```
➡️ `/login` ✅  
➡️ `/register` ✅  
➡️ `(auth)` does not appear in the URL  

---

## 10. **Private Folders → `_folder`**
- Folders starting with `_` are **ignored by Next.js routing**.  
- Good for utilities/components.

✅ Example:
```
app/
 └── _components/
      └── Navbar.js
```
➡️ `_components` is not a route.  

---

## 11. **Parallel Routes → `@slot`**
- Used for **splitting layouts** into multiple areas.  
- Example: showing a feed & a sidebar simultaneously.

✅ Example:
```
app/
 └── dashboard/
      ├── layout.js
      ├── @feed/
      │     └── page.js
      └── @sidebar/
            └── page.js
```

---

## 12. **Default / Fallback Route → `default.js`**
- Used with **parallel routes** when a slot has no content.  

---

# 🔥 Commonly Used
- `page.js` → normal pages  
- `[id]` → dynamic routes  
- `route.js` → API endpoints  
- `(auth)` → route grouping (no effect on URL)  
- `layout.js` → shared layouts  
