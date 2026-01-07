import React from 'react';

type CodeEditorProps = {
  value: string;
  language?: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
};

const CodeEditor = ({ value, onChange, rows = 14, className }: CodeEditorProps) => {
  return (
    <textarea
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder="Paste your code here..."
    />
  );
};

export default CodeEditor;
