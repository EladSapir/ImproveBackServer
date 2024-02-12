const app = require('./app');
const dotenv = require ("dotenv").config()

app.listen(8443,()=>{
    console.log('server started on port ' + 8443)
})

