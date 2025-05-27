import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getFormSubmissions } from "../../../services/api";

interface FormEntry {
  [key: string]: any;
  choices?: Array<{ [key: string]: boolean }>;
  label?: string;
  required?: boolean;
}

interface FormSubmission {
  timestamp: string;
  form: [
    {
      entries: FormEntry[];
    }
  ];
}

interface EntriesAccordionProps {
  forms: FormSubmission[];
}

interface EntriesProps {
  form: FormSubmission[];
}

/**
 * Rendering accordions for each form submission
 */
const EntriesAccordion: React.FC<EntriesAccordionProps> = ({ forms }) => {
  const accordionGroup = forms.map((form, index) => (
    <Accordion key={index}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {`Form#${index} - ${form.timestamp
            .replace("T", " --- ")
            .replace("Z", "")}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {form.form[0]["entries"].map((entry, entryIndex) => {
          return Object.keys(entry).map((key, keyIndex) => {
            return (
              <div
                key={`${entryIndex}-${keyIndex}`}
                className="margin-top-half"
              >
                {key !== "choices" &&
                  key !== "label" &&
                  key !== "required" &&
                  `${key}:${entry[key]}`}
                {key === "label" && (
                  <span className="underline">{`${entry[key]}`}</span>
                )}
                {key === "choices" &&
                  entry.choices &&
                  entry.choices.map((choice, choiceIndex) => {
                    return Object.keys(choice).map((option, optionIndex) => {
                      return (
                        <div
                          key={`${choiceIndex}-${optionIndex}`}
                          className="left-indent20"
                        >
                          {choice[option] === true && `${option}`}
                        </div>
                      );
                    });
                  })}
              </div>
            );
          });
        })}
      </AccordionDetails>
    </Accordion>
  ));

  return <div>{accordionGroup}</div>;
};

/**
 * Component that renders an Accordion for form submissions
 */
const Entries: React.FC<EntriesProps> = ({ form }) => {
  return (
    <div className="padding">
      <p className="underline-primary">Form Submissions</p>
      <EntriesAccordion forms={form} />
    </div>
  );
};

/**
 * Parent component to accept form ID to view its submissions
 */
const FormSubmissions: React.FC = () => {
  const { form: initialFormId } = useParams();
  const [formID, setFormID] = useState(initialFormId || "");
  const [formData, setFormData] = useState<FormSubmission[] | "">("");
  const [viewFormSubmissionsIsDisabled, setViewFormSubmissionsIsDisabled] =
    useState(!initialFormId);

  useEffect(() => {
    if (formID) {
      const viewSubmissionsBtn = document.getElementById(
        "view-submissions-btn"
      );
      if (viewSubmissionsBtn) {
        viewSubmissionsBtn.click();
      }
      setViewFormSubmissionsIsDisabled(true);
    }
  }, [formID]);

  const handleFormIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormID(e.target.value);
    setViewFormSubmissionsIsDisabled(false);
  };

  const handleSubmissionsFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewFormSubmissionsIsDisabled(true);

    try {
      const submissions = await getFormSubmissions(formID);
      setFormData(submissions);
    } catch (error) {
      alert(error);
      setViewFormSubmissionsIsDisabled(false);
    }
  };

  return (
    <Card className="center">
      <p className="underline-primary">Form Submissions</p>
      <form onSubmit={handleSubmissionsFormSubmit}>
        <CardContent>
          <div className="flex-rows">
            <TextField
              className="flex-1"
              id="outlined-basic"
              label="Enter form ID"
              variant="outlined"
              value={formID}
              onChange={handleFormIDChange}
            />
            <Button
              className="flex-1 margin-left-1"
              disabled={viewFormSubmissionsIsDisabled}
              id="view-submissions-btn"
              type="submit"
              size="large"
              color="primary"
              variant="contained"
            >
              View Form Submissions
            </Button>
            <div className="flex-1"></div>
          </div>
        </CardContent>
      </form>
      {formData && <Entries form={formData} />}
    </Card>
  );
};

export default FormSubmissions;
