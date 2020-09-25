import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import api from './api';

class Entries extends React.Component{
    constructor(props){
        super(props);
        this.state={
            form:this.props.form
        }
    }
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
                            {this.state.form[0].form[0]['entries'].map((row, index)=>(
                                
                                Object.keys(row).map((field)=>(
                                    <TableRow key={index}>
                                        <TableCell align="right">{field}</TableCell>
                                        <TableCell align="right">{(row[field]).toString()}</TableCell>
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

export default class FormSubmissions extends React.Component{
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
            <Card className="center">
                <form onSubmit={this.handleSubmissionsFormSubmit}>
                    <CardContent>
                        <TextField id="outlined-basic" label="Enter form ID" variant="outlined" value={this.state.formID} onChange={this.handleFormIDChange}/>
                    </CardContent>
                    <CardActions className="padding">
                        <Button type="submit" size="small" color="primary" variant="contained">View Form Submissions</Button>
                    </CardActions>
                </form>
                {this.state.formData && <Entries form={this.state.formData}/>}
            </Card>
           
        );
    }
}