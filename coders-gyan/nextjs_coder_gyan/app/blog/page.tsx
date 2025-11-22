import { Suspense } from "react";
import Posts from "./components/post";



// https://nextjs.org/docs/app/getting-started/fetching-data

export default async function BlogPage() {
    console.log("Server component");
    
    // const data = await fetch("https://jsonplaceholder.typicode.com/posts");
    // const posts = await data.json();
    // nextjs extended the fetch for caching, etc
    // const posts: Post[] = [
    //     {
    //         id: 1,
    //         title: 'post 1',
    //         body: 'post 1 body'
    //     },
    //     {
    //         id: 2,
    //         title: 'post 2',
    //         body: 'post 2 body'
    //     },
    //     {
    //         id: 3,
    //         title: 'post 3',
    //         body: 'post 3 body'
    //     },
    //     {
    //         id: 4,
    //         title: 'post 4',
    //         body: 'post 4 body'
    //     },
    // ]

    const promise = fetch("https://jsonplaceholder.typicode.com/posts").then(res => res.json())
    // console.log("fetch: ", promise);
    
    return (
        <div>
            <h1>Blog Posts</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <Posts promise={promise} />
            </Suspense>
        </div>
    );
}