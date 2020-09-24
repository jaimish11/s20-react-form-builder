import React from 'react';
import MainCard from './MainCard';
import ViewForm from './ViewForm';
import history from './history';
import './styles.css';

import {Tabs, Tab, AppBar} from '@material-ui/core';


const tabNameToIndex = {
    0: "build-form",
    1: "view-form"
};

const indexToTabName = {
    "build-form": 0,
    "view-form": 1
};


//Main app scafolding
export default class Home extends React.Component{
    constructor(props){
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        const { match } = props;
        const { params } = match;
        const { form, page } = params;
        this.state = {
            selectedTab:indexToTabName[page],
            form:form
        }
        console.log('Params\n');
        console.log(params);

    }
    handleChange(event, newSelectedTab){
        history.push(`/s20/${tabNameToIndex[newSelectedTab]}`);
        this.setState({
            selectedTab:newSelectedTab
        })
    }
    render(){
        return(
            <>
                <AppBar position="static">
                    <Tabs value={this.state.selectedTab} onChange={this.handleChange}>
                        <Tab label="Build Form"  />
                        <Tab label="View Form"  />
                    </Tabs>
                </AppBar>
                {this.state.selectedTab === 0 && <MainCard/> }
                {this.state.selectedTab === 1 && <ViewForm/> }
            </>
            
        )
    }
}


