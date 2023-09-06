/*
    Primary file for the API
*/


// Dependencies
const http = require('http');

// The server should respond to all rquests with a string
const server = http.createServer( (req, res) => {
    res.end('Hello world\n');
});

// Start the server, and have it listen on port 3000
server.listen(3001, () => {
    console.log('The server is listening on port 3001 now');
})
