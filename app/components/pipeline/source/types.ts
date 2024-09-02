import { Doc } from '@/src/doc/Document';
import { SourceStep } from '@/src/step/Step';
import { ReactElement } from 'react';

export type SourceRender = ({ data }: { data: SourceStep }) => ReactElement;

export type DocsListSourceConfig = {
  documents?: Doc[];
};

export type TextSourceConfig = {
  document?: Doc;
};
