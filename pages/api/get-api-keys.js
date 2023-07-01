const util = require('util');
const exec = util.promisify(require('child_process').exec);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retrieveFromOnePassword(path, serviceToken,vault,item) {
  try {
    const options = {
      cwd: path,
      env:{
        OP_SERVICE_ACCOUNT_TOKEN: serviceToken,
      }
    };
    let output;
      exec('op user get --me', options,(error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
        });

    // Retrieve the API keys from the vault
    exec(`op read op://${vault}/${item}/credential`, options,(error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          output = {
            credential:stdout
          }
        });
    await delay(10000);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve API keys from 1Password.');
  }
}

export default async function handler(req, res) {
  try {
    const path = req.body.path;
    const serviceToken = req.body.serviceToken;
    const vault = req.body.vault;
    const item = req.body.item;

    const apiKey = await retrieveFromOnePassword(path,serviceToken,vault,item);
    res.json(apiKey)
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Failed to retrieve API keys.' });
  }
}