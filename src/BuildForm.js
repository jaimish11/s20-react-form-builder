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
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import ArrowDropDownSharpIcon from '@material-ui/icons/ArrowDropDownSharp';
import ArrowDropUpSharpIcon from '@material-ui/icons/ArrowDropUpSharp';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { TextField } from '@material-ui/core';
import stringUtility from './stringUtility';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import history from './history';
import {
    BrowserRouter as Router,
    Redirect
} from "react-router-dom";
import api from './api';
var uniqueString = require('unique-string');



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
        // for(let i=0;i<noOfFormFields;i++){
        //     let label = formToRender[0]['fields'][i]['label'];
        //     let type = formToRender[0]['fields'][i]['type'];
        //     //Populate submission form JSON based on form to render
        //     switch(type){
                
        //         case "text":
        //         case "textarea":
                    
        //             formFieldData[0]['entries'].push({
        //                 [label]: ''
        //             });
        //         break;
        //         case "checkbox":
        //             formFieldData[0]['entries'].push({
        //                 label:label,
        //                 choices:[]
        //             });
        //             formToRender[0]['fields'][i]['choices'].forEach(choice=>{
        //                 formFieldData[0]['entries'][i]['choices'].push({
        //                     [choice.label]: choice.selected
        //                 });
        //             });
        //         break;
        //         case "radio":
        //         case "dropdown":
        //             formFieldData[0]['entries'].push({
        //                 label:label,
        //                 required: formToRender[0]['fields'][i]['required'],
        //                 choices:[]
        //             });
        //             formToRender[0]['fields'][i]['choices'].forEach(choice=>{
        //                 formFieldData[0]['entries'][i]['choices'].push({
        //                     [choice.label]: choice.selected
        //                 });
        //             });
        //         break;
        //         default:
        //     }
           
        // }
        // this.setState({
        //     form:this.props.form,
        //     formFieldData:formFieldData
        // });
        
        
    }
    
    handleFormSubmit(e){
        e.preventDefault();
        var formID = uniqueString();
        console.log(formID);
        api.saveData(
        {
            formID:formID, 
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
        const form = [...this.state.formFieldData];
        const values = [...this.props.form];
        form[0]['entries'] = [...values[0]['fields']];
        this.setState({
            submitFormIsDisabled:false
        });
        switch(type){
            case "text":
            case "textarea":
                form[0]['entries'][index][event.target.name] = event.target.value;
            break;
            case "checkbox":
                form[0]['entries'][index]['choices'][choiceIndex][event.target.value] = event.target.checked;
            break;
            // case "radio":
            //     form[0]['entries'][index]['choices'].forEach((choice, subIndex)=>{
                    
            //         //Only allow one option to be selected
            //         if(choiceIndex === subIndex){
            //             form[0]['entries'][index]['choices'][choiceIndex][event.target.value] = event.target.checked;
            //         }
            //         else{
            //             Object.keys(form[0]['entries'][index]['choices'][subIndex]).forEach(key=>{
            //                 form[0]['entries'][index]['choices'][subIndex][key] = !event.target.checked;
            //             })
                        
            //         }
            //     })   
            
            // break;
            // case "dropdown":
            //     form[0]['entries'][index]['choices'].forEach(choice=>{
            //         Object.keys(choice).forEach(key=>{
            //             if(key === event.target.value){
            //                 choice[event.target.value] = true;
            //             }
            //             else{
            //                 choice[key] = false;
            //             }
                        
            //         })
            //     })
            // break;
            // default:

        }
       
        this.setState({ formFieldData:form });
    }
    render(){
        let fields = [];
        //Populate fields array based on dynamic JSON object - object rendered in render() method
        if(this.props.form.length > 0){
            this.props.form[0].fields.map((field, index)=>{
                if(field.type === "text"){
                    fields.push(<div key={index} className="width80 margin-top-1"><TextField fullWidth id="outlined-basic" value={this.props.form[0]['fields'][index][field.label]} onChange={event=>this.handleChange(index, null, field.type, event)} name={field.label} label={field.label} variant="outlined" required={field.required}/><br/></div>)
                }
                else if(field.type === "textarea"){
                    fields.push(<div key={index} className="width80 margin-top-1"><TextField fullWidth multiline helperText="You can enter multiple lines here" id="outlined-basic" value={this.props.form[0]['fields'][index][field.label]} onChange={event=>this.handleChange(index, null, field.type, event)} name={field.label} label={field.label} variant="outlined" required={field.required}/><br/></div>)
                }
                else if(field.type === "checkbox"){
                    fields.push(<div className="margin-top-2" key={index}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <FormGroup>
                            {field.choices.map((choice,choiceIndex)=>(
                                <FormControlLabel key={choice+choiceIndex} label={choice.label} labelPlacement="end" 
                                control={<Checkbox color="primary" type={field.type} onChange={event=>this.handleChange(index, choiceIndex, field.type, event)} value={choice.label} checked={this.props.form[0]['fields'][index]['choices'][choiceIndex]['selected']}/>} />
                            ))}  
                        </FormGroup>     
                    </FormControl>
                    <br/></div>)
                }
                // else if(field.type === "radio"){
                //     fields.push(<div className="margin-top-2" key={index}>
                //     <FormControl component="fieldset" required={field.required}>
                //         <FormLabel component="legend">{field.label}</FormLabel>
                //         <RadioGroup name={field.label} value={field.label} >
                        
                //             {field.choices.map((choice,choiceIndex)=>(
                                
                                
                //                 <FormControlLabel key={choice + choiceIndex}  label={choice.label} value={choice.label} name={choice.label} labelPlacement="end" 
                //                 control={<Radio name={field.label} required={field.required} onChange={event=>this.handleChange(index, choiceIndex, field.type, event)} checked={this.props.form[0]['fields'][index]['choices'][choiceIndex]['selected']}/>
                               
                //                 } />
                                
                //             ))
                //             }  
                //         </RadioGroup>     
                //     </FormControl>
                //     <br/></div>)
                    
                // }
                // else if(field.type === "dropdown"){
                //     fields.push(<div className="margin-top-2" key={index}>
                //         <FormControl required={field.required}>
                //             <InputLabel>{field.label}</InputLabel>
                //             <Select onChange={event=>this.handleChange(index, null, field.type, event)}
                //                 value={this.findSelected(index)}>
                //                 {field.choices.map((choice,choiceIndex)=>(
                //                     <MenuItem key={choice + choiceIndex} value={choice.label}>{choice.label}</MenuItem>
                //                 ))}
                //             </Select>
                //         </FormControl>
                //     </div>)
                // }
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
                <p className="underline-primary">Your Form</p>
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
 * Actual form building component
 */
class ConfigForm extends React.Component{
    constructor(props){
        super();
        this.state = {
            formFields:[
                
            ],
            previewFormFields:[
                {fields:[]}
            ],
            formID:'',
            addedField:'',
            saveFormIsDisabled: true,
            addFieldIsDisabled:true,
            deleteFormIsDisabled: true,
            returnedServerError: false,
            isFirstElement: true
            
        };
        this.handleFormElementClick = this.handleFormElementClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleConfigFormSubmit = this.handleConfigFormSubmit.bind(this);
        this.handleRemoveField = this.handleRemoveField.bind(this);

        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this);

        this.handleClearFormClick = this.handleClearFormClick.bind(this);

        this.handleMoveDown = this.handleMoveDown.bind(this);
        this.handleMoveUp = this.handleMoveUp.bind(this);

        




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
        const previewFormValues = [...this.state.previewFormFields];
        previewFormValues[0]['fields'] = [...values];
        this.setState({
            formFields: values,
            previewFormFields: previewFormValues
           
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

        const previewFormValues = [...this.state.previewFormFields];
        previewFormValues[0]['fields'] = [...values];

        this.setState({
            formFields: values,
            previewFormFields: previewFormValues
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

        //Update form builder
        const values = [...this.state.formFields];
        values.splice(index, 1);

        //Update preview
        const previewFormValues = [...this.state.previewFormFields];
        previewFormValues[0]['fields'] = [...values];


        this.setState({
            formFields: values,
            previewFormFields: previewFormValues
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
        //Update preview
        const previewFormValues = [...this.state.previewFormFields];
        previewFormValues[0]['fields'] = [...values];
        this.setState({ 
            formFields:values,
            previewFormFields: previewFormValues
        });
    }

    //Handle form deletion
    handleClearFormClick(event){
        this.setState({
            formFields : [],
            deleteFormIsDisabled: true
        });
    }

    handleMoveDown(index, event){
        //Only allow move down if element is not first or last
        if(this.state.formFields.length > 1 && index >= 0 && index<=this.state.formFields.length-2){

            const values = [...this.state.formFields];
            [values[index], values[index+1]] = [values[index+1], values[index]]
            this.setState({
                formFields: values
            })
        }
        else{}
       
    }

    handleMoveUp(index, event){
    
        //Only allow move up if element is not first or last
        if(this.state.formFields.length > 1 && index > 0){

            const values = [...this.state.formFields];
            [values[index], values[index-1]] = [values[index-1], values[index]]
            this.setState({
                formFields: values
            })
        }
        else{}
       
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
        const arrowDisabledStyles = {
            color: "rgba(0, 0, 0, 0.12)",
            pointerEvents: "none"
        }
        const arrowEnabledStyles = {
            pointerEvents: "auto",
            cursor: "pointer"
        }
        return(
            <div className="flex-rows">
                <div className="flex-1">
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
                                                        <ArrowDropUpSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveUp(index,event)} style={index === 0 && (this.state.isFirstElement || this.state.isLastElement)?arrowDisabledStyles:arrowEnabledStyles} />
                                                        <ArrowDropDownSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveDown(index,event)}  style={index === this.state.formFields.length - 1 && (this.state.isLastElement || this.state.isFirstElement)?arrowDisabledStyles:arrowEnabledStyles} />
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
                                                        <ArrowDropUpSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveUp(index,event)} style={index === 0 && (this.state.isFirstElement || this.state.isLastElement)?arrowDisabledStyles:arrowEnabledStyles} />
                                                        <ArrowDropDownSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveDown(index,event)}  style={index === this.state.formFields.length - 1 && (this.state.isLastElement || this.state.isFirstElement)?arrowDisabledStyles:arrowEnabledStyles} />
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
                                                    <ArrowDropUpSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveUp(index,event)} style={index === 0 && (this.state.isFirstElement || this.state.isLastElement)?arrowDisabledStyles:arrowEnabledStyles} />
                                                    <ArrowDropDownSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveDown(index,event)}  style={index === this.state.formFields.length - 1 && (this.state.isLastElement || this.state.isFirstElement)?arrowDisabledStyles:arrowEnabledStyles} />
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
                                                    <ArrowDropUpSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveUp(index,event)} style={index === 0 && (this.state.isFirstElement || this.state.isLastElement)?arrowDisabledStyles:arrowEnabledStyles} />
                                                    <ArrowDropDownSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveDown(index,event)}  style={index === this.state.formFields.length - 1 && (this.state.isLastElement || this.state.isFirstElement)?arrowDisabledStyles:arrowEnabledStyles} />
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
                                                        <ArrowDropUpSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveUp(index,event)} style={index === 0 && (this.state.isFirstElement || this.state.isLastElement)?arrowDisabledStyles:arrowEnabledStyles} />
                                                        <ArrowDropDownSharpIcon fontSize="large" style={{ cursor: "pointer" }} onClick={event=>this.handleMoveDown(index,event)}  style={index === this.state.formFields.length - 1 && (this.state.isLastElement || this.state.isFirstElement)?arrowDisabledStyles:arrowEnabledStyles} />
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
                <Card className="flex-1">
                    <p className="underline-primary">Live Preview</p>
                    {this.state.previewFormFields[0]['fields'].length>0 && <SubmittedForm form={this.state.previewFormFields}/>}
                </Card>
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
                <Card className="fullwidth">
                
                    <ConfigForm />
                </Card>
            </div>
           
        )
    }
}