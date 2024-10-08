import type { Doc } from '../doc/Document';
import type { Pipeline } from '../pipeline/Pipeline';
import { sourceProviders } from './sources';

export async function setDocs(pipeline: Pipeline, docs: Doc[]) {
  // get source
  const source = pipeline.source;
  // validate
  if (!source) {
    throw new Error('Source is required!');
  }

  // get all documents from the source
  const Source = sourceProviders[source.sourceType];
  if (!Source) {
    throw new Error('Unknown source type! Cannot get documents');
  }

  const src = new Source(source);
  const newSource = await src.setDocs(docs);
  return newSource;
}
