import { Step, TestResult, useStore } from '@/app/store/store';
import { useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { Button } from '../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Select } from '../catalyst/select';
import { Spinner } from '../Spinner';
import { runPrompt } from '../util';
import { loadModule } from './util';

export function StepItem({ step }: { step: Step }) {
  const testDocRef = useRef<HTMLSelectElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | undefined>();
  const state = useStore((state) => state);

  const testStep = async () => {
    const id = testDocRef.current?.value;
    const doc = state.testDocs.find((d) => d.id === id);
    if (!doc && !step.aggregate) {
      return;
    }

    // if not first step - use result of previous step instead of doc
    let usePrevResult = false;
    let prevResult: TestResult | undefined;
    if (step.id !== '0') {
      usePrevResult = true;
      prevResult = state.steps
        .find((s) => s.id === String(parseInt(step.id) - 1))
        ?.testResults.find((r) => r.docId === id);
    }

    setLoading(true);
    const system = step.prompt!;

    if (step.type === 'llm') {
      if (prevResult && prevResult.result?.length === 0) {
        setResult(`No need to run based on previous result.`);
        setLoading(false);
        return;
      }

      let input: string = doc?.content ?? '';

      if (step.id !== '0' && step.aggregate) {
        const prevDocs = state.steps
          .find((s) => s.id === String(parseInt(step.id) - 1))
          ?.testResults.map((r) => r.result);
        input = prevDocs?.join('\n------\n') ?? '';
      }

      console.log(input);

      const user = input;
      const res = await runPrompt({ system, user });
      const newSteps = state.steps.map((s) => {
        if (s.id === step.id) {
          s.testResults = s.testResults.concat({
            docId: step.aggregate ? 'aggregate' : doc!.id,
            result: res.result!,
          });
          return s;
        }
        return s;
      });
      console.log(newSteps);
      state.setSteps(newSteps);

      setResult(res.result ?? '');
    } else {
      const code = system.replace(/^```(.+?)\n/g, '').replace(/```$/g, '');
      const mod = await loadModule(code);

      const singleInput = usePrevResult ? prevResult?.result : doc?.content;
      let aggregateInput: string[] = [];

      if (step.id !== '0') {
        const prevDocs = state.steps
          .find((s) => s.id === String(parseInt(step.id) - 1))
          ?.testResults.map((r) => r.result);
        aggregateInput = prevDocs ?? [];
      }

      const input = step.aggregate ? aggregateInput : singleInput;
      console.log(input);
      const res = await mod(input);
      const newSteps = state.steps.map((s) => {
        if (s.id === step.id) {
          s.testResults = s.testResults.concat({
            docId: step.aggregate ? 'aggregate' : doc!.id,
            result: res,
          });
          return s;
        }
        return s;
      });
      console.log(newSteps);
      state.setSteps(newSteps);

      setResult(`Function result: ${res}`);
    }
    setLoading(false);
  };

  return (
    <div>
      {step.name}
      <Button plain className="ml-2" onClick={() => setIsOpen(true)}>
        Test step
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Test step</DialogTitle>
        <DialogDescription>
          Test step {step.name} with a document.
          {step.aggregate && (
            <>
              <br />
              Running on all docs.
            </>
          )}
        </DialogDescription>
        <DialogBody>
          {!step.aggregate && (
            <FieldGroup>
              <Field>
                <Label>Document to test</Label>
                <Select aria-label="Document" name="document" ref={testDocRef}>
                  {state.testDocs.map((d) => (
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
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={testStep}>Test</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
