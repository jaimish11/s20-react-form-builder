import React from "react";
import { BaseFieldProps } from "./types";
import { isFormChoiceEntry } from "../../types/form.types";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export const RadioField: React.FC<BaseFieldProps> = ({
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
      <FormControl component="fieldset" required={field.required}>
        <FormLabel component="legend">{field.label}</FormLabel>
        <RadioGroup name={field.label} value={field.label}>
          {field.choices.map((choice, choiceIndex) => (
            <FormControlLabel
              key={choice.label + choiceIndex}
              label={choice.label}
              value={choice.label}
              labelPlacement="end"
              control={
                <Radio
                  name={field.label}
                  required={field.required}
                  onChange={(event) =>
                    onFieldChange(index, choiceIndex, field.type, event)
                  }
                  checked={entry.choices[choiceIndex][choice.label]}
                />
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
      <br />
    </div>
  );
};
