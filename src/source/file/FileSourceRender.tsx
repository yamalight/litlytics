import type { Doc } from '@/src/doc/Document';
import type { SourceStep } from '@/src/step/Step';
import {
  DocumentIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useCallback, useMemo, useState } from 'react';
import * as reactDropzone from 'react-dropzone';
import { Button } from '~/components/catalyst/button';
import { Dialog, DialogBody, DialogTitle } from '~/components/catalyst/dialog';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';
import type { FileSourceConfig } from './types';
import { getFileContent, supportedFileTypes } from './util';

export function FileSourceRender({
  source,
  setSource,
}: {
  source: SourceStep;
  setSource: (newSource: SourceStep) => void;
}) {
  const [currentDoc, setCurrentDoc] = useState<Doc>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const config = useMemo(() => source.config as FileSourceConfig, [source]);

  const updateDocs = useCallback(
    (docs: Doc[]) => {
      const newSource = structuredClone(source);
      (newSource.config as FileSourceConfig).documents = docs;
      setSource(newSource);
    },
    [source, setSource]
  );

  const deleteDoc = (doc: Doc) => {
    const newDocs = (config.documents ?? []).filter((d) => d.id !== doc.id);
    updateDocs(newDocs);
  };

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
      _fileRejections: reactDropzone.FileRejection[],
      event: reactDropzone.DropEvent
    ) => {
      try {
        setLoading(true);
        setError(undefined);
        const newDocs: Doc[] = [];
        for (const file of acceptedFiles) {
          const content = await getFileContent(file);
          if (Array.isArray(content)) {
            let segment = 1;
            for (const subContent of content) {
              newDocs.push({
                id: `${file.name}-${segment}`,
                name: `${file.name} | segment ${segment++}`,
                content: subContent,
                processingResults: [],
              });
            }
          } else if (content?.length) {
            newDocs.push({
              id: file.name,
              name: file.name,
              content,
              processingResults: [],
            });
          } else {
            throw new Error(`Error parsing file ${file.name}: empty response!`);
          }
        }
        updateDocs(newDocs);
      } catch (err) {
        setError(err as Error);
      }

      setLoading(false);

      // reset input
      if (event.target) {
        (event.target as HTMLInputElement).value = '';
      }
    },
    [updateDocs]
  );
  const { getRootProps, getInputProps, isDragActive } =
    reactDropzone.useDropzone({
      onDrop,
    });

  return (
    <>
      <div className="flex flex-col w-full h-full overflow-auto">
        <div className="flex flex-col gap-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500 dark:bg-red-600 rounded-xl py-1 px-2 my-2">
              Error loading file: {error.message}
            </div>
          )}

          <div
            {...getRootProps({
              className: 'dropzone flex items-center justify-center w-full',
            })}
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-fit border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              <div className="flex flex-col items-center justify-center pt-3 pb-4">
                <DocumentIcon
                  className="w-5 h-5 mb-2 text-zinc-500 dark:text-zinc-400"
                  aria-hidden="true"
                />
                <div className="mb-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {isDragActive ? (
                    <span className="font-semibold">Drop the files here</span>
                  ) : (
                    <span className="font-semibold">
                      {loading ? (
                        <>
                          <Spinner className="w-3 h-3" /> Processing files
                        </>
                      ) : (
                        <>Click to upload or drag and drop</>
                      )}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                  {supportedFileTypes.join(', ')}
                  <br />
                  CSVs assume header row
                </p>
              </div>
              <input
                {...getInputProps({
                  multiple: true,
                  accept: supportedFileTypes.join(','),
                  disabled: loading,
                })}
              />
            </label>
          </div>

          {config.documents && (
            <div className="flex flex-col gap-1 mb-2">
              {config.documents.map((doc) => (
                <div
                  className="p-2 flex justify-between bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-sm"
                  key={doc.id}
                >
                  <span>{doc.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      icon
                      title="Preview"
                      onClick={() => setCurrentDoc(doc)}
                    >
                      <MagnifyingGlassIcon />
                    </Button>
                    <Button icon title="Delete" onClick={() => deleteDoc(doc)}>
                      <XMarkIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={currentDoc !== undefined}
        onClose={() => setCurrentDoc(undefined)}
        size="3xl"
        topClassName="z-20"
      >
        <DialogTitle>Preview {currentDoc?.name}</DialogTitle>
        <DialogBody className="prose dark:prose-invert max-w-full">
          <CustomMarkdown>{currentDoc?.content}</CustomMarkdown>
        </DialogBody>
      </Dialog>
    </>
  );
}
