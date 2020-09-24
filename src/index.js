import React from 'react';
import ReactDOM from 'react-dom';
import MainCard from './MainCard';
import App from './App';
import ViewForm from './ViewForm';
import './styles.css';
import {Tabs, Tab, AppBar} from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
const rootElement = document.getElementById("root");
ReactDOM.render(
    <Router><App /></Router>,
    rootElement
);