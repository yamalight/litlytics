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
import { litlyticsStore, pipelineAtom } from '@/app/store/store';
import { BeakerIcon } from '@heroicons/react/24/solid';
import { useAtom, useAtomValue } from 'jotai';
import { ProcessingStep, setDocs } from 'litlytics';
import { useEffect, useMemo, useState } from 'react';
import { CustomMarkdown } from '../markdown/Markdown';
import { useTestDocs } from '../pipeline/source/useTestDocs';

export function StepTest({ data }: { data: ProcessingStep }) {
  const litlytics = useAtomValue(litlyticsStore);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);
  const { testDocs, allDocs } = useTestDocs(pipeline);
  const [testDocId, setTestDocId] = useState(testDocs.at(0)?.id ?? '');
  const [isTestOpen, setTestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const testResult = useMemo(() => {
    return testDocs
      .find((d) => d.id === testDocId)
      ?.processingResults.find((r) => r.stepId === data.id);
  }, [testDocs, testDocId, data]);

  // update first test doc on docs changes
  useEffect(() => {
    if (testDocs.find((d) => d.id === testDocId)) {
      return;
    }
    setTestDocId(testDocs.at(0)?.id ?? '');
  }, [testDocs, testDocId]);

  const testStep = async () => {
    if (!testDocId.length) {
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const startTime = performance.now();
      const doc = await litlytics.testPipelineStep({
        pipeline,
        step: data,
        docId: testDocId,
      });
      const endTime = performance.now();

      if (!doc) {
        const newDocs = allDocs.map((d) => {
          if (d.id === testDocId) {
            d.processingResults.push({
              result: undefined,
              stepId: data.id,
              timingMs: endTime - startTime,
            });
            return d;
          }
          return d;
        });
        const newSource = await setDocs(pipeline, newDocs);
        // update result manually with no execution
        setPipeline({
          ...pipeline,
          source: newSource,
        });
      } else {
        const newDocs = allDocs.map((d) => {
          if (d.id === doc?.id) {
            return doc;
          }
          return d;
        });
        const newSource = await setDocs(pipeline, newDocs);
        // update test doc results
        setPipeline({
          ...pipeline,
          source: newSource,
        });
      }
    } catch (err) {
      setError(err as Error);
    }

    setLoading(false);
  };

  return (
    <>
      <Button plain onClick={() => setTestOpen(true)}>
        <BeakerIcon className="w-4 h-4" /> Test
      </Button>

      {/* Test step */}
      <Dialog open={isTestOpen} onClose={setTestOpen} topClassName="z-20">
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
                    {testDocs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </FieldGroup>
            )}

          <div className="prose prose-sm dark:prose-invert mt-2 px-2">
            <CustomMarkdown>
              {testResult
                ? testResult.result
                  ? testResult.result
                  : 'No value returned'
                : 'No test execution'}
            </CustomMarkdown>
            {error && (
              <div
                className="px-2 py-1 text-sm text-red-800 dark:text-red-50 rounded-lg bg-red-50 dark:bg-red-800"
                role="alert"
              >
                <b>Error:</b> {error.message}
              </div>
            )}
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
