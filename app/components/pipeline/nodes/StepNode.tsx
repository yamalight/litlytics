import { defaultModelName } from '@/src/llm/config';
import { modelCosts } from '@/src/llm/costs';
import { ProcessingStep, StepInputs } from '@/src/step/Step';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CodeBracketIcon,
  CogIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import _ from 'lodash';
import { ChangeEvent, useMemo, useState } from 'react';
import { Badge } from '~/components/catalyst/badge';
import { Button } from '~/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '~/components/catalyst/dialog';
import { Field, FieldGroup, Label } from '~/components/catalyst/fieldset';
import { Input } from '~/components/catalyst/input';
import { RadioH, RadioHGroup } from '~/components/catalyst/radiogroup';
import { Select } from '~/components/catalyst/select';
import { Textarea } from '~/components/catalyst/textarea';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';
import { CodeEditor } from '~/components/step/CodeEditor';
import { StepTest } from '~/components/step/StepTest';
import { stepInputLabels } from '~/components/step/util';
import {
  litlyticsStore,
  pipelineAtom,
  pipelineStatusAtom,
} from '~/store/store';
import { BasicOutputConfig } from '../output/types';
import { NodeContent, NodeFrame, NodeHeader } from './NodeFrame';

export function StepNode({ data }: { data: ProcessingStep }) {
  const status = useAtomValue(pipelineStatusAtom);
  const litlytics = useAtomValue(litlyticsStore);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [refine, setRefine] = useState(``);
  const [loading, setLoading] = useState(false);

  const { averageTiming, averagePrompt, averageCompletion, averageCost } =
    useMemo(() => {
      // const timings = data.
      const cfg = pipeline.output.config as BasicOutputConfig;
      const results = Array.isArray(cfg.results) ? cfg.results : [cfg.results];
      const res = results.filter((doc) => doc);
      if (!res.length) {
        return {};
      }
      const stepRes = res
        .map((doc) =>
          doc.processingResults.filter((res) => res.stepId === data.id)
        )
        .flat();
      if (!stepRes) {
        return {};
      }
      const promptTokens = stepRes.map((res) => res.usage?.prompt_tokens ?? 0);
      const completionTokens = stepRes.map(
        (res) => res.usage?.completion_tokens ?? 0
      );
      const timings = stepRes.map((res) => res.timingMs);
      const averageTiming = _.round(
        timings.reduce((acc, val) => acc + val, 0) / timings.length
      );
      const averagePrompt = _.round(
        promptTokens.reduce((acc, val) => acc + val, 0) / promptTokens.length
      );
      const averageCompletion = _.round(
        completionTokens.reduce((acc, val) => acc + val, 0) /
          completionTokens.length
      );
      const averageCost = _.round(
        averagePrompt * modelCosts[defaultModelName].input +
          averageCompletion * modelCosts[defaultModelName].output,
        3
      );
      return { averageTiming, averagePrompt, averageCompletion, averageCost };
    }, [pipeline.output.config, data]);

  const updateNodeByKey = (
    newVal: string | boolean | undefined,
    prop: keyof ProcessingStep
  ) => {
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

  const doRefine = async () => {
    if (!refine?.length) {
      return;
    }

    setLoading(true);

    // generate plan from LLM
    const newStep = await litlytics.refineStep({
      refineRequest: refine,
      step: data,
    });
    const newSteps = pipeline.steps.map((s) => {
      if (s.id === data.id) {
        return newStep;
      }
      return s;
    });
    setPipeline({
      ...pipeline,
      steps: newSteps,
    });
    setRefine('');

    // save
    setLoading(false);
  };

  return (
    <>
      <NodeFrame
        hasConnector
        currentStep={data}
        size={data.expanded ? 'sm' : 'collapsed'}
        className="pb-1"
        error={
          status.status === 'error' && status.currentStep?.id === data.id
            ? status.error
            : undefined
        }
      >
        <NodeHeader collapsed={!data.expanded}>
          <div className="flex flex-1 gap-2 items-center">
            {status.status === 'step' && status.currentStep?.id === data.id ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <Button
                icon
                className="!p-0"
                onClick={() => updateNodeByKey(!data.expanded, 'expanded')}
              >
                {data.expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </Button>
            )}
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

            <div className="flex flex-1 items-center justify-between">
              <StepTest data={data} />

              <div className="flex items-center justify-center gap-1">
                {Number.isFinite(averageTiming) && (
                  <Badge
                    title="Average time per document (ms)"
                    className="flex items-center"
                  >
                    <ClockIcon className="w-3 h-3" /> {averageTiming}
                  </Badge>
                )}
                {Boolean(averagePrompt) && (
                  <Badge
                    title="Average input / completion tokens"
                    className="flex items-center"
                  >
                    <PencilSquareIcon className="w-3 h-3" />
                    {averagePrompt} / {averageCompletion}
                  </Badge>
                )}
                {Boolean(averageCost) && (
                  <Badge
                    title="Average cost (US cents)"
                    className="flex items-center"
                  >
                    <CurrencyDollarIcon className="w-3 h-3" />
                    {averageCost}
                  </Badge>
                )}
              </div>

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
        <DialogBody className="w-full">
          <FieldGroup>
            <Field>
              <div className="flex gap-1">
                <Textarea
                  rows={2}
                  placeholder="Your request..."
                  disabled={loading}
                  value={refine}
                  onChange={(e) => setRefine(e.target.value)}
                />
                <Button onClick={doRefine} disabled={loading}>
                  {loading && <Spinner className="h-5 w-5" />}
                  Refine
                </Button>
              </div>
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
              <TabGroup>
                <TabList className="flex gap-4">
                  <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                    Code
                  </Tab>
                  <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                    Code explanation
                  </Tab>
                </TabList>
                <TabPanels className="mt-3">
                  <TabPanel className="rounded-xl bg-white/5 p-3">
                    <div className="h-[60vh] min-h-[60vh]">
                      {loading ? (
                        <Spinner />
                      ) : (
                        <CodeEditor code={data.code} onChange={updateCode} />
                      )}
                    </div>
                  </TabPanel>
                  <TabPanel className="rounded-xl bg-white/5 p-3">
                    <div className="prose dark:prose-invert max-w-full">
                      <CustomMarkdown>{data.codeExplanation}</CustomMarkdown>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
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
