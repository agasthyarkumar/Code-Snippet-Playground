import { useEffect, useMemo, useState } from 'react';
import { Github, GitBranch, Moon, Sun, Plus } from 'lucide-react';
import SnippetCard from './components/SnippetCard';
import SnippetForm from './components/SnippetForm';
import Modal from './components/Modal';
import LogoMark from './components/LogoMark';
import LanguageStats from './components/LanguageStats';
import { useSnippets, SavePayload } from './hooks/useSnippets';
import { DuplicateConflicts, Snippet } from './types';

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
  const [isClosing, setIsClosing] = useState(false);
  const [duplicateConflicts, setDuplicateConflicts] = useState<DuplicateConflicts | undefined>();
  const [trimWarning, setTrimWarning] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<SavePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Snippet | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  const filtered = useMemo(
    () => search(searchTerm, languageFilter || undefined),
    [search, searchTerm, languageFilter],
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
    setIsClosing(false);
    setShowForm(true);
  };

  const startEdit = (snippet: Snippet) => {
    resetFormState();
    setEditing(snippet);
    setIsClosing(false);
    setShowForm(true);
  };

  const closeForm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setEditing(null);
      resetFormState();
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white text-black transition-colors dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="flex items-center gap-3 py-2">
          <LogoMark />
          <div>
            <h1 className="text-2xl font-semibold leading-none tracking-tight">Code Snippet Playground</h1>
            <p className="text-xs text-black/60 dark:text-white/60 mt-1">Save, organize, and reuse your code snippets.</p>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <a
              className="text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity duration-200 hover:scale-110 transform"
              href="https://github.com/agasthyarkumar"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
            >
              <Github size={18} />
            </a>
            <a
              className="text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity duration-200 hover:scale-110 transform"
              href="https://github.com/agasthyarkumar/Code-Snippet-Playground"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <GitBranch size={18} />
            </a>
            <button
              className="text-black dark:text-white opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 transform"
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
            >
              <div className={`transition-all duration-300 ${theme === 'dark' ? 'rotate-180' : 'rotate-0'}`}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </div>
            </button>
            <button 
              className="text-black dark:text-white opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 transform" 
              onClick={() => {
                if (showForm) {
                  closeForm();
                } else {
                  startCreate();
                }
              }} 
              type="button" 
              aria-label={showForm ? "Close form" : "Add snippet"}
            >
              <div className={`transition-all duration-300 ${showForm ? 'rotate-45' : 'rotate-0'}`}>
                <Plus size={18} />
              </div>
            </button>
          </div>
        </header>

        <div className="w-full space-y-3">
          <div className="panel animate-soft shadow-md">
            <input
              className={inputClass}
              placeholder="Search by name, description, or tag"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full animate-slide-left">
          <LanguageStats
            snippets={snippets}
            selected={languageFilter || undefined}
            onSelect={(lang) => setLanguageFilter((prev) => (prev === lang ? '' : lang))}
          />
        </div>

        {error && (
          <div className="panel border-red-500 bg-red-50 text-sm text-red-900">
            {error}
          </div>
        )}

        {showForm && (
          <div className={isClosing ? 'animate-slide-down' : 'animate-slide-up'}>
            <SnippetForm
              initial={editing}
              languages={allLanguages}
              duplicateConflicts={duplicateConflicts}
              trimWarning={trimWarning}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              buttonClass={buttonClass}
              inputClass={inputClass}
            />
          </div>
        )}

        {duplicateConflicts && pendingPayload && (
          <div className="panel animate-slide-up border border-black text-sm">
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

        <div className="flex w-full flex-col gap-4">
          {snippets.length === 0 && !showForm && (
            <div className="panel animate-slide-up flex flex-col items-center gap-3 text-center text-black/70 dark:text-white/70 shadow-md">
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
              theme={theme}
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
      <div className="fixed bottom-3 right-4 text-xs text-black/50 dark:text-white/50 pointer-events-none select-none">
        <span className="typewriter">Made with ❤️ by Agasthya</span>
      </div>
    </div>
  );
};

export default App;
