import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { TextField } from '@material-ui/core';
import stringUtility from './stringUtility';
import api from './api';

class ConfigForm extends React.Component{
    constructor(props){
        super();
        this.state = {
            formFields:[
                
            ],
            formID:'',
            fieldIsVisible:false,
            checkboxChoiceCount:0
        };
        this.handleFormElementClick = this.handleFormElementClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleConfigFormSubmit = this.handleConfigFormSubmit.bind(this);
        this.handleRemoveField = this.handleRemoveField.bind(this);

        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this);


    }
    //Initialises json object based on clicked form element
    handleFormElementClick(fieldType){ 
        const values = [...this.state.formFields]
        switch(fieldType){
            case "text":
                values.push({label:'', required:false, type:fieldType});
            break;
            case "checkbox":
                values.push({label:'', type:fieldType, choices:[{label:'', selected:false}]});
                break;
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
            fieldIsVisible: true
        });
    }

    //Addition of more checkboxes inside a group
    handleAddChoice(index, choiceIndex){
        const values = [...this.state.formFields]
        values[index]['choices'].push({label:'', selected:false});
        this.setState({
            formFields: values,
        });
    }
    //Deletion of checkboxes inside a group
    handleRemoveChoice(index, choiceIndex){
        const values = [...this.state.formFields];
        console.log(index, choiceIndex)
        values[index]['choices'].splice(choiceIndex, 1);
        this.setState({
            formFields: values,
           
        });
    }

    //Remove an entire field
    handleRemoveField(index, event){
        const values = [...this.state.formFields];
        values.splice(index, 1);
        this.setState({
            formFields: values,
        });
    }

    //Handle change in a textfield
    handleChange(index, choiceIndex = null, event) {
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
            //Disallow multiple options from being selected for dropdown and radio
            else{
                values[index]['choices'].forEach((choice,subIndex)=>{
                    if(choiceIndex != subIndex){
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

    //Handle form submit once form config is ready
    handleConfigFormSubmit(e){
        e.preventDefault();
        api.saveData(this.state.formFields)
        .then(res=>{
            console.log(res);
            this.setState({
                formID: res
            });
            
        })  
        .catch(error=>{
            console.log(error);
            alert(error);
        })

     
    }

    render(){
        // if(this.state.formID){
        //     let redirectURL = `/s20/view-form/${this.state.formID}`;
        //     history.push(redirectURL);
        //     return <Redirect to={{ pathname:redirectURL, state:this.state.formID}} />
        // }
        return(
            <div>
                <form onSubmit={this.handleConfigFormSubmit}>
                    <CardContent>
                        <Card>
                            <CardContent >
                                <div className="flex-rows">
                                    Add Field:
                                    <a href="#" id="singleLineText" onClick={event=>this.handleFormElementClick("text")}>Single Line Text</a>
                                    <a href="#" id="checkboxField" onClick={event=>this.handleFormElementClick("checkbox")}>Checkbox</a>
                                    <a href="#" id="radioField" onClick={event=>this.handleFormElementClick("radio")}>Radio</a>
                                    <a href="#" id="dropdownField" onClick={event=>this.handleFormElementClick("dropdown")}>Dropdown</a>
                                </div>
                            </CardContent>
                        </Card>
                       
                        {this.state.formFields.map((field, index)=>(
                            <Card key={`${field.type}-${index}`}>
                                <CardContent>
                                { field.type === "text" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                        Required?<Checkbox checked={field.required} name="label-required" onChange={event=>this.handleChange(index, null, event)} color="primary" />
                                        Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                    </div> 
                                }

                                { field.type === "checkbox" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                        Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                        <Card>
                                            {field['choices'].length > 0 && 
                                                field['choices'].map((choice, choiceIndex)=>(
                                                    <CardContent key={`${field.type}-${index}-choice-${choiceIndex}`}>
                                                        <TextField variant="outlined" type="text" name="choice" value={choice.label} label="Enter Choice" onChange={event=>this.handleChange(index, choiceIndex, event)}/>
                                                        Selected?<Checkbox checked={choice.selected} name="choice-selected-checkbox" onChange={event=>this.handleChange(index, choiceIndex, event)} color="primary" />
                                                        Add Choice<AddIcon  style={{ cursor: "pointer" }} onClick={event=>this.handleAddChoice(index, choiceIndex, event)}/>
                                                        Remove Choice<CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveChoice(index, choiceIndex, event)}/>
                                                    </CardContent>
                                                ))
                                            }

                                           
                                        </Card>
                                       
                                    </div>
                                }
                                { field.type === "radio" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                        Required<Checkbox checkbox={field.required} name="label-required" onChange={event=>this.handleChange(index, null, event)} color="primary" />
                                        Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                        <Card>
                                            {field['choices'].length > 0 && 
                                                field['choices'].map((choice, choiceIndex)=>(
                                                    <CardContent key={`${field.type}-${index}-choice-${choiceIndex}`}>
                                                        <TextField variant="outlined" type="text" name="choice" value={choice.label} label="Enter Choice" onChange={event=>this.handleChange(index, choiceIndex, event)}/>
                                                        Selected?<Checkbox checked={choice.selected} name="choice-selected-radio" onChange={event=>this.handleChange(index, choiceIndex, event)} color="primary" />
                                                        Add Choice<AddIcon  style={{ cursor: "pointer" }} onClick={event=>this.handleAddChoice(index, choiceIndex, event)}/>
                                                        Remove Choice<CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveChoice(index, choiceIndex, event)}/>
                                                    </CardContent>
                                                ))
                                            }
                                        </Card>
                                    </div>
                                }
                                { field.type === "dropdown" &&
                                        <div>
                                            <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                            <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleChange(index, null, event)}/>
                                            Required<Checkbox checkbox={field.required} name="label-required" onChange={event=>this.handleChange(index, null, event)} color="primary" />
                                            Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                            <Card>
                                                {field['choices'].length > 0 && 
                                                    field['choices'].map((choice, choiceIndex)=>(
                                                        <CardContent key={`${field.type}-${index}-choice-${choiceIndex}`}>
                                                            <TextField variant="outlined" type="text" name="choice" value={choice.label} label="Enter Choice" onChange={event=>this.handleChange(index, choiceIndex, event)}/>
                                                            Selected?<Checkbox checked={choice.selected} name="choice-selected-dropdown" onChange={event=>this.handleChange(index, choiceIndex, event)} color="primary" />
                                                            Add Choice<AddIcon  style={{ cursor: "pointer" }} onClick={event=>this.handleAddChoice(index, choiceIndex, event)}/>
                                                            Remove Choice<CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveChoice(index, choiceIndex, event)}/>
                                                        </CardContent>
                                                    ))
                                                }
                                            </Card>
                                        </div>
                                    }
                                   
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                    
                    
                    <CardActions className="padding">
                        <Button type="submit" size="small" color="primary" variant="contained">Save Form</Button>
                    </CardActions>
                    {this.state.formID &&
                        <CardContent>
                            <p>Shareable Form URL</p>
                            <p><a href={(window.location.href+"/"+this.state.formID).replace('build-form','view-form').replace("#",'')}>{(window.location.href+"/"+this.state.formID).replace('build-form','view-form').replace("#",'')}</a></p>
                        </CardContent>
                    }
                    
                </form>
                
            </div>
        )
    }
}


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