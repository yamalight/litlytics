import type { UIComponents } from '../components/types';
import type { Doc } from '../doc/Document';
import type { SourceStep } from '../step/Step';

export class SourceTypes {
  static TEXT = 'text' as const;
  static DOCS = 'docs' as const;
  static FILE = 'file' as const;
  static URL = 'url' as const;
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
    components,
  }: {
    source: SourceStep;
    setSource: (newSource: SourceStep) => void;
    components: UIComponents;
  }) => React.ReactElement;
}
