import { liabilitiesQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function LiabilitiesHistory() {
  const {
    isPending: isPendingLiabilities,
    error: errorLiabilities,
    data: liabilitiesData,
  } = useQuery(liabilitiesQuery);

  return (
    <div>
      <h1 className="text-white text-2xl">Table history</h1>
      {liabilitiesData?.liabilities
        .filter((liability) => new Date(liability.date).getMonth() === 10)
        .map((liability) => (
          <div className="text-white text-2xl" key={liability.id}>
            <h3>{liability.title}</h3>
            <p>{liability.amount}</p>
            <p>{new Date(liability.date).toLocaleDateString()}</p>
          </div>
        ))}
    </div>
  );
}
