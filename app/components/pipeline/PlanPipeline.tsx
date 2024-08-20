'use client';

import { pipelineAtom } from '@/app/store/store';
import { runPrompt } from '@/src/engine/runPrompt';
import { PuzzlePieceIcon } from '@heroicons/react/16/solid';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Button } from '../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Textarea } from '../catalyst/textarea';
import { Spinner } from '../Spinner';
import system from './pipeline.txt';

export default function PlanPipeline() {
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  const runPlan = async () => {
    const description = contentInputRef.current?.value;

    if (!description?.length) {
      return;
    }
    setLoading(true);

    // generate plan from LLM
    const plan = await runPrompt({ system, user: description });

    setPipeline({
      ...pipeline,
      pipelinePlan: plan.result ?? '',
    });
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button outline onClick={() => setIsOpen(true)}>
        <PuzzlePieceIcon className="w-3 h-3" /> Help me plan a pipeline
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Plan your pipeline</DialogTitle>
        <DialogDescription>
          Assists with planning your data processing pipeline based on your
          task.
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Describe your task</Label>
              <Textarea
                rows={5}
                name="task"
                placeholder="Task description"
                autoFocus
                ref={contentInputRef}
                disabled={loading}
              />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          {loading && (
            <div className="flex flex-1">
              <Spinner />
            </div>
          )}
          <Button plain onClick={() => setIsOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={runPlan} disabled={loading}>
            Plan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
