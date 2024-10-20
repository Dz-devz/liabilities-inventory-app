import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { budgetQuery, drainedQuery, profileQuery } from "../../lib/api";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(profileQuery);
  const {
    isLoading: isPendingTotalLiabilities,
    error: errorTotalLiabilities,
    data: totalLiabilitiesData,
  } = useQuery(drainedQuery);
  const {
    isLoading: isPendingBudget,
    error: errorBudget,
    data: budgetData,
  } = useQuery(budgetQuery);

  const budget = budgetData?.budget[0];
  const budgetD = budget?.limit;

  const remainingBudget = Number(budgetD) - Number(totalLiabilitiesData?.total);

  if (isPending || isPendingTotalLiabilities || isPendingBudget)
    return "Loading...";
  if (error || errorTotalLiabilities || errorBudget) return "Not Logged In";

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={data.user.picture || "https://github.com/shadcn.png"}
            alt={data.user.given_name}
          />
          <AvatarFallback>
            {data.user.given_name?.charAt(0)}
            {data.user.family_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-2xl font-semibold">
            {data.user.given_name} {data.user.family_name}
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold">Liability Stats</h2>
        <ul className="space-y-1">
          <li>
            <strong>Total Liabilities:</strong> ₱{totalLiabilitiesData?.total}
          </li>
          <li>
            <strong>Remaining Budget:</strong> ₱{remainingBudget}
          </li>
        </ul>
      </div>
    </div>
  );
}
