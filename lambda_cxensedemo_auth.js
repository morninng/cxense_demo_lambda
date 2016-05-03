'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
    
    console.log(event);
    var token_str = event.authorizationToken;
    console.log(token_str);
    var token_obj = JSON.parse(token_str);
    console.log(token_obj);
    var user_id = token_obj.user_id;
    console.log("user id is", user_id);
    var temporal_random = token_obj.temporal_rndom;
    var mac = token_obj.mac;
    if(user_id == '57ee794c-ad70-4849-8cdf-3e2e006cf78d'){
        context.succeed(generatePolicy('user', 'Allow', event.methodArn));
    }else{
        context.fail("Unauthorized");
    }
    
    
    /*
    
    console.log("token is" + token);
    // Call oauth provider, crack jwt token, etc.
    // In this example, the token is treated as the status for simplicity.
    switch (token) {
    case 'allow':
        console.log("allowed");
        context.succeed(generatePolicy('user', 'Allow', event.methodArn));
    break;
    case 'deny':
        console.log("denied");
        context.succeed(generatePolicy('user', 'Deny', event.methodArn));
    break;
    case 'unauthorized':
        console.log("unaurhtorized");
        context.fail("Unauthorized");
    break;
    default:
        console.log("error");
        context.fail("error");
    }
    */
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
