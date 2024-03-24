const express = require('express')
const app = express();
const dotenv = require ("dotenv").config()
const routes= require ('./routes/Routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


mongoose.connect(process.env.DATABASE_URL)
  .then((result) => {
    console.log('Connected to the DataBase successfully');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use('/',routes)
const PORT = 4000



module.exports = app;