const mongoose = require('mongoose');

const modelsHistory = new mongoose.Schema({
    model_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    modelType: {type:String, required: true},
    DBsize: {type:Number, required: true},
    accuracyLVL: {type:Number, required: true},
    paramsSVC: { },// enter dictionarry non required for the parameters that the svc is supposed to receive
    paramsKNN: {  } // enter dictionarry non required for the parameters that the knn is supposed to receive
  }, { timestamps: true });
  
  module.exports = mongoose.model('ModelHistory', modelsHistory);
