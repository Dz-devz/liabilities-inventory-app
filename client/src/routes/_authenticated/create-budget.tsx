import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/create-budget')({
  component: () => <div>Hello /_authenticated/create-budget!</div>
})