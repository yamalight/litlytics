import { defaultModelArgs } from '@/src/llm/config';
import { executeOnLLM, executeOnLLMWithJSON } from '@/src/llm/llm';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.json();
  const { messages, args, response_format } = body;

  if (response_format) {
    const response = await executeOnLLMWithJSON({
      messages,
      modelArgs: {
        ...defaultModelArgs,
        ...(args ?? {}),
      },
      response_format,
    });

    return json(response);
  }

  const response = await executeOnLLM({
    messages,
    modelArgs: {
      ...defaultModelArgs,
      ...(args ?? {}),
    },
  });
  return json(response);
};

// existing code
