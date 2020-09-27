import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import api from './api';

/**
 * Rendering accordions for each form submission
 */
class EntriesAccordion extends React.Component{

    constructor(props){
        super(props);
       
    }
    render(){
        let accordionGroup = [];
        this.props.forms.forEach((form, index)=>(
            accordionGroup.push(
                <Accordion key={index}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    >
                    <Typography>{`Form#${index} - ${form.timestamp.replace('T',' --- ').replace('Z','')}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {form.form[0]['entries'].map(entry=>{
                        return(Object.keys(entry).map(key=>{
                            return(
                               
                                    /* Traverse nested JSON object and display submitted values for each form */
                                    <div className="margin-top-half">
                                        {/* <p>{key}</p> */}
                                        {key !== "choices" && key !== "label" && key !== "required" &&
                                            `${key}:${entry[key]}`
                                        }
                                        {
                                            key === "label"  &&
                                            <span className="underline">{`${entry[key]}`}</span>
                                        }
    
                                        {key === "choices" &&
                                            entry[key].map(choice=>{
                                                return(
                                                   Object.keys(choice).map(option=>{
                                                       return(
                                                           <div key={option} className="left-indent20">
                                                            {choice[option] === true && `${option}`}
                                                           </div>  
                                                        );
                                                   }) 
                                                );
                                            })
                                        }
                                    </div>
                              
                            );
                                
                        }));
                    })}
                </AccordionDetails>
                </Accordion>     
            )
          
        ));

       return(
           <div key={accordionGroup}>
            {accordionGroup.map(accordion=>accordion)}
           </div>
        );
    }
}

/**
 * Componennt that renders an Accordion for form submissions
 */
class Entries extends React.Component{
    constructor(props){
        super(props);
        this.state={
            forms:this.props.form
        }
    }
    render(){
        return(
            <div className="padding">
                <p className="underline-primary">Form Submissions</p>
                <EntriesAccordion forms={this.props.form}/> 
            </div>
           
        );
    }
}


/**
 * Parent component to accept form ID to view its submissions
 */
export default class FormSubmissions extends React.Component{
    constructor(props){
        super(props);
        const { match } = props;
        const { params } = match;
        const { form } = params;
        this.state = {
            formID:form,
            formData:'',
            redirect:'',
            viewFormSubmissionsIsDisabled: false
        }
        this.handleSubmissionsFormSubmit = this.handleSubmissionsFormSubmit.bind(this);
        this.handleFormIDChange = this.handleFormIDChange.bind(this);

    }

    //If textfield is pre-filled with form ID (from redirect or direct URL), programmatically click button
    componentDidMount(){
        if(this.state.formID){
            document.getElementById('view-submissions-btn').click();
            this.setState({
                viewFormSubmissionsIsDisabled:true
            });
        }
        else{
            this.setState({
                viewFormSubmissionsIsDisabled:true
            });
        }
    }

    //Setting form ID and enabling submit button
    handleFormIDChange(e){
        this.setState({
            formID:e.target.value,
            viewFormSubmissionsIsDisabled:false
        });
    }


    handleSubmissionsFormSubmit(e){
        e.preventDefault();
        this.setState({
            viewFormSubmissionsIsDisabled:true
        });
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
            <Card className="center">
                <p className="underline-primary">Form Submissions</p>
                <form onSubmit={this.handleSubmissionsFormSubmit}>
                    <CardContent>
                    <div className="flex-rows">
                        <TextField className="flex-1" id="outlined-basic" label="Enter form ID" variant="outlined" value={this.state.formID} onChange={this.handleFormIDChange}/>
                        <Button className="flex-1 margin-left-1" disabled={this.state.viewFormSubmissionsIsDisabled} id="view-submissions-btn" type="submit" size="large" color="primary" variant="contained">View Form Submissions</Button>
                        <div className="flex-1"></div>
                    </div>
                        
                    </CardContent>
                </form>
                {this.state.formData && <Entries form={this.state.formData}/>}
            </Card>
           
        );
    }
}