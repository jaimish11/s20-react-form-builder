import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './styles.css'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

function saveData(payload){
    axios.post('http://localhost:5000/testAPI/save',payload)
    .then(res=>{
        alert(res.data);
    })
    .catch(error=>{
        alert(error);
    })
}

class TextBox extends React.Component{
    constructor(props) {
        super(props);
        this.handleTextboxChange = this.handleTextboxChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }
    handleTextboxChange(e){
        this.props.onTextboxChange(e.target.value);
    }
    handleCheckboxChange(e){
        this.props.onCheckboxChange(e.target.checked);
    }
    render(){
        let label = this.props.label;
        let required = this.props.fieldRequired;
        return(
            <div>
                <p className="emphasized">Text</p>
                Label:<input type="text" value={label} onChange={this.handleTextboxChange}></input>
                Required?<input type="checkbox" checked={required} onChange={this.handleCheckboxChange}></input>
            </div>
        );
    }
}

class ConfigForm extends React.Component{
    constructor(props){
        super();
        this.state = {
            isClicked:false,
            textboxLabel:'',
            textboxRequired: false
        };
        this.handleFormElementClick = this.handleFormElementClick.bind(this);
        this.handleTextboxChange = this.handleTextboxChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleConfigFormSubmit = this.handleConfigFormSubmit.bind(this);
    }
    //Calls selected form component
    handleFormElementClick(e){
        // e.preventDefault();
        // alert('clicked -'+e.target.id);
        this.setState({
            isClicked:true
        });
    }
    handleTextboxChange(label){
        this.setState({
            textboxLabel: label,
        })
    }
    handleCheckboxChange(required){
        this.setState({
            textboxRequired: required,
        })
    }
    
    handleConfigFormSubmit(e){
        e.preventDefault();
        formConfig.field = "input";
        formConfig.type = "text";
        formConfig.label = this.state.textboxLabel;
        formConfig.required = this.state.textboxRequired;
        alert(JSON.stringify(formConfig,null,2));
        saveData(formConfig);
     
    }
    render(){
        let formElement;
        if(this.state.isClicked){
            formElement = 
            <TextBox 
                label={this.state.textboxLabel} 
                fieldRequired={this.state.textboxRequired} 
                onTextboxChange={this.handleTextboxChange}
                onCheckboxChange={this.handleCheckboxChange}
            />;
        }
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
                    </CardContent>
                    {formElement}
                    <CardActions>
                        <Button type="submit" size="small">Save Form</Button>
                    </CardActions>
                </form>
                
            </div>
        )
    }
}

//Main card to display form options
class MainCard extends React.Component{
    constructor(props){
        super();

    }
    // callAPI(){
    //     fetch('http://localhost:5000/testAPI')
    //     .then(res=>res.text())
    //     .then(res=>this.setState({apiResponse:res}));
    // }
    // componentDidMount(){
    //     this.callAPI();
    // }
    render(){
        return(
            <Card className="center">
                <ConfigForm />
            </Card>
        )
    }
}

//Main app scafolding
class App extends React.Component{
    render(){
        return(
            <MainCard/> 
        )
    }
}

let formConfig = {};

ReactDOM.render(
    <App />,
    document.getElementById('root')
);