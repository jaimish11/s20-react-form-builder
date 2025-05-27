import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "../../../styles.css";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = (pageURL: string): void => {
    navigate(pageURL);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <div className="header">
            <Button
              color="inherit"
              variant="contained"
              onClick={() => handleButtonClick("/s20/build-form")}
            >
              BUILD FORM
            </Button>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => handleButtonClick("/s20/view-form")}
            >
              VIEW FORM
            </Button>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => handleButtonClick("/s20/view-submissions")}
            >
              VIEW SUBMISSIONS
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
