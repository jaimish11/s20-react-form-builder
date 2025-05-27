import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { capitalize } from "../../../utils/stringUtility";
import { saveFormConfiguration } from "../../../services/api";
import { FormField } from "../../../types/form.types";

interface FormState {
  formFields: FormField[];
  formID: string;
  addedField: string;
  saveFormIsDisabled: boolean;
  addFieldIsDisabled: boolean;
  deleteFormIsDisabled: boolean;
}

const ConfigForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    formFields: [],
    formID: "",
    addedField: "",
    saveFormIsDisabled: true,
    addFieldIsDisabled: true,
    deleteFormIsDisabled: true,
  });

  const handleFormElementClick = (fieldType: string): void => {
    setFormState((prev) => {
      const values = [...prev.formFields];
      switch (fieldType.toLowerCase()) {
        case "text":
          values.push({ label: "", required: false, type: "text" });
          break;
        case "checkbox":
          values.push({
            label: "",
            type: "checkbox",
            choices: [{ label: "", selected: false }],
          });
          break;
        case "radio":
          values.push({
            label: "",
            required: false,
            type: "radio",
            choices: [{ label: "", selected: false }],
          });
          break;
        case "dropdown":
          values.push({
            label: "",
            required: false,
            type: "dropdown",
            choices: [{ label: "", selected: false }],
          });
          break;
        default:
      }
      return {
        ...prev,
        deleteFormIsDisabled: false,
        formFields: values,
      };
    });
  };

  const handleSelectChange = (event: any): void => {
    setFormState((prev) => ({
      ...prev,
      addedField: event.target.value as string,
      addFieldIsDisabled: false,
    }));
  };

  const handleAddChoice = (index: number): void => {
    setFormState((prev) => {
      const values = [...prev.formFields];
      if (values[index].choices) {
        values[index].choices?.push({ label: "", selected: false });
      }
      return { ...prev, formFields: values };
    });
  };

  const handleRemoveChoice = (index: number, choiceIndex: number): void => {
    setFormState((prev) => {
      const values = [...prev.formFields];
      values[index].choices?.splice(choiceIndex, 1);
      return { ...prev, formFields: values };
    });
  };

  const handleRemoveField = (index: number): void => {
    setFormState((prev) => {
      const values = [...prev.formFields];
      values.splice(index, 1);
      return { ...prev, formFields: values };
    });
  };

  const handleChange = (
    index: number,
    choiceIndex: number | null,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormState((prev) => {
      const values = [...prev.formFields];
      const target = event.target;

      if (target.name === "label") {
        values[index].label = target.value;
      } else if (target.name === "label-required") {
        values[index].required = (target as HTMLInputElement).checked;
      } else if (
        target.name === "choice" &&
        choiceIndex !== null &&
        values[index].choices
      ) {
        values[index].choices![choiceIndex].label = target.value;
      } else if (
        target.name.includes("choice-selected") &&
        choiceIndex !== null &&
        values[index].choices
      ) {
        if (target.name === "choice-selected-checkbox") {
          values[index].choices![choiceIndex].selected = (
            target as HTMLInputElement
          ).checked;
        } else {
          values[index].choices?.forEach((choice, subIndex) => {
            if (choiceIndex !== subIndex) {
              choice.selected = !(target as HTMLInputElement).checked;
            } else {
              choice.selected = (target as HTMLInputElement).checked;
            }
          });
        }
      }

      return {
        ...prev,
        saveFormIsDisabled: false,
        formFields: values,
      };
    });
  };

  const handleClearFormClick = (): void => {
    setFormState((prev) => ({
      ...prev,
      formFields: [],
      deleteFormIsDisabled: true,
    }));
  };

  const handleConfigFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, saveFormIsDisabled: true }));

    try {
      const formId = await saveFormConfiguration(formState.formFields);
      setFormState((prev) => ({ ...prev, formID: formId }));
    } catch (error) {
      console.error(error);
      alert(error);
      setFormState((prev) => ({ ...prev, saveFormIsDisabled: false }));
    }
  };

  return (
    <Card>
      <form onSubmit={handleConfigFormSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select field type</InputLabel>
                <Select
                  value={formState.addedField}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="radio">Radio</MenuItem>
                  <MenuItem value="dropdown">Dropdown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={formState.addFieldIsDisabled}
                onClick={() => handleFormElementClick(formState.addedField)}
                startIcon={<AddCircleSharpIcon />}
                variant="contained"
                color="primary"
              >
                Add Field
              </Button>
              <Button
                disabled={formState.deleteFormIsDisabled}
                onClick={handleClearFormClick}
                startIcon={<CancelSharpIcon />}
                variant="contained"
                color="secondary"
              >
                Clear Form
              </Button>
            </Grid>
          </Grid>

          {formState.formFields.map((field, index) => (
            <div key={`${field.type}-${index}`}>
              <div className="space-between margin-bottom-1">
                <div className="flex-cols width80">
                  <TextField
                    variant="outlined"
                    type="text"
                    name="label"
                    value={field.label}
                    label="Enter Label"
                    onChange={(event) => handleChange(index, null, event)}
                  />
                  <div className="options flex-rows">
                    <FormControlLabel
                      label="Required?"
                      labelPlacement="start"
                      className="no-margin-left"
                      control={
                        <Checkbox
                          checked={field.required}
                          name="label-required"
                          onChange={(event) => handleChange(index, null, event)}
                          color="primary"
                        />
                      }
                    />
                  </div>
                </div>
                <div className="field-control flex-rows valign-start">
                  <CancelSharpIcon
                    color="action"
                    fontSize="large"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveField(index)}
                  />
                </div>
              </div>

              {field.choices && field.choices.length > 0 && (
                <div>
                  {field.choices.map((choice, choiceIndex) => (
                    <div
                      key={`${field.type}-${index}-choice-${choiceIndex}`}
                      className="left-indent20"
                    >
                      <div className="justify-start">
                        <div className="flex-cols width60">
                          <TextField
                            variant="outlined"
                            type="text"
                            name="choice"
                            value={choice.label}
                            label="Enter Choice"
                            onChange={(event) =>
                              handleChange(index, choiceIndex, event)
                            }
                          />
                          <div className="options flex-rows">
                            <FormControlLabel
                              label="Selected?"
                              labelPlacement="start"
                              className="no-margin-left"
                              control={
                                <Checkbox
                                  checked={choice.selected}
                                  name={`choice-selected-${field.type}`}
                                  onChange={(event) =>
                                    handleChange(index, choiceIndex, event)
                                  }
                                  color="primary"
                                />
                              }
                            />
                          </div>
                        </div>
                        <div className="field-control flex-rows valign-start">
                          <CancelSharpIcon
                            color="action"
                            fontSize="large"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleRemoveChoice(index, choiceIndex)
                            }
                          />
                          <AddCircleSharpIcon
                            color="action"
                            fontSize="large"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleAddChoice(index)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            disabled={formState.saveFormIsDisabled}
            size="large"
            color="primary"
            variant="contained"
          >
            Save Form
          </Button>
        </CardActions>
      </form>
      {formState.formID && (
        <CardContent>
          <p className="underline-primary">Shareable Form URL</p>
          <p>
            <a
              href={`${
                window.location.href.split("/build-form")[0]
              }/view-form/${formState.formID}`.replace("#", "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`${window.location.href.split("/build-form")[0]}/view-form/${
                formState.formID
              }`.replace("#", "")}
            </a>
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default ConfigForm;
