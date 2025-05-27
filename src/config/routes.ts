export const API_BASE_URL = "http://localhost:5000/testAPI";

export const API_ROUTES = {
  SAVE_FORM: `${API_BASE_URL}/save`,
  SAVE_FORM_ENTRIES: `${API_BASE_URL}/forms/entries/save`,
  GET_FORM: (formId: string) => `${API_BASE_URL}/forms/${formId}`,
  GET_FORM_ENTRIES: (formId: string) =>
    `${API_BASE_URL}/forms/entries/${formId}`,
} as const;
