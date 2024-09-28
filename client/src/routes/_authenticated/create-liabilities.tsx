import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { createLiabilities, liabilitiesQuery } from "@/lib/api";
import { liabilitiesSchema } from "@server/types";
import { useForm } from "@tanstack/react-form";

// Shadcn ui
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/create-liabilities")({
  component: CreateLiabilities,
});

function CreateLiabilities() {
  const [globalError, setGlobalError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      try {
        // making sure that it gets the past data before getting the new data to avoid duplication of data displaying
        const pastLiabilities =
          await queryClient.ensureQueryData(liabilitiesQuery);

        const recentLiabilities = await createLiabilities({ value });

        queryClient.setQueryData(liabilitiesQuery.queryKey, {
          ...pastLiabilities,
          liabilities: [recentLiabilities, ...pastLiabilities.liabilities],
        });

        navigate({ to: "/liabilities" });
      } catch (error) {
        setGlobalError("Cannot create more liabilities, budget exceeded. ");
        setShowError(true);

        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    },
  });

  return (
    <div className="p-2">
      {showError && (
        <div
          className={`text-foreground bg-secondary p-2 rounded mb-4 transition-opacity duration-500 ${!showError ? "opacity-0" : "opacity-100"}`}
        >
          {globalError}
        </div>
      )}
      <form
        className="max-w-sm m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: liabilitiesSchema.shape.title,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Category</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                // <em>{field.state.meta.errors.join(", ")}</em>
                <div
                  dangerouslySetInnerHTML={{
                    __html: field.state.meta.errors.join("<br />"),
                  }}
                />
              ) : null}
            </>
          )}
        />
        <form.Field
          name="amount"
          validators={{
            onChange: liabilitiesSchema.shape.amount,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value === "0" ? "" : field.state.value}
                placeholder="0"
                onBlur={field.handleBlur}
                type="number"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </>
          )}
        />
        <form.Field
          name="date"
          validators={{
            onChange: liabilitiesSchema.shape.date,
          }}
        >
          {(field) => (
            <Popover>
              <PopoverTrigger asChild>
                <div className="self-center mt-4">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.state.value && "text-muted-foreground"
                    )}
                  >
                    {field.state.value ? (
                      format(new Date(field.state.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) =>
                    field.handleChange((date ?? new Date()).toISOString())
                  }
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              className="mt-4 text-foreground"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? "Loading..." : "Create Liabilities"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
