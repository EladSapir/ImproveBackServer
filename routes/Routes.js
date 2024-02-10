const express = require ('express')
const router = express.Router()
const fileController = require('../controllers/fileController.js')
// router.get('/', Post.getPosts)

router.post('/upload', fileController.uploadFile);
router.get('/hey', fileController.hey);
module.exports = router