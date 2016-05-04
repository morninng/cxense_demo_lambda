'use strict';
console.log('Loading function');

var config = require('./config_local.conf');
//var config = require('./config_aws.conf');
var AWS = require("aws-sdk");
var crypto = require("crypto");

if(config.local){
    AWS.config.update({accessKeyId: config.AwsKeyId, secretAccessKey: config.SecretKey});
}

AWS.config.update({
  region: config.dynamo_region,
  endpoint: config.dynamo_url
});


var aws_client = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    
    var token_str = event.authorizationToken;
    var token_obj = JSON.parse(token_str);
    console.log(token_obj);
    var in_tuuid = token_obj.user_id;
    console.log("user id is", in_tuuid);
    var in_mac = token_obj.mac;
    console.log(in_mac);


    var params = {
        TableName: "User",
        IndexName: "TuuidIndex",
        KeyConditionExpression: "tuuid = :tuuid_value",
        ExpressionAttributeValues: {
            ":tuuid_value": in_tuuid
        }        ,
        ProjectionExpression: "tuuid, temporal_random, email, hashed_password"
    };

    docClient.query(params, function(err, data) {
        if (err){
            context.fail("Unauthorized");
            console.log(JSON.stringify(err, null, 2));
        }
        else{
            var db_tuuid = data.Items[0].tuuid;
            var db_email = data.Items[0].email;
            var db_temporal_random = data.Items[0].temporal_random;
            var db_hashed_password = data.Items[0].hashed_password;
            
            var message = db_email + String(db_temporal_random);
            var hmac_sha256 = crypto.createHash('sha256', db_hashed_password);
            var db_mac = hmac_sha256.update(message).digest('hex');

            if(db_mac == in_mac){
                context.succeed(generatePolicy('user', 'Allow', event.methodArn));
            }else{
                context.fail("unauthorized");

            }
        }
    });
};



    var generatePolicy = function(principalId, effect, resource) {
        var authResponse = {};
        authResponse.principalId = principalId;
        if (effect && resource) {
            var policyDocument = {};
            policyDocument.Version = '2012-10-17'; // default version
            policyDocument.Statement = [];
            var statementOne = {};
            statementOne.Action = 'execute-api:Invoke'; // default action
            statementOne.Effect = effect;
            statementOne.Resource = resource;
            policyDocument.Statement[0] = statementOne;
            authResponse.policyDocument = policyDocument;
        }
        return authResponse;
    };
