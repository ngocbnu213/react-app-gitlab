const fs = require('fs');
const AWS = require('aws-sdk');

/**
 * Used by the build process to inject AWS SSM params into environment variables
 *
 * NOTE: To run this locally you may need to either set AWS_REGION env var
 * or use the value in your ~/.aws/config file by:
 * AWS_SDK_LOAD_CONFIG=true node ./read-ssm.js
 */

const writeEnvFile = keyVals => {
  fs.writeFileSync('./.env', keyVals.join('\n'));
};

const retrieveParams = async () => {
  console.log(process.env.AWS_REGION);
  const client = new AWS.SecretsManager({
    region : process.env.AWS_REGION});
  const ssm = await client
    .getSecretValue({
      SecretId: process.env.SECRET_ID
    })
    .promise();

  const secret = JSON.parse(ssm.SecretString);

  const keyVals = Object.keys(secret).map((key) => `${key}=${secret[key]}`);

  writeEnvFile(keyVals);
};

await retrieveParams();