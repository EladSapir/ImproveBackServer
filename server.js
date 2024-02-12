const app = require('./app');
const dotenv = require ("dotenv").config()

app.listen(80,()=>{
    console.log('server started on port ' + 80)
})

