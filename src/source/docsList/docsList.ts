import React from 'react';
import { Doc } from '../../doc/Document';
import { SourceStep } from '../../step/Step';
import { DocsListSourceConfig, SourceProvider, SourceTypes } from '../Source';
import { DocsListSourceRender } from './DocsListRender';

export class DocsListSource implements SourceProvider {
  source: SourceStep;

  constructor(source: SourceStep) {
    this.source = source;
  }

  async getDocs(): Promise<Doc[]> {
    if (this.source.sourceType !== SourceTypes.DOCS) {
      throw new Error(
        'Not docs list source passed when trying to get docs list source docs!'
      );
    }

    const config = this.source.config as DocsListSourceConfig;
    const docs = config.documents ?? [];
    return docs;
  }

  async setDocs(docs: Doc[]) {
    if (this.source.sourceType !== SourceTypes.DOCS) {
      throw new Error(
        'Not docs list source passed when trying to set docs list source docs!'
      );
    }

    (this.source.config as DocsListSourceConfig).documents = docs;
    return this.source;
  }

  render({
    source,
    setSource,
  }: {
    source: SourceStep;
    setSource: (newSource: SourceStep) => void;
  }) {
    return React.createElement(DocsListSourceRender, { source, setSource });
  }
}
