import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import { TextField } from '@material-ui/core';
import stringUtility from './stringUtility';
import api from './api';

class ConfigForm extends React.Component{
    constructor(props){
        super();
        this.state = {
            formFields:[
                {label:'', required:false, type:"text"}
            ],
            formID:'',
            fieldIsVisible:false
        };
        this.handleFormElementClick = this.handleFormElementClick.bind(this);
        this.handleTextboxChange = this.handleTextboxChange.bind(this);
        this.handleConfigFormSubmit = this.handleConfigFormSubmit.bind(this);
        this.handleRemoveField = this.handleRemoveField.bind(this);
    }
    //Calls selected form component
    handleFormElementClick(fieldType){ 
        const values = [...this.state.formFields]
        values.push({label:'', required:false, type:fieldType});
        this.setState({
            formFields: values,
            fieldIsVisible: true
        });
    }
    handleRemoveField(index, event){
        const values = [...this.state.formFields];
        values.splice(index, 1);
        this.setState({
            formFields: values,
        });
    }
    handleTextboxChange(index, event) {
        const values = [...this.state.formFields];
        if(event.target.name === "label"){
            values[index].label = event.target.value;
        }else{
            values[index].checked = event.target.checked;
        }
        this.setState({ formFields:values });
    }

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
    // createFormElement(){
    //     return this.state.formValues.map((el, i)=>
    //     <Card key={`form-field-${i}`}>
    //         <CardContent>
    //             <div>
    //                 <p>{el}</p>
    //                 <p className="emphasized">Text</p>
    //                 <TextField variant="outlined" type="text" value={el||''} label="Enter Label" onChange={this.handleTextboxChange.bind(this,i)}/>
    //                 Required?<Checkbox onChange={this.handleCheckboxChange.bind(this,i)} color="primary" />
    //                 Remove <CloseIcon id={this.props.closeIconID} style={{ cursor: "pointer" }} onClick={this.handleClose}/>
    //             </div>
    //         </CardContent>
    //     </Card>
    //     )
    // }
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
                                </div>
                            </CardContent>
                        </Card>
                       
                        {this.state.formFields.map((field, index)=>(
                            <Card key={`${field}-${index}`}>
                                <CardContent>
                                { field.type === "text" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleTextboxChange(index, event)}/>
                                        Required?<Checkbox value={field.required} name="label-required" onChange={event=>this.handleTextboxChange(index,event)} color="primary" />
                                        Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                    </div> 
                                }

                                { field.type === "checkbox" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleTextboxChange(index, event)}/>
                                        Selected?<Checkbox value={field.required} name="label-required" onChange={event=>this.handleTextboxChange(index,event)} color="primary" />
                                        Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                    </div>
                                }
                                { field.type === "radio" &&
                                    <div>
                                        <p className="emphasized">{stringUtility.capitalize(field.type)}</p>
                                        <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleTextboxChange(index, event)}/>
                                        Selected?<Checkbox value={field.required} name="label-required" onChange={event=>this.handleTextboxChange(index,event)} color="primary" />
                                        Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
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