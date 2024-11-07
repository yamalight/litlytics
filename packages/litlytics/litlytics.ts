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
import type { LLMArgs, LLMModel, LLMProvider } from './llm/types';
import { OUTPUT_ID } from './output/Output';
import {
  pipelineFromText,
  type PipelineFromTextStatus,
} from './pipeline/fromText';
import { generatePipeline } from './pipeline/generate';
import {
  emptyPipeline,
  type Pipeline,
  type PipelineStatus,
} from './pipeline/Pipeline';
import { refinePipeline } from './pipeline/refine';
import { suggestTasks } from './pipeline/suggestTasks';
import { generateCodeExplain } from './step/explain';
import { generateStep, type GenerateStepArgs } from './step/generate';
import { refineStep } from './step/refine';
import {
  type ProcessingStep,
  type SourceStep,
  type StepInput,
} from './step/Step';

// export types and commonly used vars
export { tool } from 'ai';
export type { Doc } from './doc/Document';
export { modelCosts } from './llm/costs';
export {
  LLMModelsList,
  LLMProvidersList,
  type LLMArgs,
  type LLMModel,
  type LLMProvider,
} from './llm/types';
export { OUTPUT_ID } from './output/Output';
export {
  emptyPipeline,
  type Pipeline,
  type PipelineStatus,
} from './pipeline/Pipeline';
export {
  StepInputs,
  type ProcessingStep,
  type ProcessingStepTypes,
  type SourceStep,
  type StepInput,
} from './step/Step';

