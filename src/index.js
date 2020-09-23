import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './styles.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { TextField } from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

function saveData(payload, submissions = null){
    if(submissions){
        axios.post('http://localhost:5000/testAPI/forms/entries/save',payload)
        .then(res=>{
            console.log(res);
        })
        .catch(error=>{
            console.log(error);
            alert(error);
        })
    }
    else{
        axios.post('http://localhost:5000/testAPI/save',payload)
        .then(res=>{
            console.log(res);
            formID = res.data[0].formID;
            console.log("formID - "+formID);
        })
        .catch(error=>{
            console.log(error);
            alert(error);
        })
    }
   
}

function getForm(form, submissions= null){
    if(!submissions){
        const formData = new Promise(function(resolve, reject){
            axios.get('http://localhost:5000/testAPI/forms/'+form)
            .then(res=>{
                console.log(res.data);
                resolve(res.data);
            })
            .catch(error=>{
                console.log(error)
                reject(error);
            })
        });
        return formData;
    }
    else{
        const submissionsData = new Promise(function(resolve, reject){
            axios.get('http://localhost:5000/testAPI/forms/entries/'+form)
            .then(res=>{
                console.log(res.data);
                resolve(res.data);
            })
            .catch(error=>{
                console.log(error)
                reject(error);
            })
        });
        return submissionsData;
    }
   
    
   
}

class TextBox extends React.Component{
    constructor(props) {
        super(props);
        this.handleTextboxChange = this.handleTextboxChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }
    handleTextboxChange(e){
        this.props.onTextboxChange(e.target.value);
    }
    handleCheckboxChange(e){
        this.props.onCheckboxChange(e.target.checked);
    }
    render(){
        let label = this.props.label;
        let required = this.props.fieldRequired;
        return(
            <div>
                <p className="emphasized">Text</p>
                Label:<input type="text" value={label} onChange={this.handleTextboxChange}></input>
                Required?<input type="checkbox" checked={required} onChange={this.handleCheckboxChange}></input>
            </div>
        );
    }
}

class ConfigForm extends React.Component{
    constructor(props){
        super();
        this.state = {
            clickedCount:0,
            textboxLabel:'',
            textboxRequired: false
        };
        this.handleFormElementClick = this.handleFormElementClick.bind(this);
        this.handleTextboxChange = this.handleTextboxChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleConfigFormSubmit = this.handleConfigFormSubmit.bind(this);
    }
    //Calls selected form component
    handleFormElementClick(e){
        this.setState({
            clickedCount:this.state.clickedCount + 1
        });
    }
    handleTextboxChange(label){
        this.setState({
            textboxLabel: label,
        })
    }
    handleCheckboxChange(required){
        this.setState({
            textboxRequired: required,
        })
    }
    
    handleConfigFormSubmit(e){
        e.preventDefault();
        formConfig.field = "input";
        formConfig.type = "text";
        formConfig.label = this.state.textboxLabel;
        formConfig.required = this.state.textboxRequired;
        alert(JSON.stringify(formConfig,null,2));
        saveData(formConfig);

     
    }
    render(){
        let formElement;
        if(this.state.clickedCount > 0){
            formElement = 
            <TextBox 
                label={this.state.textboxLabel} 
                fieldRequired={this.state.textboxRequired} 
                onTextboxChange={this.handleTextboxChange}
                onCheckboxChange={this.handleCheckboxChange}
            />;
        }
        return(
            <div>
                <form onSubmit={this.handleConfigFormSubmit}>
                    <CardContent>
                        <Card>
                            <CardContent>
                                Add Field:<br/>
                                <a href="#" id="singleLineText" onClick={this.handleFormElementClick}>Single Line Text</a>
                            </CardContent>
                        </Card>
                    </CardContent>
                    {formElement}
                    <CardActions>
                        <Button type="submit" size="small">Save Form</Button>
                    </CardActions>
                </form>
                
            </div>
        )
    }
}

class ViewForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            formID:'',
            formData:'',
            redirect:''
        }
        this.handleViewFormSubmit = this.handleViewFormSubmit.bind(this);
        this.handleFormIDClick = this.handleFormIDClick.bind(this);

    }
    handleFormIDClick(e){
        this.setState({formID:formID});
    }
    handleViewFormSubmit(e){
        alert('submitted');
        e.preventDefault();
        getForm(this.state.formID)
        .then(form=>{
            alert(JSON.stringify(form,null,2));
            this.setState({
                redirect:'/forms/view/'+this.state.formID,
                formData:form[0]

            })
            this.props.onViewFormSubmit(this.state.formData);

        })
        .catch(error=>{
            alert(error);
        })
    }
    render(){
        if(this.state.redirect){
            return <Redirect to={{
                pathname:this.state.redirect,
                state:{form:this.state.formData}
                 }} />
        }
        return(
            <form onSubmit={this.handleViewFormSubmit}>
                <TextField id="outlined-basic" label="Click to see form URL" variant="outlined" value={this.state.formID} onClick={this.handleFormIDClick}/>
                <Button type="submit" size="small">View Form</Button>
            </form>
           
        );
    }
}

