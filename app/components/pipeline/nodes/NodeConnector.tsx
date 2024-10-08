import { PlusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import {
  ProcessingStep,
  ProcessingStepTypes,
  SourceStep,
  StepInput,
  StepInputs,
} from 'litlytics';
import { useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { Checkbox } from '~/components/catalyst/checkbox';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '~/components/catalyst/dialog';
import { Field, FieldGroup, Label } from '~/components/catalyst/fieldset';
import { Input } from '~/components/catalyst/input';
import { Select } from '~/components/catalyst/select';
import { Textarea } from '~/components/catalyst/textarea';
import { Spinner } from '~/components/Spinner';
import { CodeEditor } from '~/components/step/CodeEditor';
import { stepInputLabels } from '~/components/step/util';
import { litlyticsStore, pipelineAtom } from '~/store/store';
import GeneratePipeline from '../GeneratePipeline';

const defaultStep: ProcessingStep = {
  id: '',
  name: '',
  description: '',
  input: 'doc',
  type: 'llm',
  connectsTo: [],
  code: '',
  prompt: '',
  expanded: true,
};

export function NodeConnector({
  currentStep,
  showAuto,
}: {
  currentStep?: SourceStep | ProcessingStep;
  showAuto?: boolean;
}) {
  const litlytics = useAtomValue(litlyticsStore);
  const [step, setStep] = useState<ProcessingStep>(
    structuredClone(defaultStep)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manual, setManual] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const showAddStep = () => {
    setStep(structuredClone(defaultStep));
    setIsOpen(true);
  };

  const createStep = async () => {
    if (!step.name?.length || !step.description?.length) {
      return;
    }

    setLoading(true);
    // generate new ID and double-check that it doesn't overlap with other steps
    let id = pipeline.steps.length;
    let existingStep = pipeline.steps.find((s) => s.id === `step_${id}`);
    while (existingStep) {
      id += 1;
      existingStep = pipeline.steps.find((s) => s.id === `step_${id}`);
    }
    // generate final id
    const idStr = `step_${id}`;

    let newStep: ProcessingStep | undefined = undefined;
    if (manual) {
      newStep = structuredClone(step);
      newStep.id = idStr;
    } else {
      // generate new step
      newStep = await litlytics.generateStep({
        id: idStr,
        name: step.name,
        description: step.description,
        input: step.input as StepInput,
        type: step.type,
      });
    }

    if (currentStep?.type === 'source') {
      // connect new step to next node
      const nextNodeId = pipeline.source.connectsTo.at(0) ?? pipeline.output.id;
      newStep.connectsTo = [nextNodeId];
      // add
      setPipeline({
        ...pipeline,
        source: {
          ...pipeline.source,
          connectsTo: [newStep.id],
        },
        steps: pipeline.steps.concat(newStep),
      });
    } else {
      // connect new step to next node
      const nextNodeId =
        pipeline.steps
          .find((s) => s.id === currentStep?.id)
          ?.connectsTo.at(0) ?? pipeline.output.id;
      newStep.connectsTo = [nextNodeId];
      // add
      setPipeline({
        ...pipeline,
        steps: pipeline.steps
          .map((s) => {
            if (s.id === currentStep?.id) {
              s.connectsTo = [newStep.id];
              return s;
            }
            return s;
          })
          .concat(newStep),
      });
    }

    setIsOpen(false);
    setLoading(false);
  };

  return (
    <>
      <div
        className={clsx(
          // container
          'flex flex-col items-center',
          // positioning
          '-mt-3'
        )}
      >
        <Button
          icon
          className={clsx(
            // icon colors,
            '![--btn-icon:theme(colors.sky.500)] !dark:[--btn-icon:theme(colors.sky.500)] !dark:data-[active]:[--btn-icon:theme(colors.sky.400)] !dark:data-[hover]:[--btn-icon:theme(colors.sky.400)]',
            // rounded border
            'border !border-sky-400 rounded-3xl',
            // margins
            'mb-1 mt-1'
          )}
          onClick={showAddStep}
        >
          <PlusIcon className="stroke-sky-500" />
        </Button>

        {/* Line down */}
        {showAuto ? (
          <>
            <div className="w-px h-3 min-h-3 bg-sky-500 -mt-1"></div>
            <GeneratePipeline />
            <div className="w-px h-4 min-h-4 bg-sky-500 -mb-2"></div>
          </>
        ) : (
          <div className="w-px h-4 min-h-4 bg-sky-500 -mt-1 -mb-2"></div>
        )}

        {/* Arrow down */}
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 min-w-4 min-h-4 text-sky-500 -mb-0.5"
        >
          <path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path>
        </svg>
      </div>

      <Dialog open={isOpen} onClose={setIsOpen} size="3xl" topClassName="z-20">
        <DialogTitle>Add processing step</DialogTitle>
        <DialogDescription>
          Add new processing step to project
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Step type</Label>
              <Select
                aria-label="Step type"
                name="type"
                value={step.type}
                onChange={(e) =>
                  setStep((s) => ({
                    ...s,
                    type: e.target.value as ProcessingStepTypes,
                  }))
                }
              >
                <option value="llm">LLM</option>
                <option value="code">Code</option>
              </Select>
            </Field>
            <Field>
              <Label>Step name</Label>
              <Input
                name="content"
                placeholder="Step name"
                autoFocus
                value={step.name}
                onChange={(e) =>
                  setStep((s) => ({ ...s, name: e.target.value }))
                }
              />
            </Field>
            <Field>
              <Label>Step description</Label>
              <Textarea
                name="content"
                placeholder="Step description"
                value={step.description}
                onChange={(e) =>
                  setStep((s) => ({ ...s, description: e.target.value }))
                }
              />
            </Field>
            <Field>
              <Label>Step input</Label>
              <Select
                name="step-input"
                value={step.input}
                onChange={(e) =>
                  setStep((s) => ({ ...s, input: e.target.value as StepInput }))
                }
              >
                {Object.keys(StepInputs).map((key) => (
                  <option key={key} value={StepInputs[key as keyof StepInputs]}>
                    {stepInputLabels[StepInputs[key as keyof StepInputs]]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field className="flex items-center gap-1">
              <Checkbox
                name="step-manual"
                checked={manual}
                onChange={(e) => setManual(e)}
              ></Checkbox>
              <Label>Manual creation</Label>
            </Field>
            {manual && step.type === 'llm' && (
              <Field>
                <Label>Prompt</Label>
                <Textarea
                  name="step-prompt"
                  value={step.prompt}
                  onChange={(e) =>
                    setStep((s) => ({ ...s, prompt: e.target.value }))
                  }
                />
              </Field>
            )}
            {manual && step.type === 'code' && (
              <Field>
                <Label>Step code</Label>
                <div className="h-[60vh] min-h-[60vh]">
                  <CodeEditor
                    code={step.code}
                    onChange={(newCode) =>
                      setStep((s) => ({ ...s, code: newCode }))
                    }
                  />
                </div>
              </Field>
            )}
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          {loading && (
            <div className="flex flex-1">
              <Spinner />
            </div>
          )}
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={createStep}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
