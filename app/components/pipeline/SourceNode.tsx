import { Step } from '@/src/step/Step';
import { CogIcon } from '@heroicons/react/24/solid';
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';
import { Button } from '../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';

export function SourceNode({ data }: { data: Step }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-40 min-h-10 p-2 bg-neutral-800 rounded-lg">
        <div className="text-xs text-center">{data.name}</div>
        <Button className="h-4 w-4" onClick={() => setIsOpen(true)}>
          <CogIcon />
        </Button>
        <Handle type="source" position={Position.Bottom} id="a" />
      </div>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Configure {data.name}</DialogTitle>
        <DialogDescription>
          Configure parameters for source node: {data.name}
        </DialogDescription>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Step name</Label>
              <Input name="content" placeholder="Step name" autoFocus />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={() => setIsOpen(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
