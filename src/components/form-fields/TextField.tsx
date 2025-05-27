import React from "react";
import { TextField as MuiTextField } from "@mui/material";
import { BaseFieldProps } from "./types";
import { isFormChoiceEntry } from "../../types/form.types";

export const TextField: React.FC<BaseFieldProps> = ({
  field,
  index,
  formFieldData,
  onFieldChange,
}) => {
  const entry = formFieldData.entries[index];

  if (isFormChoiceEntry(entry)) {
    return null;
  }

  return (
    <div className="width80 margin-top-1">
      <MuiTextField
        fullWidth
        id="outlined-basic"
        value={entry[field.label] || ""}
        onChange={(event: any) => onFieldChange(index, null, field.type, event)}
        name={field.label}
        label={field.label}
        variant="outlined"
        required={field.required}
      />
      <br />
    </div>
  );
};
