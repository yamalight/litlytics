import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Spinner } from './Spinner';

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div
        className={clsx(
          // size
          'w-screen h-screen p-6 overflow-auto',
          // content positioning
          'flex flex-col items-center justify-center',
          // bg dots
          'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:32px_32px]'
        )}
      >
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
