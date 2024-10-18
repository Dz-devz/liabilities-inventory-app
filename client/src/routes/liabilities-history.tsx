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
import { useCallback, useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/liabilities-history")({
  component: LiabilitiesHistory,
});

type Liability = {
  id: number;
  date: string;
  userId: string;
  title: string;
  amount: string;
  createdAt: string | null;
};

interface LiabilitiesHistoryProps {
  isTooltip?: boolean; // Make isTooltip optional
  //  liabilities: Liability[]; // Add liabilities as a required prop
}

export default function LiabilitiesHistory({
  isTooltip = false,
}: LiabilitiesHistoryProps) {
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

  const [liabilitiesHistory, setLiabilitiesHistory] = useState<
    { month: string; liabilities: Liability[] }[]
  >([]);

  const liabilities: Liability[] = useMemo(() => [], []);

  const filterLiabilities = useCallback(
    (allLiabilities: Liability[], monthDate: Date) => {
      return allLiabilities.filter((liability) => {
        const liabilityDate = new Date(liability.date);
        return (
          liabilityDate.getMonth() === monthDate.getMonth() &&
          liabilityDate.getFullYear() === monthDate.getFullYear()
        );
      });
    },
    [] // Add necessary dependencies here
  );

  useEffect(() => {
    // Combine fetched liabilities with the passed liabilities
    const allLiabilities = [
      ...(liabilitiesDataHistory?.liabilities || []),
      ...liabilities,
    ];

    const now = new Date();
    const monthsToShow = 12;
    const updatedHistory: { month: string; liabilities: Liability[] }[] = [];

    for (let i = 1; i < monthsToShow; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      const monthlyLiabilities = filterLiabilities(allLiabilities, monthDate);

      // Only add to history if there are liabilities for that month
      if (filterLiabilities.length > 0) {
        updatedHistory.push({
          month: monthKey,
          liabilities: monthlyLiabilities,
        });
      }
    }

    setLiabilitiesHistory(updatedHistory);
  }, [liabilitiesDataHistory, liabilities, filterLiabilities]);

  if (errorLiabilitiesHistory || errorTotal || errorBudget) {
    return (
      "Error: " +
      errorLiabilitiesHistory?.message +
      " " +
      errorTotal?.message +
      " " +
      errorBudget?.message
    );
  }

  const budget = totalBudgetData?.budget[0];
  const budgetD = budget?.limit;
  const remainingBudget = Number(budgetD) - Number(totalDrainedData?.total);

  return (
    <div className={`p-2 ${isTooltip ? "max-w-full" : "max-w-4xl"} m-auto`}>
      <h1
        className={`text-lg ${isTooltip ? "text-center text-sm" : "text-2xl text-center mb-2"}`}
      >
        Liabilities and Budget
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
              <TableCell colSpan={4} className="text-center">
                No liabilities found for the last 12 months.
              </TableCell>
            </TableRow>
          ) : (
            liabilitiesHistory.map((monthlyData, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold">
                  Liabilities for {monthlyData.month}
                </h3>
                {monthlyData.liabilities.map((liability) => (
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
                ))}
              </div>
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
