import { MLCEngine } from '@mlc-ai/web-llm';
import type { Doc } from './doc/Document';
import { runPipeline } from './engine/runPipeline';
import {
  runPrompt,
  type RunPromptArgs,
  runPromptFromMessages,
  type RunPromptFromMessagesArgs,
} from './engine/runPrompt';
import { runStep, type RunStepArgs } from './engine/runStep';
import { runLLMStep, type RunLLMStepArgs } from './engine/step/runLLMStep';
import { testPipelineStep } from './engine/testStep';
import type { LLMModel, LLMProvider } from './llm/types';
import { OUTPUT_ID } from './output/Output';
import { pipelineFromText } from './pipeline/fromText';
import { generatePipeline } from './pipeline/generate';
import {
  emptyPipeline,
  type Pipeline,
  type PipelineStatus,
} from './pipeline/Pipeline';
import { refinePipeline } from './pipeline/refine';
import { generateCodeExplain } from './step/explain';
import { generateStep, type GenerateStepArgs } from './step/generate';
import { refineStep } from './step/refine';
import { type ProcessingStep } from './step/Step';

// export types and commonly used vars
export type { MLCEngine } from '@mlc-ai/web-llm';
export type { Doc } from './doc/Document';
export { modelCosts } from './llm/costs';
export { localModelSizes } from './llm/sizes';
export {
  LLMModelsList,
  LLMProvidersList,
  type LLMModel,
  type LLMProvider,
} from './llm/types';
export { OUTPUT_ID } from './output/Output';
export type { Pipeline, PipelineStatus } from './pipeline/Pipeline';
export {
  StepInputs,
  type ProcessingStep,
  type ProcessingStepTypes,
  type SourceStep,
  type StepInput,
} from './step/Step';

export type LLMProviders = LLMProvider | 'local';

export interface LitLyticsConfig {
  // model config
  provider?: LLMProviders;
  model?: LLMModel;
  llmKey?: string;
  // pipeline
  pipeline?: Pipeline;
}

export class LitLytics {
  // model config
  private _provider?: LLMProviders;
  private _model?: LLMModel;
  #llmKey?: string;
  // local LLM engine
  private _engine?: MLCEngine;

  // pipeline
  private _pipeline: Pipeline = emptyPipeline;
  private _pipelineStatus: PipelineStatus = {
    status: 'init',
  };

  constructor({
    provider,
    model,
    key,
    engine,
  }: {
    provider: LLMProviders;
    model: LLMModel;
    key: string;
    engine?: MLCEngine;
  }) {
    this._provider = provider;
    this._model = model;
    this.#llmKey = key;
    this._engine = engine;
  }

  /**
   * Config management
   */
  public get config(): LitLyticsConfig {
    return {
      // model config
      provider: this._provider,
      model: this._model,
      // pipeline
      pipeline: this._pipeline,
    };
  }

  exportConfig = (): LitLyticsConfig => {
    return {
      // model config
      provider: this._provider,
      model: this._model,
      llmKey: this.#llmKey,
      // pipeline
      pipeline: this._pipeline,
    };
  };

  importConfig = (config: LitLyticsConfig) => {
    this._provider = config.provider;
    this._model = config.model;
    this.#llmKey = config.llmKey;
    this._pipeline = config.pipeline ?? this._pipeline ?? emptyPipeline;
  };

  getEngine = (): MLCEngine | undefined => {
    return this._engine;
  };

  setWebEngine = (engine?: MLCEngine) => {
    this._engine = engine;
  };

  /**
   * Pipeline management
   */
  public get pipeline(): Pipeline {
    return this._pipeline;
  }

  setPipeline = (newPipeline: Partial<Pipeline>) => {
    this._pipeline = {
      ...this._pipeline,
      ...newPipeline,
    };
  };

  resetPipeline = () => {
    this._pipeline = emptyPipeline;
    this._pipelineStatus = { status: 'init' };
  };

  /**
   * Pipeline status
   */
  public get pipelineStatus(): PipelineStatus {
    return this._pipelineStatus;
  }

  setPipelineStatus = (status: PipelineStatus) => {
    this._pipelineStatus = {
      ...this._pipelineStatus,
      ...status,
    };
  };

  /**
   * Document management
   */
  public get docs(): Doc[] {
    return this._pipeline.source.docs;
  }

  setDocs = (docs: Doc[]) => {
    // update docs
    return this.setPipeline({
      source: {
        ...this.pipeline.source,
        docs,
      },
    });
  };

  /**
   * Prompt execution
   */

