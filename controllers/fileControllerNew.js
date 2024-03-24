
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');


// Set up storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'temp/') // Temporarily stores files in 'temp/' directory
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// Configure multer for file uploads
const upload = multer({ storage: storage }).single('file');

// Define the route and middleware to handle file uploads and checkbox data
exports.uploadFile = (req, res) => {
  upload(req, res, function (uploadError) {
    if (uploadError instanceof multer.MulterError) {
      // A multer error occurred when uploading.
      return res.status(500).send(`Multer uploading error: ${uploadError.message}`);
    } else if (uploadError) {
      // An unknown error occurred when uploading.
      return res.status(500).send(`Unknown uploading error: ${uploadError.message}`);
    }
    const k = req.body.k;
    // If this point is reached, file upload was successful.
    const checkboxes = req.body.checkboxes; // Assuming checkboxes is sent as a JSON array or a comma-separated list
    const file = req.file;

    // Ensure checkboxes data is in the correct format for the Python script
    const checkboxesStr = Array.isArray(checkboxes) ? checkboxes.join(',') : checkboxes;

    // Call the Python script using spawn
    const pythonProcess = spawn('python', ['ToolKit.py', checkboxesStr, file.path,k]);

    pythonProcess.stdout.on('data', (data) => {
      // Handle the transformed file path returned by the Python script
      const transformedFilePath = data.toString().trim();

      // Define the new path for the transformed file
      const newFilePath = path.join(__dirname, 'uploads', path.basename(transformedFilePath));

      // Move the file from its temporary location to the 'uploads' directory
      fs.rename(transformedFilePath, newFilePath, (err) => {
        if (err) {
          console.error('Error saving the file:', err);
          return res.status(500).send('Error processing the file.');
        }

        // If the file was handled successfully, send a response
        res.send('File processed successfully.');
      });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).send('Error processing the file.');
    });

    pythonProcess.on('error', (error) => {
      console.error(`Error spawning Python process: ${error}`);
      res.status(500).send('Error processing the file.');
    });

    // If there's no data streamed from Python, ensure the client gets a response
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).send('Python script did not execute successfully.');
      }
      // This message may be redundant due to the fs.rename callback, but it's useful for debugging
      console.log('Python script executed successfully.');
    });
  });
};

