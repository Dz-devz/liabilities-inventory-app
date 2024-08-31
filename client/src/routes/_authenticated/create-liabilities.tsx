import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { api } from "@/lib/api";
import { useForm } from "@tanstack/react-form";

import { Calendar } from "@/components/ui/calendar";
import { liabilitiesSchema } from "@server/types";

export const Route = createFileRoute("/_authenticated/create-liabilities")({
  component: CreateLiabilities,
});

function CreateLiabilities() {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const res = await api.liabilities.$post({ json: value });
      if (!res.ok) {
        throw new Error("Server Error");
      }
      navigate({ to: "/liabilities" });
    },
  });

  return (
    <div className="p-2">
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
              <Label htmlFor={field.name}>Title</Label>
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
          children={(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date: Date | null) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Loading..." : "Create Liabilities"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
