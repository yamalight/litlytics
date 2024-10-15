import { DocsListSourceRender } from './docsList/DocsListRender';
import { EmptySourceRender } from './EmptySource';
import { FileSourceRender } from './file/FileSource';
import { TextSourceRender } from './TextSource';
import { SourceTypes } from './types';
import { URLSourceRender } from './URLSource';

export const sourceRenders = {
  [SourceTypes.DOCS]: DocsListSourceRender,
  [SourceTypes.TEXT]: TextSourceRender,
  [SourceTypes.FILE]: FileSourceRender,
  [SourceTypes.URL]: URLSourceRender,
  [SourceTypes.EMPTY]: EmptySourceRender,
};
