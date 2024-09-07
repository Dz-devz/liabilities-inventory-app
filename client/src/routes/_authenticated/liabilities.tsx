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
import { deleteLiabilities, drainedQuery, liabilitiesQuery } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/liabilities")({
  component: Liabilities,
});

function Liabilities() {
  const navigate = useNavigate({ from: Route.fullPath });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedLiabilityId, setSelectedLiabilityId] = useState<number | null>(
    null
  );

  const handleClickId = (id: number) => {
    setSelectedLiabilityId(id);
    navigate({ to: `${id}` });
  };

  const {
    isPending: isPendingLiabilities,
    error: errorLiabilities,
    data: liabilitiesData,
  } = useQuery(liabilitiesQuery);
  const {
    isPending: isPendingTotal,
    error: errorTotal,
    data: totalDrainedData,
  } = useQuery(drainedQuery);

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

  function DeleteLiabilitiesButton() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: deleteLiabilities,
      onError: () => {
        throw Error("Failed to delete Liabilities");
      },
      onSuccess: () => {
        // Reload page after successfully deleting data
        queryClient.invalidateQueries(liabilitiesQuery);
        queryClient.invalidateQueries(drainedQuery);
      },
    });
    const handleDelete = () => {
      if (selectedIds.size === 0) return;
      mutation.mutate(Array.from(selectedIds));
    };
    return (
      <Button
        variant="outline"
        size="icon"
        disabled={mutation.isPending}
        style={{
          visibility: isDeleteButtonVisible ? "visible" : "hidden",
        }}
        onClick={handleDelete}
      >
        {mutation.isPending ? "..." : <TrashIcon className="h-4 w-4" />}
      </Button>
    );
  }

  const isDeleteButtonVisible = selectedIds.size > 0;

  return (
    <div className="p-2 max-w-4xl m-auto">
      <Table>
        <TableCaption>A list of all Liabilities</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]">
              <div className="flex justify-center">
                <DeleteLiabilitiesButton />
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
                <TableRow
                  key={liability.id}
                  className={
                    selectedIds.has(liability.id) ? "bg-slate-800" : ""
                  }
                >
                  <TableCell className="font-medium">{liability.id}</TableCell>
                  <TableCell
                    onClick={() => handleClickId(liability.id)}
                    className="hover:text-[#e1d6d6] hover:underline"
                  >
                    {liability.title}
                  </TableCell>
                  <TableCell>{liability.date.split("T")[0]}</TableCell>
                  <TableCell className="text-right">
                    {liability.amount}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      id={liability.id.toString()}
                      className="flex ml-[0.8rem] [&.active]:"
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
            <TableCell colSpan={3}>Total Liabilities Spent</TableCell>
            <TableCell className="text-right">
              {isPendingTotal ? "Loading..." : totalDrainedData.total}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
