const app = require('./app');
const dotenv = require ("dotenv").config()
//const http = require('http');


app.listen(443,()=>{
    console.log('server started on port ' + 443)
})

// const server = http.createServer((req, res) => {
//     res.writeHead(403, {'Content-Type': 'text/plain'});
//     res.end('Access Denied');
// });

// server.listen(443, () => {
//     console.log('Server running on port 80');
// });

