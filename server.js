const app = require('./app');
const dotenv = require ("dotenv").config()

app.listen(process.env.PORT,()=>{
    console.log('server started on port ' + process.env.PORT)
})

