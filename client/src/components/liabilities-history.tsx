import { liabilitiesHistoryQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function LiabilitiesHistory() {
  const {
    isPending: isPendingLiabilities,
    error: errorLiabilities,
    data: liabilitiesData,
  } = useQuery(liabilitiesHistoryQuery);

  return (
    <div>
      <h1 className="text-white text-2xl">Table history</h1>
      {liabilitiesData?.liabilities
        .filter((liability) => new Date(liability.date).getMonth() === 8)
        .map((liability) => (
          <div className="text-white text-2xl" key={liability.id}>
            <h3>{liability.title}</h3>
            <p>{liability.amount}</p>
            <p>{liability.date}</p>
          </div>
        ))}
    </div>
  );
}
