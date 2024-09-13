import { defaultModelName } from '@/src/llm/config';
import { modelCosts } from '@/src/llm/costs';
import { OutputType, OutputTypes } from '@/src/output/Output';
import { OutputStep } from '@/src/step/Step';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CogIcon,
  CurrencyDollarIcon,
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  PlayIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { useAtom, useAtomValue } from 'jotai';
import _ from 'lodash';
import { ChangeEvent, useMemo, useState } from 'react';
import { Badge } from '~/components/catalyst/badge';
import { Button } from '~/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '~/components/catalyst/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '~/components/catalyst/dropdown';
import { Field, FieldGroup, Label } from '~/components/catalyst/fieldset';
import { Select } from '~/components/catalyst/select';
import { Spinner } from '~/components/Spinner';
import {
  litlyticsStore,
  pipelineAtom,
  pipelineStatusAtom,
} from '~/store/store';
import { BasicOutput } from '../output/basic/Basic';
import { BasicOutputConfig, OutputRender } from '../output/types';
import { NodeContent, NodeFrame, NodeHeader } from './NodeFrame';

const OUTPUT_RENDERERS: Partial<Record<OutputType, OutputRender>> = {
  [OutputTypes.BASIC]: BasicOutput,
};

export function OutputNode() {
  const litlytics = useAtomValue(litlyticsStore);
  const [isOpen, setIsOpen] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [status, setStatus] = useAtom(pipelineStatusAtom);

  const data = useMemo(() => pipeline.output, [pipeline]);

  const { timing, prompt, completion, cost } = useMemo(() => {
    // const timings = data.
    const cfg = data.config as BasicOutputConfig;
    const results = Array.isArray(cfg.results) ? cfg.results : [cfg.results];
    const res = results.filter((doc) => doc);
    if (!res.length) {
      return {};
    }
    const stepRes = res.map((doc) => doc.processingResults).flat();
    if (!stepRes) {
      return {};
    }
    const promptTokens = stepRes.map((res) => res.usage?.promptTokens ?? 0);
    const completionTokens = stepRes.map(
      (res) => res.usage?.completionTokens ?? 0
    );
    const timings = stepRes.map((res) => res.timingMs);
    const timing = _.round(timings.reduce((acc, val) => acc + val, 0));
    const prompt = promptTokens.reduce((acc, val) => acc + val, 0);
    const completion = completionTokens.reduce((acc, val) => acc + val, 0);
    const cost = _.round(
      prompt * modelCosts[defaultModelName].input +
        completion * modelCosts[defaultModelName].output,
      3
    );
    return { timing, prompt, completion, cost };
  }, [data]);

  const Render = useMemo(() => {
    if (!data) {
      return;
    }
    return OUTPUT_RENDERERS[data.outputType];
  }, [data]);

  const updateNodeByKey = (
    newVal: string | boolean | undefined,
    prop: keyof OutputStep
  ) => {
    const newData = structuredClone(data!);
    newData[prop] = newVal;

    setPipeline({
      ...pipeline,
      output: newData,
    });
  };

  const updateNode = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: keyof OutputStep
  ) => {
    const newVal = e.target.value;
    updateNodeByKey(newVal, prop);
  };

  const doRunPipeline = async () => {
    setStatus((s) => ({ ...s, status: 'init' }));
    try {
      const newPipeline = await litlytics.runPipeline(pipeline, setStatus);
      console.log(newPipeline);
      setPipeline(structuredClone(newPipeline));
    } catch (err) {
      setStatus((s) => ({ ...s, status: 'error', error: err as Error }));
    }
  };

  const running = status.status === 'sourcing' || status.status === 'step';

  if (!data) {
    return <></>;
  }

  return (
    <>
      {/* Output node render */}
      <NodeFrame
        size={
          data.expanded
            ? (data.config as BasicOutputConfig).results
              ? 'xl'
              : 'lg'
            : 'collapsed'
        }
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
            <RectangleStackIcon className="w-4 h-4" /> Output
            <Button
              plain
              title="Run pipeline"
              onClick={doRunPipeline}
              disabled={running}
            >
              {running ? (
                <Spinner className="h-3 w-3 border-2" />
              ) : (
                <PlayIcon aria-hidden="true" className="h-5 w-5" />
              )}
            </Button>
            {status.status === 'done' && (
              <div
                className="flex flex-1 justify-end"
                title="Successfully finished!"
              >
                <CheckIcon color="green" className="w-5 h-5" />
              </div>
            )}
            {status.status === 'error' && (
              <div
                className="flex flex-1 justify-end"
                title="Error during execution!"
              >
                <ExclamationCircleIcon color="red" className="w-5 h-5" />
              </div>
            )}
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
              </DropdownMenu>
            </Dropdown>
          </div>
        </NodeHeader>
        {data.expanded ? (
          <NodeContent className="flex flex-col relative h-[calc(100%-2rem)]">
            <div className="flex items-center justify-center gap-1 my-1">
              {Number.isFinite(timing) && (
                <Badge
                  title="Total execution time (ms)"
                  className="flex items-center"
                >
                  <ClockIcon className="w-3 h-3" /> {timing}
                </Badge>
              )}
              {Boolean(prompt) && (
                <Badge
                  title="Total input / completion tokens"
                  className="flex items-center"
                >
                  <PencilSquareIcon className="w-3 h-3" />
                  {prompt} / {completion}
                </Badge>
              )}
              {Boolean(cost) && (
                <Badge
                  title="Total cost (US cents)"
                  className="flex items-center"
                >
                  <CurrencyDollarIcon className="w-3 h-3" />
                  {cost}
                </Badge>
              )}
            </div>
            {Render && <Render data={data} />}
          </NodeContent>
        ) : (
          <></>
        )}
      </NodeFrame>

      {/* Output config */}
      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Configure {data.name}</DialogTitle>
        <DialogDescription>
          Configure parameters for output node: {data.name}
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Output type</Label>
              <Select
                name="output-type"
                value={data.outputType as string}
                onChange={(e) => updateNode(e, 'outputType')}
              >
                {Object.keys(OutputTypes).map((type) => (
                  <option
                    key={type}
                    value={OutputTypes[type as keyof OutputTypes]}
                  >
                    {OutputTypes[type as keyof OutputTypes]}
                  </option>
                ))}
              </Select>
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
