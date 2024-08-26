import { BasicSourceConfig } from '@/app/components/pipeline/source/types';
import { Doc } from '../doc/Document';
import { SourceStep } from '../step/Step';
import { SourceTypes } from './Source';

export async function getBasicSourceDocuments(
  source: SourceStep
): Promise<Doc[]> {
  if (source.sourceType !== SourceTypes.BASIC) {
    throw new Error(
      'Not basic source passed when trying to get basic source docs!'
    );
  }

  const config = source.config as BasicSourceConfig;
  const docs = config.documents ?? [];
  return docs;
}
