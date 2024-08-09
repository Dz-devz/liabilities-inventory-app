import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-liabilities")({
  component: CreateLiabilities,
});

function CreateLiabilities() {
  return <div className="p-2">Create Liabilities</div>;
}
