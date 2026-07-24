import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Monaco otherwise downloads its AMD bundle from a public CDN and stays on
// "Loading…" when the browser has no external network access.
self.MonacoEnvironment = {
  getWorker: (_, label) => {
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    return new editorWorker();
  },
};

loader.config({ monaco });

const languageMap = { javascript: 'javascript', python: 'python', java: 'java', 'c++': 'cpp' };

export const CodeEditor = ({ language, value, onChange }) => (
  <Editor
    height="100%"
    theme="vs-dark"
    language={languageMap[language] ?? 'plaintext'}
    value={value}
    onChange={(nextValue) => onChange(nextValue ?? '')}
    options={{ automaticLayout: true, fontSize: 14, minimap: { enabled: false }, padding: { top: 16 }, scrollBeyondLastLine: false }}
  />
);
