import { AxiosResponse } from "axios";

export interface FormField {
  label: string;
  type: "text" | "checkbox" | "radio" | "dropdown";
  required?: boolean;
  choices?: Array<{
    label: string;
    selected: boolean;
  }>;
}

export interface FormData {
  formID: string;
  fields: FormField[];
}

export interface FormChoiceEntry {
  label: string;
  choices: Array<{ [key: string]: boolean }>;
  required?: boolean;
}

export interface FormTextEntry {
  [key: string]: string;
}

export type FormEntry = FormTextEntry | FormChoiceEntry;

export interface FormFieldData {
  entries: FormEntry[];
}

export interface ApiSaveResponse extends AxiosResponse {
  data: {
    formID: string;
  };
}

export interface ApiSaveData {
  formID: string;
  form: FormFieldData[];
}

// Type guards
export function isFormDataArray(form: [FormData] | ""): form is [FormData] {
  return Array.isArray(form) && form.length > 0 && "fields" in form[0];
}

export function isFormChoiceEntry(entry: FormEntry): entry is FormChoiceEntry {
  return (entry as FormChoiceEntry).choices !== undefined;
}
