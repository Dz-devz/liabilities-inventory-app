import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";

async function getTotalDrained() {
  const res = await api.liabilities["total-drained"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-drained"],
    queryFn: getTotalDrained,
  });

  if (error) return "An Error has occured" + error.message;

  return (
    <Card className="w-[550px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? "Loading..." : data.total}</CardContent>
    </Card>
  );
}

export default App;
