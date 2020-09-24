import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import api from './api';
import { TextField } from '@material-ui/core';


/**
 * Submit data with form that user created
 */
class SubmittedForm extends React.Component{

    constructor(props){
        super();
        this.state = {
            newTextFieldValue:'',
            form:'',
            formIsSubmitted: false

        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }
    componentDidMount(){
        this.setState({form:this.props.form});
    }
    handleFormSubmit(e){
        e.preventDefault();
        this.setState({
            formIsSubmitted: true
        })
        console.log(this.state.form[0].label)
        api.saveData(
        {
            formID:this.state.form[0].formID, 
            [this.state.form[0].label]:this.state.newTextFieldValue, 
        }
        ,true)
        .then(res=>{
            console.log(res);

        })
        .catch(error=>{
            console.log(error);
        })  
    }
    handleTextFieldChange(e){
        this.setState({
            newTextFieldValue:e.target.value
        })
    }
    render(){
        let field;
        if(this.state.form){
            if(this.state.form[0].type==="text"){
                field = <TextField id="outlined-basic" value={this.state.newTextFieldValue} onChange={this.handleTextFieldChange} type={this.state.form[0].type} label={this.state.form[0].label} variant="outlined" required={this.state.form[0].required}/>
            }
        }
        return(
            <Card>
                <form onSubmit={this.handleFormSubmit}>
                    <CardContent>
                        {field}
                    </CardContent>
                    <CardActions className="padding">
                        <Button type="submit" size="small" color="primary" variant="contained">Submit Form</Button>  
                    </CardActions>
                </form>
                {this.state.formIsSubmitted && 
                    <p>Form Submitted Successfully</p>
                }

            </Card>

        );
    }
}

export default class ViewForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            formID:'',
            formData:'',
            redirect:''
        }
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleViewFormSubmit = this.handleViewFormSubmit.bind(this);

    }
    handleTextFieldChange(e){
        this.setState({
            formID:e.target.value
        })
    }
    handleViewFormSubmit(e){
        alert(this.state.formID);
        e.preventDefault();
        api.getForm(this.state.formID)
        .then(form=>{
            alert(JSON.stringify(form,null,2));
            this.setState({
                formData:form[0]

            })
            //this.props.onViewFormSubmit(this.state.formData);

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