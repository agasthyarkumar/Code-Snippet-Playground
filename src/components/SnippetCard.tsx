import { Snippet } from '../types';

type SnippetCardProps = {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
};

const SnippetCard = ({ snippet, onEdit, onDelete }: SnippetCardProps) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>{snippet.name}</h3>
          {snippet.description && <p className="muted" style={{ margin: 0 }}>{snippet.description}</p>}
        </div>
        <div className="badge">{snippet.language ?? 'auto'}</div>
      </div>
      <pre
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 12,
          padding: 12,
          border: '1px solid var(--border)',
          whiteSpace: 'pre-wrap',
          fontFamily: 'Space Grotesk, Fira Code, monospace',
          margin: 0,
          maxHeight: 200,
          overflow: 'auto',
        }}
      >
        {snippet.code}
      </pre>
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
