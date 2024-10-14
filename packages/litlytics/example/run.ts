import { LitLytics, type Pipeline } from '../litlytics';
import pipeline from './pipeline.json';

const litlytics = new LitLytics({
  provider: 'openai',
  model: 'gpt-4o-mini',
  key: process.env.OPENAI_API_KEY!,
});
litlytics.setPipeline(pipeline as Pipeline);
const result = await litlytics.runPipeline();
console.log(result?.results);
