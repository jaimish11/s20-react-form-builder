import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import CloseIcon from '@material-ui/icons/Close';
import { TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import history from './history';
import api from './api';


let formConfig = {};

class TextBox extends React.Component{
    constructor(props) {
        super(props);

        this.handleTextboxChange = this.handleTextboxChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleTextboxChange(e){
        this.props.onTextboxChange(e.target.value);
    }
    handleCheckboxChange(e){
        this.props.onCheckboxChange(e.target.id, e.target.checked);
    }
    handleClose(e){
        this.props.onCloseIconClick();
    }
    render(){
        let label = this.props.label;
        let required = this.props.fieldRequired;
        return(
            <div>
                <p className="emphasized">Text</p>
                <TextField id={this.props.textFieldID} variant="outlined" type="text" value={label} label="Enter Label" onChange={this.handleTextboxChange}/>
                Required?<Checkbox id={this.props.checkboxID} checked={required} onChange={this.handleCheckboxChange} color="primary" />
                Remove <CloseIcon id={this.props.closeIconID} style={{ cursor: "pointer" }} onClick={this.handleClose}/>
            </div>
        );
    }
}

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
    handleFormElementClick(){ 
        const values = [...this.state.formFields]
        values.push({label:'', required:false, type:"text"});
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
            values[index].required = event.target.checked;
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
    displayFormElement(){
        let formElements = [];
        for(let i=0;i<this.state.clickedCount;i++){
            formElements.push(
            <Card key={`form-field-${i}`}>
                <CardContent>
                {/* <TextBox 
                        textFieldID={`text-field-${i}`}
                        checkboxID={`checkbox-${i}`}
                        closeIconID={`close-${i}`}
                        label={this.state.textboxLabel} 
                        fieldRequired={this.state.textboxRequired} 
                        onTextboxChange={this.handleTextboxChange}
                        onCheckboxChange={this.handleCheckboxChange}
                        onCloseIconClick={this.handleCloseIconClick}
                    /> */}
                   
                </CardContent>
            </Card>
               
            )
        }
        return formElements
    }
    createFormElement(){
        return this.state.formValues.map((el, i)=>
        <Card key={`form-field-${i}`}>
            <CardContent>
                <div>
                    <p>{el}</p>
                    <p className="emphasized">Text</p>
                    <TextField variant="outlined" type="text" value={el||''} label="Enter Label" onChange={this.handleTextboxChange.bind(this,i)}/>
                    Required?<Checkbox onChange={this.handleCheckboxChange.bind(this,i)} color="primary" />
                    Remove <CloseIcon id={this.props.closeIconID} style={{ cursor: "pointer" }} onClick={this.handleClose}/>
                </div>
            </CardContent>
        </Card>
        )
    }
    render(){
        // if(this.state.formID){
        //     // let redirectURL = `/s20/view-form/${this.state.formID}`;
        //     // history.push(redirectURL);
        //     // return <Redirect to={{ pathname:redirectURL, state:this.state.formID}} />
        //     savedFormID = this.state.formID
        // }
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
                       
                        {this.state.formFields.map((field, index)=>(
                            <Card key={`${field}-${index}`}>
                                <CardContent>
                                    <div>
                                        <p className="emphasized">Text</p>
                                        <TextField variant="outlined" type="text" name="label" value={field.label} label="Enter Label" onChange={event=>this.handleTextboxChange(index, event)}/>
                                        Required?<Checkbox value={field.required} name="label-required" onChange={event=>this.handleTextboxChange(index,event)} color="primary" />
                                        Remove <CloseIcon style={{ cursor: "pointer" }} onClick={event=>this.handleRemoveField(index,event)}/>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                    
                    
                    <CardActions className="padding">
                        <Button type="submit" size="small" color="primary" variant="contained">Save Form</Button>
                    </CardActions>
                    {this.state.formID &&
                        <CardContent>
                            <p>Form ID:</p>
                            <p>{this.state.formID}</p>
                        </CardContent>
                    }
                    
                </form>
                
            </div>
        )
    }
}



class Entries extends React.Component{
    constructor(props){
        super(props);
        this.state={
            form:this.props.form
        }
    }
    // componentDidMount(){
    //     alert('set state');
    //     this.setState({
    //         form:this.props.form
    //     })
      
    // }
    render(){
        return(
            <div className="padding">
                <p>Form Entries</p>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Label</TableCell>
                                <TableCell align="right">Value</TableCell>  
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.form.map((row, index)=>(
                                
                                Object.keys(row).map((field)=>(
                                    <TableRow key={index}>
                                        <TableCell align="right">{field}</TableCell>
                                        <TableCell align="right">{row[field]}</TableCell>
                                    </TableRow>
                                ))
                            
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
           
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
        api.getForm(this.state.formID, true)
        .then(form=>{
            this.setState({
                formData:form
            });


        })
        .catch(error=>{
            alert(error);
        })
    }
    render(){
        return(
            <>
            <form onSubmit={this.handleSubmissionsFormSubmit}>
                <CardContent>
                    <TextField id="outlined-basic" label="Enter form ID" variant="outlined" value={this.state.formID} onChange={this.handleFormIDChange}/>
                </CardContent>
                <CardActions className="padding">
                    <Button type="submit" size="small" color="primary" variant="contained">View Form Submissions</Button>
                </CardActions>
            </form>
            {this.state.formData && <Entries form={this.state.formData}/>}
            </>
           
        );
    }
}


/**
 * Main card used to render the form builder and view form submissions
 */
export default class MainCard extends React.Component{
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
                    <ViewSubmissions/>
                    <ConfigForm />
                </Card>
            </div>
           
        )
    }
}