  runPromptFromMessages = async ({
    messages,
    args,
  }: Pick<RunPromptFromMessagesArgs, 'messages' | 'args'>) => {
    if (
      !this._provider?.length ||
      !this._model?.length ||
      (!this.#llmKey?.length && this._provider !== 'local')
    ) {
      throw new Error('No provider, model or key set!');
    }

    return await runPromptFromMessages({
      provider: this._provider,
      key: this.#llmKey ?? 'local',
      model: this._model,
      engine: this._engine,
      messages,
      args,
    });
  };

  runPrompt = async ({
    system,
    user,
    args,
  }: Pick<RunPromptArgs, 'system' | 'user' | 'args'>) => {
    if (
      !this._provider?.length ||
      !this._model?.length ||
      (!this.#llmKey?.length && this._provider !== 'local')
    ) {
      throw new Error('No provider, model or key set!');
    }

    return await runPrompt({
      provider: this._provider,
      key: this.#llmKey ?? 'local',
      model: this._model,
      engine: this._engine,
      system,
      user,
      args,
    });
  };

  /**
   * Pipeline
   */
  pipelineFromText = async (
    onStatus: ({
      step,
      totalSteps,
    }: {
      step: number;
      totalSteps: number;
    }) => void
  ) => {
    if (!this.pipeline.pipelinePlan) {
      return;
    }

    this.setPipelineStatus({ status: 'sourcing' });
    const newSteps = await pipelineFromText(
      this,
      this.pipeline.pipelinePlan,
      onStatus
    );

    // assign output to last step
    newSteps.at(-1)!.connectsTo = [OUTPUT_ID];

    // save
    this.setPipeline({
      // assign input to first step
      source: {
        ...this.pipeline.source,
        connectsTo: [newSteps.at(0)!.id],
      },
      // assign steps
      steps: newSteps,
    });

    this.setPipelineStatus({ status: 'done' });
  };

  generatePipeline = async () => {
    if (!this.pipeline.pipelineDescription?.length) {
      return;
    }

    const plan = await generatePipeline({
      litlytics: this,
      description: this.pipeline.pipelineDescription,
    });

    this.setPipeline({
      pipelinePlan: plan ?? '',
    });

    return this.pipeline;
  };

  refinePipeline = async ({ refineRequest }: { refineRequest: string }) => {
    const plan = await refinePipeline({
      litlytics: this,
      refineRequest,
      pipeline: this.pipeline,
    });
    this.setPipeline({
      ...this.pipeline,
      pipelinePlan: plan ?? '',
    });
  };

  runPipeline = async ({
    onStatus,
  }: {
    onStatus?: (status: PipelineStatus) => void;
  } = {}) => {
    const setStatus = (status: PipelineStatus) => {
      this.setPipelineStatus(status);
      onStatus?.(this.pipelineStatus);
    };
    try {
      setStatus({ status: 'init' });
      const newPipeline = await runPipeline(this, setStatus);
      this.setPipeline(newPipeline);
      return newPipeline;
    } catch (err) {
      setStatus({ status: 'error', error: err as Error });
    }
  };

  /**
   * Steps generation
   */
  generateStep = async ({
    id,
    name,
    description,
    input,
    type,
  }: Omit<GenerateStepArgs, 'litlytics'>) => {
    return await generateStep({
      litlytics: this,
      id,
      name,
      description,
      input,
      type,
    });
  };

  generateCodeExplain = async ({ code }: { code: string }) => {
    return await generateCodeExplain({ litlytics: this, code });
  };

  refineStep = async ({
    refineRequest,
    step,
  }: {
    refineRequest: string;
    step: ProcessingStep;
  }) => {
    return await refineStep({
      litlytics: this,
      refineRequest,
      step,
    });
  };

  /**
   * Step execution
   */

  runStep = async ({
    step,
    source,
    allSteps,
    doc,
    allDocs,
  }: Omit<RunStepArgs, 'litlytics'>) => {
    return await runStep({
      litlytics: this,
      step,
      source,
      allSteps,
      doc,
      allDocs,
    });
  };

  runLLMStep = async ({
    step,
    source,
    allSteps,
    doc,
    allDocs,
  }: Omit<RunLLMStepArgs, 'litlytics'>) => {
    return await runLLMStep({
      litlytics: this,
      step,
      source,
      allSteps,
      doc,
      allDocs,
    });
  };

  testPipelineStep = async ({
    step,
    docId,
  }: {
    step: ProcessingStep;
    docId: string;
  }) => {
    return await testPipelineStep({
      litlytics: this,
      pipeline: this.pipeline,
      step,
      docId,
    });
  };
}
