const mongoose = require('mongoose');

const model = new mongoose.Schema({
    name: {type:String, required: true},
    CSVpath: {type:String, required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    impute_csv: {type:Boolean, required: true},
    encode_csv: {type:Boolean, required: true},
    scale_csv: {type:Boolean, required: true},
    feature_select_csv: {type:Boolean, required: true},
    remove_outliers_csv: {type:Boolean, required: true},
    isRunning: {type:Boolean, required: true,default:false},
    waitingToLearn: {type:Boolean, required: true,default:true},
  }, { timestamps: true });

  module.exports = mongoose.model('Model', model);