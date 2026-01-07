import React from 'react';

type CodeEditorProps = {
  value: string;
  language?: string;
  onChange: (value: string) => void;
  rows?: number;
};

const CodeEditor = ({ value, onChange, rows = 14 }: CodeEditorProps) => {
  return (
    <textarea
      className="textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder="Paste your code here..."
    />
  );
};

export default CodeEditor;
