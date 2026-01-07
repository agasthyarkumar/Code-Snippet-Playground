import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';

type CodeEditorProps = {
  value: string;
  language?: string;
  onChange: (value: string) => void;
};

const CodeEditor = ({ value, language, onChange }: CodeEditorProps) => {
  const lang = useMemo(() => language || 'javascript', [language]);
  const [mode, setMode] = useState<'basic' | 'monaco'>('monaco');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [lang]);

  if (mode === 'basic') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea
          className="textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write or paste your code"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="secondary" onClick={() => setMode('monaco')}>
            Use Monaco editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <Editor
        height="260px"
        theme="vs-dark"
        defaultLanguage={lang}
        language={lang}
        value={value}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          wordWrap: 'on',
          renderLineHighlight: 'line',
        }}
        onChange={(val) => onChange(val ?? '')}
        onMount={() => setReady(true)}
        onValidate={() => setReady(true)}
        onError={() => setMode('basic')}
        loading={<div style={{ padding: 12 }}>Loading editor…</div>}
      />
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="muted">{ready ? 'Monaco editor ready' : 'Loading Monaco editor…'}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="secondary" onClick={() => setMode('basic')}>
            Switch to basic
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
