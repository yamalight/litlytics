import { pipelineAtom } from '@/app/store/store';
import { Doc } from '@/src/doc/Document';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { Button } from '../catalyst/button';
import { Checkbox } from '../catalyst/checkbox';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';

export function DocItem({ doc }: { doc: Doc }) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [isOpen, setIsOpen] = useState(false);
  const testDocs = useMemo(() => pipeline.testDocs, [pipeline]);
  const inTest = useMemo(
    () => testDocs.find((d) => d.id === doc.id) !== undefined,
    [doc, testDocs]
  );

  const toggleTest = () => {
    if (inTest) {
      const newTestDocs = testDocs.filter((d) => d.id !== doc.id);
      setPipeline({
        ...pipeline,
        testDocs: newTestDocs,
      });
    } else {
      setPipeline({
        ...pipeline,
        testDocs: pipeline.testDocs.concat(doc),
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span>{doc.name}</span>
        <div className="flex items-center gap-1">
          <Checkbox checked={inTest} onClick={toggleTest} /> Use as test
          <Button plain onClick={() => setIsOpen(true)} className="ml-6">
            <PencilIcon />
          </Button>
        </div>
      </div>
      <Dialog size="3xl" open={isOpen} onClose={setIsOpen} topClassName="z-30">
        <DialogTitle>Document view</DialogTitle>
        <DialogDescription>{doc.name}</DialogDescription>
        <DialogBody className="w-full">
          <div className="prose prose-sm dark:prose-invert w-full max-w-full">
            <pre className="whitespace-pre-wrap w-full">{doc.content}</pre>
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
