import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchDrained() {
      const res = await fetch("/api/liabilities/total-drained");
      const data = await res.json();
      setCount(data.total);
    }
    fetchDrained();
  }, []);

  return (
    <Card className="w-[550px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total spent</CardDescription>
      </CardHeader>
      <CardContent>{count}</CardContent>
    </Card>
  );
}

export default App;
