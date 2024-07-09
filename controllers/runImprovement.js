const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const axios = require('axios'); // Import Axios
require('dotenv').config(); // Ensure to load the environment variables
const path = require('path'); // Import the path module

const executePythonScript = async (db) => {
    // Resolve the full path to the script
    const scriptPath = path.resolve(__dirname, process.env.RUNIMPROVEMENT_SCRIPT_PATH);
    return await exec(`python ${scriptPath} ${db}`);
};

exports.runImprovement = async (req, res) => {
    console.log('Request Body:', req.body);  // Log the entire request body
    const db = req.body.db;
    const userId = req.body.user_id;
    const modelId = req.body.model_id;
    const modelType = req.body.modelType;
    const backendUrl = process.env.BACKEND_URL; // Assuming backend URL is stored in the environment variables
    console.log('DB Path:', db);
    try {
        // Call the Python script
        await axios.post(`${backendUrl}/model/startLearn`, {
            model_id: modelId,
        });
        const { stdout, stderr } = await executePythonScript(db);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send({ success: false, message: 'Error executing Python script.', error: stderr });
        }
        
        // Parse the Python script output
        const output = JSON.parse(stdout.replace(/learning results/, '').trim());
        const { best_params, confusion_matrix, accuracy } = output;
        
        // Extract confusion matrix values
        const [tp, fp] = confusion_matrix[0];
        const [fn, tn] = confusion_matrix[1];

        // Prepare the payload for the POST request
        const payload = {
            model_id: modelId,
            user_id: userId,
            modelType: modelType,
            accuracyLVL: accuracy,
            con_mat_tp: tp,
            con_mat_fp: fp,
            con_mat_fn: fn,
            con_mat_tn: tn,
            params: best_params
        };

        // Send the POST request to the backend
        await axios.post(`${backendUrl}/modelHistory/addHistory`, payload,{
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Learning results saved to model history");
        await axios.post(`${backendUrl}/model/finishLearn`, {
            model_id: modelId,
        });
        // Only send one response, indicating success and including any data or messages
        return res.send({ success: true, data: output });
    } catch (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send({ success: false, message: 'Failed to execute Python script or save model history.', error: error.message });
    }
};
