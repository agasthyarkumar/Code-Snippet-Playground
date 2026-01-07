import { useEffect, useMemo, useState } from 'react';
import SnippetCard from './components/SnippetCard';
import SnippetForm from './components/SnippetForm';
import Modal from './components/Modal';
import LogoMark from './components/LogoMark';
import { useSnippets, SavePayload } from './hooks/useSnippets';
import { DuplicateConflicts, Snippet } from './types';
import LanguageStats from './components/LanguageStats';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const buttonClass = 'btn-ghost';
const inputClass = 'field-base';

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
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  const filtered = useMemo(
    () => search(searchTerm, languageFilter || undefined),
    [search, searchTerm, languageFilter, snippets],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

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
    <div className="min-h-screen bg-white text-black transition-colors dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="flex items-center gap-3 py-2">
          <LogoMark />
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Code Snippet Playground</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <a
              className={buttonClass}
              href="https://github.com/agasthyarkumar"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-5 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.55c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 17.13V21" />
              </svg>
            </a>
            <a
              className={buttonClass}
              href="https://github.com/agasthyarkumar/Code-Snippet-Playground"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15V6a2 2 0 0 0-2-2h-4.5L12 6.5 9.5 4H5a2 2 0 0 0-2 2v9" />
                <path d="M3 17h18" />
                <path d="M17 21H7" />
              </svg>
            </a>
            <button
              className={buttonClass}
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m18.364-7.364-1.414 1.414M6.05 17.95l-1.414 1.414m0-13.414L6.05 6.05m11.314 11.314 1.414 1.414" />
                </svg>
              )}
            </button>
            <button className={buttonClass} onClick={startCreate} type="button" aria-label="Add snippet">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
        </header>

        <div className="h-px w-full max-w-5xl bg-black/20 dark:bg-white/30" />

        <p className="text-sm text-black/70 dark:text-white/70">
          Save, organize, and reuse your code snippets.
        </p>

        <div className="w-full max-w-4xl space-y-3">
          <div className="panel animate-soft flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <input
              className={`${inputClass} md:flex-[3]`}
              placeholder="Search by name, description, or tag"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className={`${inputClass} md:flex-[1]`}
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
        </div>

        <div className="w-full max-w-4xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-black dark:text-white">
            <span>Languages</span>
            <span className="rounded-full border border-black px-2 py-0.5 text-[11px] font-semibold text-black dark:border-white dark:text-white">
              {snippets.filter((s) => s.language).length}
            </span>
          </div>
          <LanguageStats
            snippets={snippets}
            selected={languageFilter || undefined}
            onSelect={(lang) => setLanguageFilter(lang)}
          />
        </div>

        {error && (
          <div className="panel border-red-500 bg-red-50 text-sm text-red-900">
            {error}
          </div>
        )}

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
            buttonClass={buttonClass}
            inputClass={inputClass}
          />
        )}

        {duplicateConflicts && pendingPayload && (
          <div className="panel animate-soft border border-black text-sm">
            <p className="mb-2 font-semibold">Duplicate detected.</p>
            <p className="text-xs">Review the conflicts and save again if intentional.</p>
            <div className="mt-3 flex justify-end gap-2">
              <button className={buttonClass} onClick={() => setDuplicateConflicts(undefined)} type="button">
                Adjust form
              </button>
              <button className={buttonClass} onClick={handleForceSave} type="button">
                Save anyway
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {filtered.length === 0 && (
            <div className="panel flex flex-col items-center gap-3 text-center text-gray-500">
              <div className="text-sm">No snippets yet. Create one to get started.</div>
              <button className={buttonClass} onClick={startCreate} type="button">
                Create snippet
              </button>
            </div>
          )}
          {filtered.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={startEdit}
              onDelete={onDelete}
              buttonClass={buttonClass}
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
            buttonClass={buttonClass}
          />
        )}
      </div>
    </div>
  );
};

export default App;
