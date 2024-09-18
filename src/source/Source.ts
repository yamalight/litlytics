import { Doc } from '../doc/Document';
import { SourceStep } from '../step/Step';

export class SourceTypes {
  static TEXT = 'text' as const;
  static DOCS = 'docs' as const;
  // static FILES = 'files' as const;
}

type SourceTypeList = (typeof SourceTypes)[keyof typeof SourceTypes];

// Ensure SourceType is recognized as a string
export type SourceType = Extract<SourceTypeList, string>;

export abstract class SourceProvider {
  abstract source: SourceStep;
  constructor(_source: SourceStep) {}
  abstract getDocs: () => Promise<Doc[]>;
  abstract setDocs: (docs: Doc[]) => Promise<SourceStep>;
  abstract render: ({
    source,
    setSource,
  }: {
    source: SourceStep;
    setSource: (newSource: SourceStep) => void;
  }) => React.ReactElement;
}

export type DocsListSourceConfig = {
  documents?: Doc[];
};

export type TextSourceConfig = {
  document?: Doc;
};
