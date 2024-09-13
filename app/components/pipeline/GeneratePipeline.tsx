import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useAtom, useAtomValue } from 'jotai';
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
import {
  litlyticsStore,
  pipelineAtom,
  pipelineStatusAtom,
} from '~/store/store';
import { RefinePipeline } from './RefinePipeline';

export default function GeneratePipeline() {
  const status = useAtomValue(pipelineStatusAtom);
  const litlytics = useAtomValue(litlyticsStore);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const runPlan = async () => {
    if (!pipeline.pipelineDescription?.length) {
      return;
    }
    setLoading(true);

    // generate plan from LLM
    const plan = await litlytics.generatePipeline({
      description: pipeline.pipelineDescription,
    });
    console.log(plan);

    setPipeline({
      ...pipeline,
      pipelinePlan: plan ?? '',
    });
    setLoading(false);
    setSelectedTab(1);
  };

  return (
    <>
      <Button
        title="Generate pipeline"
        outline
        onClick={() => setIsOpen(true)}
        disabled={status.status === 'sourcing' || status.status === 'step'}
        className="border-sky-500 dark:border-sky-500"
      >
        <SparklesIcon aria-hidden="true" className="h-5 w-5 fill-sky-500" />{' '}
        Auto-generate
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Generate your pipeline</DialogTitle>
        <DialogDescription>
          Let us generate your data processing pipeline based on your task.
        </DialogDescription>
        <DialogBody>
          <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
            <TabList className="flex gap-4">
              <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                Plan
              </Tab>
              {Boolean(pipeline.pipelinePlan?.length) && (
                <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                  Refine plan
                </Tab>
              )}
            </TabList>
            <TabPanels className="mt-3">
              <TabPanel className="rounded-xl bg-white/5 p-3">
                <FieldGroup>
                  <Field>
                    <Label>Describe your task</Label>
                    <Textarea
                      rows={5}
                      name="task"
                      placeholder="Task description"
                      value={pipeline.pipelineDescription}
                      onChange={(e) =>
                        setPipeline((p) => ({
                          ...p,
                          pipelineDescription: e.target.value,
                        }))
                      }
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
              </TabPanel>
              <TabPanel className="rounded-xl bg-white/5 p-3">
                <RefinePipeline hide={() => setIsOpen(false)} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </DialogBody>
      </Dialog>
    </>
  );
}