export type LLMProviders = LLMProvider;

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
  provider?: LLMProviders;
  model?: LLMModel;
  llmArgs?: LLMArgs;
  #llmKey?: string;

  // pipeline
  pipeline: Pipeline = emptyPipeline;
  pipelineStatus: PipelineStatus = {
    status: 'init',
  };

  constructor({
    provider,
    model,
    key,
    llmArgs,
  }: {
    provider: LLMProviders;
    model: LLMModel;
    key: string;
    llmArgs?: LLMArgs;
  }) {
    this.provider = provider;
    this.model = model;
    this.#llmKey = key;
    this.llmArgs = llmArgs;
  }

  /**
   * Config management
   */
  exportConfig = (): LitLyticsConfig => {
    return {
      // model config
      provider: this.provider,
      model: this.model,
      llmKey: this.#llmKey,
      // pipeline
      pipeline: this.pipeline,
    };
  };

  importConfig = (config: LitLyticsConfig) => {
    this.provider = config.provider;
    this.model = config.model;
    this.#llmKey = config.llmKey;
    this.pipeline = config.pipeline ?? this.pipeline ?? emptyPipeline;
  };

  /**
   * Pipeline management
   */
  setPipeline = (newPipeline: Partial<Pipeline>) => {
    this.pipeline = {
      ...this.pipeline,
      ...newPipeline,
    };
    return this.pipeline;
  };

  resetPipeline = () => {
    this.pipeline = structuredClone(emptyPipeline);
    this.pipelineStatus = { status: 'init' };
    return this.pipeline;
  };

  /**
   * Pipeline status
   */
  setPipelineStatus = (status: PipelineStatus) => {
    this.pipelineStatus = {
      ...this.pipelineStatus,
      ...status,
    };
    return this.pipelineStatus;
  };

  /**
   * Document management
   */
  public get docs(): Doc[] {
    return this.pipeline.source.docs;
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
      args: {
        ...args,
        ...this.llmArgs,
      },
    });
  };

  runPrompt = async ({
    system,
    user,
    args,
  }: Pick<RunPromptArgs, 'system' | 'user' | 'args'>) => {
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
      args: {
        ...args,
        ...this.llmArgs,
      },
    });
  };

  /**
   * Pipeline
   */
  pipelineFromText = async (
    onStatus: ({ step, totalSteps }: PipelineFromTextStatus) => void
  ) => {
    if (!this.pipeline.pipelinePlan) {
      return this.pipeline;
    }

    const newSteps = await pipelineFromText(
      this,
      this.pipeline.pipelinePlan,
      onStatus
    );

    // assign output to last step
    newSteps.at(-1)!.connectsTo = [OUTPUT_ID];

    // save
    return this.setPipeline({
      // assign input to first step
      source: {
        ...this.pipeline.source,
        connectsTo: [newSteps.at(0)!.id],
      },
      // assign steps
      steps: newSteps,
    });
  };

  generatePipeline = async () => {
    if (!this.pipeline.pipelineDescription?.length) {
      return this.pipeline;
    }

    const plan = await generatePipeline({
      litlytics: this,
      description: this.pipeline.pipelineDescription,
    });

    return this.setPipeline({
      pipelinePlan: plan ?? '',
    });
  };

  suggestTasks = async () => {
    if (!this.pipeline.source?.docs?.length) {
      return this.pipeline;
    }

    // do not run suggestion if the tasks are already generated
    if (this.pipeline.pipelineTasks?.length) {
      return this.pipeline;
    }

    const res = await suggestTasks({
      litlytics: this,
      pipeline: this.pipeline,
    });

    const newDocs = this.pipeline.source.docs.map((d) => {
      // try to find updated doc
      const upDoc = res.docs.find((newD) => newD.id === d.id);
      // if exists - return it
      if (upDoc) {
        return upDoc;
      }
      // otherwise - use original
      return d;
    });
    // update docs
    this.setDocs(newDocs);

    // update pipeline tasks
    return this.setPipeline({
      pipelineTasks: res.tasks,
    });
  };

  refinePipeline = async ({ refineRequest }: { refineRequest: string }) => {
    const plan = await refinePipeline({
      litlytics: this,
      refineRequest,
      pipeline: this.pipeline,
    });
    return this.setPipeline({
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
    setStatus({ status: 'init' });
    const newPipeline = await runPipeline(this, setStatus);
    return this.setPipeline(newPipeline);
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

  addStep = async ({
    step,
    sourceStep,
    manual,
  }: {
    step: ProcessingStep;
    sourceStep?: SourceStep | ProcessingStep;
    manual?: boolean;
  }) => {
    // generate new ID and double-check that it doesn't overlap with other steps
    let id = this.pipeline.steps.length;
    let existingStep = this.pipeline.steps.find((s) => s.id === `step_${id}`);
    while (existingStep) {
      id += 1;
      existingStep = this.pipeline.steps.find((s) => s.id === `step_${id}`);
    }
    // generate final id
    const idStr = `step_${id}`;

    let newStep: ProcessingStep | undefined = undefined;
    if (manual) {
      newStep = structuredClone(step);
      newStep.id = idStr;
    } else {
      // generate new step
      newStep = await this.generateStep({
        id: idStr,
        name: step.name,
        description: step.description,
        input: step.input as StepInput,
        type: step.type,
      });
    }

    if (sourceStep?.type === 'source') {
      // connect new step to next node
      const nextNodeId = this.pipeline.source.connectsTo.at(0) ?? OUTPUT_ID;
      newStep.connectsTo = [nextNodeId];
      // add
      return this.setPipeline({
        source: {
          ...this.pipeline.source,
          connectsTo: [newStep.id],
        },
        steps: this.pipeline.steps.concat(newStep),
      });
    }

    // connect new step to next node
    const nextNodeId =
      this.pipeline.steps
        .find((s) => s.id === sourceStep?.id)
        ?.connectsTo.at(0) ?? OUTPUT_ID;
    newStep.connectsTo = [nextNodeId];
    // add
    return this.setPipeline({
      steps: this.pipeline.steps
        .map((s) => {
          if (s.id === sourceStep?.id) {
            s.connectsTo = [newStep.id];
            return s;
          }
          return s;
        })
        .concat(newStep),
    });
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
