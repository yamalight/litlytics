import type { UIComponents } from '@/components/types';
import type { Doc } from '@/doc/Document';
import type { SourceStep } from '@/step/Step';
import React from 'react';
import { SourceProvider, SourceTypes } from '../Source';
import { FileSourceRender } from './FileSourceRender';
import type { FileSourceConfig } from './types';

export class FileSource implements SourceProvider {
  source: SourceStep;

  constructor(source: SourceStep) {
    this.source = source;
  }

  async getDocs(): Promise<Doc[]> {
    if (this.source.sourceType !== SourceTypes.FILE) {
      throw new Error(
        'Not file source passed when trying to get file source doc!'
      );
    }

    const config = this.source.config as FileSourceConfig;
    const docs = config.documents ?? [];
    return docs;
  }

  async setDocs(docs: Doc[]) {
    if (this.source.sourceType !== SourceTypes.FILE) {
      throw new Error(
        'Not file source passed when trying to set file source doc!'
      );
    }

    (this.source.config as FileSourceConfig).documents = docs;
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
    return React.createElement(FileSourceRender, {
      source,
      setSource,
      components,
    });
  }
}
