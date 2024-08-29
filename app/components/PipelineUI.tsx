import { runPipeline } from '@/src/engine/runPipeline';
import { Pipeline } from '@/src/pipeline/Pipeline';
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  FolderIcon,
  PlayIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { emptyPipeline, isRunningAtom, pipelineAtom } from '../store/store';
import { Button } from './catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from './catalyst/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from './catalyst/dropdown';
import { Help } from './Help';
import GeneratePipeline from './pipeline/GeneratePipeline';
import { ViewResults } from './pipeline/result/ViewResult';
import { AddSource } from './pipeline/source/AddSource';
import { Spinner } from './Spinner';
import AddStep from './step/AddStep';

function MenuHolder({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-fit h-fit bg-white dark:bg-neutral-800 p-1.5 gap-1.5 isolate inline-flex rounded-lg shadow-sm pointer-events-auto ${className}`}
    >
      {children}
    </div>
  );
}

export function PipelineUI() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isRunning, setIsRunning] = useAtom(isRunningAtom);
  const [isOpen, setIsOpen] = useState(false);

  const resetPipeline = () => {
    setPipeline(structuredClone(emptyPipeline));
    setIsOpen(false);
  };

  const doRunPipeline = async () => {
    setIsRunning(true);
    const newPipeline = await runPipeline(pipeline);
    console.log(newPipeline);
    setPipeline(structuredClone(newPipeline));
    setIsRunning(false);
  };

  const savePipeline = () => {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(pipeline, null, 2);
    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pipeline.name ?? 'pipeline'}.json`;
    // Programmatically click the anchor to trigger the download
    a.click();
    // Clean up: revoke the object URL
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string) as Pipeline;
          setPipeline(json);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed pointer-events-none my-6 px-4 z-10 h-screen w-screen bg-transparent">
      <div className="flex justify-between w-full h-fit">
        <MenuHolder className="p-0 m-1.5">
          <Dropdown>
            <DropdownButton>
              <Bars3Icon />
            </DropdownButton>
            <DropdownMenu
              className="min-w-80 lg:min-w-64"
              anchor="bottom start"
            >
              <DropdownItem onClick={() => setIsOpen(true)}>
                <TrashIcon aria-hidden="true" className="h-5 w-5" />
                <DropdownLabel>Reset pipeline</DropdownLabel>
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem onClick={() => fileInputRef.current?.click()}>
                <FolderIcon aria-hidden="true" className="h-5 w-5" />
                <DropdownLabel>Open pipeline</DropdownLabel>
              </DropdownItem>

              <DropdownItem onClick={savePipeline}>
                <ArrowDownTrayIcon aria-hidden="true" className="h-5 w-5" />
                <DropdownLabel>Save pipeline</DropdownLabel>
              </DropdownItem>

              {/* <DropdownDivider />

              <DropdownItem>
                <Cog8ToothIcon />
                <DropdownLabel>Settings</DropdownLabel>
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        </MenuHolder>

        <MenuHolder>
          <GeneratePipeline />

          <div className="w-1" />

          <AddSource />
          <AddStep />

          <div className="w-1" />

          <Button
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

          <ViewResults />
        </MenuHolder>

        <MenuHolder className="p-0 m-1.5">
          <Help />
        </MenuHolder>
      </div>

      <Dialog size="3xl" open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Reset pipeline?</DialogTitle>
        <DialogBody className="w-full">
          Are you sure you want to reset the pipeline? This will delete all
          current steps and docs.
        </DialogBody>
        <DialogActions className="flex justify-between">
          <Button color="red" onClick={resetPipeline}>
            Yes, reset
          </Button>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
}
