import { pipelineAtom } from '@/app/store/store';
import { generatePipeline } from '@/src/pipeline/generate';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Button } from '../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Textarea } from '../catalyst/textarea';
import { Spinner } from '../Spinner';
import { RefinePipeline } from './RefinePipeline';

export default function GeneratePipeline() {
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const runPlan = async () => {
    const description = contentInputRef.current?.value;

    if (!description?.length) {
      return;
    }
    setLoading(true);

    // generate plan from LLM
    const plan = await generatePipeline({ description });
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
      <Button title="Generate pipeline" onClick={() => setIsOpen(true)}>
        <SparklesIcon aria-hidden="true" className="h-5 w-5" />
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
                      defaultValue={pipeline.pipelineDescription}
                      autoFocus
                      ref={contentInputRef}
                      disabled={loading}
                    />
                  </Field>
                </FieldGroup>
                <div className="flex justify-end">
                  <Button onClick={runPlan} disabled={loading} className="mt-2">
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
        <DialogActions>
          {loading && (
            <div className="flex flex-1">
              <Spinner />
            </div>
          )}
          <Button plain onClick={() => setIsOpen(false)} disabled={loading}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}