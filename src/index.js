import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';
import history from './history';
import {
    Router
} from "react-router-dom";
const rootElement = document.getElementById("root");
ReactDOM.render(
    <Router history={history}><App /></Router>,
    rootElement
);