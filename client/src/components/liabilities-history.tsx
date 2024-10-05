import { liabilitiesHistoryQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function LiabilitiesHistory() {
  const {
    isPending: isPendingLiabilitiesHistory,
    error: errorLiabilitiesHistory,
    data: liabilitiesDataHistory,
  } = useQuery(liabilitiesHistoryQuery);

  if (errorLiabilitiesHistory) {
    return "Error can't connect to " + errorLiabilitiesHistory.message;
  }

  return (
    <div>
      <h1 className="text-white text-2xl">Table history</h1>
      {isPendingLiabilitiesHistory ? (
        <div className="text-white text-2xl">
          <span>Getting Liabilities History...</span>
        </div>
      ) : (
        liabilitiesDataHistory?.liabilities
          .filter((liability) => new Date(liability.date).getMonth() === 8)
          .map((liability) => (
            <div className="text-white text-2xl" key={liability.id}>
              <h3>{liability.title}</h3>
              <p>{liability.amount}</p>
              <p>{liability.date}</p>
            </div>
          ))
      )}
    </div>
  );
}
