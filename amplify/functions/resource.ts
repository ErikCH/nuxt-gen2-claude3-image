import { defineFunction } from "@aws-amplify/backend";

export const claudeFunction = defineFunction({
  timeoutSeconds: 30,
  name: "my-claudeV3-fn",
});
