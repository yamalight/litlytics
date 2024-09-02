import { pipelineAtom } from '@/app/store/store';
import { ProcessingStep, StepInputs } from '@/src/step/Step';
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  CogIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
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
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from '../../catalyst/dropdown';
import { Field, FieldGroup, Label } from '../../catalyst/fieldset';
import { Input } from '../../catalyst/input';
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
        size={data.expanded ? 'xs' : 'collapsed'}
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
            {data.name}
          </div>
          <div className="flex items-center">
            <Dropdown>
              <DropdownButton plain>
                <EllipsisHorizontalIcon />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem onClick={() => setIsOpen(true)}>
                  <CogIcon /> Configure
                </DropdownItem>

                <DropdownDivider />

                <DropdownItem onClick={() => deleteStep()}>
                  <XMarkIcon /> Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </NodeHeader>
        {data.expanded ? (
          <NodeContent>
            <StepTest data={data} />
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
              <Label>Step name</Label>
              <Input
                name="name"
                placeholder="Step name"
                autoFocus
                value={data.name}
                onChange={(e) => updateNode(e, 'name')}
              />
            </Field>
            <Field>
              <Label>Step description</Label>
              <Textarea
                name="description"
                placeholder="Step description"
                value={data.description}
                onChange={(e) => updateNode(e, 'description')}
              />
            </Field>
            <Field>
              <Label>Step type</Label>
              <Select
                name="step-type"
                value={data.type}
                onChange={(e) => updateNode(e, 'type')}
              >
                <option value="llm">LLM</option>
                <option value="code">Code</option>
              </Select>
            </Field>
            <Field>
              <Label>Step input</Label>
              <Select
                name="step-input"
                value={data.input}
                onChange={(e) => updateNode(e, 'input')}
              >
                {Object.keys(StepInputs).map((key) => (
                  <option key={key} value={StepInputs[key as keyof StepInputs]}>
                    {stepInputLabels[StepInputs[key as keyof StepInputs]]}
                  </option>
                ))}
              </Select>
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
