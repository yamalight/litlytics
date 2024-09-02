import { Doc } from '@/src/doc/Document';
import { OutputStep } from '@/src/step/Step';
import { ReactElement } from 'react';

export type OutputRender = ({ data }: { data: OutputStep }) => ReactElement;

export type BasicOutputConfig = {
  results: Doc | Doc[];
};
