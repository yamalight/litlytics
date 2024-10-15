export class SourceTypes {
  static TEXT = 'text' as const;
  static DOCS = 'docs' as const;
  static FILE = 'file' as const;
  static URL = 'url' as const;
  static EMPTY = 'empty' as const;
}

type SourceTypeList = (typeof SourceTypes)[keyof typeof SourceTypes];

// Ensure SourceType is recognized as a string
export type SourceType = Extract<SourceTypeList, string>;
