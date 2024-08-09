import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/liabilities")({
  component: Liabilities,
});

function Liabilities() {
  return <div className="p-2">Show All Liabilities</div>;
}
