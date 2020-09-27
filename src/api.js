import axios from 'axios';
let config = {};

/**
 * Saves user built form
 * Saves user data (use submissions = true for this)
 * @param {Array} payload 
 * @param {Boolean} submissions 
 */
config.saveData =  async (payload, submissions = null) => {
    if(submissions){
        const formData = new Promise(function(resolve, reject){
            axios.post('http://localhost:5000/testAPI/forms/entries/save',payload)
            .then(res=>{
               
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

/**
 * Fetch user built form
 * Fetch user submitted form data (use submissions = true for this)
 * @param {String} form 
 * @param {Boolean} submissions 
 */
config.getForm = async (form, submissions= null) => {
    if(!submissions){
        const formData = new Promise(function(resolve, reject){
            axios.get('http://localhost:5000/testAPI/forms/'+form)
            .then(res=>{
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