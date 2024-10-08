import { DocsListSource } from './docsList/docsList';
import { FileSource } from './file/fileSource';
import { SourceTypes } from './Source';
import { TextSource } from './text/textSource';
import { UrlSource } from './url/urlSource';

export const sourceProviders = {
  [SourceTypes.DOCS]: DocsListSource,
  [SourceTypes.TEXT]: TextSource,
  [SourceTypes.FILE]: FileSource,
  [SourceTypes.URL]: UrlSource,
};
