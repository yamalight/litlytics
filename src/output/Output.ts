export class OutputTypes {
  static BASIC = 'basic' as const;
}

type OutputTypeList = (typeof OutputTypes)[keyof typeof OutputTypes];

// Ensure SourceType is recognized as a string
export type OutputType = Extract<OutputTypeList, string>;
