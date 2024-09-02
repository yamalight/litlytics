import { OutputStep } from '@/src/step/Step';
import { ReactElement } from 'react';

export type OutputRender = ({ data }: { data: OutputStep }) => ReactElement;

export type BasicOutputConfig = {};
