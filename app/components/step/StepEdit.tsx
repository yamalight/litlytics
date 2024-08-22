import { Button } from '@/app/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/app/components/catalyst/dialog';
import { ProcessingStep } from '@/src/step/Step';
import { CogIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export function StepEdit({ data }: { data: ProcessingStep }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button className="h-4 w-4" onClick={() => setIsOpen(true)}>
        <CogIcon />
      </Button>

      {/* Edit step */}
      <Dialog size="3xl" open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Step: {data.name}</DialogTitle>
        <DialogDescription>Config for {data.name}.</DialogDescription>
        <DialogBody className="w-full">
          <div className="prose prose-sm dark:prose-invert w-full max-w-full">
            <pre className="whitespace-pre-wrap w-full">
              {data.type === 'llm' ? data.prompt : data.code}
            </pre>
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={() => {}}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
