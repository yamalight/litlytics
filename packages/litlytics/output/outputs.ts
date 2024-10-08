import { BasicOutput } from './basic/basicOutput';
import { OutputTypes } from './Output';

export const outputProviders = {
  [OutputTypes.BASIC]: BasicOutput,
};
