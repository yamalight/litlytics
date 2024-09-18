import { Doc } from '@/src/doc/Document';
import { SourceStep } from '@/src/step/Step';
import React from 'react';
import { SourceProvider, SourceTypes } from '../Source';
import { FileSourceRender } from './FileSourceRender';
import { FileSourceConfig } from './types';

export class FileSource implements SourceProvider {
  source: SourceStep;

  constructor(source: SourceStep) {
    this.source = source;
  }

  async getDocs(): Promise<Doc[]> {
    if (this.source.sourceType !== SourceTypes.TEXT) {
      throw new Error(
        'Not text source passed when trying to get text source doc!'
      );
    }

    const config = this.source.config as FileSourceConfig;
    const docs = config.documents ?? [];
    return docs;
  }

  async setDocs(docs: Doc[]) {
    if (this.source.sourceType !== SourceTypes.TEXT) {
      throw new Error(
        'Not text doc source passed when trying to set text source doc!'
      );
    }

    (this.source.config as FileSourceConfig).documents = docs;
    return this.source;
  }

  render({
    source,
    setSource,
  }: {
    source: SourceStep;
    setSource: (newSource: SourceStep) => void;
  }) {
    return React.createElement(FileSourceRender, { source, setSource });
  }
}
