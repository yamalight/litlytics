import { addNewStep } from './addNewStep';
import { analyzeDocuments } from './analyzeDocs';
import { createSuggestedPipeline } from './createSuggestedPipeline';
import { editStep } from './editStep';
import { refinePipeline } from './refinePipeline';
import { runPipeline } from './runPipeline';
import { suggestPipeline } from './suggestPipeline';
import { testStep } from './testStep';

export const agentTools = [
  analyzeDocuments,
  suggestPipeline,
  refinePipeline,
  createSuggestedPipeline,
  addNewStep,
  editStep,
  testStep,
  runPipeline,
];
