export class SourceTypes {
  static PLAIN = 'plain';
}

export type SourceType = (typeof SourceTypes)[keyof typeof SourceTypes];
