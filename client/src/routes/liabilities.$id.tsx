import { getSingleLiabilities } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/liabilities/$id")({
  component: SingleLiabilities,
});

function SingleLiabilities() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-single-liability", id],
    queryFn: () => getSingleLiabilities({ id: id }), // Fetch based on selected liability ID
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading liability details</div>;

  if (!data) return <div>No data found</div>;

  const liability = data.singleLiabilities[0];

  return (
    <div>
      <h2>{liability.title}</h2>
      <p>Amount: {liability.amount}</p>
    </div>
  );
}
