const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: "eu-central-1",
});
exports.handler = (event, context, callback) => {
    console.info(event);
    const accountId = context.invokedFunctionArn.split(":")[4];
    const queueUrl1 = `https://sqs.eu-central-1.amazonaws.com/${accountId}/hb_message_processing_queue`;
    const queueUrl2 = `https://sqs.eu-central-1.amazonaws.com/${accountId}/nlb_message_processing_queue`;
    // response and status of HTTP endpoint
    const responseBody = {
        message: ""
    };
    let responseCode = 200;
    const data = JSON.parse(event.body);
    const nlb = data.message.includes("NLB");
    const hipotekarna = data.message.includes("Hipotekarna");
    
    if (hipotekarna==true){
        const params = {
            MessageBody: event.body,
            QueueUrl: queueUrl1,
        };

        sqs.sendMessage(params, (error, data) => {
            if (error) {
                console.info("error:", `failed to send message${error}`);
                responseCode = 500;
            } else {
                console.info("data:", data.MessageId);
                responseBody.message = `Sent to hb_message_processing_queue`;
                responseBody.messageId = data.MessageId;
            }
        });
        const response = {
            statusCode: responseCode,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(responseBody),
        };
        callback(null, response);
    }

    else if(nlb==true){
        const params = {
            MessageBody: event.body,
            QueueUrl: queueUrl2,
        };

        sqs.sendMessage(params, (error, data) => {
            if (error) {
                console.info("error:", `failed to send message${error}`);
                responseCode = 500;
            } else {
                console.info("data:", data.MessageId);
                responseBody.message = `Sent to nlb_message_processing_queue`;
                responseBody.messageId = data.MessageId;
            }
        });
        const response = {
            statusCode: responseCode,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(responseBody),
        };
        callback(null, response);
    }

};