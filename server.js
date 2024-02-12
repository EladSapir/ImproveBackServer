const app = require('./app');
const dotenv = require ("dotenv").config()

app.listen(443,()=>{
    console.log('server started on port ' + 443)
})

