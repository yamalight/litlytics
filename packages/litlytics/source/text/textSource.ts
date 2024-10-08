import React from 'react';
import type { UIComponents } from '../../components/types';
import type { Doc } from '../../doc/Document';
import type { SourceStep } from '../../step/Step';
import { SourceProvider, SourceTypes } from '../Source';
import { TextSourceRender } from './TextSourceRender';
import type { TextSourceConfig } from './types';

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
    components,
  }: {
    source: SourceStep;
    setSource: (newSource: SourceStep) => void;
    components: UIComponents;
  }) {
    return React.createElement(TextSourceRender, {
      source,
      setSource,
      components,
    });
  }
}