class Entries extends React.Component{

    // constructor(props){
    //     super();
    //     this.state = {
    //         value:'',
    //         formSubmitted:false
    //     }
    //     this.handleFormSubmit = this.handleFormSubmit.bind(this);
    //     this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    // }
    // handleFormSubmit(e){
    //     e.preventDefault();
    //     this.setState({
    //         formSubmitted:true
    //     })
    //     saveData({formID:this.props.location.state.form.formID, value:this.state.value},true);
    // }
    // handleTextFieldChange(e){
    //     this.setState({
    //         value:e.target.value
    //     })
    // }
    componentDidMount(){
        alert(JSON.stringify(this.props.location.state.form,null,2));
    }
    render(){
        let submissions = {...this.props.location.state.form};
        let entries = [];
        Object.keys(submissions).forEach(name=>{
            entries.push(
                <div key={name}>
                    <p>{name}</p>
                    <p>{submissions[name]}</p>
                </div>
            )
        });
        return(
            <Card className="center">
                    <CardContent>
                        {entries}
                    </CardContent>
            </Card>

        );
    }
}

class ViewSubmissions extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            formID:'',
            formData:'',
            redirect:''
        }
        this.handleSubmissionsFormSubmit = this.handleSubmissionsFormSubmit.bind(this);
        this.handleFormIDChange = this.handleFormIDChange.bind(this);

    }
    handleFormIDChange(e){
        this.setState({formID:e.target.value});
    }
    handleSubmissionsFormSubmit(e){
        e.preventDefault();
        getForm(this.state.formID, true)
        .then(form=>{
            this.setState({
                redirect:'/forms/entries/view/'+this.state.formID,
                formData:form[0]
            })

        })
        .catch(error=>{
            alert(error);
        })
    }
    render(){
        if(this.state.redirect){
            return <Redirect to={{
                pathname:this.state.redirect,
                state:{form:this.state.formData}
                }} />
        }
        return(
            <form onSubmit={this.handleSubmissionsFormSubmit}>
                <TextField id="outlined-basic" label="Enter form ID" variant="outlined" value={this.state.formID} onChange={this.handleFormIDChange}/>
                <Button type="submit" size="small">View Form Submissions</Button>
            </form>
           
        );
    }
}

class SubmittedForm extends React.Component{

    constructor(props){
        super();
        this.state = {
            value:'',
            formSubmitted:false
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }
    handleFormSubmit(e){
        e.preventDefault();
        this.setState({
            formSubmitted:true
        })
        saveData({formID:this.props.location.state.form.formID, value:this.state.value, label:this.props.location.state.form.label},true);
    }
    handleTextFieldChange(e){
        this.setState({
            value:e.target.value
        })
    }
    render(){
        let field;
        if(!this.state.formSubmitted){
            if(this.props.location.state.form.field==="input"){
                field = <TextField id="outlined-basic" value={this.state.value} onChange={this.handleTextFieldChange} type={this.props.location.state.form.type} label={this.props.location.state.form.label} variant="outlined" required={this.props.location.state.form.required}/>
            }
        }
        return(
            <Card className="center">
                <form onSubmit={this.handleFormSubmit}>
                    <CardContent>
                        {field}
                    </CardContent>
                    <CardActions>
                        <Button type="submit" size="small">Submit Form</Button>  
                    </CardActions>
                </form>
            </Card>

        );
    }
}

//Main card to display form options
class MainCard extends React.Component{
    constructor(props){
        super();
        this.handleViewFormSubmit = this.handleViewFormSubmit.bind(this);
        this.state = {
            form:''
        }
    }
    handleViewFormSubmit(e,form){
        this.setState({form:form});
    }
    render(){
        return(
            <div>
                <Card className="center">
                    <ViewForm onViewFormSubmit={this.handleViewFormSubmit}/>
                    <ViewSubmissions/>
                    <ConfigForm />
                </Card>
                <Switch>
                    <Route path="/forms/view" 
                    render={
                        (props) => <SubmittedForm {...props}/>
                    }
                    >

                    </Route>
                    <Route path="/forms/entries/view" 
                    render={
                        (props) => <Entries {...props}/>
                    }
                    >

                    </Route>
                </Switch>
            </div>
           
        )
    }
}

//Main app scafolding
class App extends React.Component{
    render(){
        return(
            <MainCard/> 
        )
    }
}

let formConfig = {};
let formID = '';

ReactDOM.render(
    <Router><App /></Router>,
    document.getElementById('root')
);