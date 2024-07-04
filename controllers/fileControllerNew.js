const multer = require('multer');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs').promises;
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
  const { stdout, stderr } = await exec(`python ${scriptPath} ${checkbox} ${target} ${db} ${k}`);
  if (stderr) {
    throw new Error(stderr);
  }
  return JSON.parse(stdout);
};

exports.uploadFile = (req, res) => {
  upload(req, res, async (uploadError) => {
    if (uploadError instanceof multer.MulterError) {
      return res.status(500).send(`Multer uploading error: ${uploadError.message}`);
    } else if (uploadError) {
      return res.status(500).send(`Unknown uploading error: ${uploadError.message}`);
    }

    const k = req.body.k;
    const target = req.body.target;
    const checkboxes = req.body.checkboxes; // Assuming checkboxes is sent as a JSON array or a comma-separated list
    const file = req.file;

    try {
      const data = await executePythonScript(checkboxes, target, file.path, k);
      await fs.unlink(file.path);
      console.log("solalalallalala "+data.csv_after_toolkit_gist);
      return res.send({ success: true, message: 'File uploaded and processed successfully', data: [data.csv_after_toolkit_gist, data.encoded_csv, data.scaled_csv, data.relative_path] });
    } catch (error) {
      await fs.unlink(file.path).catch((unlinkError) => {
        console.error(`Error deleting file: ${unlinkError}`);
      });
      return res.status(500).send({ success: false, message: 'Failed to execute Python script.', error: error.message });
    }
  });
};