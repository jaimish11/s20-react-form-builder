import React, { ChangeEvent, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
  FormData,
  FormField,
  FormFieldData,
  ApiSaveData,
  isFormDataArray,
  isFormChoiceEntry,
  FormChoiceEntry,
} from "../types/form.types";
import {
  TextField,
  CheckboxField,
  RadioField,
  DropdownField,
} from "./form-fields";
import { saveFormSubmission } from "../services/api";
import { CardContent, CardActions, Button } from "@mui/material";

interface SubmittedFormProps {
  form: [FormData];
}

export const SubmittedForm: React.FC<SubmittedFormProps> = ({ form }) => {
  const [formFieldData, setFormFieldData] = useState<FormFieldData[]>([
    { entries: [] },
  ]);
  const [formData, setFormData] = useState<[FormData] | "">("");
  const [formID, setFormID] = useState("");
  const [submitFormIsDisabled, setSubmitFormIsDisabled] = useState(true);

  const findSelected = (index: number): string => {
    let preselectedOption = "";
    const entry = formFieldData[0].entries[index];

    if (isFormChoiceEntry(entry)) {
      entry.choices.forEach((choice: { [key: string]: boolean }) => {
        Object.keys(choice).forEach((key) => {
          if (choice[key] === true) {
            preselectedOption = key;
          }
        });
      });
    }
    return preselectedOption;
  };

  useEffect(() => {
    const formToRender = [...form];
    const newFormFieldData = [{ entries: [] }] as [FormFieldData];

    formToRender[0].fields.map((field) => {
      const { label, type, choices, required } = field;

      switch (type) {
        case "text": {
          const entry = { [label]: "" };
          newFormFieldData[0].entries = [...newFormFieldData[0].entries, entry];
          break;
        }
        case "checkbox": {
          const entry = { label };
          newFormFieldData[0].entries = [...newFormFieldData[0].entries, entry];

          choices?.forEach((choice) => {
            const entry =
              newFormFieldData[0].entries[
                newFormFieldData[0].entries.length - 1
              ];
            if (isFormChoiceEntry(entry)) {
              entry.choices.push({ [choice.label]: choice.selected });
            }
          });
          break;
        }
        case "radio":
        case "dropdown": {
          const entry: FormChoiceEntry = { label, required, choices: [] };
          newFormFieldData[0].entries = [...newFormFieldData[0].entries, entry];

          choices?.forEach((choice) => {
            const entry =
              newFormFieldData[0].entries[
                newFormFieldData[0].entries.length - 1
              ];
            if (isFormChoiceEntry(entry)) {
              entry.choices.push({ [choice.label]: choice.selected });
            }
          });
          break;
        }
      }
    });

    setFormFieldData(newFormFieldData);
    setFormData(form);
  }, [form]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitFormIsDisabled(true);

    if (isFormDataArray(formData)) {
      const saveData: ApiSaveData = {
        formID: formData[0].formID,
        form: [formFieldData[0]],
      };

      try {
        const res = await saveFormSubmission(saveData);
        setFormID(res.data.formID);
      } catch (error) {
        console.error(error);
        setSubmitFormIsDisabled(false);
      }
    }
  };

  const handleChange = (
    index: number,
    choiceIndex: number | null,
    type: string,
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const newFormFieldData = [...formFieldData];
    setSubmitFormIsDisabled(false);

    const entry = newFormFieldData[0].entries[index];
    const target = event.target;

    switch (type) {
      case "text":
        if ("name" in target && !isFormChoiceEntry(entry)) {
          entry[target.name as string] = target.value as string;
        }
        break;
      case "checkbox":
        if (
          choiceIndex !== null &&
          "value" in target &&
          isFormChoiceEntry(entry) &&
          target instanceof HTMLInputElement
        ) {
          entry.choices[choiceIndex][target.value] = target.checked;
        }
        break;
      case "radio":
        if (
          choiceIndex !== null &&
          "value" in target &&
          isFormChoiceEntry(entry) &&
          target instanceof HTMLInputElement
        ) {
          entry.choices.forEach((choice, subIndex) => {
            if (choiceIndex === subIndex) {
              entry.choices[choiceIndex][target.value] = target.checked;
            } else {
              Object.keys(entry.choices[subIndex]).forEach((key) => {
                entry.choices[subIndex][key] = !target.checked;
              });
            }
          });
        }
        break;
      case "dropdown":
        if ("value" in target && isFormChoiceEntry(entry)) {
          const value = target.value as string;
          entry.choices.forEach((choice: { [key: string]: boolean }) => {
            Object.keys(choice).forEach((key) => {
              choice[key] = key === value;
            });
          });
        }
        break;
    }

    setFormFieldData(newFormFieldData);
  };

  const renderField = (field: FormField, index: number): React.ReactNode => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            key={index}
            field={field}
            index={index}
            formFieldData={formFieldData[0]}
            onFieldChange={handleChange}
          />
        );
      case "checkbox":
        return (
          <CheckboxField
            key={index}
            field={field}
            index={index}
            formFieldData={formFieldData[0]}
            onFieldChange={handleChange}
          />
        );
      case "radio":
        return (
          <RadioField
            key={index}
            field={field}
            index={index}
            formFieldData={formFieldData[0]}
            onFieldChange={handleChange}
          />
        );
      case "dropdown":
        return (
          <DropdownField
            key={index}
            field={field}
            index={index}
            formFieldData={formFieldData[0]}
            onFieldChange={handleChange}
            findSelected={findSelected}
          />
        );
      default:
        return null;
    }
  };

  if (!isFormDataArray(formData)) {
    return null;
  }

  if (formID) {
    const redirectURL = `/s20/view-submissions/${formID}`;
    return <Navigate to={redirectURL} state={formID} replace />;
  }

  return (
    <div>
      <p className="underline-primary">Your Form</p>
      <form onSubmit={handleFormSubmit}>
        <CardContent>
          {formData[0].fields.map((field, index) => renderField(field, index))}
        </CardContent>
        <CardActions className="padding">
          <Button
            type="submit"
            disabled={submitFormIsDisabled}
            size="large"
            color="primary"
            variant="contained"
          >
            Submit Form
          </Button>
        </CardActions>
      </form>
    </div>
  );
};
