import {
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  EllipsisHorizontalIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { Doc, SourceStep } from 'litlytics';
import { useMemo, useState } from 'react';
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
import { useLitlytics } from '~/store/WithLitLytics';
import { NodeContent, NodeFrame, NodeHeader } from '../NodeFrame';
import { sourceRenders } from './providers';
import { SourceType, SourceTypes } from './types';

interface SourceConfig {
  type: string;
}

const UnknownSource = ({
  docs: _data,
}: {
  docs: Doc[];
  setDocs: (newDocs: Doc[]) => void;
}) => <span>Unknown source type! Cannot get render</span>;

export function SourceNode() {
  const [isOpen, setIsOpen] = useState(false);
  const { litlytics, pipeline, setPipeline, pipelineStatus } = useLitlytics();

  const source = useMemo(() => {
    return pipeline.source;
  }, [pipeline.source]);
  const docs = useMemo(() => source.docs, [source.docs]);

  const sourceType = useMemo(
    () => ((source.config as SourceConfig)?.type ?? 'text') as SourceType,
    [source]
  );

  const Render = useMemo(() => {
    // get all documents from the source
    const Render = sourceRenders[sourceType];
    if (!Render) {
      return UnknownSource;
    }
    return Render;
  }, [sourceType]);

  const updateNodeByKey = (
    newVal: string | boolean | undefined,
    prop: keyof SourceStep
  ) => {
    const newData = structuredClone(source!);
    newData[prop] = newVal;
    setPipeline({
      ...pipeline,
      source: newData,
    });
  };

  const updateDocs = (newDocs: Doc[]) => {
    const newPipeline = litlytics.setDocs(newDocs);
    setPipeline(newPipeline);
  };

  if (!source) {
    return <></>;
  }

  return (
    <>
      {/* Source node render */}
      <NodeFrame
        hasConnector={pipeline.steps.length > 0 ? true : 'auto'}
        currentStep={source}
        size={
          // always collapse empty
          sourceType === 'empty'
            ? 'collapsed'
            : source.expanded
            ? 'lg'
            : 'collapsed'
        }
      >
        <NodeHeader
          collapsed={sourceType === 'empty' ? true : !source.expanded}
        >
          <div className="flex flex-1 gap-2 items-center">
            {pipelineStatus.status === 'sourcing' ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <Button
                icon
                className="!p-0"
                onClick={() => updateNodeByKey(!source.expanded, 'expanded')}
              >
                {sourceType === 'empty' ? (
                  <ChevronRightIcon />
                ) : source.expanded ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </Button>
            )}
            <RectangleStackIcon className="w-4 h-4" /> Source
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
        {source.expanded ? (
          <NodeContent className="h-[calc(100%-2rem)]">
            {Render && <Render docs={docs} setDocs={updateDocs} />}
          </NodeContent>
        ) : (
          <></>
        )}
      </NodeFrame>

      {/* Source config */}
      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Configure {source.name}</DialogTitle>
        <DialogDescription>
          Configure parameters for source node: {source.name}
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Source type</Label>
              <Select
                name="step-input"
                value={sourceType as string}
                onChange={(e) =>
                  setPipeline({
                    ...pipeline,
                    source: {
                      ...pipeline.source,
                      config: {
                        type: e.target.value as SourceType,
                      } as SourceConfig,
                    },
                  })
                }
              >
                {Object.keys(SourceTypes).map((type) => (
                  <option
                    key={type}
                    value={SourceTypes[type as keyof SourceTypes]}
                  >
                    {SourceTypes[type as keyof SourceTypes]}
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
