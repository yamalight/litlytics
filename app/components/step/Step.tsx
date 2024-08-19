import { useStore } from '@/app/store/store';
import { testPipeline } from '@/src/engine/test';
import { Step } from '@/src/step/Step';
import { BeakerIcon } from '@heroicons/react/16/solid';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { Badge } from '../catalyst/badge';
import { Button } from '../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';
import { Divider } from '../catalyst/divider';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Select } from '../catalyst/select';
import { Spinner } from '../Spinner';

export function StepItem({ step }: { step: Step }) {
  const testDocRef = useRef<HTMLSelectElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTestOpen, setTestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | undefined>();
  const state = useStore((state) => state);

  const testStep = async () => {
    const id = testDocRef.current?.value;
    if (!id) {
      return;
    }

    setLoading(true);

    try {
      const { doc, result } = await testPipeline({
        pipeline: state.pipeline,
        step,
        docId: id,
      });

      state.setPipeline({
        ...state.pipeline,
        documents: state.pipeline.documents.map((d) => {
          if (d.id === doc?.id) {
            return doc;
          }
          return d;
        }),
      });

      setResult(result ?? '');
    } catch (err) {
      setResult((err as Error).message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <Divider soft className="my-2" />
      <div className="flex items-center gap-2">
        <ArrowDownIcon className="w-4 h-4 opacity-30" />
        <Button plain onClick={() => setIsOpen(true)}>
          {step.name}
        </Button>
        <Badge>{step.type}</Badge>
        <div className="flex flex-1" />
        <Button outline className="ml-2" onClick={() => setTestOpen(true)}>
          <BeakerIcon className="w-4 h-4" /> Test
        </Button>
      </div>
      <Dialog open={isTestOpen} onClose={setTestOpen}>
        <DialogTitle>Test step</DialogTitle>
        <DialogDescription>
          Test step {step.name} with a document.
          {step.input === 'aggregate' && (
            <>
              <br />
              Running on all docs.
            </>
          )}
        </DialogDescription>
        <DialogBody>
          {step.input !== 'aggregate' && (
            <FieldGroup>
              <Field>
                <Label>Document to test</Label>
                <Select aria-label="Document" name="document" ref={testDocRef}>
                  {state.pipeline.documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </FieldGroup>
          )}

          <div className="prose prose-sm dark:prose-invert">
            <Markdown>{result}</Markdown>
          </div>
        </DialogBody>
        <DialogActions>
          {loading && (
            <div className="flex flex-1">
              <Spinner />
            </div>
          )}
          <Button plain onClick={() => setTestOpen(false)}>
            Close
          </Button>
          <Button onClick={testStep}>Test</Button>
        </DialogActions>
      </Dialog>

      <Dialog size="3xl" open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Step: {step.name}</DialogTitle>
        <DialogDescription>Config for {step.name}.</DialogDescription>
        <DialogBody className="w-full">
          <div className="prose prose-sm dark:prose-invert w-full max-w-full">
            <pre className="whitespace-pre-wrap w-full">
              {step.type === 'llm' ? step.prompt : step.code}
            </pre>
          </div>
        </DialogBody>
        <DialogActions>
          {loading && (
            <div className="flex flex-1">
              <Spinner />
            </div>
          )}
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={() => {}}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
