import React from 'react';
import Header from './Header';
import BuildForm from './BuildForm';
import ViewFormNew from './ViewFormNew';
import FormSubmissions from './FormSubmissions';
import './styles.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";


export default class App extends React.Component{
    render(){
        return(
            <div className="padding-1">
                <Header/>
                <Switch>
                        <Redirect exact from="/" to="/s20" />
                        <Redirect exact from="/s20" to="/s20/build-form" />
                        <Route exact path="/s20/build-form" render={props=><BuildForm {...props} />}/>
                        <Route path="/s20/view-form/:form?" render={props=><ViewFormNew {...props} />}/>
                        <Route path="/s20/view-submissions/:form?" render={props=><FormSubmissions {...props} />}/>
                </Switch>
            </div>
               

        );
    }
    
}