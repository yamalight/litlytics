import { ProcessingStep, SourceStep } from '@/src/step/Step';
import clsx from 'clsx';
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

const sizes = {
  lg: 'h-52',
  sm: 'h-32',
  xs: 'h-24',
  collapsed: 'h-9',
};

export function NodeFrame({
  children,
  className,
  size = 'lg',
  hasConnector,
  currentStep,
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  hasConnector?: boolean;
  currentStep?: SourceStep | ProcessingStep;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          className,
          // sizing
          `flex flex-col w-96 ${sizes[size]}`,
          // padding
          'pb-2',
          // border
          'border border-bg-zinc-300 dark:border-zinc-600 rounded-xl',
          // background
          'bg-zinc-100 dark:bg-zinc-800'
        )}
      >
        {children}
      </div>
      {hasConnector && <NodeConnector currentStep={currentStep} />}
    </div>
  );
}
