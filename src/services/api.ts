import axios, { AxiosResponse } from "axios";
import { API_ROUTES } from "../config/routes";
import { FormField } from "../types/form.types";

interface SaveFormResponse {
  formID: string;
}

/**
 * Saves the form configuration/structure created by form builder
 * @param formFields - Array of form fields configuration
 * @returns Promise with the form ID
 */
export const saveFormConfiguration = async (
  formFields: FormField[]
): Promise<string> => {
  try {
    const response = await axios.post(API_ROUTES.CREATE_FORM, formFields);

    console.log(response.data);
    if (response.data && response.data.length > 0) {
      return response.data[0].formID;
    }
    throw new Error("No form ID returned");
  } catch (error) {
    console.error("Error saving form configuration:", error);
    throw error;
  }
};

/**
 * Saves the form submission data entered by users
 * @param submissionData - Form submission data
 * @returns Promise with the submission response
 */
export const saveFormSubmission = async (
  submissionData: any
): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(
      API_ROUTES.SAVE_FORM_SUBMISSIONS,
      submissionData
    );
    return response;
  } catch (error) {
    console.error("Error saving form submission:", error);
    throw error;
  }
};

/**
 * Fetch form configuration/structure
 * @param formId - Form ID to fetch
 */
export const getForm = async (formId: string): Promise<any> => {
  try {
    const response = await axios.get(API_ROUTES.GET_FORM(formId));
    return response.data;
  } catch (error) {
    console.error("Error fetching form:", error);
    throw error;
  }
};

/**
 * Fetch form submissions
 * @param formId - Form ID to fetch submissions for
 */
export const getFormSubmissions = async (formId: string): Promise<any> => {
  try {
    const response = await axios.get(API_ROUTES.GET_FORM_SUBMISSIONS(formId));
    return response.data;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    throw error;
  }
};
