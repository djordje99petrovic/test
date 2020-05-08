const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});

exports.handler=function(e, ctx, callback){

    const item = JSON.parse(event.body);
    item["uuid"] = uuidv4();
    const params = {
      TableName: "transactions",
      Item: item
    }

    await dynamoDb.put(params).promise()
}

