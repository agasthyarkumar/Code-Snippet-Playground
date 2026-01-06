import { useMemo, useState } from 'react';
import SnippetCard from './components/SnippetCard';
import SnippetForm from './components/SnippetForm';
import Modal from './components/Modal';
import { useSnippets, SavePayload } from './hooks/useSnippets';
import { DuplicateConflicts, Snippet } from './types';

const App = () => {
  const { snippets, search, save, remove, allLanguages, forceSave } = useSnippets();
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [editing, setEditing] = useState<Snippet | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [duplicateConflicts, setDuplicateConflicts] = useState<DuplicateConflicts | undefined>();
  const [trimWarning, setTrimWarning] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<SavePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Snippet | null>(null);

  const filtered = useMemo(
    () => search(searchTerm, languageFilter || undefined),
    [search, searchTerm, languageFilter, snippets],
  );

  const resetFormState = () => {
    setDuplicateConflicts(undefined);
    setTrimWarning(false);
    setPendingPayload(null);
    setError(null);
  };

  const handleSubmit = (payload: SavePayload) => {
    setError(null);
    try {
      const result = save(payload);
      setTrimWarning(Boolean(result.trimmedWarning));

      if (result.conflicts) {
        setDuplicateConflicts(result.conflicts);
        setPendingPayload(payload);
        return;
      }

      setDuplicateConflicts(undefined);
      setPendingPayload(null);
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save snippet');
    }
  };

  const handleForceSave = () => {
    if (!pendingPayload) return;
    const result = forceSave(pendingPayload);
    if (result.snippet) {
      setShowForm(false);
      setEditing(null);
      resetFormState();
    }
  };

  const onDelete = (snippet: Snippet) => setConfirmDelete(snippet);

  const confirmDeleteHandler = () => {
    if (confirmDelete) {
      remove(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  const startCreate = () => {
    resetFormState();
    setEditing(null);
    setShowForm(true);
  };

  const startEdit = (snippet: Snippet) => {
    resetFormState();
    setEditing(snippet);
    setShowForm(true);
  };

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <h1>Code Snippet Manager</h1>
            <p className="muted" style={{ margin: 0 }}>
              Save, organize, and reuse your code snippets.
            </p>
          </div>
        </div>
        <div className="actions">
          <button className="secondary" onClick={() => resetFormState()} type="button">
            Clear warnings
          </button>
          <button className="primary" onClick={startCreate} type="button">
            New snippet
          </button>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by name, description, or tag"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="">All languages</option>
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert danger">{error}</div>}

      {showForm && (
        <SnippetForm
          initial={editing}
          languages={allLanguages}
          duplicateConflicts={duplicateConflicts}
          trimWarning={trimWarning}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
            resetFormState();
          }}
        />
      )}

      {duplicateConflicts && pendingPayload && (
        <div className="alert warn" style={{ marginTop: 12 }}>
          Duplicate detected. Review the conflicts and save again if intentional.
          <div className="actions" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="secondary" onClick={() => setDuplicateConflicts(undefined)} type="button">
              Adjust form
            </button>
            <button className="primary" onClick={handleForceSave} type="button">
              Save anyway
            </button>
          </div>
        </div>
      )}

      <div className="card-grid" style={{ marginTop: 18 }}>
        {filtered.length === 0 && (
          <div className="empty-state">
            No snippets yet. Create one to get started.
            <div style={{ marginTop: 12 }}>
              <button className="primary" onClick={startCreate} type="button">
                Create snippet
              </button>
            </div>
          </div>
        )}
        {filtered.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onEdit={startEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {confirmDelete && (
        <Modal
          title="Delete snippet?"
          description={`Delete "${confirmDelete.name}". This action cannot be undone.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteHandler}
          tone="danger"
          confirmLabel="Delete"
        />
      )}
    </div>
  );
};

export default App;
