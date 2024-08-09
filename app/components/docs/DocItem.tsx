import { Doc } from '@/app/store/store';
import { useState } from 'react';
import { Button } from '../catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../catalyst/dialog';
import { SidebarItem } from '../catalyst/sidebar';

export function DocItem({ doc }: { doc: Doc }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SidebarItem onClick={() => setIsOpen(true)}>{doc.name}</SidebarItem>
      <Dialog size="3xl" open={isOpen} onClose={setIsOpen}>
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
