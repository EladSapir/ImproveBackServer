const express = require('express')
const app = express();
const dotenv = require ("dotenv").config()
const routes= require ('./routes/Routes')
//const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//mongoose.connect(process.env.DATABASE_URL);
//const db= mongoose.connection
//db.on("error",(err)=>console.log(err))
//db.once("open",()=>console.log("connected to database"))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use('/',routes)
const PORT = process.env.PORT



module.exports = app;