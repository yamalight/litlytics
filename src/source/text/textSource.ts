import { Doc } from '@/src/doc/Document';
import { SourceStep } from '@/src/step/Step';
import React from 'react';
import { SourceProvider, SourceTypes, TextSourceConfig } from '../Source';
import { TextSourceRender } from './TextSourceRender';

export class TextSource implements SourceProvider {
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

    const config = this.source.config as TextSourceConfig;
    const docs = [config.document!];
    return docs;
  }

  async setDocs(docs: Doc[]) {
    if (this.source.sourceType !== SourceTypes.TEXT) {
      throw new Error(
        'Not text doc source passed when trying to set text source doc!'
      );
    }

    (this.source.config as TextSourceConfig).document = docs[0];
    return this.source;
  }

  render({
    source,
    setSource,
  }: {
    source: SourceStep;
    setSource: (newSource: SourceStep) => void;
  }) {
    return React.createElement(TextSourceRender, { source, setSource });
  }
}
