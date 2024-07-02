const multer = require('multer');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
require('dotenv').config(); // Ensure to load the environment variables

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

const executePythonScript = async (checkbox, target, db, k) => {
  const scriptPath = path.resolve(__dirname, process.env.TOOLKIT_SCRIPT_PATH);
  return await exec(`python ${scriptPath} ${checkbox} ${target} ${db} ${k}`);
};

// Define the route and middleware to handle file uploads and checkbox data
exports.uploadFile = (req, res) => {
  upload(req, res, async (uploadError) => {
    if (uploadError instanceof multer.MulterError) {
      // A multer error occurred when uploading.
      return res.status(500).send(`Multer uploading error: ${uploadError.message}`);
    } else if (uploadError) {
      // An unknown error occurred when uploading.
      return res.status(500).send(`Unknown uploading error: ${uploadError.message}`);
    }

    // Collect request body data
    const k = req.body.k;
    const target = req.body.target;
    const checkboxes = req.body.checkboxes; // Assuming checkboxes is sent as a JSON array or a comma-separated list
    const file = req.file;

    try {
      // Call the Python script
      const { stdout, stderr } = await executePythonScript(checkboxes, target, file.path, k);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send({ success: false, message: 'Error executing Python script.', error: stderr });
      }
      console.log(`stdout: ${stdout}`)
      // Only send one response, indicating success and including any data or messages
      return res.send({ success: true, message: 'File uploaded and processed successfully', data: stdout});
    } catch (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ success: false, message: 'Failed to execute Python script.', error: error.message });
    }
  });
};
