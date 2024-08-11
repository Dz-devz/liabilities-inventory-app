import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

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

function Liabilities() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-all-liabilities"],
    queryFn: getAllDrained,
  });

  if (error) return "An Error has occured" + error.message;

  return (
    <div className="p-2 max-w-4xl m-auto">
      <Table>
        <TableCaption>A list of all Liabilities</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
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
                  </TableRow>
                ))
            : data?.liabilities.map((liability) => (
                <TableRow key={liability.id}>
                  <TableCell className="font-medium">{liability.id}</TableCell>
                  <TableCell>{liability.title}</TableCell>
                  <TableCell>{liability.amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
