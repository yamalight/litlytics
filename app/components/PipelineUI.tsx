import { runPipeline } from '@/src/engine/runPipeline';
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  FolderIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { emptyPipeline, pipelineAtom } from '../store/store';
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
import GeneratePipeline from './pipeline/GeneratePipeline';
import { ViewResults } from './pipeline/result/ViewResult';
import { AddSource } from './pipeline/source/AddSource';
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
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isOpen, setIsOpen] = useState(false);

  const resetPipeline = () => {
    setPipeline(structuredClone(emptyPipeline));
    setIsOpen(false);
  };

  const doRunPipeline = async () => {
    const newPipeline = await runPipeline(pipeline);
    console.log(newPipeline);
    setPipeline(structuredClone(newPipeline));
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

              <DropdownItem>
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

          <Button title="Run pipeline" onClick={doRunPipeline}>
            <PlayIcon aria-hidden="true" className="h-5 w-5" />
          </Button>

          <ViewResults />
        </MenuHolder>

        <MenuHolder className="p-0 m-1.5">
          <Button title="Help">
            <QuestionMarkCircleIcon aria-hidden="true" className="h-5 w-5" />
          </Button>
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
    </div>
  );
}
