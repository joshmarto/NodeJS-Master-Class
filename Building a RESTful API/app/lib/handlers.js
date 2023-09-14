/*
    Request handlers

*/

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
const handlers = {};

// Users
handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if ( acceptableMethods.indexOf(data.method) > -1 ){
        handlers._users[data.method](data, callback);
    } else{
        callback(405);// Method not allowed
    }
};

// Container for users submethods
handlers._users = {};

// Users - post
// Required data: firstNamee, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled out
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the users doesn't already exist
        _data.read('users', phone, (err, data) => {
            if(err){
                // Hash the password
                const hashedPassword = helpers.hash(password);

                // Create the user oject
                if (hashedPassword){
                    const userObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement,
                    };
    
                    // Store the user
                    _data.create('users', phone, userObject, (err) => {
                        if(!err){
                            callback(200);
                        } else{
                            console.log(err);
                            callback(500, {'Error': 'Could not create the new user'});
                        }
                    });
                } else{
                    callback(500, {'Error': 'Could not hash the user\'s password'});
                }
            } else{
                // User already exist
                callback(400, { 'Error': 'A user with that phone number already exist' });
            }
        });
    } else{
        callback(400, {'Error': 'Missing required fields'});
    }
};

// Users - get
// Required data: phone
// Optional data; none
// toDo: Only let an authenticated user access their object. Don't let them access anyone else's
handlers._users.get = (data, callback) => {
    // Check that the phone number is valid
    const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.length === 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        // Look up the user
        _data.read('users', phone, (err, data2) => {
            if(!err && data2){
                // Remove the hashedPassword from the user object before returning it to the requester
                delete data2.hashedPassword;
                callback(200, data2);
            } else{
                callback(404);
            }
        });
    } else{
        callback(400, {'Error': 'Missing required field'});
    }
};

// Users - put
// Required data: phone
// Optionl data: firstName, lastName, password (at least one mustbe specified)
// toDo: Only let an authenticated user update their own object, don't let them update anyone else's
handlers._users.put = (data, callback) => {
    // Check for the required field
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;

    // Check for the optional fields
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if the phone is invalid
    if (phone){
        // Error if nthing is sent to update
        if (firstName || lastName || password){
            // Look up the user
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // Update the fields necessary
                    if (firstName){
                        userData.firstName = firstName;
                    }
                    if (lastName){
                        userData.lastName = lastName;
                    }
                    if (password){
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store the new updates
                    _data.update('users', phone, userData, (err) => {
                        if(!err){
                            callback(200);
                        } else{
                            console.log(err);
                            callback(500, {'Error': 'Could not update the user'});
                        }
                    });
                } else{
                    callback(400, {'Error': 'The specified user does not exist'});
                }
            });
        } else{
            callback(400, {'Error': 'Missing fields to update'});
        }
    } else{
        callback(400, {'Error': 'Missing required field'});
    }
};

// Users - delete
// Required field: phone
// toDo: Only allow to an authenticated user delete their own object, don't let them delete anyone else's
// toDo: Cleanup (delete) any other data files associated with this user
handlers._users.delete = (data, callback) => {
    // Check that the phone number is valid
    const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.length === 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        // Look up the user
        _data.read('users', phone, (err, userData) => {
            if(!err && userData){
                _data.delete('users', phone, (err) => {
                    if (!err){
                        callback(200);
                    } else{
                        console.log(err);
                        callback(500, {'Error': 'Could not delete the specified user'});
                    }
                });
            } else{
                callback(400, {'Error': 'Could not find the specified user'});
            }
        });
    } else{
        callback(400, {'Error': 'Missing required field'});
    }
};



// Ping handler
handlers.ping = (data, callback) => {
    callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};


// Export the module
module.exports = handlers;