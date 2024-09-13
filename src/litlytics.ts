import { LLMChatModel, LLMProvider } from 'token.js/dist/chat';
import { runPipeline } from './engine/runPipeline';
import {
  runPrompt,
  RunPromptArgs,
  runPromptFromMessages,
  RunPromptFromMessagesArgs,
} from './engine/runPrompt';
import { runStep, RunStepArgs } from './engine/runStep';
import { runLLMStep, RunLLMStepArgs } from './engine/step/runLLMStep';
import { testPipelineStep } from './engine/testStep';
import { pipelineFromText } from './pipeline/fromText';
import { generatePipeline } from './pipeline/generate';
import { Pipeline, PipelineStatus } from './pipeline/Pipeline';
import { refinePipeline } from './pipeline/refine';
import { generateCodeExplain } from './step/explain';
import { generateStep, GenerateStepArgs } from './step/generate';
import { refineStep } from './step/refine';
import { ProcessingStep } from './step/Step';

export type LLMProviders = LLMProvider | 'local';

export class LitLytics {
  provider?: LLMProviders;
  model?: LLMChatModel;
  #llmKey?: string;

  constructor({
    provider,
    model,
    key,
  }: {
    provider: LLMProviders;
    model: LLMChatModel;
    key: string;
  }) {
    this.provider = provider;
    this.model = model;
    this.#llmKey = key;
  }

  /**
   * Prompt execution
   */

  async runPromptFromMessages({
    messages,
    args,
  }: Pick<RunPromptFromMessagesArgs, 'messages' | 'args'>) {
    if (
      !this.provider?.length ||
      !this.model?.length ||
      !this.#llmKey?.length
    ) {
      throw new Error('No provider, model or key set!');
    }

    return await runPromptFromMessages({
      provider: this.provider,
      key: this.#llmKey,
      model: this.model,
      messages,
      args,
    });
  }

  async runPrompt({
    system,
    user,
    args,
  }: Pick<RunPromptArgs, 'system' | 'user' | 'args'>) {
    if (
      !this.provider?.length ||
      !this.model?.length ||
      !this.#llmKey?.length
    ) {
      throw new Error('No provider, model or key set!');
    }

    return await runPrompt({
      provider: this.provider,
      key: this.#llmKey,
      model: this.model,
      system,
      user,
      args,
    });
  }

  /**
   * Pipeline
   */
  async pipelineFromText(description: string) {
    return await pipelineFromText(this, description);
  }

  async generatePipeline({ description }: { description: string }) {
    return generatePipeline({ litlytics: this, description });
  }

  async refinePipeline({
    refineRequest,
    pipeline,
  }: {
    refineRequest: string;
    pipeline: Pipeline;
  }) {
    return await refinePipeline({
      litlytics: this,
      refineRequest,
      pipeline,
    });
  }

  async runPipeline(
    pipeline: Pipeline,
    onStatus: (status: PipelineStatus) => void
  ) {
    return await runPipeline(this, pipeline, onStatus);
  }

  /**
   * Steps generation
   */
  async generateStep({
    id,
    name,
    description,
    input,
    type,
  }: Omit<GenerateStepArgs, 'litlytics'>) {
    return await generateStep({
      litlytics: this,
      id,
      name,
      description,
      input,
      type,
    });
  }

  async generateCodeExplain({ code }: { code: string }) {
    return await generateCodeExplain({ litlytics: this, code });
  }

  async refineStep({
    refineRequest,
    step,
  }: {
    refineRequest: string;
    step: ProcessingStep;
  }) {
    return await refineStep({
      litlytics: this,
      refineRequest,
      step,
    });
  }

  /**
   * Step execution
   */

  async runStep({
    step,
    source,
    allSteps,
    doc,
    allDocs,
  }: Omit<RunStepArgs, 'litlytics'>) {
    return await runStep({
      litlytics: this,
      step,
      source,
      allSteps,
      doc,
      allDocs,
    });
  }

  async runLLMStep({
    step,
    source,
    allSteps,
    doc,
    allDocs,
  }: Omit<RunLLMStepArgs, 'litlytics'>) {
    return await runLLMStep({
      litlytics: this,
      step,
      source,
      allSteps,
      doc,
      allDocs,
    });
  }

  async testPipelineStep({
    pipeline,
    step,
    docId,
  }: {
    pipeline: Pipeline;
    step: ProcessingStep;
    docId: string;
  }) {
    return await testPipelineStep({
      litlytics: this,
      pipeline,
      step,
      docId,
    });
  }
}
