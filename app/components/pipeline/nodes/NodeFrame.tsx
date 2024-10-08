import { ProcessingStep, SourceStep } from '@/packages/src/step/Step';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';
import { Button } from '~/components/catalyst/button';
import { Dialog, DialogBody, DialogTitle } from '~/components/catalyst/dialog';
import { NodeConnector } from './NodeConnector';

export function NodeHeader({
  children,
  className,
  collapsed,
}: {
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
}) {
  return (
    <div
      className={clsx(
        className,
        // sizing
        'flex h-11 px-2',
        // border
        collapsed ? '' : 'border-b border-b-zinc-300 dark:border-b-zinc-600',
        // content
        'items-center'
      )}
    >
      {children}
    </div>
  );
}

export function NodeContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx(className, 'flex flex-1', 'px-2 py-1')}>
      {children}
    </div>
  );
}

function NodeError({ error }: { error: Error }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="">Error: {error.message.slice(0, 30)}...</div>
      <Button icon onClick={() => setIsOpen(true)}>
        <MagnifyingGlassIcon className="w-3 h-3" stroke="black" fill="black" />
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen} topClassName="z-20">
        <DialogTitle>Error during step execution</DialogTitle>
        <DialogBody>
          <pre>{`${error.message}\n\n\n${error.stack}`}</pre>
        </DialogBody>
      </Dialog>
    </>
  );
}

const sizes = {
  xl: 'w-[32rem] h-96',
  lg: 'w-96 h-52',
  base: 'w-96 h-44',
  sm: 'w-96 h-32',
  xs: 'w-96 h-24',
  collapsed: 'w-96 h-9',
};

export function NodeFrame({
  children,
  className,
  size = 'lg',
  hasConnector,
  currentStep,
  error,
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  hasConnector?: boolean | 'auto';
  currentStep?: SourceStep | ProcessingStep;
  error?: Error;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          className,
          // sizing
          `flex flex-col ${sizes[size]}`,
          // padding
          'pb-2',
          // border
          `border border-bg-zinc-300 dark:border-zinc-600 rounded-xl ${
            error ? 'rounded-b-none' : ''
          }`,
          // background
          'bg-zinc-100 dark:bg-zinc-800'
        )}
      >
        {children}
      </div>
      {error && (
        <div
          className={clsx([
            'flex items-center justify-between',
            'bg-red-400 dark:bg-red-700',
            'rounded-xl rounded-t-none',
            'py-1 px-2',
          ])}
        >
          <NodeError error={error} />
        </div>
      )}
      {hasConnector && (
        <NodeConnector
          showAuto={hasConnector === 'auto'}
          currentStep={currentStep}
        />
      )}
    </div>
  );
}
