import TooltipHistory from "@/components/tooltip-history";
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
  availableMonthsQuery,
  budgetQuery,
  createBudget,
  deleteLiabilities,
  drainedQuery,
  liabilitiesQuery,
  updateBudget,
} from "@/lib/api";
import { EditTwoTone } from "@ant-design/icons";
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
  const [selectAll, setSelectAll] = useState<boolean>();
  const [editableStr, setEditableStr] = useState("");
  const { Paragraph } = Typography;
  const [globalError, setGlobalError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

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

      const liabilities = await queryClient.ensureQueryData(liabilitiesQuery); // Fetch latest liabilities

      const totalLiabilities = liabilities.liabilities.reduce(
        (sum, liability) => sum + Number(liability.amount),
        0
      );

      // Validate the new limit before proceeding with update or creation
      if (Number(value.limit) < totalLiabilities) {
        setGlobalError("Cannot set budget lower than total liabilities");
        setShowError(true);

        setTimeout(() => {
          setShowError(false);
        }, 3000);
        return;
      }

      if (lastMonthBudget?.budget.length > 0) {
        // Update existing budget
        await updateBudgetMutation.mutateAsync({
          id: JSON.stringify(lastMonthBudget.budget[0].id),
          limit: value.limit,
        });
      } else {
        await createBudgetMutation.mutateAsync({
          value,
        });
      }
      queryClient.invalidateQueries(budgetQuery);
      queryClient.invalidateQueries(liabilitiesQuery);

      navigate({ to: "/liabilities" });
    },
  });

  const handleClickId = (id: number) => {
    navigate({ to: `${id}` });
  };

  const handleChange = async (value: string) => {
    setEditableStr(value);
    form.setFieldValue("limit", value);
    // Added handlesubmit inside handlechange to rerender changes of data, onSubmit without using button or similar can have an issue rerendering new data.
    form.handleSubmit();
  };

  const {
    isLoading: isPendingLiabilities,
    error: errorLiabilities,
    data: liabilitiesData,
  } = useQuery(liabilitiesQuery);
  const {
    isLoading: isPendingTotal,
    error: errorTotal,
    data: totalDrainedData,
  } = useQuery(drainedQuery);
  const {
    isLoading: isPendingBudget,
    error: errorBudget,
    data: getBudget,
  } = useQuery(budgetQuery);
  const { error: errorAvailableMonths, data: dataAvailableMonths } =
    useQuery(availableMonthsQuery);

  if (errorLiabilities || errorTotal || errorBudget || errorAvailableMonths)
    return (
      "An Error has occurred" + errorLiabilities?.message || errorTotal?.message
    );

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

  const handleSelectAllChange = (isChecked: boolean) => {
    if (isChecked) {
      const allIds = new Set(
        liabilitiesData?.liabilities.map((liability) => liability.id)
      );
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds(new Set());
      setSelectAll(false);
    }
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

  // Set a default value to show paragraph
  const defaultBudget = {
    id: 0,
    limit: 0,
  };
  const allLiabilityIds = new Set(
    liabilitiesData?.liabilities.map((liability) => liability.id)
  );

  const budget = getBudget?.budget[0];
  const budgetD = budget?.limit;

  const remainingBudget = Number(budgetD) - Number(totalDrainedData?.total);

  const isDeleteButtonVisible = selectedIds.size > 0;
  const date: Date = new Date();
  const d = new Date();
  date.setMonth(date.getMonth() - 1);
  const availableMonths = dataAvailableMonths?.availableMonths || [];
  return (
    <div>
      <div className="mr-auto">
        <TooltipHistory availableMonths={availableMonths} />
      </div>
      <div className="p-2 max-w-4xl m-auto">
        <h1 className="text-2xl text-center mb-2">
          {d.toLocaleString("default", { month: "long" }) +
            " " +
            "Liabilities and Budget"}
        </h1>
        {showError && (
          <div
            className={`text-foreground bg-secondary p-2 rounded mb-4 transition-opacity duration-500 ${!showError ? "opacity-0" : "opacity-100"}`}
          >
            {globalError}
          </div>
        )}
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
                      className="text-white
                      text-2xl"
                      editable={{ onChange: handleChange }}
                      onBlur={() => form.handleSubmit()}
                      // onClick={() => form.handleSubmit()}
                    >
                      {defaultBudget.limit}
                    </Paragraph>
                  </div>
                </form>
              ) : (
                getBudget?.budget.map((budget) => (
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
                        editable={{
                          onChange: handleChange,
                          icon: <EditTwoTone twoToneColor="#7A7A7A" />,
                        }}
                        onBlur={() => form.handleSubmit()}
                      >
                        {updateBudgetMutation.isPending
                          ? "Updating Budget..."
                          : budget.limit}
                      </Paragraph>
                    </div>
                  </form>
                ))
              )}
            </>
          )}
        </h2>
        <Table>
          <TableCaption>
            {" "}
            <h2 className="text-xl text-center mb-2 ">
              {date.toLocaleString("default", { month: "long" })} Remaining
              Balance:{" "}
              {isPendingBudget ? (
                "Getting Remaining Budget..."
              ) : (
                <span className="font-semibold text-white">
                  {" "}
                  {remainingBudget}{" "}
                </span>
              )}
            </h2>
          </TableCaption>
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
                      selectedIds.has(liability.id) ? "bg-secondary" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {liability.id}
                    </TableCell>
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
                      {selectAll ? (
                        <Checkbox
                          checked={selectedIds.has(liability.id)}
                          id={liability.id.toString()}
                          className="flex ml-[0.8rem]"
                          onCheckedChange={(isChecked) =>
                            handleCheckboxChange(liability.id, !!isChecked)
                          }
                        />
                      ) : (
                        <Checkbox
                          id={liability.id.toString()}
                          className="flex ml-[0.8rem]"
                          onCheckedChange={(isChecked) =>
                            handleCheckboxChange(liability.id, !!isChecked)
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Liabilities Spent</TableCell>
              <TableCell className="text-right">
                {isPendingTotal ? "Loading..." : totalDrainedData?.total}
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedIds.size === allLiabilityIds.size}
                  className="flex ml-[0.8rem]"
                  onCheckedChange={handleSelectAllChange}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
