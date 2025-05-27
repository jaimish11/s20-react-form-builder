import React from "react";
import { BaseFieldProps } from "./types";
import { isFormChoiceEntry } from "../../types/form.types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const DropdownField: React.FC<
  BaseFieldProps & { findSelected: (index: number) => string }
> = ({ field, index, formFieldData, onFieldChange, findSelected }) => {
  const entry = formFieldData.entries[index];

  if (!field.choices || !isFormChoiceEntry(entry)) {
    return null;
  }

  return (
    <div className="margin-top-2">
      <FormControl required={field.required}>
        <InputLabel>{field.label}</InputLabel>
        <Select
          onChange={(event: any) =>
            onFieldChange(index, null, field.type, event)
          }
          value={findSelected(index)}
        >
          {field.choices.map((choice, choiceIndex) => (
            <MenuItem key={choice.label + choiceIndex} value={choice.label}>
              {choice.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
