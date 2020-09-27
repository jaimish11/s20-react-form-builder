/**
 * String utility config for all string related operations
 */
const StringUtility = {
    //Make first letter of word capital
    capitalize: function(string){
        return string.charAt(0).toUpperCase()+string.slice(1);
    }
}

export default StringUtility;