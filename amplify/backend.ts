import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { claudeFunction } from "./functions/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  claudeFunction,
});

backend.claudeFunction.resources.lambda.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: ["*"],
    actions: ["bedrock:InvokeModel"],
  })
);

backend.claudeFunction.resources.lambda.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: ["*"],
    actions: ["dynamodb:*"],
  })
);
