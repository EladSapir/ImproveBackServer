const multer = require('multer');
const path = require('path');

// Set up storage engine to save files in 'uploads/' directory with a specific naming convention
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/') // Change the directory to 'uploads/'
  },
  filename: function(req, file, cb) {
    // Keep the naming convention as date and original file name
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// Configure multer for file uploads
const upload = multer({ storage: storage }).single('file');

exports.uploadFile = (req, res) => {
  upload(req, res, (uploadError) => {
    if (uploadError instanceof multer.MulterError) {
      // A multer error occurred when uploading.
      return res.status(500).send(`Multer uploading error: ${uploadError.message}`);
    } else if (uploadError) {
      // An unknown error occurred when uploading.
      return res.status(500).send(`Unknown uploading error: ${uploadError.message}`);
    }
    // If file upload is successful, send back a success message.
    res.send('File uploaded successfully.');
  });
};
