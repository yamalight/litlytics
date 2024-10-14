import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  CogIcon,
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  PlayIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { modelCosts } from 'litlytics';
import _ from 'lodash';
import { useMemo, useState } from 'react';
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
import { CentIcon } from '~/components/ui/CentIcon';
import { useLitlytics } from '~/store/WithLitLytics';
import { NodeContent, NodeFrame, NodeHeader } from '../NodeFrame';
import { BasicOutputRender } from './BasicOutput';
import { OutputType, OutputTypes } from './types';

export function OutputNode() {
  const litlytics = useLitlytics();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [outputType, setOutputType] = useState<OutputType>('basic');

  const results = useMemo(
    () => litlytics.pipeline.results,
    [litlytics.pipeline]
  );

  const { timing, prompt, completion, cost } = useMemo(() => {
    // const timings = data.
    const results = litlytics.pipeline.resultDocs ?? [];
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
    const inputCost =
      litlytics.config.provider === 'ollama'
        ? 0
        : modelCosts[litlytics.config.model!].input;
    const outputCost =
      litlytics.config.provider === 'ollama'
        ? 0
        : modelCosts[litlytics.config.model!].output;
    const cost = _.round(prompt * inputCost + completion * outputCost, 3);
    return { timing, prompt, completion, cost };
  }, [litlytics]);

  const doRunPipeline = async () => {
    await litlytics.runPipeline({
      // very hacky, but will trigger UI re-renders
      // while setting status internally won't because proxy doesn't see those triggers
      onStatus: (status) => {
        litlytics.setPipelineStatus(status);
      },
    });

    // write final status to update on end
    litlytics.setPipelineStatus({ status: 'done' });
  };

  const running =
    litlytics.pipelineStatus.status === 'sourcing' ||
    litlytics.pipelineStatus.status === 'step';

  return (
    <>
      {/* Output node render */}
      <NodeFrame size={expanded ? (results ? 'xl' : 'lg') : 'collapsed'}>
        <NodeHeader collapsed={!expanded}>
          <div className="flex flex-1 gap-2 items-center">
            <Button
              icon
              className="!p-0"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
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
            {litlytics.pipelineStatus.status === 'done' && (
              <div
                className="flex flex-1 justify-end"
                title="Successfully finished!"
              >
                <CheckIcon color="green" className="w-5 h-5" />
              </div>
            )}
            {litlytics.pipelineStatus.status === 'error' && (
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
        {expanded ? (
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
                  <CentIcon className="w-3 h-3" />
                  {cost}
                </Badge>
              )}
            </div>
            <BasicOutputRender pipeline={litlytics.pipeline} />
          </NodeContent>
        ) : (
          <></>
        )}
      </NodeFrame>

      {/* Output config */}
      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Configure output</DialogTitle>
        <DialogDescription>
          Configure parameters for output node
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Output type</Label>
              <Select
                name="output-type"
                value={outputType}
                onChange={(e) => setOutputType(e.target.value as OutputType)}
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
