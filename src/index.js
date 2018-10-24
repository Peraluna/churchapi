const http = require('http');
const app = require('./app.js');

const ip_addr = 'localhost'
const port = 5000// process.env.PORT || 3000;
const server = http.createServer(app);
var Globals = require('./globals')

server.listen(port , ip_addr);
console.log('Server started on %s port: %s',ip_addr , port );
Globals.serverURL = 'http://'+ip_addr + ':' + port
console.log('Server started on URL: ' +  Globals.serverURL);

