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
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import api from './api';
import { TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import history from './history';
import {
    BrowserRouter as Router,
    Redirect
} from "react-router-dom";


/**
* Component to submit form with entered data
*/
class SubmittedForm extends React.Component{

    constructor(props){
        super();
        this.state = {
            formFieldData:[{
                entries:[
                    
                ]
            }],
            form:'',
            formID:'',
            submitFormIsDisabled:true,
            returnedServerError: false


        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.findSelected = this.findSelected.bind(this);
        this.handleChange = this.handleChange.bind(this);
    
    }

    //Helper function to find selected value for dropdown
    findSelected(index){
        const values = [...this.state.formFieldData];
        let preselectedOption = '';
        values[0]['entries'][index]['choices'].forEach(choice=>{
           Object.keys(choice).forEach(key=>{
               if(choice[key] === true) {
                   preselectedOption = key;
               }
           })
       })
       return preselectedOption;
    }


    componentDidMount(){
        
        //Form JSON to render on frontend
        let formToRender = [...this.props.form];
        let noOfFormFields = this.props.form[0].fields.length;
        //Form JSON to store entered form data
        let formFieldData = [...this.state.formFieldData]
        for(let i=0;i<noOfFormFields;i++){
            let label = formToRender[0]['fields'][i]['label'];
            let type = formToRender[0]['fields'][i]['type'];
            //Populate submission form JSON based on form to render
            switch(type){
                case "text":
                case "textarea":
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
        api.saveData(
        {
            formID:this.state.form[0].formID, 
            form:this.state.formFieldData 
        }
        ,true)
        .then(res=>{
            this.setState({
                formID:res.data.formID
            })

        })
        .catch(error=>{
            console.log(error);
            this.setState({
                returnedServerError: true
            });
        })  
    }

    //Populate form JSON based on type of field interacted with
    handleChange(index, choiceIndex=null, type, event){
        const values = [...this.state.formFieldData];
        this.setState({
            submitFormIsDisabled:false
        });
        switch(type){
            case "text":
                case "textarea":
                values[0]['entries'][index][event.target.name] = event.target.value;
            break;
            case "checkbox":
                values[0]['entries'][index]['choices'][choiceIndex][event.target.value] = event.target.checked;
            break;
            case "radio":
                values[0]['entries'][index]['choices'].forEach((choice, subIndex)=>{
                    
                    //Only allow one option to be selected
                    if(choiceIndex === subIndex){
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
                        if(key === event.target.value){
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
        //Populate fields array based on dynamic JSON object - object rendered in render() method
        if(this.state.form.length > 0){
            this.state.form[0].fields.map((field, index)=>{
                if(field.type === "text"){
                    fields.push(<div key={index} className="width80 margin-top-1"><TextField fullWidth id="outlined-basic" value={this.state.formFieldData[0]['entries'][index][field.label]} onChange={event=>this.handleChange(index, null, field.type, event)} name={field.label} label={field.label} variant="outlined" required={field.required}/><br/></div>)
                }
                if(field.type === "textarea"){
                    fields.push(<div key={index} className="width80 margin-top-1"><TextField fullWidth multiline helperText="You can enter multiple lines here" id="outlined-basic" value={this.state.formFieldData[0]['entries'][index][field.label]} onChange={event=>this.handleChange(index, null, field.type, event)} name={field.label} label={field.label} variant="outlined" required={field.required}/><br/></div>)
                }
                else if(field.type === "checkbox"){
                    fields.push(<div className="margin-top-2" key={index}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <FormGroup>
                            {field.choices.map((choice,choiceIndex)=>(
                                <FormControlLabel key={choice+choiceIndex} label={choice.label} labelPlacement="end" 
                                control={<Checkbox color="primary" type={field.type} onChange={event=>this.handleChange(index, choiceIndex, field.type, event)} value={choice.label} checked={this.state.formFieldData[0]['entries'][index]['choices'][choiceIndex][choice.label]}/>} />
                            ))}  
                        </FormGroup>     
                    </FormControl>
                    <br/></div>)
                }
                else if(field.type === "radio"){
                    fields.push(<div className="margin-top-2" key={index}>
                    <FormControl component="fieldset" required={field.required}>
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <RadioGroup name={field.label} value={field.label} >
                        
                            {field.choices.map((choice,choiceIndex)=>(
                                
                                
                                <FormControlLabel key={choice + choiceIndex}  label={choice.label} value={choice.label} name={choice.label} labelPlacement="end" 
                                control={<Radio name={field.label} required={field.required} onChange={event=>this.handleChange(index, choiceIndex, field.type, event)} checked={this.state.formFieldData[0]['entries'][index]['choices'][choiceIndex][choice.label]}/>
                               
                                } />
                                
                            ))
                            }  
                        </RadioGroup>     
                    </FormControl>
                    <br/></div>)
                    
                }
                else if(field.type === "dropdown"){
                    fields.push(<div className="margin-top-2" key={index}>
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

        //Once form is submitted successfully, automatically redirect to submissions page
        if(this.state.formID){
            let redirectURL = `/s20/view-submissions/${this.state.formID}`;
            history.push(redirectURL);
            return <Redirect to={{ pathname:redirectURL, state:this.state.formID}} />
        }
        return(
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <CardContent>
                        {fields}
                    </CardContent>
                    <CardActions className="padding">
                        <Button type="submit" disabled={this.state.submitFormIsDisabled} size="large" color="primary" variant="contained">Submit Form</Button>  
                    </CardActions>
                </form>
                <Snackbar open={this.state.returnedServerError} autoHideDuration={3000} onClose={() => this.setState({returnedServerError: false})}>
                    <Alert severity="error" variant="filled" onClose={() => this.setState({returnedServerError: false})}>SERVER ERROR</Alert>
                </Snackbar>
            </div>
                

           

        );
    }
}


/**
 * Parent component to view a created form
 */
export default class ViewFormNew extends React.Component{
    constructor(props){
        super(props);
        const { match } = props;
        const { params } = match;
        const { form } = params;
        this.state = {
            formID:form,
            formData:'',
            redirect:'',
            formsStore:[],
            newFormRequested:false,
            viewFormIsDisabled: false,
            returnedServerError: false,
            viewFormIsLoading:false
            
        }
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleViewFormSubmit = this.handleViewFormSubmit.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);


    }
   
    //If input field is pre-filled with form ID, click View Form button programmatically
    componentDidMount(){
        if(this.state.formID){
            document.getElementById('view-form-btn').click();
            this.setState({
                viewFormIsDisabled:true
            });
        }
        else{
            this.setState({
                viewFormIsDisabled:true
            });
        }
    }

    handleTextFieldChange(e){
        this.setState({
            formID:e.target.value,
            viewFormIsDisabled: false
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

    handleOnClick(e){
        e.preventDefault();
        this.setState({
            viewFormIsDisabled:true,
            viewFormIsLoading:true
        });
        api.getForm(this.state.formID)
        .then(form=>{
            this.setState({
                formData:''
            });
            this.setState({
                formData:form[0],
                viewFormIsLoading:false
            });

        })
        .catch(error=>{
            this.setState({
                returnedServerError: true,
                viewFormIsDisabled:false,
                viewFormIsLoading:false
            });
        })
    }
    render(){
       
        return(
            <Card className="center">
                <Typography><p className="underline-primary"></p></Typography>
                <form /*onSubmit={this.handleViewFormSubmit}*/>
                    <CardContent>
                        <div className="flex-rows">
                            <TextField className="flex-1" id="outlined-basic" label="Enter form ID" variant="outlined" value={this.state.formID} onChange={this.handleTextFieldChange}/> 
                            
                            <Button className="flex-1 margin-left-1" disabled={this.state.viewFormIsDisabled} id="view-form-btn" type="submit" size="large" color="primary" variant="contained" onClick={this.handleOnClick}>{this.state.viewFormIsLoading && <CircularProgress color="inherit" size={27}/> }{!this.state.viewFormIsLoading && <span>View Form</span>}</Button>
                            <div className="flex-1"></div>
                        </div>
   
                    </CardContent>
                   
                </form>
                <CardContent>
                    {this.state.formData && <SubmittedForm form={[this.state.formData]}/>}
                </CardContent>

                <Snackbar open={this.state.returnedServerError} autoHideDuration={3000} onClose={() => this.setState({returnedServerError: false})}>
                    <Alert severity="error" variant="filled" onClose={() => this.setState({returnedServerError: false})}>SERVER ERROR</Alert>
                </Snackbar>
            </Card>
            
           
        );
    }
}