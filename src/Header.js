import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import history from './history';
import './styles.css';

class Header extends React.Component{
   
    constructor(){
        super();
        this.handleButtonClick = this.handleButtonClick.bind(this);
       
    }

    handleButtonClick(pageURL){
        history.push(pageURL);
    }
    
    render(){
        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                    <div className="header">
                        <Button
                            variant="contained"
                            onClick={() => this.handleButtonClick("/s20/build-form")}
                        >
                            BUILD FORM
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => this.handleButtonClick("/s20/view-form")}
                        >
                            VIEW FORM
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => this.handleButtonClick("/s20/view-submissions")}
                        >
                            VIEW SUBMISSIONS
                        </Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withRouter(Header);