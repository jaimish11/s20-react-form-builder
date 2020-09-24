import React from 'react';
import Home from './Home';
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
        console.log('inside App.js render()');
        return(
            <Switch>
                    <Redirect exact from="/s20" to="/s20/build-form" />
                    <Route exact path="/s20/:page" render={props => <Home {...props} />} />
                    <Route exact path="/s20/:page/:form?" render={props => <Home {...props} />} />
            </Switch>
        );
    }
    
}
