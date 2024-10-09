import {
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  EllipsisHorizontalIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/solid';
import { sourceProviders, SourceStep, SourceTypes } from 'litlytics';
import { ChangeEvent, useMemo, useState } from 'react';
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
import { useLitlytics } from '~/store/store';
import { components } from './components';
import { NodeContent, NodeFrame, NodeHeader } from './NodeFrame';

const UnknownSource = ({
  source: _data,
}: {
  source: SourceStep;
  setSource: (n: SourceStep) => void;
}) => <span>Unknown source type! Cannot get render</span>;

export function SourceNode() {
  const [isOpen, setIsOpen] = useState(false);
  const litlytics = useLitlytics();

  const source = useMemo(() => {
    return litlytics.pipeline.source;
  }, [litlytics.pipeline.source]);
  const Render = useMemo(() => {
    if (!source) {
      return;
    }

    // get all documents from the source
    const Source = sourceProviders[source.sourceType];
    if (!Source) {
      return UnknownSource;
    }
    const src = new Source(source);
    return src.render;
  }, [source]);

  const updateNodeByKey = (
    newVal: string | boolean | undefined,
    prop: keyof SourceStep
  ) => {
    const newData = structuredClone(source!);
    newData[prop] = newVal;

    // clear docs when changing source type
    if (prop === 'sourceType') {
      newData.config = {};
    }

    litlytics.setPipeline({
      source: newData,
    });
  };

  const updateNode = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    prop: keyof SourceStep
  ) => {
    const newVal = e.target.value;
    updateNodeByKey(newVal, prop);
  };

  const updateSource = (newSource: SourceStep) => {
    litlytics.setPipeline({
      source: newSource,
    });
  };

  if (!source) {
    return <></>;
  }

  return (
    <>
      {/* Source node render */}
      <NodeFrame
        hasConnector={litlytics.pipeline.steps.length > 0 ? true : 'auto'}
        currentStep={source}
        size={source.expanded ? 'lg' : 'collapsed'}
      >
        <NodeHeader collapsed={!source.expanded}>
          <div className="flex flex-1 gap-2 items-center">
            {litlytics.pipelineStatus.status === 'sourcing' ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <Button
                icon
                className="!p-0"
                onClick={() => updateNodeByKey(!source.expanded, 'expanded')}
              >
                {source.expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
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
            {Render && (
              <Render
                source={source}
                setSource={updateSource}
                components={components}
              />
            )}
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
                value={source.sourceType as string}
                onChange={(e) => updateNode(e, 'sourceType')}
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
