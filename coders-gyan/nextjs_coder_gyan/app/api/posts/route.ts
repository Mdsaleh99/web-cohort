// https://nextjs.org/docs/app/getting-started/route-handlers
// https://nextjs.org/docs/app/api-reference/file-conventions/route
// https://nextjs.org/docs/app/getting-started/images
// https://nextjs.org/docs/app/getting-started/metadata-and-og-images
// in nextjs 16 we can not use middleware instead we have to use proxy
// https://nextjs.org/blog/next-16#proxyts-formerly-middlewarets
// https://nextjs.org/docs/app/getting-started/proxy
// https://nextjs.org/blog/next-16
export async function GET(request: Request) {
    console.log("request: ", request);
    
    return Response.json([
        {
            userId: 1,
            id: 1,
            title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
        },
        {
            userId: 1,
            id: 2,
            title: "qui est esse",
            body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
        },
        {
            userId: 1,
            id: 3,
            title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
            body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
        },
    ]);
}

export async function POST(request: Request) {
    console.log("request: ", request);

    return Response.json({message: "OK"})
}