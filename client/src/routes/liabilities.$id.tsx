"use client";
import { budgetQuery, drainedQuery, getSingleLiabilities } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart with text";

const chartConfig = {
  chrome: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/liabilities/$id")({
  component: SingleLiabilities,
});

function SingleLiabilities() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-single-liability", id],
    queryFn: () => getSingleLiabilities({ id: id }), // Fetch based on selected liability ID on Route.params
    enabled: !!id,
  });
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

  if (isLoading || isPendingTotal || isPendingBudget)
    return <div>Loading...</div>;
  if (error || errorTotal || errorBudget)
    return <div>Error loading liability details</div>;

  if (!data || !totalDrainedData || !getBudget) return <div>No data found</div>;

  // to ensure getting a single Data
  const liability = data.singleLiabilities[0];
  const budget = getBudget.budget[0];

  const getMonthName = (date: Date): string => {
    return date.toLocaleString("default", { month: "long" });
  };
  const d = new Date();

  const liabilityData = [
    {
      id: liability.id,
      title: liability.title,
      amount: Number(liability.amount),
      fill: "var(--color-chrome)",
    },
    {
      id: liability.id,
      title: "Total Spent",
      amount: Number(totalDrainedData?.total),
      fill: "var(--color-firefox)",
    },
    {
      id: budget.id,
      title: "Budget",
      amount: Number(budget?.limit),
      fill: "var(--color-budget)",
    },
  ];

  // const totalD = totalDrainedData?.total;
  const amountD = liability.amount;
  const budgetD = budget.limit;
  const totalMins = Number(budgetD) - Number(amountD);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Category: {liability.title}</h2>
      <p className="text-lg font-medium">Budget Limit:</p>
      <p className="text-xl font-semibold text-green-600">{budgetD}</p>
      <p className="text-lg font-medium">Amount Spent:</p>
      <p className="text-xl font-semibold text-red-600">{amountD}</p>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart</CardTitle>
          <CardDescription>{getMonthName(d)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={liabilityData}
                dataKey="amount"
                nameKey="title"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalMins}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Remaining Balance
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Spend <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
