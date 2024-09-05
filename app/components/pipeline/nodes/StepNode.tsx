import { pipelineAtom } from '@/app/store/store';
import { ProcessingStep, StepInputs } from '@/src/step/Step';
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  CogIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { ChangeEvent, useState } from 'react';
import { Button } from '../../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../../catalyst/dialog';
import { Field, FieldGroup, Label } from '../../catalyst/fieldset';
import { Input } from '../../catalyst/input';
import { RadioH, RadioHGroup } from '../../catalyst/radiogroup';
import { Select } from '../../catalyst/select';
import { Textarea } from '../../catalyst/textarea';
import { CodeEditor } from '../../step/CodeEditor';
import { StepTest } from '../../step/StepTest';
import { stepInputLabels } from '../../step/util';
import { NodeContent, NodeFrame, NodeHeader } from './NodeFrame';

export function StepNode({ data }: { data: ProcessingStep }) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isOpen, setIsOpen] = useState(false);

  const updateNodeByKey = (newVal: any, prop: keyof ProcessingStep) => {
    const newData = structuredClone(data);
    newData[prop] = newVal;

    const newSteps = pipeline.steps.map((s) => {
      if (s.id === newData.id) {
        return newData;
      }
      return s;
    });
    setPipeline({
      ...pipeline,
      steps: newSteps,
    });
  };

  const updateNode = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: keyof ProcessingStep
  ) => {
    const newVal = e.target.value;
    updateNodeByKey(newVal, prop);
  };

  const updateCode = (newCode?: string) => {
    if (!newCode) {
      return;
    }

    const newData = structuredClone(data);
    newData.code = newCode;

    const newSteps = pipeline.steps.map((s) => {
      if (s.id === newData.id) {
        return newData;
      }
      return s;
    });
    setPipeline({
      ...pipeline,
      steps: newSteps,
    });
  };

  const deleteStep = () => {
    const newSteps = pipeline.steps.filter((s) => s.id !== data.id);
    setPipeline({
      ...pipeline,
      steps: newSteps,
    });
  };

  return (
    <>
      <NodeFrame
        hasConnector
        currentStep={data}
        size={data.expanded ? 'sm' : 'collapsed'}
        className="pb-1"
      >
        <NodeHeader collapsed={!data.expanded}>
          <div className="flex flex-1 gap-2 items-center">
            <Button
              icon
              className="!p-0"
              onClick={() => updateNodeByKey(!data.expanded, 'expanded')}
            >
              {data.expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </Button>
            {data.type === 'llm' ? (
              <ChatBubbleBottomCenterIcon className="w-4 h-4" />
            ) : (
              <CodeBracketIcon className="w-4 h-4" />
            )}{' '}
            <Input
              value={data.name}
              onChange={(e) => updateNode(e, 'name')}
              className={clsx(
                '!bg-transparent !dark:bg-transparent',
                'border-none'
              )}
            />
          </div>
          <div className="flex items-center">
            <Button plain onClick={() => deleteStep()} title="Delete step">
              <XMarkIcon />
            </Button>
          </div>
        </NodeHeader>
        {data.expanded ? (
          <NodeContent className="flex-col pb-0 pt-0 mt-0 gap-2">
            <div className="flex justify-between gap-3">
              <Field className="flex items-baseline justify-start gap-2 [&>[data-slot=label]+[data-slot=control]]:mt-0">
                <Label className="w-10">Input:</Label>
                <Select
                  name="step-input"
                  value={data.input}
                  onChange={(e) => updateNode(e, 'input')}
                >
                  {Object.keys(StepInputs).map((key) => (
                    <option
                      key={key}
                      value={StepInputs[key as keyof StepInputs]}
                    >
                      {stepInputLabels[StepInputs[key as keyof StepInputs]]}
                    </option>
                  ))}
                </Select>
              </Field>

              <RadioH className="mx-2">
                <RadioHGroup
                  options={[
                    {
                      value: 'llm',
                      label: 'LLM',
                    },
                    {
                      value: 'code',
                      label: 'Code',
                    },
                  ]}
                  value={data.type}
                  onChange={(newVal) => updateNodeByKey(newVal, 'type')}
                />
              </RadioH>
            </div>

            <div className="flex flex-1 items-end justify-between">
              <StepTest data={data} />
              <Button
                plain
                onClick={() => setIsOpen(true)}
                title="Configure step"
              >
                <CogIcon />
              </Button>
            </div>
          </NodeContent>
        ) : (
          <></>
        )}
      </NodeFrame>

      {/* Edit step */}
      <Dialog size="3xl" open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Step: {data.name}</DialogTitle>
        <DialogDescription>Config for {data.name}.</DialogDescription>
        <DialogBody className="w-full">
          <FieldGroup>
            <Field>
              <Label>Step description</Label>
              <Textarea
                name="description"
                placeholder="Step description"
                value={data.description}
                onChange={(e) => updateNode(e, 'description')}
              />
            </Field>
            {data.type === 'llm' ? (
              <Field>
                <Label>Step prompt</Label>
                <Textarea
                  rows={5}
                  name="prompt"
                  placeholder="Step prompt"
                  value={data.prompt}
                  onChange={(e) => updateNode(e, 'prompt')}
                />
              </Field>
            ) : (
              <Field>
                <Label>Step code</Label>
                <div className="h-[60vh] min-h-[60vh]">
                  <CodeEditor code={data.code} onChange={updateCode} />
                </div>
              </Field>
            )}
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
