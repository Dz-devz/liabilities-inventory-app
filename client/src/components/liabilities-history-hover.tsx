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

interface LiabilitiesHistoryProps {
  monthProps: number;
  isTooltip?: boolean;
  monthName: string;
  yearProps: number;
}

export default function LiabilitiesHistoryHover({
  monthProps,
  isTooltip = false,
  monthName,
  yearProps,
}: LiabilitiesHistoryProps) {
  const {
    isLoading: isPendingLiabilitiesHistory,
    error: errorLiabilitiesHistory,
    data: liabilitiesDataHistory,
  } = useQuery(liabilitiesHistoryQuery);

  const {
    isLoading: isPendingTotal,
    error: errorTotal,
    data: totalDrainedData,
  } = useQuery(drainedQuery);

  const {
    isLoading: isPendingBudget,
    error: errorBudget,
    data: totalBudgetData,
  } = useQuery(budgetQuery);

  if (errorLiabilitiesHistory || errorTotal || errorBudget) {
    return (
      <div>
        Error: {errorLiabilitiesHistory?.message} {errorTotal?.message}{" "}
        {errorBudget?.message}
      </div>
    );
  }

  // Use isTooltip if its hover it will show the data on hover but if clicked it will use the monthString of useSearch like useSearchParams
  const monthString = `${yearProps}-${String(monthProps).padStart(2, "0")}`;
  // Get liabilities for the specified month when being hovered and clicked
  const liabilitiesHistory =
    liabilitiesDataHistory?.liabilities.filter((liability) =>
      liability.date.startsWith(monthString)
    ) || [];

  console.log(monthString);

  const budget = totalBudgetData?.budget[0];
  const budgetD = budget?.limit;
  const remainingBudget = Number(budgetD) - Number(totalDrainedData?.total);

  return (
    <div className={`p-2 ${isTooltip ? "max-w-full" : "max-w-4xl"} m-auto`}>
      <h1
        className={`text-lg ${isTooltip ? "text-center font-bold text-sm" : "text-2xl text-center mb-2 font-bold"}`}
      >
        {`Liabilities History for ${monthName} ${yearProps}`}
      </h1>
      {totalBudgetData?.budget.map((budget) => (
        <p
          key={budget.id}
          className={`text-lg ${isTooltip ? "text-center text-sm" : "text-2xl text-center mb-2"}`}
        >
          {isPendingBudget ? "Getting Budget..." : budget.limit}
        </p>
      ))}
      <Table className={isTooltip ? "text-sm" : ""}>
        <TableCaption>
          Remaining Balance:{" "}
          {isPendingBudget ? (
            "Getting Remaining Budget..."
          ) : (
            <span className="font-semibold text-white">{remainingBudget}</span>
          )}
        </TableCaption>
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
          {isPendingLiabilitiesHistory ? (
            Array(3)
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
          ) : liabilitiesHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center font-bold">
                No liabilities found for {monthName}.
              </TableCell>
            </TableRow>
          ) : (
            liabilitiesHistory.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell className="font-medium">{liability.id}</TableCell>
                <TableCell className="hover:text-[#e1d6d6] hover:underline">
                  {liability.title}
                </TableCell>
                <TableCell>{liability.date.split("T")[0]}</TableCell>
                <TableCell className="text-right">{liability.amount}</TableCell>
              </TableRow>
            ))
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
