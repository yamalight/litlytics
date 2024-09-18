import type { Doc } from '@/src/doc/Document';
import type { SourceStep } from '@/src/step/Step';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Field, Label } from '~/components/catalyst/fieldset';
import { Input } from '~/components/catalyst/input';
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
  const [loading, setLoading] = useState(false);
  const config = useMemo(() => source.config as FileSourceConfig, [source]);

  const updateDocs = useCallback(
    (docs: Doc[]) => {
      const newSource = structuredClone(source);
      (newSource.config as FileSourceConfig).documents = docs;
      setSource(newSource);
    },
    [source, setSource]
  );

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    try {
      setLoading(true);
      const newDocs: Doc[] = [];
      for (const file of files) {
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
      // TODO: show to user
      console.error('Error parsing files:', err);
    }

    setLoading(false);

    // reset input
    e.target.value = '';
  };

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col gap-2">
        <Field>
          <Label className="flex items-center gap-2">
            {loading ? (
              <>
                <Spinner className="w-3 h-3" /> Processing files
              </>
            ) : (
              <>Select files to process</>
            )}
          </Label>
          <Input
            type="file"
            accept={supportedFileTypes.join(',')}
            multiple
            onChange={handleFiles}
            disabled={loading}
          />
        </Field>

        {config.documents &&
          config.documents.map((doc) => (
            <div className="" key={doc.id}>
              {doc.name}
            </div>
          ))}
      </div>
    </div>
  );
}
