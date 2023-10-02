const {CloudWatchClient} = require("@aws-sdk/client-cloudwatch");

const {AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env;

const cloudWatchClient = new CloudWatchClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
})

module.exports = cloudWatchClient;
