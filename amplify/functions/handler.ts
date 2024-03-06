import { AppSyncResolverHandler } from "aws-lambda";
import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime";

type ResolverArgs = {
  base64Image: string;
  prompt: string;
};

type ResolverResult = { content: string };

export const handler: AppSyncResolverHandler<
  ResolverArgs,
  ResolverResult
> = async (event, context) => {
  const bedrock = new BedrockRuntime({
    region: "us-east-1",
  });

  const prompt = event.arguments.prompt;
  // data:image/jpeg;base64,
  const [meta, data] = event.arguments.base64Image?.split(",") ?? [];
  if (!meta || !data) {
    return {
      content: "ERROR!",
    };
  }
  const media_type = meta?.split(";")[0].replace("data:", "");
  console.log({ meta, data, media_type });

  const results = await bedrock.invokeModel({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type,
                data,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    }),
  });
  const decoder = new TextDecoder();
  const res = JSON.parse(decoder.decode(results.body));
  console.log(res);
  const content = res.content[0].text;

  return {
    content,
  };
};
