import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-liabilities")({
  component: CreateLiabilities,
});

function CreateLiabilities() {
  return (
    <div className="p-2">
      <h2>Create Liabilities</h2>
      <form className="max-w-sm m-auto">
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" placeholder="Title" />
        <Label htmlFor="amount">Amount</Label>
        <Input type="number" id="amount" placeholder="Amount" />
        <Button className="mt-4" type="submit">
          Create Liabilities
        </Button>
      </form>
    </div>
  );
}
