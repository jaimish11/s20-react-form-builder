import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
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
        this.findSelected = this.findSelected.bind(this);
        this.handleChange = this.handleChange.bind(this);
    
    }
    findSelected(index){
        const values = [...this.state.formFieldData];
        values[0]['entries'][index]['choices'].forEach(choice=>{
           Object.keys(choice).forEach(key=>{
               if(choice[key] === true) {
                   console.log(choice['label']);
                   return choice['label'];
               }
           })
       })
    }
    componentDidMount(){

        //Form JSON to render on frontend
        let formToRender = [...this.props.form];
        let noOfFormFields = this.props.form[0].fields.length;
        //Form JSON to store entered form values
        let formFieldData = [...this.state.formFieldData]
        console.log(formToRender);
        for(let i=0;i<noOfFormFields;i++){
            let label = formToRender[0]['fields'][i]['label'];
            let type = formToRender[0]['fields'][i]['type'];
            //Populate submission form JSON based on form to render
            switch(type){
                case "text":
                    formFieldData[0]['entries'].push({
                        [label]: ''
                    });
                break;
                case "checkbox":
                    formFieldData[0]['entries'].push({
                        label:label,
                        choices:[]
                    });
                    formToRender[0]['fields'][i]['choices'].forEach(choice=>{
                        formFieldData[0]['entries'][i]['choices'].push({
                            [choice.label]: choice.selected
                        });
                    });
                break;
                case "radio":
                case "dropdown":
                    formFieldData[0]['entries'].push({
                        label:label,
                        required: formToRender[0]['fields'][i]['required'],
                        choices:[]
                    });
                    formToRender[0]['fields'][i]['choices'].forEach(choice=>{
                        formFieldData[0]['entries'][i]['choices'].push({
                            [choice.label]: choice.selected
                        });
                    });
                break;
                default:
            }
           
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
    handleChange(index, choiceIndex=null, type, event){
        const values = [...this.state.formFieldData];
        switch(type){
            case "text":
                values[0]['entries'][index][event.target.name] = event.target.value;
            break;
            case "checkbox":
                values[0]['entries'][index]['choices'][choiceIndex][event.target.value] = event.target.checked;
            break;
            case "radio":
                values[0]['entries'][index]['choices'].forEach((choice, subIndex)=>{
                    
                    //Only allow one option to be selected
                    if(choiceIndex == subIndex){
                        values[0]['entries'][index]['choices'][choiceIndex][event.target.value] = event.target.checked;
                    }
                    else{
                        Object.keys(values[0]['entries'][index]['choices'][subIndex]).forEach(key=>{
                            values[0]['entries'][index]['choices'][subIndex][key] = !event.target.checked;
                        })
                        
                    }
                })   
            
            break;
            case "dropdown":
                values[0]['entries'][index]['choices'].forEach(choice=>{
                    Object.keys(choice).forEach(key=>{
                        if(key == event.target.value){
                            choice[event.target.value] = true;
                        }
                        else{
                            choice[key] = false;
                        }
                        
                    })
                })
            break;
            default:

        }
       
        this.setState({ formFieldData:values });
    }
    render(){
        let fields = [];
        if(this.state.form.length > 0){
            this.state.form[0].fields.map((field, index)=>{
                if(field.type === "text"){
                    fields.push(<div key={index}><TextField  id="outlined-basic" value={this.state.formFieldData[0]['entries'][index][field.label]} onChange={event=>this.handleChange(index, null, field.type, event)} name={field.label} label={field.label} variant="outlined" required={field.required}/><br/></div>)
                }
                else if(field.type === "checkbox"){
                    fields.push(<div key={index}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <FormGroup>
                            {field.choices.map((choice,choiceIndex)=>(
                                <FormControlLabel key={choice+choiceIndex} label={choice.label} labelPlacement="start" 
                                control={<Checkbox color="primary" type={field.type} onChange={event=>this.handleChange(index, choiceIndex, field.type, event)} value={choice.label} checked={this.state.formFieldData[0]['entries'][index]['choices'][choiceIndex].selected}/>} />
                            ))}  
                        </FormGroup>     
                    </FormControl>
                    <br/></div>)
                }
                else if(field.type === "radio"){
                    fields.push(<div key={index}>
                    <FormControl component="fieldset" required={field.required}>
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <RadioGroup name={field.label} value={field.label} >
                            {field.choices.map((choice,choiceIndex)=>(
                                <FormControlLabel key={choice + choiceIndex}  label={choice.label} value={choice.label} name={choice.label} labelPlacement="start" 
                                control={<Radio onChange={event=>this.handleChange(index, choiceIndex, field.type, event)} checked={this.state.formFieldData[0]['entries'][index]['choices'][choiceIndex][choice.label]}/>} />
                            ))}  
                        </RadioGroup>     
                    </FormControl>
                    <br/></div>)
                }
                else if(field.type === "dropdown"){
                    fields.push(<div key={index}>
                        <FormControl required={field.required}>
                            <InputLabel>{field.label}</InputLabel>
                            <Select onChange={event=>this.handleChange(index, null, field.type, event)}
                                value={this.findSelected(index)}>
                                {field.choices.map((choice,choiceIndex)=>(
                                    <MenuItem key={choice + choiceIndex} value={choice.label}>{choice.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>)
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