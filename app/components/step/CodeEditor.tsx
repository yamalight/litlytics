import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect, useMemo, useRef } from 'react';

export function CodeEditor({
  code,
  onChange,
}: {
  code?: string;
  onChange: (newCode?: string) => void;
}) {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);

  const isDarkMode = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  useEffect(() => {
    if (!monaco) {
      return;
    }
    // add workflow state typedef
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(WorkflowStateTypeDef);
  }, [monaco]);

  return (
    <Editor
      width="100%"
      height="100%"
      theme={isDarkMode ? 'vs-dark' : ''}
      defaultLanguage="javascript"
      defaultValue={code}
      options={{
        wordWrap: 'on',
      }}
      onChange={(value) => onChange(value)}
      onMount={(editor) => {
        editorRef.current = editor;
      }}
    />
  );
}
