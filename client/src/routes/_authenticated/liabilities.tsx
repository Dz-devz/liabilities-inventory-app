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
import {
  budgetQuery,
  createBudget,
  deleteLiabilities,
  drainedQuery,
  liabilitiesQuery,
  updateBudget,
} from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Typography } from "antd";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/liabilities")({
  component: Liabilities,
});

function Liabilities() {
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editableStr, setEditableStr] = useState("");
  const { Paragraph } = Typography;

  const updateBudgetMutation = useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries(budgetQuery);
    },
    onError: (error) => {
      console.error("Failed to update budget:", error);
    },
  });

  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries(budgetQuery);
    },
    onError: (error) => {
      console.error("Failed to create budget:", error);
    },
  });

  // const form = useForm({
  //   validatorAdapter: zodValidator(),
  //   defaultValues: {
  //     limit: editableStr,
  //   },
  //   onSubmit: async ({ value }) => {
  //     const lastMonthBudget = await queryClient.ensureQueryData(budgetQuery);

  //     if (lastMonthBudget?.budget.length > 0) {
  //       // If there's a budget for the current month, update it
  //       const updatedBudget = await updateBudget({
  //         id: JSON.stringify(lastMonthBudget.budget[0].id),
  //         limit: value.limit,
  //       });

  //       const updatedBudgetData = {
  //         id: updatedBudget.id,
  //         userId: updatedBudget.userId,
  //         createdAt: updatedBudget.createdAt,
  //         limit: updatedBudget.limit,
  //       };

  //       queryClient.setQueryData(budgetQuery.queryKey, {
  //         ...lastMonthBudget,
  //         budget: [updatedBudgetData],
  //       });
  //       await mutation.mutateAsync({
  //         id: JSON.stringify(lastMonthBudget.budget[0].id),
  //         limit: value.limit,
  //       });
  //       console.log("Last Month Budget:", lastMonthBudget);
  //     } else {
  //       const monthlyBudget = await createBudget({ value });

  //       queryClient.setQueryData(budgetQuery.queryKey, {
  //         ...lastMonthBudget,
  //         budget: [monthlyBudget],
  //       });
  //     }

  //     navigate({ to: "/liabilities" });
  //   },
  // });

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      limit: editableStr,
    },
    onSubmit: async ({ value }) => {
      const lastMonthBudget = await queryClient.ensureQueryData(budgetQuery);

      if (lastMonthBudget?.budget.length > 0) {
        // If there's a budget for the current month, update it
        await updateBudgetMutation.mutateAsync({
          id: JSON.stringify(lastMonthBudget.budget[0].id),
          limit: value.limit,
        });
      } else {
        // Create a new budget if none exists
        await createBudgetMutation.mutateAsync({
          value,
        });
      }

      navigate({ to: "/liabilities" });
    },
  });

  const handleClickId = (id: number) => {
    navigate({ to: `${id}` });
  };

  const handleChange = (value: string) => {
    setEditableStr(value);
    form.setFieldValue("limit", value);
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
  const {
    isPending: isPendingBudget,
    error: errorBudget,
    data: getBudget,
  } = useQuery(budgetQuery);

  if (errorLiabilities || errorTotal || errorBudget)
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
        queryClient.invalidateQueries(budgetQuery);
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

  const defaultBudget = {
    id: 0,
    limit: 0, // Set a default value
  };

  const isDeleteButtonVisible = selectedIds.size > 0;
  const date: Date = new Date();
  return (
    <div className="p-2 max-w-4xl m-auto">
      <h1 className="text-2xl text-center mb-2">
        {date.toLocaleString("default", { month: "long" }) +
          " " +
          "Liabilities and Budget"}
      </h1>
      <h2 className="text-xl text-center mb-2">
        {isPendingBudget ? (
          <span>Getting Budget to load...</span>
        ) : (
          <>
            {getBudget?.budget.length === 0 ? (
              <form
                className="max-w-sm m-auto"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div key={defaultBudget.id}>
                  <Paragraph
                    className="text-white text-2xl"
                    editable={{ onChange: handleChange }}
                    onBlur={() => form.handleSubmit()}
                    // onClick={() => form.handleSubmit()}
                  >
                    {defaultBudget.limit}
                  </Paragraph>
                </div>
              </form>
            ) : (
              getBudget.budget.map((budget) => (
                <form
                  key={budget.id}
                  className="max-w-sm m-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <div>
                    <Paragraph
                      className="text-white text-2xl"
                      editable={{ onChange: handleChange }}
                      onBlur={() => form.handleSubmit()}
                    >
                      {budget.limit}
                    </Paragraph>
                  </div>
                </form>
              ))
            )}
          </>
        )}
      </h2>

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
