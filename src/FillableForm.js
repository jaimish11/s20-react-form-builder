import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import api from './api';
import { TextField } from '@material-ui/core';


export default class FillableForm extends React.Component{

    constructor(props){
        super();
        const { match } = props;
        const { params } = match;
        const { form } = params;
        this.state = {
            newTextFieldValue:'',
            formFieldData:[{
                entries:[
                        
                ]
            }],
            form: form,
            formIsSubmitted: false
    
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }
    // componentDidMount(){
    //     let formToRender = [...this.props.form];
    //     let noOfFormFields = this.props.form[0].fields.length;
    //     let formFieldData = [...this.state.formFieldData]
    //     console.log(formToRender);
    //     for(let i=0;i<noOfFormFields;i++){
    //         let label = formToRender[0]['fields'][i]['label'];
    //         formFieldData[0]['entries'].push({
    //             [label]: ''
    //         });
    //     }
    //     this.setState({
    //         form:this.props.form,
    //         formFieldData:formFieldData
    //     });
            
    // }
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
        // this.setState({
        //     newTextFieldValue:e.target.value
        // })
        const values = [...this.state.formFieldData];
        console.log(values[0]['entries'][index][event.target.name]);
        values[0]['entries'][index][event.target.name] = event.target.value;
        this.setState({ formFieldData:values });
    }
    render(){
        // let fields = [];
        // if(this.state.form.length > 0){
        //     this.state.form[0].fields.map((field, index)=>{
        //         if(field.type === "text"){
        //             fields.push(<div key={index}><TextField  id="outlined-basic" value={this.state.formFieldData[0]['entries'][index][field.label]} onChange={event=>this.handleTextFieldChange(index,event)} type={field.type} name={field.label} label={field.label} variant="outlined" required={field.required}/><br/></div>)
        //         }
        //     })
        // }
    
        // return(
        //     <Card>
        //         <form onSubmit={this.handleFormSubmit}>
        //             <CardContent>
        //                 {fields}
        //             </CardContent>
        //             <CardActions className="padding">
        //                 <Button type="submit" size="small" color="primary" variant="contained">Submit Form</Button>  
        //             </CardActions>
        //         </form>
        //         {this.state.formIsSubmitted && 
        //             <p>Form Submitted Successfully</p>
        //         }
    
        //     </Card>
    
        // );
        return <h4>Form</h4>
    }
}