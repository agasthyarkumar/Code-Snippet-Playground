import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Snippet } from '../types';

type SnippetCardProps = {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  buttonClass?: string;
};

const SnippetCard = ({ snippet, onEdit, onDelete, buttonClass = 'btn-ghost' }: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // ignore errors
    }
  };
  return (
    <div className="panel animate-soft mx-auto max-w-2xl flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-tight">{snippet.name}</h3>
          {snippet.description && <p className="text-sm text-black/70 dark:text-white/70">{snippet.description}</p>}
        </div>
        <span className="rounded-full border border-black px-2 py-1 text-xs font-semibold uppercase tracking-wide text-black dark:border-white dark:text-white">
          {snippet.language ?? 'auto'}
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-black dark:border-white">
        <SyntaxHighlighter
          language={snippet.language ?? 'text'}
          style={{}}
          showLineNumbers={false}
          customStyle={{
            margin: 0,
            fontSize: 13,
            background: '#ffffff',
            color: '#000000',
            padding: 12,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
      {snippet.keyTerms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {snippet.keyTerms.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black px-2 py-1 text-xs font-medium text-black dark:border-white dark:text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button className={`${buttonClass} h-9 w-9 p-0`} onClick={handleCopy} type="button" title="Copy snippet">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <button className={`${buttonClass} h-9 w-9 p-0`} onClick={() => onEdit(snippet)} type="button" title="Edit snippet">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 3 21l.5-4.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
        <button className={`${buttonClass} h-9 w-9 p-0`} onClick={() => onDelete(snippet)} type="button" title="Delete snippet">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SnippetCard;
