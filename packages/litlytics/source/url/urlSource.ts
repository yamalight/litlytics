import type { UIComponents } from '@/components/types';
import type { Doc } from '@/doc/Document';
import type { SourceStep } from '@/step/Step';
import React from 'react';
import { SourceProvider, SourceTypes } from '../Source';
import { URLSourceRender } from './URLSourceRender';
import type { URLSourceConfig } from './types';

export class UrlSource implements SourceProvider {
  source: SourceStep;

  constructor(source: SourceStep) {
    this.source = source;
  }

  async getDocs(): Promise<Doc[]> {
    if (this.source.sourceType !== SourceTypes.URL) {
      throw new Error(
        'Not URL source passed when trying to get URL source doc!'
      );
    }

    const config = this.source.config as URLSourceConfig;
    const docs = [config.document!];
    return docs;
  }

  async setDocs(docs: Doc[]) {
    if (this.source.sourceType !== SourceTypes.URL) {
      throw new Error(
        'Not URL doc source passed when trying to set URL source doc!'
      );
    }

    (this.source.config as URLSourceConfig).document = docs[0];
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
    return React.createElement(URLSourceRender, {
      source,
      setSource,
      components,
    });
  }
}
