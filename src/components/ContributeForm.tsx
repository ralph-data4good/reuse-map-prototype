"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTRIBUTE_FIELDS,
  CONTRIBUTE_SECTIONS,
  CONTRIBUTE_SECTION_ORDER,
  type ContributeField,
} from "@/lib/contribute-form";

// Built-in preview of the contribution form, generated from the field spec.
// Shown when no NoteForms embed URL is configured. Submissions are intentionally
// not persisted (public write is disabled); this exists to scaffold and preview
// the exact fields the NoteForms form should collect.
function Field({
  field,
  defaultValue,
}: {
  field: ContributeField;
  defaultValue?: string;
}) {
  const id = `contribute-${field.name}`;
  const base =
    "w-full rounded-btn border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {field.label}
        {field.required && <span className="ml-0.5 text-brand">*</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={defaultValue}
          rows={4}
          className={base}
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          name={field.name}
          required={field.required}
          defaultValue={defaultValue ?? ""}
          className={base}
        >
          <option value="">Select {field.label.toLowerCase()}</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type === "url" ? "url" : field.type}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={defaultValue}
          className={base}
        />
      )}
      {field.help && <p className="text-xs text-muted">{field.help}</p>}
    </div>
  );
}

export function ContributeForm({
  defaultCategory,
  defaultCountry,
}: {
  defaultCategory?: string | null;
  defaultCountry?: string | null;
} = {}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card bg-white p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand" />
        <h3 className="font-heading text-lg font-semibold text-ink">
          Thanks for sharing
        </h3>
        <p className="max-w-md text-sm text-muted">
          This is a preview form, so nothing was sent yet. Once the NoteForms
          form is connected, submissions will go to the review team.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form
      className="rounded-card bg-white p-6 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="space-y-8">
        {CONTRIBUTE_SECTION_ORDER.map((section) => {
          const fields = CONTRIBUTE_FIELDS.filter((f) => f.section === section);
          return (
            <fieldset key={section} className="space-y-4">
              <legend className="mb-1">
                <span className="block font-heading text-base font-semibold text-ink">
                  {CONTRIBUTE_SECTIONS[section].title}
                </span>
                <span className="block text-sm text-muted">
                  {CONTRIBUTE_SECTIONS[section].description}
                </span>
              </legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((field) => {
                  let defaultValue: string | undefined;
                  if (field.name === "reuse_framework_category" && defaultCategory) {
                    defaultValue = defaultCategory;
                  }
                  if (field.name === "country" && defaultCountry) {
                    defaultValue = defaultCountry;
                  }
                  return (
                    <div
                      key={field.name}
                      className={
                        field.type === "textarea" ? "sm:col-span-2" : undefined
                      }
                    >
                      <Field field={field} defaultValue={defaultValue} />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-muted">
          Fields marked <span className="text-brand">*</span> are required.
        </p>
        <Button type="submit" variant="gold" size="lg">
          Submit for review
        </Button>
      </div>
    </form>
  );
}
