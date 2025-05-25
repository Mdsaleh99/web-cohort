import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/Products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Products"!
    <Link to='/Product/1'>Go to product 1</Link>
    <br />
    <Link to='/Product/2'>Go to product 2</Link>
    <br />
    <Link to='/Product/3'>Go to product 2</Link>
    <br />
  </div>
}
