import { create } from 'zustand';

export interface Doc {
  id: string;
  name: string;
  content: string;
}

export interface Step {
  id: string;
  type: 'llm' | 'code';
  prompt?: string;
  code?: string;
}

export interface State {
  // project setup
  projectName: string;
  setProjectName: (name: string) => void;

  // test docs
  testDocs: Doc[];
  addTestDoc: (doc: Doc) => void;

  // pipeline steps
  steps: Step[];
  addStep: (step: Step) => void;
}

export const useStore = create<State>((set) => ({
  // project setup
  projectName: '',
  setProjectName: (name: string) => set({ projectName: name }),

  // test docs
  testDocs: [],
  addTestDoc: (doc: Doc) =>
    set((state) => ({ testDocs: state.testDocs.concat(doc) })),

  // pipeline steps
  steps: [],
  addStep: (step: Step) =>
    set((state) => ({ steps: state.steps.concat(step) })),
}));
