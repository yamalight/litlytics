import { executeOnLLM } from '@/src/llm/llm';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.json();
  const response = await executeOnLLM(body);
  return json(response);
};

// existing code
