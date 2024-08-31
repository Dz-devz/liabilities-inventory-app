import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/liabilities")({
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

async function getTotalDrained() {
  const res = await api.liabilities["total-drained"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

function Liabilities() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const {
    isPending: isPendingLiabilities,
    error: errorLiabilities,
    data: liabilitiesData,
  } = useQuery({
    queryKey: ["get-all-liabilities"],
    queryFn: getAllDrained,
  });
  const {
    isPending: isPendingTotal,
    error: errorTotal,
    data: totalDrainedData,
  } = useQuery({
    queryKey: ["get-total-drained"],
    queryFn: getTotalDrained,
  });

  if (errorLiabilities || errorTotal)
    return "An Error has occurred" + errorLiabilities?.message || errorTotal;

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const isDeleteButtonVisible = selectedIds.size > 0;

  return (
    <div className="p-2 max-w-4xl m-auto">
      <Table>
        <TableCaption>A list of all Liabilities</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]">
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  style={{
                    visibility: isDeleteButtonVisible ? "visible" : "hidden",
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPendingLiabilities
            ? Array(5)
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
            : liabilitiesData?.liabilities.map((liability) => (
                <TableRow key={liability.id}>
                  <TableCell className="font-medium">{liability.id}</TableCell>
                  <TableCell>{liability.title}</TableCell>
                  <TableCell>{liability.date.split("T")[0]}</TableCell>
                  <TableCell className="text-right">
                    {liability.amount}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      id={liability.id.toString()}
                      className="flex ml-[0.8rem]"
                      onCheckedChange={(isChecked) =>
                        handleCheckboxChange(liability.id, !!isChecked)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {isPendingTotal ? "Loading..." : totalDrainedData.total}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
