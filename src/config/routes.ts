export const API_BASE_URL = "http://localhost:5000/api/v1";

export const API_ROUTES = {
  CREATE_FORM: `${API_BASE_URL}/forms`,
  SAVE_FORM_SUBMISSIONS: `${API_BASE_URL}/forms/submissions`,
  GET_FORM: (formId: string) => `${API_BASE_URL}/forms/${formId}`,
  GET_FORM_SUBMISSIONS: (formId: string) =>
    `${API_BASE_URL}/forms/${formId}/submissions`,
} as const;
