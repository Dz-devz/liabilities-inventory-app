import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/liabilities")({
  component: Liabilities,
});

async function getAllDrained() {
  const res = await api.liabilities.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

function Liabilities() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-all-liabilities"],
    queryFn: getAllDrained,
  });

  if (error) return "An Error has occured" + error.message;

  return (
    <div className="p-2">
      <pre>{isPending ? "..." : JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
