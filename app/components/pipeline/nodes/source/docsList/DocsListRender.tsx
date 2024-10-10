import { Doc } from 'litlytics';
import AddDoc from './AddDoc';
import { DocItem } from './DocItem';

export function DocsListSourceRender({
  docs,
  setDocs,
}: {
  docs: Doc[];
  setDocs: (newDocs: Doc[]) => void;
}) {
  const updateDoc = (doc: Doc) => {
    const newDocs = docs?.map((d) => {
      if (d.id === doc.id) {
        return doc;
      }
      return d;
    });
    setDocs(newDocs);
  };

  const deleteDoc = (docId: string) => {
    const newDocs = docs?.filter((d) => {
      if (d.id === docId) {
        return false;
      }
      return true;
    });
    setDocs(newDocs);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-auto p-1 max-w-full">
      <div className="flex flex-col">
        {docs?.length ? (
          <>
            {docs?.map((doc) => (
              <DocItem
                doc={doc}
                key={doc.id}
                updateDoc={updateDoc}
                deleteDoc={deleteDoc}
              />
            ))}
          </>
        ) : (
          <>No documents</>
        )}
      </div>
      <AddDoc docs={docs} setDocs={setDocs} />
    </div>
  );
}
