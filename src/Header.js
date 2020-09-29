import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { withRouter } from "react-router-dom";
import Link from '@material-ui/core/Link';
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
                            <Link href="#" color="inherit"
                                
                                onClick={() => this.handleButtonClick("/s20/build-form")}
                            >
                                BUILD FORM
                            </Link>
                            <Link href="#" color="inherit"
                                
                                onClick={() => this.handleButtonClick("/s20/view-form")}
                            >
                                VIEW FORM
                            </Link>
                            <Link href="#" color="inherit"
                                
                                onClick={() => this.handleButtonClick("/s20/view-submissions")}
                            >
                                VIEW SUBMISSIONS
                            </Link>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withRouter(Header);