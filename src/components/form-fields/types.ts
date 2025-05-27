import { FormField, FormFieldData } from "../../types/form.types";

export interface BaseFieldProps {
  field: FormField;
  index: number;
  formFieldData: FormFieldData;
  onFieldChange: (
    index: number,
    choiceIndex: number | null,
    type: string,
    event: React.ChangeEvent<any>
  ) => void;
}
