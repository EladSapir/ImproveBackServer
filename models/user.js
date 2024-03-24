const mongoose = require('mongoose');
const user = new mongoose.Schema({
    Email: {type:String, required: true, unique: true},
    Password: {type:String, required: true},
    accountType: {type:Boolean, required: true}
  }, { timestamps: true });

module.exports = mongoose.model('User', user);
    