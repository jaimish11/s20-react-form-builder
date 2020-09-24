import axios from 'axios';
let config = {};
config.saveData =  async (payload, submissions = null) => {
    if(submissions){
        const formData = new Promise(function(resolve, reject){
            axios.post('http://localhost:5000/testAPI/forms/entries/save',payload)
            .then(res=>{
                console.log(res);
                resolve(res);
            })
            .catch(error=>{
                console.log(error);
                reject(error);
            }); 
        });
        return formData;
    }
    else{
        const formData = new Promise(function(resolve, reject){
            axios.post('http://localhost:5000/testAPI/save',payload)
            .then(res=>{
                console.log(res);
                console.log(res.data[0].formID);
                resolve(res.data[0].formID);
                
            })
            .catch(error=>{
                console.log(error);
                reject(error);
            })
        })
        return formData;
      
    }
   
}

config.getForm = async (form, submissions= null) => {
    if(!submissions){
        const formData = new Promise(function(resolve, reject){
            axios.get('http://localhost:5000/testAPI/forms/'+form)
            .then(res=>{
                console.log(res.data);
                resolve(res.data);
            })
            .catch(error=>{
                console.log(error)
                reject(error);
            })
        });
        return formData;
    }
    else{
        const submissionsData = new Promise(function(resolve, reject){
            axios.get('http://localhost:5000/testAPI/forms/entries/'+form)
            .then(res=>{
                console.log(res.data);
                resolve(res.data);
            })
            .catch(error=>{
                console.log(error)
                reject(error);
            })
        });
        return submissionsData;
    }
 
}

export default config;