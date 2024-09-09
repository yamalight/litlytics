import clsx from 'clsx';

export function Background({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        // size
        'w-screen h-screen p-6 overflow-auto',
        // content positioning
        'flex flex-col items-center',
        // bg dots
        'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:32px_32px]'
      )}
    >
      {children}
    </div>
  );
}
