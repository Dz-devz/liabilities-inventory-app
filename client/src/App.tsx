import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

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
