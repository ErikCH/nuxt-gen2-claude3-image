import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { claudeFunction } from "../functions/resource";

const schema = a.schema({
  BedrockResponse: a.customType({
    content: a.string(),
  }),
  imageBedrock: a
    .query()
    .arguments({ base64Image: a.string(), prompt: a.string() })
    .returns(a.ref("BedrockResponse"))
    .authorization([a.allow.public()])
    .function("claudeV3"),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
  functions: {
    claudeV3: claudeFunction,
  },
});
