import { Button } from '@/app/components/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/app/components/catalyst/dialog';
import { Field, FieldGroup, Label } from '@/app/components/catalyst/fieldset';
import { Select } from '@/app/components/catalyst/select';
import { Spinner } from '@/app/components/Spinner';
import { pipelineAtom } from '@/app/store/store';
import { testPipelineStep } from '@/src/engine/testStep';
import { ProcessingStep } from '@/src/step/Step';
import { BeakerIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import Markdown from 'react-markdown';

export function StepTest({ data }: { data: ProcessingStep }) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const [testDocId, setTestDocId] = useState(pipeline.testDocs.at(0)?.id ?? '');
  const [isTestOpen, setTestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const testResult = useMemo(() => {
    return pipeline.testDocs
      .find((d) => d.id === testDocId)
      ?.processingResults.find((r) => r.stepId === data.id);
  }, [pipeline.testDocs, testDocId, data]);

  const testStep = async () => {
    if (!Boolean(testDocId.length)) {
      return;
    }

    setLoading(true);

    // try {
    const doc = await testPipelineStep({
      pipeline,
      step: data,
      docId: testDocId,
    });

    setPipeline({
      ...pipeline,
      testDocs: pipeline.testDocs.map((d) => {
        if (d.id === doc?.id) {
          return doc;
        }
        return d;
      }),
    });

    setLoading(false);
  };

  return (
    <>
      <Button className="h-4 w-4" onClick={() => setTestOpen(true)}>
        <BeakerIcon className="w-4 h-4" />
      </Button>

      {/* Test step */}
      <Dialog open={isTestOpen} onClose={setTestOpen}>
        <DialogTitle>Test step</DialogTitle>
        <DialogDescription>
          Test step {data.name} with a document.
          {data.input === 'aggregate-docs' && (
            <>
              <br />
              Running on all docs.
            </>
          )}
          {data.input === 'aggregate-results' && (
            <>
              <br />
              Running on all results.
            </>
          )}
        </DialogDescription>
        <DialogBody>
          {data.input !== 'aggregate-docs' &&
            data.input !== 'aggregate-results' && (
              <FieldGroup>
                <Field>
                  <Label>Document to test</Label>
                  <Select
                    aria-label="Document"
                    name="document"
                    value={testDocId}
                    onChange={(e) => setTestDocId(e.target.value)}
                  >
                    {pipeline.testDocs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </FieldGroup>
            )}

          <div className="prose prose-sm dark:prose-invert mt-2 px-2">
            <Markdown>
              {testResult
                ? testResult.result
                  ? testResult.result
                  : 'No value returned'
                : 'No test execution'}
            </Markdown>
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
    </>
  );
}
