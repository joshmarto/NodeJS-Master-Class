/*
    Create an export configuration variable

 */

// Container for all the environmets
const environmets = {};

// Stagging {default} environment
environmets.staging = {
    'port': 3000,
    'envName': 'stagging',
};


// Production environment
environmets.production = {
    'port': 5001,
    'envName': 'production',
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to stagging
const environmentToExport = typeof(environmets[currentEnvironment]) === 'object' ? environmets[currentEnvironment] : environmets.staging;

// Export the module
module.exports = environmentToExport;
