const express = require('express')
const app = express();
const routes= require ('./routes/Routes')
const bodyParser = require('body-parser')



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use('/',routes)
const PORT = 4000



module.exports = app;