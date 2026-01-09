import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { useSnippets, SavePayload } from '../hooks/useSnippets';
import { DuplicateConflicts, Snippet } from '../types';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

type AppContextType = {
  // Snippet data
  snippets: Snippet[];
  allLanguages: string[];
  filtered: Snippet[];
  
  // Search & Filter
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  languageFilter: string;
  setLanguageFilter: (lang: string) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Form state
  editing: Snippet | null;
  showForm: boolean;
  duplicateConflicts?: DuplicateConflicts;
  trimWarning: boolean;
  error: string | null;
  pendingPayload: SavePayload | null;
  
  // Actions
  handleSubmit: (payload: SavePayload) => void;
  handleForceSave: () => void;
  startCreate: () => void;
  startEdit: (snippet: Snippet) => void;
  closeForm: () => void;
  onDelete: (snippet: Snippet) => void;
  confirmDeleteHandler: () => void;
  cancelDelete: () => void;
  
  // Delete confirmation
  confirmDelete: Snippet | null;
  
  // UI
  isClosing: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
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

  const cancelDelete = () => {
    setConfirmDelete(null);
    setDuplicateConflicts(undefined);
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
      setIsClosing(false);
      resetFormState();
    }, 200);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: AppContextType = {
    snippets,
    allLanguages,
    filtered,
    searchTerm,
    setSearchTerm,
    languageFilter,
    setLanguageFilter,
    theme,
    toggleTheme,
    editing,
    showForm,
    duplicateConflicts,
    trimWarning,
    error,
    pendingPayload,
    handleSubmit,
    handleForceSave,
    startCreate,
    startEdit,
    closeForm,
    onDelete,
    confirmDeleteHandler,
    cancelDelete,
    confirmDelete,
    isClosing,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
