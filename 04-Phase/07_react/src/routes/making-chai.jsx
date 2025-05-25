import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/making-chai')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/making-chai"!</div>
}
