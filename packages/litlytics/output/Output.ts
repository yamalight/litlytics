import type { Doc } from '../doc/Document';
import type { StepResult } from '../step/Step';

export const OUTPUT_ID = 'litlytics_output';

export interface Result extends StepResult {
  doc: Doc;
}
