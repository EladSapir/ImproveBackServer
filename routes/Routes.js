const express = require ('express')
const router = express.Router()
const fileControllerNew = require('../controllers/fileControllerNew.js')
const improvement = require('../controllers/runImprovement.js')
// router.get('/', Post.getPosts)

router.post('/upload', fileControllerNew.uploadFile);

router.post('/runImprovement', improvement.runImprovement);
module.exports = router