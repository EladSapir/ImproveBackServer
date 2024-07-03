const express = require('express')
const app = express();
const routes= require ('./routes/Routes');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
  origin: 'https://intellitest-front.onrender.com',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use('/',routes)
const PORT = 4000



module.exports = app;