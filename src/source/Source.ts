export class SourceTypes {
  static BASIC = 'basic' as const;
}

type SourceTypeList = (typeof SourceTypes)[keyof typeof SourceTypes];

// Ensure SourceType is recognized as a string
export type SourceType = Extract<SourceTypeList, string>;
