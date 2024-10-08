import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { LitLytics, LLMModel, LLMProvider, Pipeline } from 'litlytics';

interface ExecuteRequest {
  provider?: LLMProvider;
  model?: LLMModel;
  key?: string;
  pipeline?: Pipeline;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = (await request.json()) as ExecuteRequest;
  const { provider, model, key, pipeline } = body;
  if (!provider?.length || !model?.length) {
    throw new Error('Provider and model must not be empty!');
  }
  if (!key?.length) {
    throw new Error('API key must not be empty!');
  }
  if (!pipeline) {
    throw new Error('Pipeline config must not be empty!');
  }
  // create new litlytics instance
  const litlytics = new LitLytics({
    provider,
    model,
    key,
  });
  const newPipeline = await litlytics.runPipeline(pipeline, () => {});
  return json(newPipeline);
};
