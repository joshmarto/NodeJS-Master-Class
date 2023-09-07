/*
    Primary file for the API
*/


// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all rquests with a string
const server = http.createServer( (req, res) => {

    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, If any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Chose the handler this request should go to, If one is not found use the not found handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            'payload': buffer,
        };

        // Route te request to the specified handler in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) === 'object' ? payload : {};

            // Convert the payloa to a string
            payloadString = JSON.stringify(payload); // Not payload received but sent back to the user

            // Return the response
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log(`Returning this response: ${statusCode} ${payloadString}`);

        });

    });
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log('The server is listening on port 3000 now');
})

// Define the handlers
const handlers = {};

// Sample hander
handlers.sample = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(406, {'name': 'sample handler'});
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    'sample': handlers.sample,
};
