const express = require ('express')
const router = express.Router()
const fileSave = require('../controllers/fileSave.js')
const fileControllerNew = require('../controllers/fileControllerNew.js')

// router.get('/', Post.getPosts)

router.post('/upload', fileControllerNew.uploadFile);
//router.get('/hey', fileController.hey);
module.exports = router