// ============================================================================
// Contribution form field spec ("Contribute a reuse solution").
// This is the single source of truth for the fields the NoteForms form should
// collect. It also drives the built-in preview form rendered when no NoteForms
// embed URL is configured (see ContributeCTA / ContributeForm).
//
// When building the NoteForms form, mirror these fields (label, type, required).
// ============================================================================

import { COUNTRIES } from "@/lib/taxonomy";
import { REUSE_CATEGORY_NAMES } from "@/lib/reuse-categories";

export type ContributeFieldType =
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "url";

export type ContributeSection = "org" | "solution";

export type ContributeField = {
  name: string;
  label: string;
  type: ContributeFieldType;
  section: ContributeSection;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: readonly string[];
};

export const CONTRIBUTE_SECTIONS: Record<
  ContributeSection,
  { title: string; description: string }
> = {
  org: {
    title: "About you and your organization",
    description:
      "So we can verify the submission and follow up if we have questions.",
  },
  solution: {
    title: "The reuse solution",
    description: "The minimal details that let us map and describe the solution.",
  },
};

export const CONTRIBUTE_FIELDS: ContributeField[] = [
  // Organization / submitter
  {
    name: "org_name",
    label: "Name of organization or agency",
    type: "text",
    section: "org",
    required: true,
    placeholder: "e.g. Zero Waste Collective",
  },
  {
    name: "org_representative",
    label: "Organization representative",
    type: "text",
    section: "org",
    required: true,
    placeholder: "Full name of the contact person",
  },
  {
    name: "rep_email",
    label: "Contact email of representative",
    type: "email",
    section: "org",
    required: true,
    placeholder: "name@organization.org",
  },
  // Solution (minimal lead data a member could share)
  {
    name: "solution_name",
    label: "Name of reuse solution",
    type: "text",
    section: "solution",
    required: true,
    placeholder: "Short, descriptive title of the solution",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    section: "solution",
    required: true,
    options: COUNTRIES,
  },
  {
    name: "city",
    label: "City",
    type: "text",
    section: "solution",
    placeholder: "City or province where it operates",
  },
  {
    name: "reuse_framework_category",
    label: "Reuse Framework Category",
    type: "select",
    section: "solution",
    required: true,
    options: REUSE_CATEGORY_NAMES,
  },
  {
    name: "service_provider_name",
    label: "Name of service provider",
    type: "text",
    section: "solution",
    placeholder: "Who runs the solution (if different)",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    section: "solution",
    placeholder: "What does the solution do, and how does it work?",
  },
  {
    name: "image_url",
    label: "Image link",
    type: "url",
    section: "solution",
    placeholder: "https://... (a photo of the solution)",
    help: "Paste a link to an image. File upload is available in the NoteForms form.",
  },
];

export const CONTRIBUTE_SECTION_ORDER: ContributeSection[] = ["org", "solution"];
