import { DocsListSourceConfig } from '@/app/components/pipeline/source/types';
import { Doc } from '../doc/Document';
import { SourceStep } from '../step/Step';
import { SourceTypes } from './Source';

export async function getDocsListSourceDocuments(
  source: SourceStep
): Promise<Doc[]> {
  if (source.sourceType !== SourceTypes.DOCS) {
    throw new Error(
      'Not docs list source passed when trying to get docs list source docs!'
    );
  }

  const config = source.config as DocsListSourceConfig;
  const docs = config.documents ?? [];
  return docs;
}
