import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { TextField } from '@material-ui/core';
import stringUtility from './stringUtility';
import api from './api';


/**
 * Actual form building component
 */
class ConfigForm extends React.Component{
    constructor(props){
        super();
        this.state = {
            formFields:[
                
            ],
            formID:'',
            addedField:'',
            saveFormIsDisabled: true,
            addFieldIsDisabled:true,
            deleteFormIsDisabled: true,
            returnedServerError: false
            
        };
        this.handleFormElementClick = this.handleFormElementClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleConfigFormSubmit = this.handleConfigFormSubmit.bind(this);
        this.handleRemoveField = this.handleRemoveField.bind(this);

        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this);

        this.handleClearFormClick = this.handleClearFormClick.bind(this);




    }
    //Initialises json object based on type of form field selected
    handleFormElementClick(fieldType){ 
        this.setState({
            deleteFormIsDisabled:false
        });
        const values = [...this.state.formFields]
        switch(fieldType.toLowerCase()){
            case "text":
            case "textarea":
                values.push({label:'', required:false, type:fieldType});
                break;
            case "checkbox":
                values.push({label:'', type:fieldType, choices:[{label:'', selected:false}]});
                break;
            case "radio":
                values.push({label:'', required:false, type:fieldType, choices:[{label:'', selected:false}]});
                break;
            case "dropdown":
                values.push({label:'', required:false, type:fieldType, choices:[{label:'', selected:false}]});
                break;
            default:
        }
        
        this.setState({
            formFields: values,
           
        });
    }

    //Handles form field selector 
    handleSelectChange(event){
        this.setState({
            addedField:event.target.value,
            addFieldIsDisabled:false
        })
    }

    //Addition of options within a radio/checkbox/dropdown group
    handleAddChoice(index, choiceIndex){
        const values = [...this.state.formFields]
        values[index]['choices'].push({label:'', selected:false});
        this.setState({
            formFields: values,
        });
    }

    //Deletion of options within a radio/checkbox/dropdown group
    handleRemoveChoice(index, choiceIndex){
        const values = [...this.state.formFields];
        values[index]['choices'].splice(choiceIndex, 1);
        this.setState({
            formFields: values,
           
        });
    }

    //Remove an entire field (e.g text field, checkbox, radio, dropdown)
    handleRemoveField(index, event){
        const values = [...this.state.formFields];
        values.splice(index, 1);
        this.setState({
            formFields: values,
        });
        
    }

    //Populate form JSON object based on type of element interacted with
    handleChange(index, choiceIndex = null, event) {
        this.setState({
            saveFormIsDisabled:false
        });
        const values = [...this.state.formFields];
        //Normal label for all field types
        if(event.target.name === "label"){
            values[index].label = event.target.value;

        //Field required or not?
        }else if(event.target.name === "label-required"){
            values[index].required = event.target.checked;
        }

        //Label for checkbox/radio/dropdown choices
        else if(event.target.name === "choice"){
            values[index]['choices'][choiceIndex].label = event.target.value
        }

        //Choices for radio/checkbox/dropdown selected or not?
        else if(event.target.name.includes("choice-selected")){
            if(event.target.name === "choice-selected-checkbox"){
                values[index]['choices'][choiceIndex].selected = event.target.checked;
            }
            //Disallow multiple option selection for dropdown and radios
            else{
                values[index]['choices'].forEach((choice,subIndex)=>{
    
                    if(choiceIndex !== subIndex){
                       
                        values[index]['choices'][subIndex].selected = !event.target.checked
                    }
                    else{
                        values[index]['choices'][subIndex].selected = event.target.checked
                    }
                })
            }
            
        }
   
        this.setState({ formFields:values });
    }

    //Handle form deletion
    handleClearFormClick(event){
        this.setState({
            formFields : [],
            deleteFormIsDisabled: true
        });
    }

    //Handle form submit once config form is ready
    handleConfigFormSubmit(e){
        e.preventDefault();
        this.setState({
            saveFormIsDisabled:true
        })
        api.saveData(this.state.formFields)
        .then(res=>{
            this.setState({
                formID: res
            });
            
        })  
        .catch(error=>{
            console.log(error);

            this.setState({
                saveFormIsDisabled:false,
                returnedServerError: true
            });
        })

     
    }

    render(){
        return(
            <div>
                <CardContent>
                <p className="underline-primary">Build Form</p>
                    <div className="flex-cols">
                        <div className="flex-rows margin-top-1">

                                <FormControl className="flex-1">
                                    <InputLabel>Add Field</InputLabel>
                                    <Select onChange={this.handleSelectChange} value={this.state.addedField}>
                                    <MenuItem value="text">Single Line Text</MenuItem>
                                    <MenuItem value="textarea">Multi Line Text</MenuItem>
                                    <MenuItem value="checkbox">Checkbox</MenuItem>
                                    <MenuItem value="radio">Radio</MenuItem>
                                    <MenuItem value="dropdown">Dropdown</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button className="flex-1 margin-left-1" disabled={this.state.addFieldIsDisabled} type="submit" size="small" color="primary" variant="contained" onClick={event=>this.handleFormElementClick(this.state.addedField)}>Add Field</Button>
                                <div className="flex-2"></div>
                        </div>
                                    
                    </div>
                </CardContent>
              
                <form onSubmit={this.handleConfigFormSubmit}>

                    <CardContent>
                               
                       
                        {this.state.formFields.map((field, index)=>(
                            
                            <div key={`${field.type}-${index}`}>
                               
                                { field.type === "text" &&
                                    
                                        <div>
                                            <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                            <div className="space-between">
                                                <div className="flex-cols width80">
                                                    <TextField fullWidth  variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                                    <div className="options flex-rows" >
                                                        <FormControlLabel
                                                            label="Required?" labelPlacement="start" className="no-margin-left"
                                                            control={<Checkbox checked={field.required} name="label-required" onChange={event=>this.handleChange(index, null, event)} color="primary" />}>
                                                        </FormControlLabel>
                                                            
                                                    </div>
                                                </div>
                                                <div className="field-control flex-rows valign-start">
                                                <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                                </div>
                                            </div>
                                            
                                        
                                        </div> 
                                   
                                }

                                { field.type === "textarea" &&
                                    
                                        <div>
                                            <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                            <div className="space-between">
                                                <div className="flex-cols width80">
                                                    <TextField fullWidth variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                                    <div className="options flex-rows" >
                                                        <FormControlLabel
                                                            label="Required?" labelPlacement="start" className="no-margin-left"
                                                            control={<Checkbox checked={field.required} name="label-required" onChange={event=>this.handleChange(index, null, event)} color="primary" />}>
                                                        </FormControlLabel>
                                                            
                                                    </div>
                                                </div>
                                                <div className="field-control flex-rows valign-start">
                                                <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                                </div>
                                            </div>
                                            
                                        
                                        </div> 
                                   
                                }

                                { field.type === "checkbox" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <div className="space-between margin-bottom-1">
                                            <div className="flex-cols width80">
                                                <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                            </div>
                                            <div className="field-control flex-rows valign-start">
                                                <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                            </div>
                                            
                                        </div>
                                        <div>
                                            {field['choices'].length > 0 && 
                                                    field['choices'].map((choice, choiceIndex)=>(
                                                        
                                                            <div className="left-indent20" key={`${field.type}-${index}-choice-${choiceIndex}`}>
                                                                <div className="justify-start">
                                                                    <div className="flex-cols width60">

                                                                    <TextField variant="outlined" type="text" name="choice" value={choice.label} label="Enter Choice" onChange={event=>this.handleChange(index, choiceIndex, event)}/>
                                                                    <div className="options flex-rows" >
                                                                        <FormControlLabel
                                                                            label="Selected?" labelPlacement="start" className="no-margin-left"
                                                                            control={<Checkbox checked={choice.selected} name="choice-selected-checkbox" onChange={event=>this.handleChange(index, choiceIndex, event)} color="primary" />}>
                                                                    
                                                                        </FormControlLabel>

                                                                    </div>
                                                                </div>
                                                                    <div className="field-control flex-rows margin-left-1" >
                                                                            <AddCircleSharpIcon color="primary" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleAddChoice(index, choiceIndex, event)}/>
                                                                            <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveChoice(index, choiceIndex, event)}/>
                                                                    </div>
                                                                
                                                                </div>   
                                                            </div>
                                                      
                                                        
                                                    ))
                                            }
                                        </div>      
                                       
                                    </div>
                                }
                                { field.type === "radio" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <div className="space-between margin-bottom-1">
                                            <div className="flex-cols width80">
                                                <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                                <div className="options flex-rows" >
                                                    <FormControlLabel
                                                        label="Required?" labelPlacement="start" className="no-margin-left"
                                                        control={<Checkbox checked={field.required} name="label-required" onChange={event=>this.handleChange(index, null, event)} color="primary" />}>
                                                    </FormControlLabel> 
                                                </div>
                                            </div>
                                            <div className="field-control flex-rows valign-start">
                                                <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                            </div>

                                        </div>
                                        <div>
                                            {field['choices'].length > 0 && 
                                                    field['choices'].map((choice, choiceIndex)=>(
                                                        <div className="left-indent20" key={`${field.type}-${index}-choice-${choiceIndex}`}>
                                                        <div className="justify-start">
                                                            <div className="flex-cols width60">
                                                                <TextField variant="outlined" type="text" name="choice" value={choice.label} label="Enter Choice" onChange={event=>this.handleChange(index, choiceIndex, event)}/>
                                                                <div className="options flex-rows">
                                                                    <FormControlLabel
                                                                        label="Selected?" labelPlacement="start" className="no-margin-left"
                                                                        control={<Checkbox checked={choice.selected} name="choice-selected-radio" onChange={event=>this.handleChange(index, choiceIndex, event)} color="primary" />}>

                                                                    </FormControlLabel>
                                                                </div>
                                                            </div>
                                                            <div className="field-control flex-rows margin-left-1">
                                                               <AddCircleSharpIcon color="primary" fontSize="large"  style={{ cursor: "pointer" }} onClick={event=>this.handleAddChoice(index, choiceIndex, event)}/>
                                                               <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveChoice(index, choiceIndex, event)}/>
                                                            </div>
                                                        </div>
                             
                                                        </div>
                                                    ))
                                                }
                                        </div>   
                                    </div>
                                }
                                { field.type === "dropdown" &&
                                        <div>
                                            <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                            <div className="space-between margin-bottom-1">
                                                <div className="flex-cols width80">
                                                    <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                                    <div className="options flex-rows">
                                                        <FormControlLabel
                                                            label="Required?" labelPlacement="start" className="no-margin-left"
                                                            control={
                                                                <Checkbox checkbox={field.required} name="label-required" onChange={event=>this.handleChange(index, null, event)} color="primary" />
                                                            }>
                                                        </FormControlLabel>
                                                    </div>
                                                </div>
                                                <div className="field-control flex-rows valign-start">
                                                    <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                                </div>
                                            </div>
                                            <div>
                                                {field['choices'].length > 0 && 
                                                        field['choices'].map((choice, choiceIndex)=>(
                                                            <div className="left-indent20" key={`${field.type}-${index}-choice-${choiceIndex}`}>
                                                                <div className="justify-start">
                                                                    <div className="flex-cols width60">
                                                                    <TextField variant="outlined" type="text" name="choice" value={choice.label} label="Enter Choice" onChange={event=>this.handleChange(index, choiceIndex, event)}/>
                                                                        <div className="options flex-rows">
                                                                            <FormControlLabel
                                                                                label="Selected?" labelPlacement="start" className="no-margin-left"
                                                                                control={<Checkbox checked={choice.selected} name="choice-selected-dropdown" onChange={event=>this.handleChange(index, choiceIndex, event)} color="primary" />} >

                                                                            </FormControlLabel>
                                                                                
                                                                        </div>
                                                                    </div>
                                                                    <div className="field-control flex-rows valign-start margin-left-1">
                                                                        <AddCircleSharpIcon color="primary" fontSize="large"   style={{ cursor: "pointer" }} onClick={event=>this.handleAddChoice(index, choiceIndex, event)}/>
                                                                        <CancelSharpIcon color="action" fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveChoice(index, choiceIndex, event)}/>
                                                                    </div>
                                                                </div>  
                                                            </div>
                                                        ))
                                                }
                                            </div>
                                                
                                           
                                        </div>
                                    }
                                   
                                
                            </div>
                        ))}
                    </CardContent>
                    
                    

                    <Grid container justify="center">
                        <CardActions>
                            <Button disabled={this.state.saveFormIsDisabled} type="submit" size="large" color="primary" variant="contained">Save Form</Button>
                            <Button disabled={this.state.deleteFormIsDisabled} type="button" size="large" color="secondary" variant="contained" onClick={this.handleClearFormClick}>Delete Form</Button>
                        </CardActions>     
                    </Grid>
                        
                    
                    {this.state.formID &&
                        <CardContent>
                            <p>Shareable Form URL</p>
                            <p><a href={(window.location.href+"/"+this.state.formID).replace('build-form','view-form').replace("#",'')}>{(window.location.href+"/"+this.state.formID).replace('build-form','view-form').replace("#",'')}</a></p>
                        </CardContent>
                    }

                    <Snackbar open={this.state.returnedServerError} autoHideDuration={3000} onClose={() => this.setState({returnedServerError: false})}>
                        <Alert severity="error" variant="filled" onClose={() => this.setState({returnedServerError: false})}>SERVER ERROR</Alert>
                    </Snackbar>
                    
                </form>
                
            </div>
        )
    }
}

/**
 * Parent component for form building
 */
export default class BuildForm extends React.Component{
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
                
                    <ConfigForm />
                </Card>
            </div>
           
        )
    }
}