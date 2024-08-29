import { Button } from '@/app/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/app/components/catalyst/dialog';
import {
  ArrowRightEndOnRectangleIcon,
  DocumentCheckIcon,
  DocumentIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';

export function Help() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button title="Help" onClick={() => setIsOpen(true)}>
        <QuestionMarkCircleIcon aria-hidden="true" className="h-5 w-5" />
      </Button>

      {/* Edit step */}
      <Dialog size="3xl" open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>🔥LitLytics help</DialogTitle>
        <DialogBody className="flex flex-col w-full gap-2">
          <p className="flex gap-2">
            Use <SparklesIcon className="h-5 w-5" /> button to auto-generate
            pipeline from description.
          </p>
          <p className="flex gap-2">
            Use <DocumentIcon className="h-5 w-5" /> button to manually add
            source.
          </p>
          <p className="flex gap-2">
            Use <ArrowRightEndOnRectangleIcon className="h-5 w-5" /> button to
            manually add steps.
          </p>
          <p className="flex gap-2">
            Use <PlayIcon className="h-5 w-5" /> to run pipeline.
          </p>
          <p className="flex gap-2">
            Use <DocumentCheckIcon className="h-5 w-5" /> to view pipeline
            results.
          </p>
          <p>To be improved ... </p>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
