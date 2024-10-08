import { LitLytics } from '@/src/litlytics';
import { ModelConfig } from '@/src/llm/types';
import { Pipeline } from '@/src/pipeline/Pipeline';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

interface ExecuteRequest {
  modelConfig: ModelConfig;
  pipeline?: Pipeline;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = (await request.json()) as ExecuteRequest;
  const { modelConfig, pipeline } = body;
  if (!modelConfig.provider?.length || !modelConfig.model?.length) {
    throw new Error('Provider and model must not be empty!');
  }
  if (!modelConfig.apiKey?.length) {
    throw new Error('API key must not be empty!');
  }
  if (!pipeline) {
    throw new Error('Pipeline config must not be empty!');
  }
  // create new litlytics instance
  const litlytics = new LitLytics({
    modelConfig,
  });
  const newPipeline = await litlytics.runPipeline(pipeline, () => {});
  return json(newPipeline);
};
