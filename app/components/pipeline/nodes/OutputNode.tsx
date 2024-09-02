import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/app/components/catalyst/dropdown';
import { isRunningAtom, pipelineAtom } from '@/app/store/store';
import { runPipeline } from '@/src/engine/runPipeline';
import { OutputType, OutputTypes } from '@/src/output/Output';
import { OutputStep } from '@/src/step/Step';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  EllipsisHorizontalIcon,
  PlayIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { ChangeEvent, useMemo, useState } from 'react';
import { Button } from '../../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../../catalyst/dialog';
import { Field, FieldGroup, Label } from '../../catalyst/fieldset';
import { Select } from '../../catalyst/select';
import { Spinner } from '../../Spinner';
import { BasicOutput } from '../output/basic/Basic';
import { OutputRender } from '../output/types';
import { NodeContent, NodeFrame, NodeHeader } from './NodeFrame';

const OUTPUT_RENDERERS: Partial<Record<OutputType, OutputRender>> = {
  [OutputTypes.BASIC]: BasicOutput,
};

export function OutputNode() {
  const [isOpen, setIsOpen] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isRunning, setIsRunning] = useAtom(isRunningAtom);

  const data = useMemo(() => pipeline.output, [pipeline]);
  const Render = useMemo(() => {
    if (!data) {
      return;
    }
    return OUTPUT_RENDERERS[data.outputType];
  }, [data]);

  const updateNodeByKey = (newVal: any, prop: keyof OutputStep) => {
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
    setIsRunning(true);
    const newPipeline = await runPipeline(pipeline);
    console.log(newPipeline);
    setPipeline(structuredClone(newPipeline));
    setIsRunning(false);
  };

  if (!data) {
    return <></>;
  }

  return (
    <>
      {/* Output node render */}
      <NodeFrame
        size={data.expanded ? (data.config.results ? 'xl' : 'lg') : 'collapsed'}
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
              disabled={isRunning}
            >
              {isRunning ? (
                <Spinner className="h-3 w-3 border-2" />
              ) : (
                <PlayIcon aria-hidden="true" className="h-5 w-5" />
              )}
            </Button>
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
          <NodeContent className="h-[calc(100%-2rem)]">
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
