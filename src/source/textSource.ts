import { TextSourceConfig } from '@/app/components/pipeline/source/types';
import { Doc } from '../doc/Document';
import { SourceStep } from '../step/Step';
import { SourceTypes } from './Source';

export async function getTextSourceDocuments(
  source: SourceStep
): Promise<Doc[]> {
  if (source.sourceType !== SourceTypes.TEXT) {
    throw new Error(
      'Not text source passed when trying to get text source doc!'
    );
  }

  const config = source.config as TextSourceConfig;
  const docs = [config.document!];
  return docs;
}
