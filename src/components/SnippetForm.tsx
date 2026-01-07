import { useEffect, useMemo, useState } from 'react';
import { DuplicateConflicts, Snippet } from '../types';
import { SavePayload } from '../hooks/useSnippets';
import CodeEditor from './CodeEditor';
import TagInput from './TagInput';

const COMMON_LANGS = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Rust', 'SQL', 'Go'];

type SnippetFormProps = {
  initial?: Snippet | null;
  languages: string[];
  duplicateConflicts?: DuplicateConflicts;
  trimWarning?: boolean;
  onSubmit: (payload: SavePayload) => void;
  onCancel: () => void;
  buttonClass: string;
  inputClass: string;
};

const SnippetForm = ({
  initial,
  languages,
  duplicateConflicts,
  trimWarning,
  onSubmit,
  onCancel,
  buttonClass,
  inputClass,
}: SnippetFormProps) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [language, setLanguage] = useState(initial?.language ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [keyTerms, setKeyTerms] = useState<string[]>(initial?.keyTerms ?? []);

  useEffect(() => {
    setName(initial?.name ?? '');
    setDescription(initial?.description ?? '');
    setLanguage(initial?.language ?? '');
    setCode(initial?.code ?? '');
    setKeyTerms(initial?.keyTerms ?? []);
  }, [initial]);

  const languageOptions = useMemo(() => {
    const merged = [...COMMON_LANGS, ...languages].filter((l, idx, arr) => arr.indexOf(l) === idx);
    return merged;
  }, [languages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initial?.id,
      name,
      description,
      code,
      keyTermsRaw: keyTerms.join(','),
      language: language || undefined,
    });
  };

  return (
    <form className="panel space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span className="text-xs uppercase tracking-wide text-gray-500">Name*</span>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Unique snippet name"
            required
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span className="text-xs uppercase tracking-wide text-gray-500">Language</span>
          <input
            className={inputClass}
            list="language-options"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Select language (optional)"
          />
          <datalist id="language-options">
            {languageOptions.map((lang) => (
              <option key={lang} value={lang} />
            ))}
          </datalist>
        </label>
        <label className="space-y-1 text-sm font-medium text-gray-700">
          <span className="text-xs uppercase tracking-wide text-gray-500">Key terms</span>
          <TagInput value={keyTerms} onChange={setKeyTerms} placeholder="auth, api, utils" className={inputClass} />
        </label>
      </div>

      <label className="space-y-1 text-sm font-medium text-gray-700">
        <span className="text-xs uppercase tracking-wide text-gray-500">Description</span>
        <input
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short context for this snippet"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-gray-700">
        <span className="text-xs uppercase tracking-wide text-gray-500">Snippet*</span>
        <CodeEditor
          value={code}
          language={language || undefined}
          onChange={setCode}
          className={`${inputClass} h-auto min-h-[260px] resize-y whitespace-pre font-mono`}
        />
      </label>

      {trimWarning && (
        <div className="rounded-lg border border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Trailing or leading spaces detected and will be removed.
        </div>
      )}
      {(duplicateConflicts?.byName || duplicateConflicts?.byContent) && (
        <div className="rounded-lg border border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          This snippet appears to be a duplicate. Please review before saving.
          <div className="mt-1 text-xs text-amber-900/80">
            Conflicts: {duplicateConflicts.byName ? 'name ' : ''}
            {duplicateConflicts.byContent ? 'code content' : ''}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button type="button" className={buttonClass} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={buttonClass}>
          {initial ? 'Update snippet' : 'Save snippet'}
        </button>
      </div>
    </form>
  );
};

export default SnippetForm;
