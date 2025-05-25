import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Product/$pid')({
  component: RouteComponent,
})

// dynamic routing
function RouteComponent() {
  const {pid} = Route.useParams()
  return <div>Hello "/Product/$pid"!
    <h2>This is my product {pid}</h2>
  </div>
}
