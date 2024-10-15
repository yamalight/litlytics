import { Doc } from 'litlytics';
import { useEffect } from 'react';

export function EmptySourceRender({
  setDocs,
}: {
  docs: Doc[];
  setDocs: (newDocs: Doc[]) => void;
}) {
  useEffect(() => {
    const newDoc = {
      id: 'textdoc',
      name: 'Default document',
      content: 'empty',
      test: true,
      processingResults: [],
    };
    setDocs([newDoc]);
  }, [setDocs]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col">Empty source</div>
    </div>
  );
}
