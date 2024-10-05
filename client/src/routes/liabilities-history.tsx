import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { budgetQuery, drainedQuery, liabilitiesHistoryQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/liabilities-history")({
  component: LiabilitiesHistory,
});

export default function LiabilitiesHistory({ isTooltip = false }) {
  const {
    isPending: isPendingLiabilitiesHistory,
    error: errorLiabilitiesHistory,
    data: liabilitiesDataHistory,
  } = useQuery(liabilitiesHistoryQuery);
  const {
    isPending: isPendingTotal,
    error: errorTotal,
    data: totalDrainedData,
  } = useQuery(drainedQuery);
  const {
    isPending: isPendingBudget,
    error: errorBudget,
    data: totalBudgetData,
  } = useQuery(budgetQuery);

  if (errorLiabilitiesHistory || errorTotal || errorBudget) {
    return (
      "Error can't connect to " +
      errorLiabilitiesHistory?.message +
      " " +
      errorTotal?.message +
      " " +
      errorBudget?.message
    );
  }
  const date: Date = new Date();

  return (
    <div className={`p-2 ${isTooltip ? "max-w-full" : "max-w-4xl"} m-auto`}>
      <h1
        className={`text-lg ${isTooltip ? "text-center text-sm" : "text-2xl text-center mb-2"}`}
      >
        {date.toLocaleString("default", { month: "long" }) +
          " Liabilities and Budget"}
      </h1>
      {totalBudgetData?.budget.map((budget) => (
        <p
          className={`text-lg ${isTooltip ? "text-center text-sm" : "text-2xl text-center mb-2"}`}
        >
          {isPendingBudget ? "Getting Budget..." : budget.limit}
        </p>
      ))}
      <Table className={isTooltip ? "text-sm" : ""}>
        <TableCaption>A list of all Liabilities</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={`w-[80px] ${isTooltip ? "text-sm" : ""}`}>
              Id
            </TableHead>
            <TableHead className={isTooltip ? "text-sm" : ""}>
              Category
            </TableHead>
            <TableHead className={isTooltip ? "text-sm" : ""}>Date</TableHead>
            <TableHead className={`text-right ${isTooltip ? "text-sm" : ""}`}>
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPendingLiabilitiesHistory
            ? Array(3) // Reduced number of skeletons for tooltip
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
            : liabilitiesDataHistory?.liabilities.slice(0, 3).map(
                (
                  liability // Limited to 3 rows
                ) => (
                  <TableRow key={liability.id}>
                    <TableCell className="font-medium">
                      {liability.id}
                    </TableCell>
                    <TableCell className="hover:text-[#e1d6d6] hover:underline">
                      {liability.title}
                    </TableCell>
                    <TableCell>{liability.date.split("T")[0]}</TableCell>
                    <TableCell className="text-right">
                      {liability.amount}
                    </TableCell>
                  </TableRow>
                )
              )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Liabilities Spent</TableCell>
            <TableCell className="text-right">
              {isPendingTotal ? "Loading..." : totalDrainedData?.total}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
