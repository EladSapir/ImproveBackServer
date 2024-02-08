const multer = require('multer');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const dotenv = require ("dotenv").config()


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
});

const upload = multer({ storage: storage }).single('file');

// Async function to execute Python script
const executePythonScript = async (filePath) => {
  const scriptPath = process.env.IMPROVEMENT_SCRIPT_PATH; 
  return await exec(`python "${scriptPath}" "${filePath}"`);
};

// Controller function to handle file upload and Python script execution
exports.uploadFile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ success: false, message: 'File upload failed.', error: err });
    }
    if (!req.file) {
      return res.status(400).send({ success: false, message: 'No file uploaded. Please select a file to upload.' });
    }
    try {
      // Execute the Python script using the path of the uploaded file
      const { stdout, stderr } = await executePythonScript(req.file.path);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send({ success: false, message: 'Error executing Python script.', error: stderr });
      }
      res.send({ success: true, message: 'File processed successfully', data: stdout });
    } catch (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send({ success: false, message: 'Failed to execute Python script.', error: error.message });
    }
  });
};
