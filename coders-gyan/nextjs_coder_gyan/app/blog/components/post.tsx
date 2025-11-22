'use client'

import Link from "next/link";
import { use } from "react";

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

// https://nextjs.org/docs/app/getting-started/fetching-data#client-components

function Posts({ promise }: { promise: Promise<Post[]> }) {
    console.log("Client component");
    // console.log("promise: ", promise);
    const posts = use(promise);
    
    return (
        <div>
            {posts.map((post: Post, i: number) => (
                <div key={i}>
                    <Link href={`/blog/${post.id}`}>
                        <h1 className="text-indigo-500">{post.title}</h1>
                    </Link>
                    <p>{post.body}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
}
export default Posts;
