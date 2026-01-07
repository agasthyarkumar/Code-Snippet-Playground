import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Snippet } from '../types';

type SnippetCardProps = {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
};

const SnippetCard = ({ snippet, onEdit, onDelete }: SnippetCardProps) => {
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
    <div className="card">
      <div className="card-header">
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>{snippet.name}</h3>
          {snippet.description && <p className="muted" style={{ margin: 0 }}>{snippet.description}</p>}
        </div>
        <div className="badge">{snippet.language ?? 'auto'}</div>
      </div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: '#fff' }}>
        <SyntaxHighlighter
          language={snippet.language ?? 'text'}
          style={prism}
          showLineNumbers={false}
          customStyle={{
            margin: 0,
            fontSize: 13,
            background: '#fff',
          }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
      {snippet.keyTerms.length > 0 && (
        <div className="tags">
          {snippet.keyTerms.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="actions">
        <button className="secondary" onClick={handleCopy} type="button">
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button className="secondary" onClick={() => onEdit(snippet)} type="button">
          Edit
        </button>
        <button className="danger" onClick={() => onDelete(snippet)} type="button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default SnippetCard;
