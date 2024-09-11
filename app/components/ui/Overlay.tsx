import { Pipeline } from '@/src/pipeline/Pipeline';
import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3Icon,
  FolderIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { useAtom, useAtomValue } from 'jotai';
import { useRef, useState } from 'react';
import { Button } from '~/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '~/components/catalyst/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '~/components/catalyst/dropdown';
import { emptyPipeline, pipelineAtom, pipelineUndoAtom } from '~/store/store';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';

function MenuHolder({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-fit h-fit bg-transparent p-1.5 gap-1.5 isolate inline-flex rounded-lg shadow-sm pointer-events-auto ${className}`}
    >
      {children}
    </div>
  );
}

export function OverlayUI() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pipelineNameRef = useRef<HTMLInputElement>(null);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const { undo, redo, canUndo, canRedo } = useAtomValue(pipelineUndoAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  const resetPipeline = () => {
    setPipeline(structuredClone(emptyPipeline));
    setIsOpen(false);
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
    a.download = `${pipelineNameRef.current?.value ?? 'pipeline'}.json`;
    // Programmatically click the anchor to trigger the download
    a.click();
    // Clean up: revoke the object URL
    URL.revokeObjectURL(url);
    // close modal
    setIsSaveOpen(false);
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
        <MenuHolder>
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

              <DropdownItem onClick={() => setIsSaveOpen(true)}>
                <ArrowDownTrayIcon aria-hidden="true" className="h-5 w-5" />
                <DropdownLabel>Save pipeline</DropdownLabel>
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem
                onClick={undo}
                disabled={!canUndo}
                className="disabled:opacity-30"
              >
                <ArrowUturnLeftIcon aria-hidden="true" className="h-5 w-5" />
                <DropdownLabel>Undo</DropdownLabel>
              </DropdownItem>

              <DropdownItem
                onClick={redo}
                disabled={!canRedo}
                className="disabled:opacity-30"
              >
                <ArrowUturnRightIcon aria-hidden="true" className="h-5 w-5" />
                <DropdownLabel>Redo</DropdownLabel>
              </DropdownItem>

              {/* <DropdownDivider />

              <DropdownItem>
                <Cog8ToothIcon />
                <DropdownLabel>Settings</DropdownLabel>
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
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

      <Dialog
        size="xl"
        open={isSaveOpen}
        onClose={setIsSaveOpen}
        topClassName="z-20"
      >
        <DialogTitle>Save pipeline?</DialogTitle>
        <DialogBody className="w-full">
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input
                ref={pipelineNameRef}
                name="name"
                placeholder="Pipeline name"
                autoFocus
                defaultValue="pipeline"
              />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions className="flex justify-between">
          <Button plain onClick={() => setIsSaveOpen(false)}>
            Close
          </Button>
          <Button color="green" onClick={savePipeline}>
            Save
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