const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const executePythonScript = async (db) => {
    const scriptPath = process.env.RUNIMPROVEMENT_SCRIPT_PATH;
    return await exec(`python ${scriptPath} ${db}`);
};

exports.runImprovement = async (req, res) => {
    const db = req.body.db;
    try {
        // Call the Python script
        const { stdout, stderr } = await executePythonScript(db);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).send({ success: false, message: 'Error executing Python script.', error: stderr });
        }
        // Only send one response, indicating success and including any data or messages
        return res.send({ success: true, data:stdout});
      } catch (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send({ success: false, message: 'Failed to execute Python script.', error: error.message });
      }
    };



