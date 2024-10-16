import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';
import { Button } from '~/components/catalyst/button';
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '~/components/catalyst/dialog';
import { Field, FieldGroup, Label } from '~/components/catalyst/fieldset';
import { Textarea } from '~/components/catalyst/textarea';
import { Spinner } from '~/components/Spinner';
import { useLitlytics } from '~/store/WithLitLytics';
import { RefinePipeline } from './RefinePipeline';

const tabClass = clsx(
  `rounded-full py-1 px-3 text-sm/6 font-semibold`,
  `text-zinc-900 dark:text-zinc-50 focus:outline-none`,
  `data-[selected]:bg-zinc-900/10 dark:data-[selected]:bg-zinc-50/10`,
  `data-[hover]:bg-zinc-900/5 dark:data-[hover]:bg-zinc-50/5 data-[selected]:data-[hover]:bg-zinc-900/10 dark:data-[selected]:data-[hover]:bg-zinc-50/10`,
  `data-[focus]:outline-1 data-[focus]:outline-black dark:data-[focus]:outline-white`
);

export default function GeneratePipeline() {
  const { litlytics, pipeline, setPipeline, pipelineStatus } = useLitlytics();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const runPlan = async () => {
    try {
      setLoading(true);
      setError(undefined);

      // generate plan from LLM
      const newPipeline = await litlytics.generatePipeline();
      setPipeline(newPipeline);
      setLoading(false);
      setSelectedTab(1);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const closeDialog = () => {
    if (
      loading ||
      pipelineStatus.status === 'refine' ||
      pipelineStatus.status === 'step' ||
      pipelineStatus.status === 'sourcing'
    ) {
      return;
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button
        title="Generate pipeline"
        outline
        onClick={() => setIsOpen(true)}
        disabled={
          pipelineStatus.status === 'sourcing' ||
          pipelineStatus.status === 'step'
        }
        className="border-sky-500 dark:border-sky-500"
      >
        <SparklesIcon aria-hidden="true" className="h-5 w-5 fill-sky-500" />{' '}
        Auto-generate
      </Button>

      <Dialog open={isOpen} onClose={closeDialog} topClassName="z-20">
        <DialogTitle>Generate your pipeline</DialogTitle>
        <DialogDescription>
          Let us generate your data processing pipeline based on your task.
        </DialogDescription>
        <DialogBody>
          <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
            <TabList className="flex gap-4">
              <Tab className={tabClass}>Plan</Tab>
              {Boolean(pipeline.pipelinePlan?.length) && (
                <Tab className={tabClass}>Refine plan</Tab>
              )}
            </TabList>
            <TabPanels className="mt-3">
              <TabPanel className="rounded-xl bg-zinc-900/5 dark:bg-zinc-50/5 p-3">
                <FieldGroup>
                  <Field>
                    <Label>Describe your task</Label>
                    <Textarea
                      rows={5}
                      name="task"
                      placeholder="Task description"
                      value={pipeline.pipelineDescription ?? ''}
                      onChange={(e) => {
                        setPipeline({
                          ...pipeline,
                          pipelineDescription: e.target.value,
                        });
                      }}
                      autoFocus
                      disabled={loading}
                    />
                  </Field>
                </FieldGroup>
                <div className="flex justify-end">
                  <Button onClick={runPlan} disabled={loading} className="mt-2">
                    {loading && (
                      <div className="flex items-center">
                        <Spinner className="h-5 w-5" />
                      </div>
                    )}
                    Plan
                  </Button>
                </div>
                {error && (
                  <div className="flex items-center justify-between bg-red-400 dark:bg-red-700 rounded-xl py-1 px-2 my-2">
                    Error planning: {error.message}
                  </div>
                )}
              </TabPanel>
              <TabPanel className="rounded-xl bg-zinc-900/5 dark:bg-zinc-50/5 p-3">
                <RefinePipeline hide={closeDialog} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </DialogBody>
      </Dialog>
    </>
  );
}
