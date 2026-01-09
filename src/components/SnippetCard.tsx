import { useState } from 'react';
import { Clipboard, Pencil, Trash } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Snippet } from '../types';

type SnippetCardProps = {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  theme?: 'light' | 'dark';
};

const SnippetCard = ({ snippet, onEdit, onDelete, theme = 'light' }: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore errors
    }
  };
  return (
    <div className="panel animate-soft flex flex-col gap-3 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-tight">{snippet.name}</h3>
          {snippet.description && <p className="text-sm text-black/70 dark:text-white/70">{snippet.description}</p>}
        </div>
        <span className="rounded-full border border-black px-2 py-1 text-xs font-semibold uppercase tracking-wide text-black dark:border-white dark:text-white">
          {snippet.language ?? 'AUTO'}
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-black dark:border-white">
        <SyntaxHighlighter
          language={snippet.language ?? 'text'}
          style={theme === 'dark' ? vscDarkPlus : prism}
          showLineNumbers={false}
          customStyle={{
            margin: 0,
            fontSize: 13,
            background: theme === 'dark' ? '#0a0a0a' : '#ffffff',
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
      <div className="flex justify-end gap-4">
        <button
          className="text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity duration-200 hover:scale-110 transform"
          onClick={handleCopy}
          type="button"
          title={copied ? 'Copied!' : 'Copy snippet'}
        >
          <Clipboard size={18} />
        </button>
        <button
          className="text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity duration-200 hover:scale-110 transform"
          onClick={() => onEdit(snippet)}
          type="button"
          title="Edit snippet"
        >
          <Pencil size={18} />
        </button>
        <button
          className="text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity duration-200 hover:scale-110 transform"
          onClick={() => onDelete(snippet)}
          type="button"
          title="Delete snippet"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
};

export default SnippetCard;
