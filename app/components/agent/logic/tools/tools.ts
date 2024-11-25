import { addNewStep } from './addNewStep';
import { analyzeDocuments } from './analyzeDocs';
import { createSuggestedPipeline } from './createSuggestedPipeline';
import { editStep } from './editStep';
import { refinePipeline } from './refinePipeline';
import { suggestPipeline } from './suggestPipeline';

export const agentTools = [
  analyzeDocuments,
  suggestPipeline,
  refinePipeline,
  createSuggestedPipeline,
  addNewStep,
  editStep,
];
