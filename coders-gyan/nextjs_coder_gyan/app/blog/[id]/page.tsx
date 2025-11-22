// https://nextjs.org/docs/app/getting-started/layouts-and-pages
async function SinglePageArticle({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params
    // const ps = await params
    // console.log(ps);
    
    return <div>SinglePageArticle: {id}</div>;
}
export default SinglePageArticle;
