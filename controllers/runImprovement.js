const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
require('dotenv').config(); // Ensure to load the environment variables
const path = require('path'); // Import the path module

const executePythonScript = async (db) => {
    // Resolve the full path to the script
    const scriptPath = path.resolve(__dirname, process.env.RUNIMPROVEMENT_SCRIPT_PATH);
    return await exec(`python3 ${scriptPath} ${db}`);
};

exports.runImprovement = async (req, res) => {
    console.log('Request Body:', req.body);  // Log the entire request body
    const db = req.body.db;
    console.log('DB Path:', db);
    try {
        // Call the Python script
        const { stdout, stderr } = await executePythonScript(db);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send({ success: false, message: 'Error executing Python script.', error: stderr });
        }
        // Only send one response, indicating success and including any data or messages
        return res.send({ success: true, data: stdout });
    } catch (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send({ success: false, message: 'Failed to execute Python script.', error: error.message });
    }
};
