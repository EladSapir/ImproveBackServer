const app = require('./app');
const dotenv = require ("dotenv").config()

// app.listen(80,()=>{
//     console.log('server started on port ' + 80)
// })

const server = http.createServer((req, res) => {
    res.writeHead(403, {'Content-Type': 'text/plain'});
    res.end('Access Denied');
});

server.listen(80, () => {
    console.log('Server running on port 80');
});

