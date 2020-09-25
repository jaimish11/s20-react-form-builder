import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import api from './api';
import { TextField } from '@material-ui/core';
import history from './history';
import {
    BrowserRouter as Router,
    Redirect
} from "react-router-dom";

/**
* Submit data with form that user created
*/
class SubmittedForm extends React.Component{

    constructor(props){
        super();
        this.state = {
            newTextFieldValue:'',
            formFieldData:[{
                entries:[
                    
                ]
            }],
            form:'',
            formIsSubmitted: false

        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }
    componentDidMount(){
        let formToRender = [...this.props.form];
        let noOfFormFields = this.props.form[0].fields.length;
        let formFieldData = [...this.state.formFieldData]
        console.log(formToRender);
        for(let i=0;i<noOfFormFields;i++){
            let label = formToRender[0]['fields'][i]['label'];
            formFieldData[0]['entries'].push({
                [label]: ''
            });
        }
        this.setState({
            form:this.props.form,
            formFieldData:formFieldData
        });
        
    }
    handleFormSubmit(e){
        e.preventDefault();
        this.setState({
            formIsSubmitted: true
        })
        api.saveData(
        {
            formID:this.state.form[0].formID, 
            form:this.state.formFieldData 
        }
        ,true)
        .then(res=>{
            console.log(res);

        })
        .catch(error=>{
            console.log(error);
        })  
    }
    handleTextFieldChange(index, event){
        const values = [...this.state.formFieldData];
        console.log(values[0]['entries'][index][event.target.name]);
        values[0]['entries'][index][event.target.name] = event.target.value;
        this.setState({ formFieldData:values });
    }
    handleCheckboxChange(index, event){
        const values = [...this.state.formFieldData];
        console.log(values[0]['entries'][index][event.target.name]);
        values[0]['entries'][index][event.target.name] = event.target.checked;
        this.setState({ formFieldData:values });
    }
    handleRadioChange(index, event){
        const values = [...this.state.formFieldData];
        console.log(values[0]['entries'][index][event.target.name]);
        values[0]['entries'][index][event.target.name] = event.target.checked;
        this.setState({ formFieldData:values });
    }
    render(){
        let fields = [];
        if(this.state.form.length > 0){
            this.state.form[0].fields.map((field, index)=>{
                if(field.type === "text"){
                    fields.push(<div key={index}><TextField  id="outlined-basic" value={this.state.formFieldData[0]['entries'][index][field.label]} onChange={event=>this.handleTextFieldChange(index,event)} type={field.type} name={field.label} label={field.label} variant="outlined" required={field.required}/><br/></div>)
                }
                else if(field.type === "checkbox"){
                    fields.push(<div key={index}>
                    <FormControlLabel 
                        label={field.label} labelPlacement="start" 
                        control={<Checkbox color="primary" value={this.state.formFieldData[0]['entries'][index][field.label]} onChange={event=>this.handleCheckboxChange(index,event)} type={field.type} name={field.label} checked={field.checked}/>}>
                    </FormControlLabel>
                    <br/></div>)
                }
                else if(field.type === "radio"){
                    fields.push(<div key={index}>
                    <FormControlLabel 
                        label={field.label} labelPlacement="start" 
                        control={<Radio color="primary" value={this.state.formFieldData[0]['entries'][index][field.label]} onChange={event=>this.handleRadioChange(index,event)} type={field.type} name={field.label} checked={field.checked}/>}>
                    </FormControlLabel>
                    <br/></div>)
                }
            })
        }
        if(this.state.formID){
            let redirectURL = `/s20/view-submissions/${this.state.formID}`;
            history.push(redirectURL);
            return <Redirect to={{ pathname:redirectURL, state:this.state.formID}} />
        }
        return(
            <Card>
                <form onSubmit={this.handleFormSubmit}>
                    <CardContent>
                        {fields}
                    </CardContent>
                    <CardActions className="padding">
                        <Button type="submit" size="small" color="primary" variant="contained">Submit Form</Button>  
                    </CardActions>
                </form>

            </Card>

        );
    }
}


export default class ViewFormNew extends React.Component{
    constructor(props){
        super(props);
        const { match } = props;
        const { params } = match;
        const { form } = params;
        this.state = {
            formID:form,
            formData:'',
            redirect:''
        }
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleViewFormSubmit = this.handleViewFormSubmit.bind(this);

    }
    componentDidMount(){
        console.log(this.state.form);
    }
    handleTextFieldChange(e){
        this.setState({
            formID:e.target.value
        })
    }
    handleViewFormSubmit(e){
        e.preventDefault();
        api.getForm(this.state.formID)
        .then(form=>{
            this.setState({
                formData:form[0]

            })
        })
        .catch(error=>{
            alert(error);
        })
    }
    render(){
        let form = [];
        if(this.state.formData){
            form.push(this.state.formData);
        }
        return(
            <Card className="center">
                <form onSubmit={this.handleViewFormSubmit}>
                    <CardContent>
                        <TextField id="outlined-basic" label="Enter form ID" variant="outlined" value={this.state.formID} onChange={this.handleTextFieldChange}/> 
                    </CardContent>
                    <CardActions className="padding">
                        <Button type="submit" size="small" color="primary" variant="contained">View Form</Button>
                    </CardActions>
                </form>
                <CardContent>
                    {form.length > 0 && <SubmittedForm form={form}/>}
                </CardContent>
            </Card>
            
           
        );
    }
}