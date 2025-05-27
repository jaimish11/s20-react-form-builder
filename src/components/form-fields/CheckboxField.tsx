import React from "react";
import { BaseFieldProps } from "./types";
import { isFormChoiceEntry } from "../../types/form.types";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";

export const CheckboxField: React.FC<BaseFieldProps> = ({
  field,
  index,
  formFieldData,
  onFieldChange,
}) => {
  const entry = formFieldData.entries[index];

  if (!field.choices || !isFormChoiceEntry(entry)) {
    return null;
  }

  return (
    <div className="margin-top-2">
      <FormControl component="fieldset">
        <FormLabel component="legend">{field.label}</FormLabel>
        <FormGroup>
          {field.choices.map((choice, choiceIndex) => (
            <FormControlLabel
              key={choice.label + choiceIndex}
              label={choice.label}
              labelPlacement="end"
              control={
                <Checkbox
                  color="primary"
                  onChange={(event) =>
                    onFieldChange(index, choiceIndex, field.type, event)
                  }
                  value={choice.label}
                  checked={entry.choices[choiceIndex][choice.label]}
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>
      <br />
    </div>
  );
};
