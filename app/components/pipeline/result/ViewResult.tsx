import { Button } from '@/app/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/app/components/catalyst/dialog';
import { isRunningAtom, pipelineAtom } from '@/app/store/store';
import { DocumentCheckIcon } from '@heroicons/react/24/solid';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { RenderResults } from './Results';

export function ViewResults() {
  const isRunning = useAtomValue(isRunningAtom);
  const [isOpen, setIsOpen] = useState(false);
  const pipeline = useAtomValue(pipelineAtom);

  return (
    <>
      <Button
        title="View results"
        onClick={() => setIsOpen(true)}
        disabled={!pipeline.results || isRunning}
      >
        <DocumentCheckIcon aria-hidden="true" className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>View results</DialogTitle>
        <DialogDescription>Pipeline results</DialogDescription>
        <DialogBody>
          <RenderResults results={pipeline.results!} />
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
