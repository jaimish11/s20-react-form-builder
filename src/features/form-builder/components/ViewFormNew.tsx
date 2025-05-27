import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Button, TextField } from "@mui/material";
import { SubmittedForm } from "../../../components/SubmittedForm";
import { FormData } from "../../../types/form.types";
import { getForm } from "../../../services/api";

export default function ViewFormNew() {
  const { form } = useParams();
  const [formID, setFormID] = useState(form || "");
  const [formData, setFormData] = useState<FormData | "">("");
  const [viewFormIsDisabled, setViewFormIsDisabled] = useState(!form);

  useEffect(() => {
    if (form) {
      const viewFormBtn = document.getElementById("view-form-btn");
      if (viewFormBtn) {
        viewFormBtn.click();
      }
      setViewFormIsDisabled(true);
    }
  }, [form]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormID(e.target.value);
    setViewFormIsDisabled(false);
  };

  const handleOnClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setViewFormIsDisabled(true);

    try {
      const form = await getForm(formID);
      setFormData(""); // Reset form data
      setFormData(form[0]);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Card className="center">
      <p className="underline-primary">View Form</p>
      <form>
        <CardContent>
          <div className="flex-rows">
            <TextField
              className="flex-1"
              id="outlined-basic"
              label="Enter form ID"
              variant="outlined"
              value={formID}
              onChange={handleTextFieldChange}
            />
            <Button
              className="flex-1 margin-left-1"
              disabled={viewFormIsDisabled}
              id="view-form-btn"
              type="submit"
              size="large"
              color="primary"
              variant="contained"
              onClick={handleOnClick}
            >
              View Form
            </Button>
            <div className="flex-1"></div>
          </div>
        </CardContent>
      </form>
      <CardContent>
        {formData && <SubmittedForm form={[formData]} />}
      </CardContent>
    </Card>
  );
}
