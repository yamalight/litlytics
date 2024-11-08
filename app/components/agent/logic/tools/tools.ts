import { analyzeDocuments } from './analyzeDocs';
import { createSuggestedPipeline } from './createSuggestedPipeline';
import { refinePipeline } from './refinePipeline';
import { suggestPipeline } from './suggestPipeline';

export const agentTools = [
  analyzeDocuments,
  suggestPipeline,
  refinePipeline,
  createSuggestedPipeline,
];
