/*
    Helpers for various tasks

*/

// Dependecies
const crypto = require('crypto');
const config = require('./config');

// Container for all the helpers
const helpers = {};


// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof(str) === 'string' && str.length > 0){
        const hash = crypto.createHmac('SHA256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else{
        return false;
    }
};

// Parse a JSON String to an Object in all cases without throwing
helpers.parseJsonToObject = str => {
    try{
        const obj = JSON.parse(str);
        return obj;
    } catch(e){
        return {};
    }
};












// Export the module
module.exports = helpers;
